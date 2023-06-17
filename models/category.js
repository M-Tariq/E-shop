const mongoose = require("mongoose");

const categorySchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    color: {
        type: String,

    },
    icon: {
        type: String,
        required: true
    },

    image: {
        String
    }

});

exports.Category = mongoose.model("Category", categorySchema);
