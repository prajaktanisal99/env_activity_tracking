import express from "express";
import ROLES_LIST from "../../config/roles_list.js";
import activityController from "../../controllers/activityController.js";
import verifyRoles from "../../middleware/verifyRoles.js";

const router = express.Router();

router
  .route("/")
  .get(activityController.getAllActivities)
  .post(activityController.createNewActivity);

router
  .route("/:activityId")
  .get(activityController.getActivityDetails)
  .post(verifyRoles(ROLES_LIST.Admin), activityController.editActivityDetails)
  .delete(verifyRoles(ROLES_LIST.Admin), activityController.deleteActivity);

router
  .route("/:activityId/volunteers")
  .get(activityController.getActivityVolunteers);

export default router;
