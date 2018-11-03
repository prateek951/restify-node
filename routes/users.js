const HTTP_STATUS_CODES = require('http-status-codes');
const bcrypt = require('bcryptjs');
const errors = require('restify-errors');
const User = require('../models/User');


module.exports = server => {
    server.post('/register',async (req, res, next) => {

        //Tap the email and password from request body

        const { email, password } = req.body;

        //User banado

        const user = new User({
            email,password
        });

        //Before storing the password to the database 
        // generate a salt and hash the password 
        bcrypt.genSalt(10,(err,salt) => {
            bcrypt.hash(user.password,salt, async (error,hash) => {
                user.password = hash;
                //Save the user 
                try {
                    const newUser = await user.save();
                    res.status(HTTP_STATUS_CODES.CREATED).send(201);
                    next();
                } catch (error) {
                    return next(new errors.InternalError(error.message));
                }
            });
        });
    });
}