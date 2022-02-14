const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DB_URI);
        console.log("Database connect successfully");
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

module.exports = { connectDB }