const sqlite3 = require('sqlite3').verbose();
const md5 = require('md5');

const DBSOURCE = 'db.sqlite';

let db = new sqlite3.Database(DBSOURCE, err => {
  if (err) {
    // Cannot open database
    console.error(err.message);
    throw err;
  } else {
    console.log('Connected to the SQLite database.');
    db.run(
      `CREATE TABLE expenses (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT
            amount REAL
            description TEXT
            )`,
      err => {
        if (err) {
          console.log("Didn't create a table, mostlikely table already exists");
        } else {
          console.log('database initialised');
        }
      },
    );
  }
});

module.exports = db;
