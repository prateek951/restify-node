const errors = require('restify-errors');
const Customer = require('../models/Customer');
const HTTP_STATUS_CODES = require('http-status-codes');
module.exports = server => {
    //Get Customers
    server.get('/customers', async (req, res, next) => {
        try {
            const customers = await Customer.find({});
            res.status(HTTP_STATUS_CODES.OK).send(customers);
            next();
        } catch (error) {
            return next(new errors.InvalidContentError(error));
        }
    });


    //Add a new customer 
    server.post('/customers',async (req, res, next) => {
        //Check for JSON 
        if(!req.is('application/json')) {
            return next(new errors.InvalidContentError("Expects 'application/json'"));
        }
        const { name, email, balance } = req.body;
        //Create a new customer 
        const customer = new Customer({name, email, balance});
        
        try {
            const newCustomer = await customer.save();
            res.status(HTTP_STATUS_CODES.CREATED).send(201);
            next();
        } catch (error) {
            return next(new errors.InternalError(error.message));
        }
    })

}