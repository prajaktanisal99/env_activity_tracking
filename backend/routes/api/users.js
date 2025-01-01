import express from "express";
import ROLES_LIST from "../../config/roles_list.js";
import activityController from "../../controllers/activityController.js";
import verifyRoles from "../../middleware/verifyRoles.js";

const router = express.Router();

// router
// .route("/")
// .get(verifyRoles(ROLES_LIST.Admin), activityController.getAllActivities)
// .post(verifyRoles(ROLES_LIST.Admin), activityController.createNewActivity);

// router
// .route("/:id")
// .get(verifyRoles(ROLES_LIST.Admin), usersController.getUser);

router
  .route("/adminAccess")
  .get(verifyRoles(ROLES_LIST.Admin), activityController.getAdminRequests)
  .post(verifyRoles(ROLES_LIST.Admin), activityController.addAdminAccess);

export default router;
