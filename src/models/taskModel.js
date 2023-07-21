// taskSchema.js
const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        // required: true,
    },
    assignedBy: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['TO DO', 'DOING', 'DONE'],
        default: 'TO DO',
    },
    image: {
        type: String,
        required: true
    },
    comments: [{
        text: {
            type: String,
            required: true,
        },
        postedBy: {
            type: String,
            requried: true
        },
    }],
    history: [
        {
            timestamp: Date,
            eventType: String,
            data: mongoose.Schema.Types.Mixed
        }
    ],
});

module.exports = mongoose.model('Task', taskSchema);

