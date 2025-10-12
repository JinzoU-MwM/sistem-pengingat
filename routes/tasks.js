const express = require('express');
const { dbOperations } = require('../db');
const router = express.Router();

// GET /api/tasks - Get all tasks with optional filter
router.get('/', async (req, res) => {
    try {
        const { filter = 'all' } = req.query;
        let query = 'SELECT * FROM tasks ORDER BY datetime ASC';
        let params = [];

        if (filter === 'active') {
            query = 'SELECT * FROM tasks WHERE completed = 0 ORDER BY datetime ASC';
        } else if (filter === 'completed') {
            query = 'SELECT * FROM tasks WHERE completed = 1 ORDER BY datetime DESC';
        }

        const tasks = await dbOperations.all(query, params);
        res.json({
            success: true,
            data: tasks
        });
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch tasks'
        });
    }
});

// GET /api/tasks/:id - Get single task
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const task = await dbOperations.get('SELECT * FROM tasks WHERE id = ?', [id]);

        if (!task) {
            return res.status(404).json({
                success: false,
                message: 'Task not found'
            });
        }

        res.json({
            success: true,
            data: task
        });
    } catch (error) {
        console.error('Error fetching task:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch task'
        });
    }
});

// POST /api/tasks - Create new task
router.post('/', async (req, res) => {
    try {
        const { title, description, datetime, priority = 'medium', whatsapp_number } = req.body;

        // Validation
        if (!title || !datetime) {
            return res.status(400).json({
                success: false,
                message: 'Title and datetime are required'
            });
        }

        const query = `
            INSERT INTO tasks (title, description, datetime, priority, whatsapp_number)
            VALUES (?, ?, ?, ?, ?)
        `;

        const result = await dbOperations.run(query, [title, description, datetime, priority, whatsapp_number]);

        // Get the created task
        const newTask = await dbOperations.get('SELECT * FROM tasks WHERE id = ?', [result.id]);

        res.status(201).json({
            success: true,
            data: newTask,
            message: 'Task created successfully'
        });
    } catch (error) {
        console.error('Error creating task:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create task'
        });
    }
});

// PUT /api/tasks/:id - Update task
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, datetime, priority, whatsapp_number, completed } = req.body;

        // Check if task exists
        const existingTask = await dbOperations.get('SELECT * FROM tasks WHERE id = ?', [id]);
        if (!existingTask) {
            return res.status(404).json({
                success: false,
                message: 'Task not found'
            });
        }

        // Build dynamic update query
        const updates = [];
        const params = [];

        if (title !== undefined) {
            updates.push('title = ?');
            params.push(title);
        }
        if (description !== undefined) {
            updates.push('description = ?');
            params.push(description);
        }
        if (datetime !== undefined) {
            updates.push('datetime = ?');
            params.push(datetime);
        }
        if (priority !== undefined) {
            updates.push('priority = ?');
            params.push(priority);
        }
        if (whatsapp_number !== undefined) {
            updates.push('whatsapp_number = ?');
            params.push(whatsapp_number);
        }
        if (completed !== undefined) {
            updates.push('completed = ?');
            params.push(completed);
        }

        updates.push('updated_at = CURRENT_TIMESTAMP');
        params.push(id);

        const query = `UPDATE tasks SET ${updates.join(', ')} WHERE id = ?`;
        await dbOperations.run(query, params);

        // Get updated task
        const updatedTask = await dbOperations.get('SELECT * FROM tasks WHERE id = ?', [id]);

        res.json({
            success: true,
            data: updatedTask,
            message: 'Task updated successfully'
        });
    } catch (error) {
        console.error('Error updating task:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update task'
        });
    }
});

// PATCH /api/tasks/:id/complete - Mark task as completed
router.patch('/:id/complete', async (req, res) => {
    try {
        const { id } = req.params;

        // Check if task exists
        const existingTask = await dbOperations.get('SELECT * FROM tasks WHERE id = ?', [id]);
        if (!existingTask) {
            return res.status(404).json({
                success: false,
                message: 'Task not found'
            });
        }

        // Update task
        await dbOperations.run(
            'UPDATE tasks SET completed = 1, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
            [id]
        );

        // Get updated task
        const updatedTask = await dbOperations.get('SELECT * FROM tasks WHERE id = ?', [id]);

        res.json({
            success: true,
            data: updatedTask,
            message: 'Task marked as completed'
        });
    } catch (error) {
        console.error('Error completing task:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to complete task'
        });
    }
});

// DELETE /api/tasks/:id - Delete task
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Check if task exists
        const existingTask = await dbOperations.get('SELECT * FROM tasks WHERE id = ?', [id]);
        if (!existingTask) {
            return res.status(404).json({
                success: false,
                message: 'Task not found'
            });
        }

        // Delete task
        await dbOperations.run('DELETE FROM tasks WHERE id = ?', [id]);

        res.json({
            success: true,
            message: 'Task deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting task:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete task'
        });
    }
});

// GET /api/tasks/due - Get tasks that are due (for reminder system)
router.get('/due', async (req, res) => {
    try {
        const currentDateTime = new Date().toISOString();
        const oneMinuteLater = new Date(Date.now() + 60000).toISOString();

        const query = `
            SELECT * FROM tasks
            WHERE completed = 0
            AND datetime >= ?
            AND datetime <= ?
            ORDER BY datetime ASC
        `;

        const dueTasks = await dbOperations.all(query, [currentDateTime, oneMinuteLater]);

        res.json({
            success: true,
            data: dueTasks
        });
    } catch (error) {
        console.error('Error fetching due tasks:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch due tasks'
        });
    }
});

module.exports = router;