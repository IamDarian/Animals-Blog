import mongoose from "mongoose";

const articleScheme = new mongoose.Schema({
    title:{
        required: true,
        type: String,
    },
    author:{
        required: true,
        type: String,
    },
    tags:{
        required: true,
        type: String,
    },
    description:{
        required: true,
        type: String,
    },
    writtenText:{
        required: true,
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    imgRandomizer: {
        type: Number,
        default: function() {
            return Math.floor(Math.random()*8)+1;
        }
    }, 
    comments: [{
        username: {
            type: String,
            required: true
        },
        comment: {
            type: String,
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }]
});

const Article = mongoose.model("Article", articleScheme);

export { Article };