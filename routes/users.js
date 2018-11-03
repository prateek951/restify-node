const HTTP_STATUS_CODES = require('http-status-codes');
const bcrypt = require('bcryptjs');
const JWT = require('jsonwebtoken');
const errors = require('restify-errors');
const User = require('../models/User');
const auth = require('../auth');
const config = require('../config');

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
        bcrypt.genSalt(10,(error,salt) => {
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

    //Auth user 
    server.post('/auth', async (req, res, next) => {
        const { email, password } =  req.body;

        try {
           //Authenticate the user 
           const user = await auth.authenticate(email,password);
           //Create the token 
           const token = JWT.sign(user.toJSON(),config.JWT_SECRET,{
               expiresIn: '15m'
           });
           const { iat, exp } = jwt.decode(token);
           
           // Send the token to the client 
           res.status(HTTP_STATUS_CODES.OK).send({iat,exp,token});
           next();
        } catch (error) {
           //User unauthorized 
           return next(new errors.UnauthorizedError(error.message)); 
        }

    });


}