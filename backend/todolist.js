const express = require('express');
const app = express();
const cors = require('cors');
const dbURI = "mongodb+srv://admin:rpdiVsK3tLnbFrfH@cluster0.a4ifhlu.mongodb.net/?retryWrites=true&w=majority";

const { MongoClient } = require('mongodb');

const uri = "your-mongodb-connection-string"; 
const client = new MongoClient(dbURI);
const database = client.db('todolist'); 
run().catch(console.dir);

app.use(cors());

app.use(express.urlencoded({ extended: true })); 

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.post('/signup', async (req, res) => {
  const collection = database.collection('users'); 

  try {
    const data = req.body;
    const jsonString = Object.keys(data)[0];
    const parsedData = JSON.parse(jsonString);

    const existingUser = await collection.findOne({ email: parsedData.email });
    if (existingUser) {
      return res.status(400).send('User already exists');
    }

    const result = await collection.insertOne(parsedData);

    res.status(201).send({ status: true, message: 'User created successfully, Please Login!!', userId: result.insertedId });
  } catch (error) {
    res.status(201).send({ status: false, message: 'Error creating user' });

  }
});

app.post('/login', async (req, res) => {
  const collection = database.collection('users'); 

  try {

    const data = req.body;

    const jsonString = Object.keys(data)[0];
    const parsedData = JSON.parse(jsonString);
    const existingUser = await collection.findOne({ email: parsedData.email });
    // console.log(existingUser)

    if (!existingUser) {
      return res.status(400).send({ status: false, message: 'Invalid credentials' });

    } else {
      return res.status(200).send({ status: true, message: 'User loggedin' });

    }

  } catch (error) {
    res.status(201).send({ status: false, message: 'Error creating user' });

  }
});


async function run() {
  try {
    await client.connect();
    console.log("Connected successfully to MongoDB");

  }
  finally {
    //   await client.close();
  }
}

// run().catch(console.dir);


const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
