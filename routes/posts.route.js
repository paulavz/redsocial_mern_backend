const { Router } = require("express");
const postsController = require("../controllers/posts.controller.js");

const router = Router();

router.post("/", postsController.createPostController);
router.get("/", postsController.getPostsController);
router.put("/:id", postsController.editPostController);
router.delete("/:id", postsController.deletePostController);
router.put("/:id/like", postsController.likePostController);
router.get("/:id", postsController.getPostController);
router.get("/timeline/all", postsController.getAllPostController);

module.exports = router;
