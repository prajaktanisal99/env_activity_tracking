import "./home.css";
import {
  CreateNewActivity,
  ViewActivities,
  ViewAdminRequests,
} from "./rightPanel/index";

export const RightPanel = ({
  myActivities,
  rightPanel,
  setRightPanel,
  setShowMap,
  setSelectedActivity,
}) => {
  return (
    <>
      <h1>{getTitle(rightPanel)}</h1>
      <div>
        {getComponent(
          myActivities,
          rightPanel,
          setRightPanel,
          setShowMap,
          setSelectedActivity
        )}
      </div>
    </>
  );
};

export const getTitle = (rightPanel) => {
  switch (rightPanel) {
    case "createNewActivity":
      return "Create Activity";
    case "viewAdminRequests":
      return "Admin Requests";
    case "viewMyActivities":
      return "My Activities";
    case "viewAllActivities":
    default:
      return "All Activities";
  }
};

export const getComponent = (
  myActivities,
  rightPanel,
  setRightPanel,
  setShowMap,
  setSelectedActivity
) => {
  switch (rightPanel) {
    case "createNewActivity":
      return <CreateNewActivity setRightPanel={setRightPanel} />;
    case "viewAdminRequests":
      return <ViewAdminRequests />;
    case "viewAllActivities":
    case "viewMyActivities":
    default:
      return (
        <ViewActivities
          myActivities={myActivities}
          setShowMap={setShowMap}
          setSelectedActivity={setSelectedActivity}
        />
      );
  }
};
