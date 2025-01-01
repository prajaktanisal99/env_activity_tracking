import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  role: {
    type: Number,
    required: true,
    enum: [1000, 2000],
    default: 2000,
  },
  password: {
    type: String,
    required: true,
  },
  refreshToken: String,
  requestingAdminAccess: { type: Boolean, default: false },
});

export default mongoose.model("User", userSchema);
