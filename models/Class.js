const mongoose = require('mongoose');
const { Schema } = mongoose;

const classSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    teacherId: { type: String, required: true },
    students: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
}, { timestamps: true });

const Class = mongoose.model('Class', classSchema);
module.exports = Class;