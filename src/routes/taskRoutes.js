const express = require("express");
const router = express.Router();

const { createTask, getUserTasks, updateTask, getSingleTask } = require("../controllers/taskController");

// Task routes
router.post('/create-task',createTask);
router.get('/my-tasks/:userId', getUserTasks);
router.get("/getSingleTask/:taskId", getSingleTask)
 router.put('/update-task/:taskId', updateTask);
// router.put('/tasks/:taskId/status', taskController.updateTaskStatus);
// router.post('/tasks/:taskId/comment', taskController.addComment);
// router.get('/tasks/:taskId/history', taskController.getTaskHistory);

module.exports = router