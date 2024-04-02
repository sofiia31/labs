const express = require("express");
const mongoose = require("mongoose");

const app = express();
const jsonParser = express.json();

mongoose.connect("mongodb://localhost:27017/usersdb", { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("З'єднання з MongoDB через Mongoose успішно встановлено");
        app.listen(3000, function () {
            console.log("Сервер запущено на порту 3000...");
        });
    })
    .catch((error) => {
        console.error("Помилка при з'єднанні з базою даних:", error);
    });

const userSchema = new mongoose.Schema({
    name: String,
    age: Number
});

const User = mongoose.model("User", userSchema);

app.use(express.static(__dirname + "/public"));

app.get("/api/users", async function (req, res) {
    try {
        const users = await User.find({});
        res.send(users);
    } catch (error) {
        console.error("Помилка при отриманні користувачів з бази даних:", error);
        res.status(500).send("Помилка при отриманні користувачів з бази даних");
    }
});

app.get("/api/users/:id", async function (req, res) {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).send("Користувача не знайдено");
        }
        res.send(user);
    } catch (error) {
        console.error("Помилка при отриманні користувача з бази даних:", error);
        res.status(500).send("Помилка при отриманні користувача з бази даних");
    }
});

app.post("/api/users", jsonParser, async function (req, res) {
    try {
        const { name, age } = req.body;
        if (!name || !age) {
            return res.status(400).send("Не вказано ім'я або вік користувача");
        }
        const newUser = await User.create({ name, age });
        res.send(newUser);
    } catch (error) {
        console.error("Помилка при додаванні користувача до бази даних:", error);
        res.status(500).send("Помилка при додаванні користувача до бази даних");
    }
});

app.put("/api/users/:id", jsonParser, async function (req, res) {
    try {
        const { id } = req.params;
        const { name, age } = req.body;
        const updatedUser = await User.findByIdAndUpdate(id, { name, age }, { new: true });
        if (!updatedUser) {
            return res.status(404).send("Користувача не знайдено");
        }
        res.send(updatedUser);
    } catch (error) {
        console.error("Помилка при оновленні користувача у базі даних:", error);
        res.status(500).send("Помилка при оновленні користувача у базі даних");
    }
});

app.delete("/api/users/:id", async function (req, res) {
    try {
        const { id } = req.params;
        const deletedUser = await User.findByIdAndDelete(id);
        if (!deletedUser) {
            return res.status(404).send("Користувача не знайдено");
        }
        res.send(deletedUser);
    } catch (error) {
        console.error("Помилка при видаленні користувача з бази даних:", error);
        res.status(500).send("Помилка при видаленні користувача з бази даних");
    }
});

process.on("SIGINT", () => {
    mongoose.connection.close(() => {
        console.log("З'єднання з базою даних закрито");
        process.exit(0);
    });
});