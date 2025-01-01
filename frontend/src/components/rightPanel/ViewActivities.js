import { useContext, useEffect, useState } from "react";
import { axiosPrivate } from "../../api/axios";
import { ROLES } from "../../constants";
import { ACTIVITY, VOLUNTEER } from "../../constants/url";
import AuthContext from "../../context/AuthProvider";
import { verifyAccess } from "../../utils/verifyAccess";
import "./../home.css";

// Helper function to fetch activities with query parameter
const fetchActivities = async (accessToken, myActivities) => {
  try {
    // Use URLSearchParams to construct query parameters properly
    const queryParams = new URLSearchParams({
      myActivities: myActivities ?? false,
    });
    const response = await axiosPrivate.get(
      `${ACTIVITY}?${queryParams.toString()}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        withCredentials: true,
      }
    );

    return response?.data; // Ensure data is returned correctly
  } catch (error) {
    console.error("Error fetching activities:", error);
    return []; // Return an empty array in case of error
  }
};

export const ViewActivities = ({
  myActivities,
  setShowMap,
  setSelectedActivity,
}) => {
  // Get auth context
  const { auth } = useContext(AuthContext);
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    const getActivities = async () => {
      if (auth?.accessToken) {
        const activitiesData = await fetchActivities(
          auth.accessToken,
          myActivities || false
        );
        setActivities(activitiesData);
      }
    };

    // Fetch activities when accessToken or myActivities changes
    getActivities();
  }, [auth.accessToken, myActivities]);

  const handleViewMap = (activity) => {
    setShowMap(activity); // Set the activity to display on the map
  };

  const handleVolunteerRegistration = async (e, activityId) => {
    e.preventDefault();
    // Ensure user is authenticated
    if (!auth?.accessToken) {
      alert("You must be logged in to register for an activity.");
      return;
    }

    try {
      const response = await axiosPrivate.post(
        `${VOLUNTEER}/${activityId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${auth.accessToken}`,
          },
        }
      );

      // Handle successful registration
      if (response.status === 200) {
        alert("Successfully registered for the activity!");
      } else {
        alert("Registration failed. Please try again.");
      }
    } catch (err) {
      console.error("Error registering for activity:", err);
      alert("There was an error. Please try again.");
    }
  };

  return (
    <>
      <div className="activitiesContainer">
        {activities.length > 0 ? (
          activities.map((activity) => (
            <div
              className="activityCard"
              key={activity._id}
              onClick={() => setSelectedActivity(activity)}
            >
              <div className="activityHeading">
                <h3 className="activityTitle">{activity.title}</h3>
                <div className="activityHeadingButtons">
                  {verifyAccess(auth?.role, ROLES.ADMIN) && (
                    <button>Edit</button>
                  )}
                  {verifyAccess(auth?.role, ROLES.VOLUNTEER) && (
                    <button
                      onClick={(e) =>
                        handleVolunteerRegistration(e, activity._id)
                      }
                    >
                      Register
                    </button>
                  )}
                  <button onClick={() => handleViewMap(activity)}>Map</button>
                </div>
              </div>

              <p className="activityDescription">{activity.description}</p>
              <p className="activityType">Type: {activity.type}</p>
              <p className="activityDate">
                Date: {new Date(activity.date).toLocaleDateString()}
              </p>
              <p className="activityOrganizer">
                Organizer: {activity.organizer}
              </p>
              <p className="activityVolunteers">
                Volunteers: {activity.volunteerCount}
              </p>
            </div>
          ))
        ) : (
          <div>No Upcoming activities.</div>
        )}
      </div>
    </>
  );
};
