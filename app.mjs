import express from "express";
import ejs from "ejs";
import path from "path";
import { detectFood } from "./services/llmService.mjs";
import { processImg } from "./middleware/processImgMiddleware.mjs";

const app = express();

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: "50mb" }));

app.set("view engine", "ejs");

app.listen(3000);

console.log("Server running at http://localhost:3000/calc");

app.get("/", (req, res) => res.render("home"));
app.get("/calc", (req, res) => res.render("calculator"));

app.post("/upload", (req, res) => {
	//console.log(req.body);

	// Returns data - proccessed base64, img type, detected food with estimated cals
	processImg(req.body).then((data) => res.json(data));
});
