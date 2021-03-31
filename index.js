const express = require('express')
const port = 5000 || process.env.PORT;
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config()


const app = express();
app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
  res.send('This is port 5000')
})

const MongoClient = require('mongodb').MongoClient;
const { ObjectId } = require('bson');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gpn2l.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const booksCollection = client.db("bongoLibrary").collection("books");
  console.log("database connected , error:",err);
  
  app.post('/addProduct', (req, res) => {
    const productInfo = req.body;
    console.log("adding new product", productInfo);
    booksCollection.insertOne(productInfo)
      .then(result => {
        console.log(result.insertedCount, 'insertedCount');
        res.send(result.insertedCount > 0)
    })
  })
  
  app.get('/books',(req, res)=> {
    booksCollection.find({})
      .toArray((err, documents) => {
      res.send(documents)
    })
  })
  app.get('/book/:id', (req, res) => {
    console.log(req.params.id);
    booksCollection.find({_id:ObjectId(`${req.params.id}`)})
      .toArray((err, documents) => {
        res.send(documents)
        console.log(err,"for finding a book");
    })
  })

});

app.listen(port)