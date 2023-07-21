

// CREATE TASK

const taskModel = require("../models/taskModel");
const userModel = require("../models/userModel");

exports.createTask = async (req, res) => {

    try {

        let taskData = req.body
        let { title, description, email, image, assignedBy } = taskData;

        // task validation
        if (!title || !description || !email || !image || !assignedBy) {
            return res.status(400).send({ status: false, message: "Tasks all data is required" });
        }

        // find user who has assigned this task
        const findUser = await userModel.findOne({ email });
        if (!findUser) {
            return res.status(404).send({ status: false, message: "User not found with this email" })
        }

        taskData.assignedTo = findUser._id.toString();

        // task created
        const createdTask = await taskModel.create(taskData);
        return res.status(201).send({ status: true, message: "Task Created Successfully", createdTask });

    }
    catch (error) {
        res.status(500).send({ status: false, message: "Error in Task Creation", error: error.message });
    }
}



exports.getUserTasks = async (req, res) => {
    try {
        const { userId } = req.params
        const myTasks = await taskModel.find({ assignedTo: userId })

        console.log(myTasks);

        return res.status(200).send({ status: true, message: "My tasks", myTasks });


    } catch (error) {
        res.status(500).send({ status: false, message: "Error in get my Task", error: error.message });
    }
}

// get single task

exports.getSingleTask = async (req, res) => {
    try {
        const { taskId } = req.params
        const singleTask = await taskModel.findById(taskId);
        return res.status(200).send({ status: true, singleTask });
    } catch (error) {
        res.status(500).send({ status: false, message: "Error in get single Task", error: error.message });
    }
}


// updating the task


// exports.updateTask = async (req, res) => {
//     try {
//         const { taskId } = req.params;
//         const data = req.body;

//         console.log(data);
//         // Update the task using its id and return the updated task
//         const updatedTask = await taskModel.findOneAndUpdate(
//             { _id: taskId },
//             {
//                 $set: { status: data.status },
//                 $push: { comments: { text: data.comment, postedBy: data.userName } }
//             },
//             { new: true } // Return the modified document (updated task)
//         );

//         if (!updatedTask) {
//             return res.status(404).send({
//                 status: false,
//                 message: 'Task not found.',
//             });
//         }

//         return res.status(200).send({
//             status: true,
//             message: 'Task Updated Successfully.',
//             updatedTask, // Return the updated task in the response
//         });
//     } catch (error) {
//         res.status(500).send({
//             status: false,
//             message: 'Error in updating my Task',
//             error: error.message,
//         });
//     }
// };




exports.updateTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const data = req.body;

    // Fetch the existing task
    const existingTask = await taskModel.findById(taskId);

    if (!existingTask) {
      return res.status(404).json({ status: false, message: 'Task not found.' });
    }

    // Save the current status before updating
    const currentStatus = existingTask.status;

    // Update the task with the new status and/or comment
    existingTask.status = data.status || existingTask.status;
    if (data.comment) {
      existingTask.comments.push({ text: data.comment, postedBy: data.userName });
    }

    // Update the history
    existingTask.history.push({
      timestamp: Date.now(),
      eventType: data.comment ? 'comment' : 'status-update',
      data: data.comment ? { comment: data.comment, userName: data.userName } : { status: data.status },
    });

    // Save the updated task
    const updatedTask = await existingTask.save();

    return res.status(200).json({
      status: true,
      message: 'Task Updated Successfully.',
      updatedTask,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: 'Error in updating the task',
      error: error.message,
    });
  }
};
