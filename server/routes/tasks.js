import express from 'express';
import mongoose from 'mongoose';
import Task from '../models/Task.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All task routes require authentication
router.use(protect);

// Helper to format task for frontend compatibility
const formatTask = (task) => ({
  id: task._id.toString(),
  userId: task.userId.toString(),
  title: task.title,
  description: task.description || '',
  dueDate: task.dueDate,
  priority: task.priority,
  isCompleted: task.isCompleted,
  category: task.category || 'General',
  createdAt: task.createdAt,
});

// @route   GET /api/tasks/stats
// @desc    Get aggregate task stats for user
// @access  Private
router.get('/stats', async (req, res) => {
  try {
    const userId = req.user._id;
    const today = new Date().toISOString().split('T')[0];

    const [total, completed, highPriority, dueToday] = await Promise.all([
      Task.countDocuments({ userId }),
      Task.countDocuments({ userId, isCompleted: true }),
      Task.countDocuments({ userId, priority: 'HIGH' }),
      Task.countDocuments({ userId, dueDate: today }),
    ]);

    const pending = total - completed;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    return res.json({
      success: true,
      stats: {
        total,
        completed,
        pending,
        highPriority,
        dueToday,
        completionRate,
      },
    });
  } catch (error) {
    console.error('Stats Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve task statistics',
    });
  }
});

// @route   GET /api/tasks
// @desc    Get all tasks for logged-in user
// @access  Private
router.get('/', async (req, res) => {
  try {
    const { search, priority, completed, view } = req.query;
    const query = { userId: req.user._id };

    if (priority) {
      query.priority = priority.toUpperCase();
    }

    if (completed !== undefined) {
      query.isCompleted = completed === 'true';
    }

    if (view === 'today') {
      const today = new Date().toISOString().split('T')[0];
      query.dueDate = today;
    } else if (view === 'high-priority') {
      query.priority = 'HIGH';
    } else if (view === 'completed') {
      query.isCompleted = true;
    }

    if (search && search.trim()) {
      const safeSearch = search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      query.$or = [
        { title: { $regex: safeSearch, $options: 'i' } },
        { description: { $regex: safeSearch, $options: 'i' } },
      ];
    }

    const tasks = await Task.find(query).sort({ createdAt: -1 });

    return res.json({
      success: true,
      count: tasks.length,
      tasks: tasks.map(formatTask),
    });
  } catch (error) {
    console.error('Get Tasks Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch tasks',
    });
  }
});

// @route   POST /api/tasks
// @desc    Create a new task
// @access  Private
router.post('/', async (req, res) => {
  try {
    const { title, description, dueDate, priority, category } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Task title is required',
      });
    }

    const task = await Task.create({
      userId: req.user._id,
      title: title.trim(),
      description: description ? description.trim() : '',
      dueDate: dueDate || new Date().toISOString().split('T')[0],
      priority: priority || 'MEDIUM',
      category: category || 'General',
      isCompleted: false,
      createdAt: Date.now(),
    });

    return res.status(201).json({
      success: true,
      task: formatTask(task),
    });
  } catch (error) {
    console.error('Create Task Error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to create task',
    });
  }
});

// @route   PUT /api/tasks/:id
// @desc    Update an existing task
// @access  Private
router.put('/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({
        success: false,
        message: 'Task not found or invalid ID',
      });
    }

    const { title, description, dueDate, priority, isCompleted, category } = req.body;

    const task = await Task.findOne({ _id: req.params.id, userId: req.user._id });
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found or access denied',
      });
    }

    if (title !== undefined) task.title = title.trim();
    if (description !== undefined) task.description = description.trim();
    if (dueDate !== undefined) task.dueDate = dueDate;
    if (priority !== undefined) task.priority = priority;
    if (isCompleted !== undefined) task.isCompleted = isCompleted;
    if (category !== undefined) task.category = category;

    await task.save();

    return res.json({
      success: true,
      task: formatTask(task),
    });
  } catch (error) {
    console.error('Update Task Error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to update task',
    });
  }
});

// @route   PATCH /api/tasks/:id/toggle
// @desc    Toggle task completed state
// @access  Private
router.patch('/:id/toggle', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({
        success: false,
        message: 'Task not found or invalid ID',
      });
    }

    const task = await Task.findOne({ _id: req.params.id, userId: req.user._id });
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found or access denied',
      });
    }

    task.isCompleted = !task.isCompleted;
    await task.save();

    return res.json({
      success: true,
      task: formatTask(task),
    });
  } catch (error) {
    console.error('Toggle Task Error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to toggle task status',
    });
  }
});

// @route   DELETE /api/tasks/:id
// @desc    Delete a task
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({
        success: false,
        message: 'Task not found or invalid ID',
      });
    }

    const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found or access denied',
      });
    }

    return res.json({
      success: true,
      message: 'Task deleted successfully',
      id: req.params.id,
    });
  } catch (error) {
    console.error('Delete Task Error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete task',
    });
  }
});

export default router;
