const express = require('express');
const Task = require('./model'); // This imports the task model correctly
const JWT = require('jsonwebtoken');
const router = express.Router();

// Middleware to check for JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (token == null) {
    return res.sendStatus(401); // Unauthorized
  }

  JWT.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.sendStatus(403); // Forbidden
    }
    req.user = user;
    next();
  });
};

// POST /task route to create a new task and generate a token
router.post('/task', async (req, res) => {
  try {
    const { name, description, author } = req.body;
    
    if (!name || !description || !author) {
      return res.status(400).json({
        message: 'Please provide all the required fields'
      });
    }

    const newTask = new Task({
      name,
      description,
      author
    });

    const savedTask = await newTask.save();

    // Generate JWT token
    const token = JWT.sign(
      { taskId: savedTask._id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '1h' }
    );

    res.status(201).json({
      task: savedTask,
      token
    });
  } catch (error) {
    res.status(500).json({
      message: 'Something went wrong',
      error: error.message // Providing more details about the error
    });
  }
});

// GET /tasks route to retrieve all tasks (authentication required)
router.get('/tasks',  async (req, res) => {
  try {
    const tasks = await Task.find(); // Fetch all tasks from the database
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({
      message: 'Something went wrong',
      error: error.message // Providing more details about the error
    });
  }
});

// GET /tasks/:id route to retrieve a task by ID (authentication required)
router.get('/tasks/:id',  async (req, res) => {
    try {
      const { id } = req.params;
      const task = await Task.findById(id);
      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }
      res.status(200).json(task);
    } catch (error) {
      res.status(500).json({
        message: 'Something went wrong',
        error: error.message
      });
    }
  });

  // PUT /tasks/:id route to update a task by ID (authentication required)
router.put('/tasks/:id',  async (req, res) => {
    try {
      const { id } = req.params;
      const { name, description, author } = req.body;
  
      if (!name || !description || !author) {
        return res.status(400).json({
          message: 'Please provide all the required fields'
        });
      }
  
      const updatedTask = await Task.findByIdAndUpdate(
        id,
        { name, description, author },
        { new: true, runValidators: true }
      );
  
      if (!updatedTask) {
        return res.status(404).json({ message: 'Task not found' });
      }
  
      res.status(200).json(updatedTask);
    } catch (error) {
      res.status(500).json({
        message: 'Something went wrong',
        error: error.message
      });
    }
  });
  
  // DELETE /tasks/:id route to delete a task by ID (authentication required)
  router.delete('/tasks/:id',  async (req, res) => {
    try {
      const { id } = req.params;
      const deletedTask = await Task.findByIdAndDelete(id);
  
      if (!deletedTask) {
        return res.status(404).json({ message: 'Task not found' });
      }
  
      res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
      res.status(500).json({
        message: 'Something went wrong',
        error: error.message
      });
    }
  });

module.exports = router;
