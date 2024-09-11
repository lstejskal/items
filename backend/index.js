
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());

const config = require('./config');

app.use(cors({
  origin: config.corsOrigin,
  credentials: true,
}));

(async () => {
  try {
    await mongoose.connect(config.mongo.connectionString)
    console.log('Connected to MongoDB')
  } catch (err) {
    console.error('Could not connect to MongoDB: ', err);
  }
})()

const toMongoType = (t) => {
  if (t === 'string') {
    return String;
  }
  if (t === 'number') {
    return Number;
  }
  throw new Error('Invalid item type!');
};

const { itemTypes } = config;

// set up MongoDB models
const Item = {};
itemTypes.forEach((item, i) => {
  // convert attribute type in config to MongoDB type
  const updatedAttributes = Object.fromEntries(
    Object.entries(item.attributes).map((e) => {
      return [e[0], toMongoType(e[1])];
    })
  );

  const itemSchema = new mongoose.Schema(updatedAttributes);

  Item[item.type] = mongoose.model(item.type, itemSchema);
});

const verifyTurnstile = async (turnstileToken, secretKey) => {
  try {
    const response = await axios.post(config.turnstile.url, 
      new URLSearchParams({
        secret: secretKey,
        response: turnstileToken,
      }).toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        }
      }
    );

    const data = response.data;
    if (data.success) {
      console.log('CAPTCHA verified successfully');
    } else {
      console.error('CAPTCHA verification failed:', data['error-codes']);
    }
  } catch (error) {
    console.error('Error during CAPTCHA verification:', error.message);
  }
};

app.get('/item-types', async (req, res) => {
  return res.status(200).json(itemTypes.map((i) => i.type));
});

app.get('/item-types/:type', async (req, res) => {
  const item = itemTypes.find((i) => i.type === req.params.type);

  if (!item) {
    return res.status(404);
  }

  res.status(200).json(item.attributes);
});

app.post('/items', async (req, res) => {
  const itemType = req.body.type;
  const itemSecretKey = itemTypes.find((i) => i.type === itemType).captcha.secret_key; // REFACTOR

  try {
    await verifyTurnstile(req.body.turnstile_token, itemSecretKey);
  } catch (error) {
    return res.status(400).json({ message: 'CAPTCHA verification failed', error });
  }

  const item = new Item[itemType](req.body);

  try {
    const newItem = await item.save();
    res.status(201).json(item);
  } catch (error) {
    res.status(400).json({ error: `Unable to save ${item.type}` });
  }
});

app.get('/items/:type', async (req, res) => {
  const { type } = req.params;

  try {
    const items = await Item[type].find();
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ error: 'Unable to fetch item types' });
  }
});

app.get('/items/:type/:id', async (req, res) => {
  const { type, id } = req.params;

  try {
    const item = await Item[type].findById(id);
  
    if (!item) {
      return res.status(404);
    }

    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ error: 'Unable to fetch item type' });
  }
});

app.listen(config.port, () => {
  console.log(`Server is running on port ${config.port}`);
});
