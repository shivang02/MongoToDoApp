const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const Task = require("./models/Task");


dotenv.config();

app.use("/static", express.static("public"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());


//connection to db
const DB = process.env.MONGODB_URI ;

mongoose.connect(
    DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});


app.set("view engine", "ejs");
// READ
app.get('/', (req, res) => {
    Task.find({}, (err, tasks) => {
        res.render("todo.ejs", {tasks: tasks, onlyComp: false});
    });
});

// READ2
app.get('/completed', (req, res) => {
    Task.find({}, (err, tasks) => {
        res.render("todo.ejs", { tasks: tasks, onlyComp: true });
    });
});

// CREATE
app.post('/', async (req, res) => {
    const task = new Task({
        Description: req.body.Description
    });
    try {
        await task.save();
        res.redirect("/");
    } catch (err) {
        res.redirect("/");
    }
});

//UPDATE
app
    .route("/edit/:id")
    .get((req, res) => {
        const id = req.params.id;
        Task.findByIdAndUpdate(id, { "Completed": true }, err => {
            if (err) return res.send(500, err);
            res.redirect("/");
        });
    });

//DELETE
app
    .route("/remove/:id")
    .get((req, res) => {
        const id = req.params.id;
        Task.findByIdAndDelete(id, err => {
            if (err) return res.send(500, err);
            res.redirect("back");
        });
});
const port = process.env.PORT || 3000;
app.listen(port, () => console.log("Server Up and running"));