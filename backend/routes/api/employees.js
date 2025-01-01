import express from "express";
import ROLES_LIST from "../../config/roles_list.js";
import { employeesController } from "../../controllers/index.js";
import verifyRoles from "../../middleware/verifyRoles.js";

const router = express.Router();

router
  .route("/")
  .get(employeesController.getAllEmployees)
  .post(
    // verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor),
    employeesController.createNewEmployee
  )
  .put(
    verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor),
    employeesController.updateEmployee
  );
// .delete(verifyRoles(ROLES_LIST.Admin), employeesController.deleteEmployee);

router.route("/:id").get(employeesController.getEmployee);

export default router;
