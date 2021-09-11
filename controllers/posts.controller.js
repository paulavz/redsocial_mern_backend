const Post = require("../models/Post.model");
const User = require("../models/User.model");

const getPostsController = async (req, res = response) => {
	try {
		const posts = await Post.find({});

		res.status(200).json(posts);
	} catch (err) {
		console.log(err);
	}
};

const createPostController = async (req, res = response) => {
	const { userId, desc, img, likes } = req.body;
	try {
		const newPost = new Post({
			userId,
			desc,
			img,
			likes,
		});
		const savedPost = await newPost.save();
		res.status(200).json(savedPost);
	} catch (err) {
		res.status(500).json(err);
	}
};

const deletePostController = async (req, res = response) => {
	try {
		const post = await Post.findById(req.params.id);
		if (post.userId === req.body.userId) {
			await post.deleteOne();
			res.status(200).json("The post has been deleted");
		} else {
			res.status(403).json("You can delete only your post");
		}
	} catch (err) {
		res.status(500).json(err);
	}
};

const editPostController = async (req, res = response) => {
	try {
		const post = await Post.findById(req.params.id);
		if (post.userId === req.body.userId) {
			await post.updateOne({
				$set: req.body,
			});
			res.status(200).json("The post has been updated");
		} else {
			res.status(403).json("You can update only your post");
		}
	} catch (err) {
		res.status(500).json(err);
	}
};

const likePostController = async (req, res = response) => {
	try {
		const post = await Post.findById(req.params.id);
		if (!post.likes.includes(req.body.userId)) {
			await post.updateOne({ $push: { likes: req.body.userId } });
			res.status(200).json("The post has been liked");
		} else {
			await post.updateOne({ $pull: { likes: req.body.userId } });
			res.status(200).json("The post has been unliked");
		}
	} catch (err) {
		res.status(500).json(err);
	}
};

const getPostController = async (req, res = response) => {
	try {
		const post = await Post.findById(req.params.id);
		res.status(200).json(post);
	} catch (err) {
		res.status(500).json(err);
	}
};

const getAllPostController = async (req, res = response) => {
	try {
		const currentUser = await User.findById(req.body.userId);
		const userPosts = await Post.find({ userId: currentUser._id });
		const friendPosts = await Promise.all(
			currentUser.followings.map((friendId) => {
				return Post.find({ userId: friendId });
			})
		);
		res.json(userPosts.concat(...friendPosts));
	} catch (err) {
		res.status(500).json(err);
	}
};

module.exports = {
	createPostController,
	getPostsController,
	editPostController,
	deletePostController,
	likePostController,
	getPostController,
	getAllPostController,
};
