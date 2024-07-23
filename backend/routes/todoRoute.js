import express from "express";
import passport from "passport";
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

        const item = {
            title: text,
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
            toDo.todo[firstQ].push(item);
        } else {
            navAndInsert(toDo.todo[firstQ], points, item);
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
            const result = getAllTitles(toDo.todo, "Home");
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
        let { path, text } = req.body;
        const currentUser = req.user;
        const userId = currentUser._id;

        if (!path || !text) {
            return res.status(400).send({
                message: "Send all the required data (path, text)",
            });
        }

        const filter = { userId: userId };

        let toDo = await ToDo.findOne(filter);

        if (!toDo) {
            return res.status(404).send({
                message: "Your todo nest not found",
            });
        }

        const points = path.split("/");

        const firstQ = points.shift();

        navAndUpdate(toDo.todo[firstQ], points, text);

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
        let { path } = req.body;
        const currentUser = req.user;
        const userId = currentUser._id;

        if (!path) {
            return res.status(400).send({
                message: "Send all the required data (path)",
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

        navAndDelete(toDo.todo[firstQ], points);

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
