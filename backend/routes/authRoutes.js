import express from "express"
import { allUsers, creatingUser, deleteUser, forgotPassword, getUserDetails, resetPassword, updatePassword, updateProfile, updateUserDetails, userDetails, userLogin, userLogout } from "../controllers/authControllers.js";
import { authorizeRoles, isAuthenticatedUser } from "../middleware/auth.js";
const router = express.Router();




router.route("/register").post(creatingUser)
router.route("/login").post(userLogin)
router.route("/logout").get(userLogout)
router.route("/password/forgot").post(forgotPassword)
router.route("/password/forgot/:token").put(resetPassword)
router.route("/me").get(isAuthenticatedUser,getUserDetails)
router.route("/password/update").put(isAuthenticatedUser,updatePassword)
router.route("/me/update").put(isAuthenticatedUser,updateProfile)
router.route("/admin/users").get(isAuthenticatedUser,authorizeRoles("admin"),allUsers)
router.route("/admin/users/:id").get(isAuthenticatedUser,authorizeRoles("admin"),userDetails)
router.route("/admin/users/:id").put(isAuthenticatedUser,authorizeRoles("admin"),updateUserDetails)
router.route("/admin/users/:id").delete(isAuthenticatedUser,authorizeRoles("admin"),deleteUser)

export default router