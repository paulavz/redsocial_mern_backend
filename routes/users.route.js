const { Router } = require("express");
const userController = require("../controllers/users.controller");

const router = Router();

router.get("/", userController.getUsersController);
router.put("/:id", userController.updateUserController);
router.delete("/:id", userController.deleteUserController);
router.get("/:id", userController.getUserController);
router.put("/:id/follow", userController.followUserController);
router.put("/:id/unfollow", userController.unfollowUserController);

module.exports = router;
