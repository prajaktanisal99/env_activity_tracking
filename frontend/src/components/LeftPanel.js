import { useContext } from "react";
import { axiosPrivate } from "../api/axios";
import { RIGHT_PANEL, ROLES } from "../constants";
import { REQUEST_ADMIN_ACCESS } from "../constants/url";
import AuthContext from "../context/AuthProvider";
import { verifyAccess } from "../utils/verifyAccess";
import "./home.css";

export const LeftPanel = ({
  setMyActivities,
  selectedActivity,
  showMap,
  setRightPanel,
}) => {
  const { auth } = useContext(AuthContext);

  const handleRequestAdminAccess = async (e) => {
    e.preventDefault();
    const response = await axiosPrivate.post(
      REQUEST_ADMIN_ACCESS,
      JSON.stringify({ user: auth.user }),
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.accessToken}`,
        },
        withCredentials: true,
      }
    );
    alert(response.data.message);
  };

  return (
    <>
      <div className="homeButtons">
        <button
          className="homeButton"
          onClick={() => setRightPanel(RIGHT_PANEL.VIEW_ACTIVITIES)}
        >
          All Activities
        </button>
        <button
          className="homeButton"
          onClick={() => {
            setMyActivities(true);
            setRightPanel(RIGHT_PANEL.VIEW_MY_ACTIVITIES);
          }}
        >
          My Activities
        </button>
        {verifyAccess(auth?.role, ROLES.ADMIN) && (
          <>
            <button
              className="homeButton"
              onClick={() => setRightPanel(RIGHT_PANEL.CREATE_ACTIVITY)}
            >
              Create New Activity
            </button>
            <button
              className="homeButton"
              onClick={() => setRightPanel(RIGHT_PANEL.VIEW_REQUESTS)}
            >
              View Requests
            </button>
          </>
        )}
        {verifyAccess(auth?.role, ROLES.VOLUNTEER) && (
          <button className="homeButton" onClick={handleRequestAdminAccess}>
            Request Admin Access
          </button>
        )}

        {showMap ? (
          <div className="map">
            <p>showMap for {selectedActivity?.title}</p>
            <div className="showMap">"MAP HERE"</div>
          </div>
        ) : (
          <>Select Activity to view location on map.</>
        )}
      </div>
    </>
  );
};
