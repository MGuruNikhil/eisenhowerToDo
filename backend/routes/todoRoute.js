import express from "express";
import passport from "passport";
import { ToDo } from "../model/todoModel.js";

const router = express.Router();

router.post("/add", passport.authenticate('jwt', { session: false }), async (req, res) => {
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

        function navAndInsert(arr, points, newItem) {
            if(points.length == 1) {
                const title = points[0].split('.')[0];
                const quad = points[0].split('.')[1];
                for(let i=0;i<arr.length;i++) {
                    if(arr[i].title == title) {
                        arr[i][quad].push(newItem);
                        return;
                    }
                }
            } else {
                const title = points[0].split('.')[0];
                const quad = points[0].split('.')[1];
                for(let i=0;i<arr.length;i++) {
                    if(arr[i].title == title) {
                        points.shift();
                        return navAndInsert(arr[i][quad], points, newItem);
                    }
                }
            }
        }

        const firstQ = points.shift();
        
        if(!points.length) {
            toDo.todo[firstQ].push(item);
        } else {
            navAndInsert(toDo.todo[firstQ], points, item);
        }

        console.log(toDo);

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

export default router;
