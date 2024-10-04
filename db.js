const mongoose = require("mongoose");

const connectToDatabase = () => {
    mongoose.connect(process.env.DB_URI, {
        dbName: 'mma-muhasebe',
    })
    .then(() => {
        console.log("Connected to the database!");
    })
    .catch((err) => {
        console.error("Error connecting to the database:", err);
    });
};

module.exports = connectToDatabase;
