const mongoose = require('mongoose')

const noteModel = mongoose.Schema({
    text : {
        type: String,
        required: [true,"please add a text"]
    },
    user : {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: 'User'
    },
    project : {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: 'Project'
    }
},
{
    timestamps: true
}
)

module.exports = mongoose.model('Note',noteModel)