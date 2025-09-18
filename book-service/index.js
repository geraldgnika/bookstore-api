const express = require('express');
const books = require('./books.json');

const app = express();
app.use(express.json());

app.get('/books', (res) => {
    res.json(books);
});

app.get('/books/:id', (req, res) => {
    const id = req.params.id;
    const book = books.find(b => b.id === id);
    
    if (!book) {
        return res.status(404).json({ error: 'Book not found!' });
    } else {
        res.json(book);
    }
});

const PORT = process.env.PORT || 8082;
app.listen(PORT);