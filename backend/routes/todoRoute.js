import express from "express";
import passport from "passport";
import slugify from "slugify";
import { ToDo } from "../model/todoModel.js";
import { getAllTitles, navAndDelete, navAndGet, navAndInsert, navAndUpdate } from "../allJsFun.js";

const router = express.Router();

router.post("/", passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        let { path, text } = req.body;
        const currentUser = req.user;
        const userId = currentUser._id;
        
        if (!path || !text) {
            return res.status(400).send({
                message: "Send all the required data (path, text)",
            });
        }
        const slug = slugify(text);

        const item = {
            title: text,
            slug: slug,
            iu: [],
            in: [],
            nu: [],
            nn: []
        };

        const filter = { userId: userId };

        let toDo = await ToDo.findOne(filter);

        if (!toDo) {

            const newToDo = {
                userId: userId,
            };

            const createdToDo = await ToDo.create(newToDo);

            createdToDo.todo[path].push(item);

            await createdToDo.save();

            return res.status(201).send({
                message: "ToDo created successfully",
            });
        }

        const points = path.split("/");

        const firstQ = points.shift();

        if (!points.length) {
            for(let i = 0; i < toDo.todo[firstQ].length; i++) {
                if(toDo.todo[firstQ][i].slug == item.slug) {
                    return res.status(405).send({
                        message: "an item already exist with the same slug in this list",
                    });
                }
            }
            toDo.todo[firstQ].push(item);
        } else {
            const isDone = navAndInsert(toDo.todo[firstQ], points, item);
            if(!isDone) {
                return res.status(405).send({
                    message: "an item already exist with the same slug in this list",
                });
            }
        }

        await toDo.save();

        return res.status(201).send({
            message: "ToDo added successfully",
        });

    } catch (error) {
        console.log(error.message);
        res.status(500).send({
            message: error.message,
        });
    }
});

router.get("/", passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        let { path } = req.query;
        console.log(path);
        const currentUser = req.user;
        const userId = currentUser._id;

        if (!path) {
            return res.status(400).send({
                message: "Send all the required data (path)",
            });
        }

        const filter = { userId: userId };

        let toDo = await ToDo.findOne(filter);

        if (!toDo) {
            return res.status(404).send({
                message: "Your todo nest not found",
            });
        }

        if (path == "home") {
            let result = getAllTitles(toDo.todo);
            return res.status(200).send(result);
        }

        const points = path.split("/");

        const firstQ = points.shift();

        if (!points.length) {
            return res.status(400).send({
                message: "wrong path is sent"
            });
        } else {
            const result = navAndGet(toDo.todo[firstQ], points);
            if(result) {
                res.status(200).send(result);
            } else {
                res.status(404).send({
                    message: "no such item exist",
                })
            }
        }

    } catch (error) {
        console.log(error.message);
        res.status(500).send({
            message: error.message,
        });
    }
});


router.put("/",passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        let { path, index, text } = req.body;
        const currentUser = req.user;
        const userId = currentUser._id;

        if (!path || !index || !text) {
            return res.status(400).send({
                message: "Send all the required data (path, index, text)",
            });
        }
        const slug = slugify(text);

        const filter = { userId: userId };

        let toDo = await ToDo.findOne(filter);

        if (!toDo) {
            return res.status(404).send({
                message: "Your todo nest not found",
            });
        }

        const points = path.split("/");

        const firstQ = points.shift();

        if(!points.length) {
            toDo.todo[firstQ][index].title = text;
            toDo.todo[firstQ][index].slug = slug;
        } else {
            navAndUpdate(toDo.todo[firstQ], points, index, text, slug);
        }

        toDo.markModified("todo");
        await toDo.save();

        return res.status(201).send({
            message: "ToDo updated successfully",
        });       

    } catch (error) {
        console.log(error.message);
        res.status(500).send({
            message: error.message,
        });
    }
});

router.delete("/",passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        let { path, index } = req.body;
        const currentUser = req.user;
        const userId = currentUser._id;

        if (!path || !index) {
            return res.status(400).send({
                message: "Send all the required data (path, index)",
            });
        }

        const filter = { userId: userId };

        if(path == "home") {
            await ToDo.findOneAndDelete(filter);
            return res.status(200).send({
                message: "your entire toDo nest is deleted successfuly"
            })
        }

        let toDo = await ToDo.findOne(filter);

        if (!toDo) {
            return res.status(404).send({
                message: "Your todo nest not found",
            });
        }

        const points = path.split("/");

        const firstQ = points.shift();

        if(!points.length) {
            toDo.todo[firstQ].splice(index,1);
        } else {
            navAndDelete(toDo.todo[firstQ], points, index);
        }

        toDo.markModified("todo");
        await toDo.save();

        return res.status(201).send({
            message: "deleted successfully",
        });

    } catch (error) {
        console.log(error.message);
        res.status(500).send({
            message: error.message,
        });
    }
});
export default router;
