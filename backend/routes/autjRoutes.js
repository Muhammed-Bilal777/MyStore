import express from "express"
import { creatingUser, userLogin } from "../controllers/autho.js";
const router = express.Router();

router.route("/user").post(creatingUser)
router.route("/user/login").get(userLogin)


export default router