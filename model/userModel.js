const mongoose = require('mongoose')

const userModel = mongoose.Schema({
    name : {
        type: String,
        required: [true,"please add a name"]
    },
    username : {
        type: String,
        required: [true,"please add a username"]
    },
    email : {
        type: String,
        required: [true,"please add a email"],
        unique: true
    },
    password : {
        type: String,
        required: [true,"please add a password"]
    },
    profile :{
        type: String,
        required: false,
        default: ""
    },
    google_id :{
        type: String,
        required: false,
        default: ""
    }
},
{
    timestamps: true
}
)

module.exports = mongoose.model('User',userModel)