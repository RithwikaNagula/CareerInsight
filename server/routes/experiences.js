const express = require('express');
const router = express.Router();
const Experience = require('../models/Experience');
const User = require('../models/User');
const auth = require('../middleware/auth');

// Get all experiences (accessible to all authenticated users)
router.get('/', auth, async (req, res) => {
  try {
    const experiences = await Experience.find()
      .populate('userId', 'email')
      .sort({ createdAt: -1 });
    res.json(experiences);
  } catch (error) {
    console.error('Error fetching experiences:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get a single experience by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const experience = await Experience.findById(req.params.id)
      .populate('userId', 'email');
    
    if (!experience) {
      return res.status(404).json({ message: 'Experience not found' });
    }
    
    res.json(experience);
  } catch (error) {
    console.error('Error fetching experience:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get experiences by user ID
router.get('/user/:userId', auth, async (req, res) => {
  try {
    const experiences = await Experience.find({ userId: req.params.userId })
      .populate('userId', 'email')
      .sort({ createdAt: -1 });
    res.json(experiences);
  } catch (error) {
    console.error('Error fetching user experiences:', error);
    res.status(500).json({ message: 'Error fetching user experiences' });
  }
});

// Create new experience (only for approved users)
router.post('/', auth, async (req, res) => {
  try {
    // Check if user is approved
    const user = await User.findById(req.user.userId);
    if (!user.isApproved) {
      return res.status(403).json({ message: 'Access denied. Approved users only.' });
    }

    const {
      jobTitle,
      companyName,
      salary,
      yearOfJoining,
      description,
      questions,
      rounds
    } = req.body;

    // Validate required fields
    if (!jobTitle || !companyName || !salary || !yearOfJoining || !description) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Create new experience
    const experience = new Experience({
      userId: req.user.userId,
      jobTitle,
      companyName,
      salary,
      yearOfJoining,
      description,
      questions: {
        technical: questions?.technical?.filter(q => q.trim()) || [],
        nonTechnical: questions?.nonTechnical?.filter(q => q.trim()) || []
      },
      rounds: rounds?.filter(round => round.description.trim()) || []
    });

    await experience.save();
    
    // Populate user details before sending response
    const populatedExperience = await Experience.findById(experience._id)
      .populate('userId', 'email');
    
    res.status(201).json(populatedExperience);
  } catch (error) {
    console.error('Error creating experience:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update experience (only for the owner)
router.put('/:id', auth, async (req, res) => {
  try {
    const experience = await Experience.findOne({
      _id: req.params.id,
      userId: req.user.userId
    });

    if (!experience) {
      return res.status(404).json({ message: 'Experience not found or unauthorized' });
    }

    // Check if user is still approved
    const user = await User.findById(req.user.userId);
    if (!user || !user.isApproved) {
      return res.status(403).json({ message: 'Access denied. Approved users only.' });
    }

    const {
      jobTitle,
      companyName,
      salary,
      yearOfJoining,
      description,
      questions,
      rounds
    } = req.body;

    // Update fields
    if (jobTitle) experience.jobTitle = jobTitle;
    if (companyName) experience.companyName = companyName;
    if (salary) experience.salary = salary;
    if (yearOfJoining) experience.yearOfJoining = yearOfJoining;
    if (description) experience.description = description;
    
    if (questions) {
      experience.questions = {
        technical: questions.technical?.filter(q => q.trim()) || experience.questions.technical,
        nonTechnical: questions.nonTechnical?.filter(q => q.trim()) || experience.questions.nonTechnical
      };
    }
    
    if (rounds) {
      experience.rounds = rounds.filter(round => round.description.trim());
    }

    await experience.save();
    await experience.populate('userId', 'email');
    
    res.json(experience);
  } catch (error) {
    console.error('Error updating experience:', error);
    res.status(500).json({ message: 'Error updating experience' });
  }
});

// Delete experience (only for the owner or admin)
router.delete('/:id', auth, async (req, res) => {
  try {
    const experience = await Experience.findById(req.params.id);
    if (!experience) {
      return res.status(404).json({ message: 'Experience not found' });
    }

    // Check if user is admin or the owner of the experience
    const user = await User.findById(req.user.userId);
    if (user.role !== 'admin' && experience.userId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    await Experience.findByIdAndDelete(req.params.id);
    res.json({ message: 'Experience deleted successfully' });
  } catch (error) {
    console.error('Error deleting experience:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 