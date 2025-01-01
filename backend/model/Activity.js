import mongoose from "mongoose";

const activitySchema = new mongoose.Schema({
  type: String,
  description: String,
  // location: {
  //   type: {
  //     type: String, // GeoJSON type
  //     enum: ["Point"], // Only 'Point' is supported in this schema
  //     required: true,
  //   },
  //   coordinates: {
  //     type: [Number], // [longitude, latitude]
  //     required: true,
  //   },
  // },
  title: String,
  organizer: String,
  volunteers: [String],
  volunteerCount: Number,
  date: Date,
});

export default mongoose.model("Activity", activitySchema);
