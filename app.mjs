import express from 'express';
import ejs from 'ejs';
import path from 'path';

const app = express();

app.use(express.static("public"));


app.set('view engine', 'ejs');

app.listen(3000);

app.get("/", (req, res) => res.render("home"));
app.get("/calc", (req, res) => res.render("calculator"));
