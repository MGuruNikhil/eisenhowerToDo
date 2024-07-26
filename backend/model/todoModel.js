import mongoose from "mongoose";

export const itemSchema = new mongoose.Schema({
    title: {
        type: String
    },
    slug: String,
    iu: [],
    in: [],
    nu: [],
    nn: []
}, { _id : false, minimize: false });

export const todoSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    todo: {
        iu: [itemSchema],
        in: [itemSchema],
        nu: [itemSchema],
        nn: [itemSchema]
    }
}, { minimize: false });

export const ToDo = mongoose.model('todo', todoSchema);
