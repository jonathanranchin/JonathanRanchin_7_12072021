const express = require('express');
const mysql = require('mysql');

const app = express();

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '@Trololo4055',
    database: 'acme'
});

db.connect();

app.get('/users', (req, res) => {
    const sql = 'SELECT * FROM users';

    db.query(sql, (err, result) => {
        if(err) {
            throw err
        };
        res.send(result);
    });
});

app.get('/comments', (req, res) => {
    const sql = 'SELECT * FROM comments';

    db.query(sql, (err, result) => {
        if(err) {
            throw err
        };
        res.send(result);
    });
});

app.get('/posts', (req, res) => {
    const sql = 'SELECT * FROM posts';

    db.query(sql, (err, result) => {
        if(err) {
            throw err
        };
        res.send(result);
    });
});

app.listen(5000, () => console.log('Server Operational'));