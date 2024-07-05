import app from "./app.js";
import mongoose from "mongoose";
import { PORT, mongoDBURL } from "./config.js";


mongoose.connect(mongoDBURL)
.then(() => {
    console.log("App connected to database");
    app.listen(PORT, () => {
        console.log(`listening:${PORT}`);
    });
})
.catch((error) => {
    console.log(error);
});
