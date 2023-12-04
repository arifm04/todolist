const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { MongoClient, ObjectId, ServerApiVersion } = require('mongodb');
const bcrypt = require('bcryptjs');
const app = express();
const secretKey = 'eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZXIiOiJJc3N1ZXIiLCJVc2VybmFtZSI6IkphdmFJblVzZSIsImV4cCI6MTcwMTE1Njg2OSwiaWF0IjoxNzAxMTU2ODY5fQ.fpdzX10jYVo5gv-bC5OLByzVG3R3JK8PpPw8urUJz08';
const dbURI = "mongodb://localhost:27017/";

const client = new MongoClient(dbURI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

const PORT = 8081;

let database = client.db("todolist")

app.use(cors());
app.use(express.json());

async function run() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
  }
}

async function getNextSequenceValue() {
  const collection = database.collection('counters');
  const pipeline = [
    {
      $match: { _id: "userId" }
    },
    {
      $addFields: { sequence_value: { $add: ["$sequence_value", 1] } }
    },
    {
      $merge: {
        into: "counters",
        on: "_id",
        whenMatched: "replace",
        whenNotMatched: "insert"
      }
    },
    {
      $project: { sequence_value: 1, _id: 0 }
    }
  ];

  const results = await collection.aggregate(pipeline).toArray();
  return results.length > 0 ? results[0].sequence_value : null;
}


app.get('/', (req, res) => {
  res.send('Hello!!');
});

app.post('/signup', async (req, res) => {
  const collection = database.collection('users');

  try {
    const { email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const maxUserIdResult = await collection.aggregate([
      { $group: { _id: null, maxUserId: { $max: "$userId" } } }
    ]).toArray();

    const maxUserId = maxUserIdResult.length > 0 ? maxUserIdResult[0].maxUserId : 0;
    const newUserId = maxUserId + 1;

    const existingUser = await collection.findOne({ email });
    if (existingUser) {
      return res.status(400).send({ status: false, message: 'User already exists' });
    }

    const result = await collection.insertOne({
      ...req.body,
      password: hashedPassword,
      userId: newUserId
    });

    res.status(201).send({ status: true, message: 'User created successfully, Please Login!!', userId: result.insertedId });
  } catch (error) {
    console.error(error);
    res.status(500).send({ status: false, message: 'Internal Server Error' });
  }
});


app.post('/login', async (req, res) => {
  const collection = database.collection('users');

  try {
    const { email, password } = req.body;

    const user = await collection.findOne({ email });

    if (!user) {
      return res.status(401).send({ status: false, message: 'Invalid credentials' });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).send({ status: false, message: 'Invalid credentials' });
    }

    const tokenPayload = {
      email,
      _id: user._id
    };
    const token = jwt.sign(tokenPayload, secretKey, { expiresIn: '1h' });

    await collection.updateOne(
      { _id: user._id },
      { $set: { token: token } }
    );

    return res.status(200).send({
      status: true,
      message: 'User logged in',
      token,
      userId: user._id
    });

  } catch (error) {
    console.error(error);
    res.status(500).send({ status: false, message: 'Internal Server Error' });
  }
});



app.post('/todoInsert', async (req, res) => {
  const collection = database.collection('todolist');
  const { newTask, uid } = req.body;
  try {
    const { title, description, dueDate, status, category } = newTask;
    const newTaskData = {
      title,
      description,
      dueDate: new Date(dueDate),
      status,
      category,
      createdAt: new Date(),
      uid: uid
    };

    const result = await collection.insertOne(newTaskData);

    if (result.acknowledged) {
      res.status(201).send({ message: 'Task added successfully', taskId: result.insertedId });
    } else {
      res.status(400).send({ message: 'Unable to add task' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
});

app.post('/getTodolist', async (req, res) => {
  const collection = database.collection('todolist');
  const { uid } = req.body;

  try {
    const todos = await collection.aggregate([
      { $match: { uid: uid } },
    ]).toArray();

    res.status(200).json(todos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.post('/updateTask', async (req, res) => {
  const collection = database.collection('todolist');
  const { editTask, uid } = req.body;
  try {
    const { id, status } = editTask;

    const filter = { _id: new ObjectId(id), uid: uid };
    const updateDoc = { $set: { status } };

    const result = await collection.updateOne(filter, updateDoc);

    if (result.modifiedCount === 0) {
      return res.status(404).send({ message: 'No task found with the given ID and user ID' });
    }

    res.status(200).send({ message: 'Task updated successfully' });
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).send({ message: 'Error updating task' });
  }
});
app.post('/updateStatus', async (req, res) => {

  const collection = database.collection('todolist');
  try {
    const { id, status, uid } = req.body;

    const filter = { _id: new ObjectId(id), uid: uid };
    const updateDoc = { $set: { status } };

    const result = await collection.updateOne(filter, updateDoc);

    if (result.modifiedCount === 0) {
      return res.status(404).send({ message: 'No task found with the given ID and user ID' });
    }

    res.status(200).send({ message: 'Task updated successfully' });
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).send({ message: 'Error updating task' });
  }
});

app.post('/updateTodo', async (req, res) => {
  const collection = database.collection('todolist');

  try {
    const { editTask } = req.body;

    const filter = { _id: new ObjectId(editTask.id) };
    const updateDoc = { $set: { ...editTask } };

    const result = await collection.updateOne(filter, updateDoc);

    if (result.modifiedCount === 0) {
      return res.status(404).send({ message: 'No task found with the given ID' });
    }

    res.send({ message: 'Task updated successfully' });
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).send({ message: 'Error updating task' });
  }
});

app.post('/deleteTodo', async (req, res) => {
  const collection = database.collection('todolist');
  try {
    const { taskId, uid } = req.body;
    const result = await collection.deleteOne({ _id: new ObjectId(taskId), uid: uid });

    if (result.deletedCount === 1) {
      res.status(200).json({ message: 'Task successfully deleted' });
    } else {
      res.status(404).json({ message: 'Task not found' });
    }

  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

run().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}).catch(console.error);
