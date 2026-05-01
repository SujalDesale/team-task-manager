import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  title: String,
  description: String,

  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
  },

  assignee: String,
  priority: String,
  status: String,
  date: String,

  userId: String,

  activity: [
    {
      action: String,
      user: String,
      time: { type: Date, default: Date.now }
    }
  ],

  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project"
  }

});

export default mongoose.model("Task", taskSchema);