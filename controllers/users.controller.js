const User = require("../models/User.model");
const bcrypt = require("bcrypt");

const getUsersController = async (req, res = response) => {
	try {
		const users = await User.find({});

		res.status(200).json(users);
	} catch (err) {
		console.log(err);
	}
};

const getUserController = async (req, res) => {
	try {
		const user = await User.findById(req.params.id);
		const { password, updatedAt, ...other } = user._doc;
		res.status(200).json(other);
	} catch (err) {
		return res.status(500).json({ msg: err });
	}
};

const updateUserController = async (req, res) => {
	if (req.body.userId === req.params.id || req.body.isAdmin) {
		if (req.body.password) {
			try {
				const salt = await bcrypt.genSalt(10);
				req.body.password = await bcrypt.hash(req.body.password, salt);
			} catch (err) {
				return res.status(500).json({ msg: err });
			}
		}
		try {
			const user = await User.findByIdAndUpdate(req.params.id, {
				$set: req.body,
			});
			res.status(200).json("Account has been update");
		} catch (err) {
			return res.status(500).json({ msg: err });
		}
	} else {
		return res.status(403).json("You can update only your account");
	}
};

const deleteUserController = async (req, res) => {
	console.log(req.params.id);
	if (req.body.userId === req.params.id || req.body.isAdmin) {
		try {
			const user = await User.findByIdAndDelete(req.params.id);
			res.status(200).json("Account has been deleted");
		} catch (err) {
			return res.status(500).json({ msg: err });
		}
	} else {
		return res.status(403).json("You can delete only your account");
	}
};

const unfollowUserController = async (req, res) => {
	if (req.body.userId !== req.params.id) {
		try {
			const user = await User.findById(req.params.id);
			const currentUser = await User.findById(req.body.userId);
			if (user.followers.includes(req.body.userId)) {
				await user.updateOne({
					$pull: { followers: req.body.userId },
				});
				await currentUser.updateOne({
					$pull: { followings: req.params.id },
				});
				res.status(200).json("User has been unfollowed");
			} else {
				res.status(403).json("You don't follow this user");
			}
		} catch {
			res.status(500).json(err);
		}
	} else {
		res.status(403).json("Your can't unfollow yourself");
	}
};

const followUserController = async (req, res) => {
	if (req.body.userId !== req.params.id) {
		try {
			const user = await User.findById(req.params.id);
			const currentUser = await User.findById(req.body.userId);
			if (!user.followers.includes(req.body.userId)) {
				await user.updateOne({
					$push: { followers: req.body.userId },
				});
				await currentUser.updateOne({
					$push: { followings: req.params.id },
				});
				res.status(200).json("User has been followed");
			} else {
				res.status(403).json("You allready follow this user");
			}
		} catch {
			res.status(500).json(err);
		}
	} else {
		res.status(403).json("Your can't follow yourself");
	}
};

module.exports = {
	getUsersController,
	getUserController,
	updateUserController,
	deleteUserController,
	unfollowUserController,
	followUserController,
};
