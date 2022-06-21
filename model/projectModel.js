const mongoose = require('mongoose')

const projectModel = mongoose.Schema({
    name : {
        type: String,
        required: [true,"please add a name"]
    },
    total_work : {
        type: Number,
        required: [false,"please add a total hour"],
        default: 0
    },
    start_time : {
        type: String,
        required: [false,"please add a start time"],
        default: "00:00"
    },
    user : {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
},
{
    timestamps: true
}
)

module.exports = mongoose.model('Project',projectModel)