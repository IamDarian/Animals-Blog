import express from "express";
import { Article } from "../models/article.js";

const router = express.Router()

router.use(express.static("public"));

router.get("/new", (req, res) => {
    res.render("articles/new", {
        article: new Article()
    });
});

router.get("/edit/:id", async (req, res) => {
    const article = await Article.findById(req.params.id);
    res.render("articles/edit", { article: article });
});

router.get("/:id", async (req, res) => {
    const article = await Article.findById(req.params.id);
    if(article == null) res.redirect("/");
    res.render('articles/show', { article: article });
});

router.post("/", async (req, res, next) => {
    req.article = new Article()
    next();
}, saveArticle("/new"));  

router.put("/:id", async (req, res, next) => {
    req.article = await Article.findById(req.params.id);
    next();
}, saveArticle("edit"));

router.delete("/:id", async (req, res) => {
    await Article.findByIdAndDelete(req.params.id);
    res.redirect("/");
});


//comments
router.post("/:id", async (req, res) => {
    const { id }  = req.params;
    const { username, comment } = req.body;
    
    try{
        const article = await Article.findById(id);
        article.comments.push({ username, comment });

        await article.save();

        res.redirect(`/articles/${id}`);

    } catch(err) {
        console.log(err);
        res.redirect(`/articles/${id}`);;
    }
});

router.get("/:id", async (req, res) => {
    const article = await Article.findById(req.params.id);
    res.render("articles/show", { article: article });
});

router.delete("/:articleId/:commentId", async (req, res) => {
    const { articleId, commentId } = req.params;
    try {
        await Article.findByIdAndUpdate(articleId, {
            $pull: { comments: { _id: commentId } }
        });

        res.redirect(`/articles/${articleId}`);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});


//functions
function saveArticle(path) {
    return async (req, res) =>{
        let article = req.article
            article.author = req.body.author
            article.title = req.body.title
            article.description = req.body.description
            article.writtenText = req.body.writtenText
            article.tags = req.body.tags

        try {
            article = await article.save();
            res.redirect(`/articles/${article.id}`);
        } catch (e) {
            console.log(e);
            res.render(`articles/${path}`, { article: article });
        }
    }
}

export { router };