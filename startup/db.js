const mongoose = require('mongoose');
const constants = require('../constants')
mongoose.set('strictQuery', true);
module.exports = async () => {

    const connectionString = process.env.DB_SERVER_STRING;

    try {
        const options = {
            // useNewUrlParser: true,
            // useCreateIndex: true,
        }
        await mongoose.connect(connectionString, options);
        console.log(constants.DATABASE_CONNECTED)
    }
    catch (error) {
        console.log(`${error} ${constants.DATABASE_NOTCONNECTED}, ${connectionString}`)
    }
}
