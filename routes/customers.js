const errors = require('restify-errors');
const Customer = require('../models/Customer');
const HTTP_STATUS_CODES = require('http-status-codes');
const rjwt = require('restify-jwt-community');
const config = require('../config');

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
    

    //Get a single customer
    server.get('/customers/:id', async (req, res, next) => {
        try {
            const { id } = req.params;
            const customer = await Customer.findById({_id : id});
            res.status(HTTP_STATUS_CODES.OK).send(customer);
        } catch (error) {
            return next(new errors.ResourceNotFoundError(`There is no customer with the id of ${id}`));
        }

    });

    //Add a new customer 
    server.post('/customers', rjwt({secret : config.JWT_SECRET}) , async (req, res, next) => {
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
    });

    // Update customer 
    server.put('/customers/:id', rjwt({secret: config.JWT_SECRET }) ,async (req, res, next) => {

        if(!req.is('application/json')) {
            return next(new errors.InvalidContentError("Expects 'application/json'"));
        }

        try {
            const { id } = req.params;
            const customer = await Customer.findOneAndUpdate({_id : id}, req.body);
            res.status(HTTP_STATUS_CODES.OK).send(customer);
        } catch (error) {
            return next(new errors.ResourceNotFoundError(`There is no customer with the id of ${id}`));
        }
    });

    //Delete the customer 
    server.del('/customers/:id', rjwt({secret: config.JWT_SECRET }), async (req, res, next) => {
        try {
            const { id } = req.params;
            const customer = await Customer.findOneAndRemove({_id : id});
            res.status(HTTP_STATUS_CODES.NO_CONTENT).send(204);
        } catch (error) {
            return next(new errors.ResourceNotFoundError(`There is no customer with the id of ${id}`));
        }
    })


}