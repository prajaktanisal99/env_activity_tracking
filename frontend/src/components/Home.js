import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LOGIN_URL } from "../constants/url";
import AuthContext from "../context/AuthProvider";
import { RIGHT_PANEL } from "./../constants";
import { LeftPanel } from "./LeftPanel";
import { RightPanel } from "./RightPanel";
import "./home.css";

export const Home = () => {
  const { auth, setAuth } = useContext(AuthContext);
  const navigate = useNavigate();

  const [myActivities, setMyActivities] = useState(false);
  const [rightPanel, setRightPanel] = useState(RIGHT_PANEL.VIEW_MAP);
  const [selectedActivity, setSelectedActivity] = useState();
  const [showMap, setShowMap] = useState(false);

  useEffect(() => {
    setSelectedActivity(null);
    setShowMap(!false);
  }, [rightPanel]);

  const logout = async () => {
    setAuth({});
    navigate(LOGIN_URL);
  };

  // Early return if user is not authenticated
  if (!auth?.user) {
    navigate(LOGIN_URL, { replace: true });
    return null;
  }

  return (
    <div className="homeContainer">
      <p>You are logged in!</p>
      <div className="homeHeading">
        <h1>Welcome, {auth.user}!</h1>
        {/* <div className="flexGrow"> */}
        <button onClick={logout}>Sign Out</button>
        {/* </div> */}
      </div>
      <div className="homeView">
        <div className="homeLeft">
          <LeftPanel
            setMyActivities={setMyActivities}
            setRightPanel={setRightPanel}
            showMap={showMap}
            selectedActivity={selectedActivity}
          />
        </div>
        <div className="homeRight">
          <RightPanel
            myActivities={myActivities}
            setShowMap={setShowMap}
            rightPanel={rightPanel}
            setRightPanel={setRightPanel}
            setSelectedActivity={setSelectedActivity}
          />
        </div>
      </div>
    </div>
  );
};
