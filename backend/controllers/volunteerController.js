import Activity from "../model/Activity.js";
import User from "../model/User.js";

// Register for activity
const register = async (req, res) => {
  const { activityId } = req.params; // Get the activityId from the request URL
  const userId = req.user._id; // Assuming user authentication middleware adds the user to the request object

  try {
    // Find the activity by activityId
    const activity = await Activity.findById(activityId);

    if (!activity) {
      return res.status(404).json({ message: "Activity not found." });
    }

    // Check if the user is already registered
    if (activity.volunteers.includes(userId)) {
      return res
        .status(400)
        .json({ message: "You are already registered for this activity." });
    }

    // Add the user to the volunteers list
    activity.volunteers.push(userId);
    activity.volunteerCount += 1; // Increment the volunteer count
    await activity.save();

    // Respond with success
    res
      .status(200)
      .json({ message: "Successfully registered for the activity." });
  } catch (error) {
    console.error("Error registering for activity:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

const deregister = async (req, res) => {
  console.log("deregister from activity");
};

const requestAdminAccess = async (req, res) => {
  console.log("Requesting admin access");

  const { user } = req.body;

  if (!user) {
    return res
      .status(400)
      .json({ message: "Retry again. Try logging in again." });
  }

  try {
    const foundUser = await User.findOne({ username: user }).exec();

    if (!foundUser) {
      return res.sendStatus(401); // Unauthorized
    }

    foundUser.requestingAdminAccess = true;

    await foundUser.save();

    res.status(200).json({ message: "Admin Request sent successfully." });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error. Please try again." });
  }
};

export default { register, deregister, requestAdminAccess };
