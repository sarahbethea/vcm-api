const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    firstName : { type: String, required: true },
    lastName : { type: String, required: true },
    email : { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['student', 'teacher'], required: true},
    enrolledClasses: [{ 
        type: Schema.Types.ObjectId, // Specifies that each element is an ObjectID
        ref: 'Class' // Reference to the related model (optional). Enables population, a mongoose feature that lets you replace ObjectIDs with the actual documents they reference
      }],
}, { timestamps: true });


const User = mongoose.model('User', userSchema);
module.exports = User;