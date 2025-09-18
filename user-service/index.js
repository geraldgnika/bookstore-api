const express = require('express');
const axios = require('axios');
const users = require('./users.json');

const app = express();
app.use(express.json());

app.get('/users', (req, res) => {
  res.json(users);
});

app.get('/users/:id', (req, res) => {
    const id = req.params.id;
    const user = users.find(u => u.id === id);

    if (!user) {
        return res.status(404).json({ error: 'User not found!' });
    } else {
        res.json(user);
    }
});

function convertToCSV(rows) {
  const headers = ['User Id', 'First Name', 'Last Name', 'Date', 'Book', 'Pages Read'];
  const separators = [headers.join('|')];

  rows.forEach(r => {
    const row = [
      r.userId,
      r.firstName,
      r.lastName,
      r.date,
      r.book,
      r.pagesRead
    ].join('|');

    separators.push(row);
  });

  return separators.join('\n');
}

app.post('/users/export', async (req, res) => {
    try {
        const bookServiceUrl = process.env.BOOK_SERVICE_URL || 'http://localhost:8082/books';
        const { data: books } = await axios.get(bookServiceUrl);
        
        const rows = users.map(u => {
            const book = books.find(b => b.id === u.bookId);
            const pagesRead = book ? Math.round(book.totalPages * (u.percentageRead || 0)) : 0;
            
            return {
                userId: u.id,
                firstName: u.firstName,
                lastName: u.lastName,
                date: u.date,
                book: book ? book.name : 'Null',
                pagesRead
            };
        });

        const csvFile = convertToCSV(rows);
        res.type('text/csv').send(csvFile);
    } catch {
        res.status(500).json({ error: 'Export failed!' });
    }
});

const PORT = process.env.PORT || 8081;

app.listen(PORT);

module.exports = app;