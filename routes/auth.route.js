const { Router } = require("express");
const router = Router();
const {
	registerController,
	loginController,
} = require("../controllers/auth.controller");

//REGISTER
router.post("/register", registerController);
router.post("/login", loginController);

module.exports = router;
