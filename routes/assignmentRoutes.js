const express = require('express');
const router = express.Router();
const Assignment = require('../models/Assignment');

// get all assignments
router.get('/', async (req, res) => {
    try {
        const assignments = await Assignment.find();
        res.json(assignments);

    } catch (e) {
        res.status(500).json({message: e.message});
    }
});

//get assignment by id
router.get('/:id', async (req, res) => {
    try {
        const assignment = await Assignment.findById(req.params.id);
        if (!assignment) return res.status(404).json({ message: 'Class not found.' });
        res.json(assignment); //sends response with class data in JSON format back to client
    } catch (e) {
        res.status(500).json({message: e.message});
    }
});


//create new assignment
router.post('/', async (req, res) => {
    const assignment = new Assignment({
        classId: req.body.classId,
        title: req.body.title,
        description: req.body.description,
        teacherId: req.body.teacherId,
        dueDate: req.body.dueDate,
    });

    try {
        const newAssignment = await assignment.save(); //save new assignment to DB
        res.status(201).json(newAssignment); //respond with created assignment in JSON format with created status code
    } catch (e) {
        res.status(400).json({ message: e.message }); //400 is bad request status code. 
    }
});

// update assignment by PUT request 
router.put('/:id', async (req, res) => {
    const { id } = req.params
    try {
        const updatedAssignment = await Assignment.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
        if (!updatedAssignment) return res.status(404).json({ message: 'Assignment not found'});
        res.status(200).json(updatedAssignment);
    } catch (e) {
        res.status(400).json({ message: e.message });
    }
});


//delete assignment by id
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const deletedAssignment = await Assignment.findByIdAndDelete(id);
        if (!deletedAssignment) {
            return res.status(404).json({ message: 'Assignment not found' });
        }
        res.status(200).json({ message: 'Assignment deleted successfully' });
    } catch (e) {
        console.error('Error deleting assignment:', e);
        res.status(400).json({ message: 'Error deleting assignment', error: e});
    }
});

module.exports = router;

