const express = require("express");
const MongoClient = require("mongodb").MongoClient;
const { ObjectId } = require("mongodb");

const app = express();
const jsonParser = express.json();

const mongoClient = new MongoClient("mongodb://localhost:27017", { useUnifiedTopology: true });

let dbClient;

app.use(express.static(__dirname + "/public" ));

async function connectToDatabase() {
    try {
        const client = await mongoClient.connect();
        console.log("З'єднання з MongoDB успішно встановлено");
        dbClient = client;
        app.locals.collection = client.db("usersdb").collection("users");
        app.listen(3000, function () {
            console.log("Waiting for connection...");
        });
    } catch (error) {
        console.error("Помилка при з'єднанні з базою даних:", error);
    }
}

connectToDatabase();

app.get("/api/users", async function (req, res) {
    try {
        const collection = req.app.locals.collection;
        const users = await collection.find({}).toArray();
        res.send(users);
    } catch (error) {
        console.error("Помилка при отриманні користувачів з бази даних:", error);
        res.status(500).send("Помилка при отриманні користувачів з бази даних");
    }
});

app.get("/api/users/:id", async function (req, res) {
    try {
        const id = ObjectId.createFromHexString(req.params.id);
        const collection = req.app.locals.collection;
        const user = await collection.findOne({ _id: id });
        res.send(user);
    } catch (error) {
        console.error("Помилка при отриманні користувача з бази даних:", error);
        res.status(500).send("Помилка при отриманні користувача з бази даних");
    }
});

app.post("/api/users", jsonParser, async function (req, res) {
    try {
        if (!req.body) return res.sendStatus(400);

        const userName = req.body.name;
        const userAge = req.body.age;
        const user = { name: userName, age: userAge };

        const collection = req.app.locals.collection;
        const result = await collection.insertOne(user);

        res.send(user);
    } catch (error) {
        console.error("Помилка при додаванні користувача до бази даних:", error);
        res.status(500).send("Помилка при додаванні користувача до бази даних");
    }
});

app.delete("/api/users/:id", async function (req, res) {
    try {
        const id = ObjectId.createFromHexString(req.params.id);
        const collection = req.app.locals.collection;
        const result = await collection.findOneAndDelete({ _id: id });

        let user = result.value;
        res.send(user);
    } catch (error) {
        console.error("Помилка при видаленні користувача з бази даних:", error);
        res.status(500).send("Помилка при видаленні користувача з бази даних");
    }
});

app.put("/api/users", jsonParser, async function (req, res) {
    try {
        if (!req.body) return res.sendStatus(400);

        const id = ObjectId.createFromHexString(req.body.id);
        const userName = req.body.name;
        const userAge = req.body.age;

        const collection = req.app.locals.collection;
        const result = await collection.findOneAndUpdate(
            { _id: id },
            { $set: { age: userAge, name: userName } },
            { returnDocument: "after" }
        );

        const user = result.value;
        res.send(user);
    } catch (error) {
        console.error("Помилка при оновленні користувача у базі даних:", error);
        res.status(500).send("Помилка при оновленні користувача у базі даних");
    }
});
const fs = require("fs");

// Маршрут для збереження даних таблиці у файл JSON
app.get("/api/users/save", async function (req, res) {
    try {
        const collection = req.app.locals.collection;
        const users = await collection.find({}).toArray();

        // Зберегти дані користувачів у файл users.json
        fs.writeFile("users.json", JSON.stringify(users), (err) => {
            if (err) {
                console.error("Помилка при збереженні даних користувачів у файл:", err);
                res.status(500).send("Помилка при збереженні даних користувачів у файл");
            } else {
                console.log("Дані користувачів було збережено у файл users.json");
                res.send("Дані користувачів було збережено у файл users.json");
            }
        });
    } catch (error) {
        console.error("Помилка при отриманні користувачів з бази даних:", error);
        res.status(500).send("Помилка при отриманні користувачів з бази даних");
    }
});

process.on("SIGINT", () => {
    dbClient.close();
    process.exit();
});