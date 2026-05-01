import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  name: String,
  description: String,
  color: String,
  userId: String,
});

export default mongoose.model("Project", projectSchema);