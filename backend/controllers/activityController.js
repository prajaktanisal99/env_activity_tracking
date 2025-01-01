import Activity from "../model/Activity.js";
import User from "../model/User.js";

const getAllActivities = async (req, res) => {
  console.log("getAllActivities");
  console.log("req?.query", req?.query);
  const activities = await Activity.find();
  if (!activities)
    return res.status(204).json({ message: "No activities found." });
  res.json(activities);
};

const createNewActivity = async (req, res) => {
  const {
    type,
    description,
    // location,
    title,
    organizer,
    volunteerCount,
    date,
  } = req.body;

  if (!type || !description || !title || !organizer || !date) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const newActivity = new Activity({
      type,
      description,
      // location, // Expecting GeoJSON format
      title,
      organizer,
      volunteerCount: volunteerCount || 0, // Default to 0 if not provided
      date,
    });
    const savedActivity = await newActivity.save();

    res.status(201).json({
      message: "Activity created successfully!",
      activity: savedActivity,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

const getActivityDetails = async (req, res) => {
  if (!req?.params?.activityId)
    return res.status(400).json({ message: "Activity ID required." });

  const activity = await Activity.findOne({ _id: req.params.id }).exec();
  if (!activity) {
    return res
      .status(204)
      .json({ message: `Activity ID ${req.params.activityId} not found.` });
  }
  res.json(activity?.data);
};

const editActivityDetails = async (req, res) => {
  // Validate request parameters
  if (!req?.params?.activityId) {
    return res.status(400).json({ message: "Activity ID is required." });
  }

  // Validate request body
  const { title, type, description, location, date } = req.body;

  if (!title && !type && !description && !location && !date) {
    return res
      .status(400)
      .json({ message: "At least one field to update is required." });
  }

  try {
    // Find activity by ID and update fields provided in the request
    const updatedActivity = await Activity.findOneAndUpdate(
      { _id: req.params.activityId },
      {
        $set: {
          ...(title && { title }),
          ...(type && { type }),
          ...(description && { description }),
          ...(location && { location }),
          ...(date && { date }),
        },
      },
      { new: true, runValidators: true } // Return updated document and apply schema validation
    );

    if (!updatedActivity) {
      return res
        .status(404)
        .json({ message: `Activity ID ${req.params.activityId} not found.` });
    }

    // Respond with updated activity details
    res
      .status(200)
      .json({ message: "Activity updated successfully", updatedActivity });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while updating the activity." });
  }
};

const deleteActivity = async (req, res) => {
  if (!req?.params?.activityId)
    return res.status(400).json({ message: "Activity ID required." });
  const activity = await Activity.findOne({ _id: req.params.activityId });
  if (!activity) {
    return res
      .status(204)
      .json({ message: `Activity ID ${req.params.activityId} not found.` });
  }
  const result = await activity.deleteOne({ _id: req.params.activityId });
  res.json(result);
};

const getActivityVolunteers = async (req, res) => {
  // Validate request parameter
  if (!req?.params?.activityId) {
    return res.status(400).json({ message: "Activity ID is required." });
  }

  try {
    const activity = await Activity.findOne({
      _id: req.params.activityId,
    }).exec();

    if (!activity) {
      return res
        .status(404)
        .json({ message: `Activity ID ${req.params.activityId} not found.` });
    }
    res.status(200).json({
      volunteerIds: activity?.volunteers,
      volunteerCount: activity?.volunteerCount,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error." });
  }
};

const getAdminRequests = async (req, res) => {
  try {
    const adminRequests = await User.find({
      requestingAdminAccess: true,
    }).select("username roles requestedAt");
    if (!adminRequests.length) {
      return res.status(404).json({ message: "No admin requests found." });
    }
    res.status(200).json(adminRequests);
  } catch (error) {
    console.error("Error fetching admin requests:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

const addAdminAccess = async (req, res) => {
  const { username, permission } = req.body;

  if (!username) {
    return res.status(400).json({ message: "Username is required." });
  }

  try {
    // Find the user by username
    const user = await User.findOne({ username }).exec();

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    user.role = permission ? 1000 : 2000;
    user.requestingAdminAccess = false;

    // Save changes to the database

    console.log("Updated user roles:", user);
    await user.save();

    res.status(200).json({
      message: permission
        ? `Admin access granted to ${username}.`
        : `Admin access rejected for ${username}.`,
      user: {
        username: user.username,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error. Please try again.",
    });
  }
};

export default {
  addAdminAccess,
  createNewActivity,
  deleteActivity,
  editActivityDetails,
  getAllActivities,
  getActivityVolunteers,
  getActivityDetails,
  getAdminRequests,
};
