const express = require('express');
const { MongoClient } = require('mongodb');

const app = express();
const port = 3000;

const mongoURL = 'mongodb://localhost:27017';
const dbName = 'testdb';
const collectionName = 'testcollection';

async function connectAndRetrieve() {
  try {
    const client = await MongoClient.connect(mongoURL, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('З\'єднання з MongoDB успішно встановлено');

    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    const data = await collection.find({}).toArray();
    console.log('Дані з колекції успішно отримані:', data);

    client.close();
    return data;
  } catch (error) {
    console.error('Помилка при отриманні даних з бази даних:', error);
    return [];
  }
}

app.get('/api/data', async (req, res) => {
  try {
    const data = await connectAndRetrieve();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Помилка при отриманні даних з бази даних' });
  }
});

app.listen(port, () => {
  console.log(`Сервер запущено на порті ${port}`);
});