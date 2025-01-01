import express from "express";
import registerController from "../controllers/registerController.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.status("Load Register Page");
});
router.post("/", registerController.handleNewUser);

export default router;
