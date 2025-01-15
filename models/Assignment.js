const mongoose = require('mongoose');
const { Schema } = mongoose;

const assignmentSchema = new Schema({
    classId: { type: Schema.Types.ObjectId, ref: 'Class' },
    title: { type: String, required: true },
    description: { type: String },
    dueDate: { type: Date },
    completedBy: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
}, { timestamps: true });

const Assignment = mongoose.model('Assignment', assignmentSchema);
module.exports = Assignment;