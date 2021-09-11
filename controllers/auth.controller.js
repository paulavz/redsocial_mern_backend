const User = require("../models/User.model");
const bcrypt = require("bcrypt");

const registerController = async (req, res = response) => {
	const { username, email, password } = req.body;

	try {
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);

		const newUser = new User({
			username,
			email,
			password: hashedPassword,
		});

		const user = await newUser.save();
		res.status(200).json(user);
	} catch (err) {
		res.status(500).json(err);
	}
};

const loginController = async (req, res) => {
	const { email, password } = req.body;
	try {
		const user = await User.findOne({ email });
		!user && res.status(404).json("User not found");
		if (password) {
			const validPassword = await bcrypt.compare(password, user.password);
			!validPassword && res.status(400).json("Invalid Password");
		} else {
			res.status(400).json("Password is Empty");
		}
		res.status(200).json(user);
	} catch (err) {
		res.status(500).json(err);
	}
};

module.exports = {
	registerController,
	loginController,
};
