module.exports = {
    ENV : process.env.NODE_ENV || 'development',
    PORT : process.env.PORT || 4220,
    URL : process.env.BASE_URL || 'http://localhost:4220',
    MONGODB_URI : process.env.MONGODB_URI || 'mongodb://localhost:27017/customer-api'
}