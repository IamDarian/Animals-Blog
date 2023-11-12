import express from "express";
import ejs from "ejs";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import methodOverride from "method-override"
import { router } from "./routes/articles.js"
import { Article } from "./models/article.js";
import * as dotenv from 'dotenv';

const app = express();
const port = 3000;
dotenv.config();

mongoose.connect(process.env.MONGO_URI);

app.set("view engine", "ejs");

app.use(methodOverride("_method"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));
app.use("/articles", router);


app.get("/", async (req, res) => {
    const articles = await Article.find().sort({ createdAt: "desc" });

    res.render("articles/index", {
        articles: articles,
    });
});

app.get("/about", (req, res) => {
    res.render("about");
});

app.listen(port, () => {
    console.log(`The serever has started on port ${port}.`);
});

