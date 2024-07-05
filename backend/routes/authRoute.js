import express from "express";
import passport from "passport";
import { User } from "../model/userModel.js";
import { compareSync, hashSync } from "bcrypt";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/register", function (req, res) {
    
    const { username, password, displayName } = req.body;

    if(!username || !password || !displayName) {
        return res.status(400).send({
            message: "Send all the required data (username, password, displayName)",
        });
    }

    const user = new User({
        username: username,
        password: hashSync(password, 10),
        displayName: displayName
    });

    user.save().then(user => {
        res.status(200).send({
            message: "User created successfully",
            user: {
                id: user._id,
                username: user.username,
                displayName: user.displayName
            }
        })
    }).catch(error => {
        res.status(500).send({
            message: error.message,
        });
    })
});

router.post("/login", function (req, res) {

    User.findOne({ username: req.body.username }).then(user => {
        if(!user) {
            return res.status(401).send({
                message: "User not found"
            })
        }
        if(!compareSync(req.body.password, user.password)) {
            return res.status(401).send({
                message: "Incorrect password"
            })
        }
        const payload = {
            id: user._id,
            username: user.username,
            displayName: user.displayName
        }
        const token = jwt.sign(payload, process.env.SECRET, { expiresIn: "1d" });
        return res.status(200).send({
            message: "Successfully logged in",
            token: "Bearer " + token
        });
    });

});

router.get("/user", passport.authenticate('jwt', { session: false }), (req, res) => {
    return res.status(200).send({
        message: "u are one of us",
        user: {
            id: req.user._id,
            username: req.user.username,
            displayName: req.user.displayName
        }
    });
});

export default router;
