// Create express app
const express = require('express');
const app = express();
const db = require('./database.js');
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
// Server port
const HTTP_PORT = 8000;
// Start server
app.listen(HTTP_PORT, () => {
  console.log('Server running on port %PORT%'.replace('%PORT%', HTTP_PORT));
});

// Root endpoint
app.get('/', (req, res, next) => {
  res.json({message: 'Ok'});
});

// get all endpoint
app.get('/data/getAll', (req, res, next) => {
  const query = 'select * from expenses';
  let params = [];
  db.all(query, params, (err, rows) => {
    if (err) {
      res.status(400).json({error: err.message});
      return;
    }

    rows.reduce((acc, curr) => {
      acc[curr.name] = curr;
      return acc;
    }, {});

    const formattedResponse = rows.reduce(
      (acc, curr) => {
        if (curr.name === 'elena') {
          acc.elena.push(curr);
        } else {
          acc.george.push(curr);
        }
        return acc;
      },
      {george: [], elena: []},
    );

    // TODO: calculate the amount for each user
    res.json({
      message: 'success',
      data: formattedResponse,
    });
  });
});

// delete all endpoint
app.delete('/data/dropAll', (req, res, next) => {
  //drop all the data
  // Query to delete all the data inside user table
  const query = 'delete from expenses';
  let params = [];
  db.all(query, params, (err, _) => {
    if (err) {
      res.status(400).json({error: err.message});
      return;
    }
    res.json({
      message: 'success',
    });
  });
});

// create one
app.post('/data/insert/', (req, res, next) => {
  // get the data from the request body
  let errors = [];
  if (!req.body.description) {
    errors.push('No description specified');
  }

  if (!req.body.amount) {
    errors.push('No amount specified');
  }

  if (!req.body.name) {
    errors.push('No name specified');
  }

  if (errors.length) {
    res.status(400).json({error: errors.join(',')});
    return;
  }

  const data = {
    amount: req.body.amount,
    description: req.body.description,
    name: req.body.name,
  };

  let sql = 'INSERT INTO expenses ( amount, description, name) VALUES (?,?,?)';
  let params = [data.amount, data.description, data.name];
  db.run(sql, params, function (err, result) {
    if (err) {
      res.status(400).json({error: err.message});
      return;
    }
    res.json({
      message: 'success',
      data: data,
      id: this.lastID,
    });
  });
});

// delete one
app.delete('/data/:id', (req, res, next) => {
  db.run(
    'DELETE FROM expenses WHERE id = ?',
    req.params.id,
    function (err, result) {
      if (err) {
        res.status(400).json({error: res.message});
        return;
      }
      res.json({message: 'success', changes: this.changes});
    },
  );
});

// create a create entry
app.use(function (req, res) {
  res.status(404);
});

module.exports = app;
