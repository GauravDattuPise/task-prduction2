const mongoose = require("mongoose");

// crating user schema

const userSchama = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }

},
    { timestamps: true }
)

module.exports = mongoose.model("User", userSchama);