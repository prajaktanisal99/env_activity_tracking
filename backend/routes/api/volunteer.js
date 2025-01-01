import express from "express";
import ROLES_LIST from "../../config/roles_list.js";
import volunteerController from "../../controllers/volunteerController.js";
import verifyRoles from "../../middleware/verifyRoles.js";

const router = express.Router();

router.route("/access").post(volunteerController.requestAdminAccess);

router
  .route("/:activityId")
  .post(verifyRoles(ROLES_LIST.Volunteer), volunteerController.register) //
  .delete(verifyRoles(ROLES_LIST.Volunteer), volunteerController.deregister);

export default router;
