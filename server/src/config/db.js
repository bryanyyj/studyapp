const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Open (or create) the database file

const dbPath = path.join(__dirname, '../../../study_app.db');

let db = new sqlite3.Database(dbPath , (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Connected to the SQLite database.');
});

db.serialize(() => {
  // Drop tables if they exist
  db.exec(`
    DROP TABLE IF EXISTS reminders;
    DROP TABLE IF EXISTS study_sessions;
    DROP TABLE IF EXISTS user_subjects;
    DROP TABLE IF EXISTS subjects;
    DROP TABLE IF EXISTS users;
    DROP TABLE IF EXISTS reviews;
    DROP TABLE IF EXISTS time_prediction;
    DROP TABLE IF EXISTS Todos;
  `, (err) => {
    if (err) {
      console.error('Error dropping tables:', err.message);
    } else {
      console.log('Old tables dropped successfully.');
    }
  });

  // Create tables and insert sample data in one execution block
  const sql = `
    CREATE TABLE Users (
      user_id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    
    CREATE TABLE Subjects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      description TEXT
    );
    
    CREATE TABLE User_Subjects (
      user_id INTEGER NOT NULL,
      subject_id INTEGER NOT NULL,
      is_struggling INTEGER DEFAULT 0,
      PRIMARY KEY (user_id, subject_id),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE
    );

    CREATE TABLE Study_Sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      subject_id INTEGER,
      start_time DATETIME NOT NULL,
      end_time DATETIME,
      total_time INTEGER,
      break_time INTEGER,
      notes TEXT,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (subject_id) REFERENCES subjects(id)
    );

    CREATE TABLE Reminders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      message TEXT NOT NULL,
      scheduled_time DATETIME NOT NULL,
      is_completed INTEGER DEFAULT 0,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    -- Insert some sample subjects
    INSERT INTO Subjects (name, description) VALUES ('E Math', 'Everyday Math for secondary school');
    INSERT INTO Subjects (name, description) VALUES ('A Math', 'Advanced Math for secondary school');
    INSERT INTO Subjects (name, description) VALUES ('Combined Science (Physics)', 'Physics topics in combined science');
    INSERT INTO Subjects (name, description) VALUES ('Combined Science (Chem)', 'Chemistry topics in combined science');
    INSERT INTO Subjects (name, description) VALUES ('Combined Science (Bio)', 'Biology topics in combined science');

    CREATE TABLE Reviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      rating INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      scheduleSatisfaction INTEGER NOT NULL,
      sessionDuration INTEGER NOT NULL,
      feedback TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );


    CREATE TABLE time_prediction (
    time_prediction_id INTEGER PRIMARY KEY AUTOINCREMENT,
    review_id INT NOT NULL,
    predicted_class INT NOT NULL,
    predicted_duration VARCHAR(50) NOT NULL,
    probabilities TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_review
    FOREIGN KEY (review_id)
    REFERENCES reviews (review_id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);


CREATE TABLE Todos (
    todo_id INTEGER PRIMARY KEY AUTOINCREMENT,
    subject TEXT NOT NULL,
    task TEXT NOT NULL,
    deadline DATETIME NOT NULL
);


  `;

  db.exec(sql, (err) => {
    if (err) {
      console.error('Error creating tables and inserting data:', err.message);
    } else {
      console.log('Tables created and sample data inserted successfully.');
    }
  });
});

// Close the database connection
db.close((err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Closed the database connection.');
});

