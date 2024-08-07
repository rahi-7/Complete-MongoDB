const express = require('express')
const { connectToDb, getDb } = require('./db')
const { ObjectId } = require('mongodb');

const app = express()
app.use(express.json())
let db 

connectToDb((err) => {
    if(!err) {
        app.listen(3000, () => {
            console.log('app listening on port 3000')
        })
        db = getDb()
    }
})

app.get('/books', (req, res) => {
    const page = req.query.p || 0
    const booksPerPage = 3
  
    let books = []

    db.collection('books')
      .find()
      .sort({ author: 1 })
      .skip(page * booksPerPage)
      .limit(booksPerPage)
      .forEach(book => books.push(book)) 
      . then(()=> {
        res.status(200).json(books)
    })
    .catch(() => {
        res.status(500).json({error: 'Could not fetch the documents'})
    })
})

app.get('/books/:id', (req, res) => {
   
    if(ObjectId.isValid(req.params.id)) {
        db.collection('books')
        .findOne({_id: ObjectId(req.params.id)})
        .then(doc => {
            res.status(200).json(result)
        })
        .catch(err => {
            res.status(500).json({error: 'Could not delete the document'})
        })
    } else {
        res.status(500).json({error: 'Not a valid document id'})
    }
})

app.post('/books', (req, res) => {
  const book = req.body

  db.collection('books')
    .insertOne(book)
    .then(result => {
        res.status(201).json(result)
    })
    .catch(err => {
        res.status(500).json({err: 'Could not create a new document'})
    })
})

app.delete('/books/:id', (req, res) => {
    const id = req.params.id;

    if (ObjectId.isValid(id)) {
        db.collection('books')
          .deleteOne({ _id: new ObjectId(id) })  // Use 'new' here
          .then(result => {
              if (result.deletedCount === 0) {
                  return res.status(404).json({ error: 'Document not found' });
              }
              res.status(200).json({ message: 'Document deleted', result });
          })
          .catch(err => {
              res.status(500).json({ error: 'Could not delete the document' });
          });
    } else {
        res.status(400).json({ error: 'Not a valid document id' });
    }
})

app.patch('/books/:id', (req, res) => {
    const updates = req.body;

    if (ObjectId.isValid(req.params.id)) {
        db.collection('books')
          .updateOne({ _id: new ObjectId(req.params.id) }, { $set: updates })
          .then(result => {
              res.status(200).json(result);
          })
          .catch(err => {
              res.status(500).json({ error: 'Could not update the document' });
          });
    } else {
        res.status(400).json({ error: 'Not a valid document id' });
    }
})


