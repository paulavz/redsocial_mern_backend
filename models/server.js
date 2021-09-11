const express = require("express");
//const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const { dbConnection } = require("../database/config");

class Server {
	constructor() {
		this.app = express();
		this.port = process.env.PORT;
		this.homePath = "/";
		this.usersPath = "/api/users";
		this.authPatch = "/api/auth";
		this.postPatch = "/api/posts";

		//Conectar a base de datos
		this.connectDB();

		//Parseo y lectura del body
		this.app.use(express.json());

		//Middlewares
		this.middrewares();
		//Rutas de mi Aplicación

		this.routes();
	}

	async connectDB() {
		await dbConnection();
	}

	middrewares() {
		//cors
		this.app.use(helmet());
		this.app.use(morgan("common"));
		//this.app.use(cors());
		//Directorio Público
		this.app.use(express.static("public"));
	}

	routes() {
		this.app.use(this.homePath, require("../routes/home.route"));
		this.app.use(this.usersPath, require("../routes/users.route"));
		this.app.use(this.authPatch, require("../routes/auth.route"));
		this.app.use(this.postPatch, require("../routes/posts.route"));
	}

	listen() {
		this.app.listen(this.port, () => {
			console.log("Server running on port", this.port);
		});
	}
}

module.exports = Server;
