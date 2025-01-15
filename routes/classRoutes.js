const express = require('express');
const router = express.Router();
const Class = require('../models/Class');

// get all classes
router.get('/', async (req, res) => {
    try {
        const classes = await Class.find();
        res.json(classes);

    } catch (e) {
        res.status(500).json({message: e.message});
    }
});

//get class by id
router.get('/:id', async (req, res) => {
    try {
        const selectedClass = await Class.findById(req.params.id);
        if (!selectedClass) return res.status(404).json({ message: 'Class not found.' });
        res.json(selectedClass); //sends response with class data in JSON format back to client
    } catch (e) {
        res.status(500).json({message: e.message});
    }
});


//create new class
router.post('/', async (req, res) => {
    const selectedClass = new Class({
        title: req.body.title,
        description: req.body.description,
        teacherId: req.body.teacherId,
    });

    try {
        const newClass = await selectedClass.save(); //save new class to DB
        res.status(201).json(newClass); //respond with created class in JSON format with created status code
    } catch (e) {
        res.status(400).json({ message: e.message }); //400 is bad request status code. 
    }
});

// update class by PUT request 
router.put('/:id', async (req, res) => {
    const { id } = req.params
    try {
        const updatedClass = await Class.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
        if (!updatedClass) return res.status(404).json({ message: 'Class not found'});
        res.status(200).json(updatedClass);
    } catch (e) {
        res.status(400).json({ message: e.message });
    }
});


//delete class by id
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const deletedClass = await Class.findByIdAndDelete(id);
        if (!deletedClass) {
            return res.status(404).json({ message: 'Class not found' });
        }
        res.status(200).json({ message: 'Class deleted successfully' });
    } catch (e) {
        console.error('Error deleting class:', e);
        res.status(400).json({ message: 'Error deleting class', error: e});
    }
});

module.exports = router;




