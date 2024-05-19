import mysql from 'mysql2/promise.js';

export class SubjectHandler {
  constructor() {
    this.pool = mysql.createPool({
      connectionLimit: 20,
      database: 'sql11706392',
      host: 'sql11.freesqldatabase.com',
      port: 3306,
      user: 'sql11706392',
      password: 'S68HviUySF',
    });
  }

  async setupTables() {
    await this.pool.query('DROP TABLE IF EXISTS Assignments');
    await this.pool.query('DROP TABLE IF EXISTS Subjects');
    await this.pool.query('DROP TABLE IF EXISTS Users');

    await this.pool.query(`CREATE TABLE IF NOT EXISTS Users (
      UserID INT PRIMARY KEY AUTO_INCREMENT,
      UserName VARCHAR(64)
    );`);

    await this.pool.query(`CREATE TABLE IF NOT EXISTS Subjects (
      SubjID VARCHAR(64),
      SubjName VARCHAR(256),
      SubjDesc VARCHAR(256),
      UserID INT,
      PRIMARY KEY (SubjID),
      FOREIGN KEY (UserID) REFERENCES Users(UserID)
    );`);

    await this.pool.query(`CREATE TABLE IF NOT EXISTS Assignments (
      AID INT PRIMARY KEY AUTO_INCREMENT,
      SubjID VARCHAR(64),
      ADesc VARCHAR(256),
      DueDate DATE,
      FileName VARCHAR(256),
      FOREIGN KEY (SubjID) REFERENCES Subjects(SubjID)
    )`);

    await this.pool.query(`INSERT INTO Users(UserName)
      VALUES ("Tanar1"), ("Tanar2"), ("Diak1"), ("Diak2"), ("Teljes Nev"), ("ltim2261")`);

    console.log('Tables created successfully!');
  }

  getAllSubjects() {
    const query = 'SELECT * FROM Subjects';
    return this.pool.query(query);
  }

  insertSubject(subject) {
    const query = 'INSERT INTO Subjects VALUES (?, ?, ?, ?)';
    return this.pool.query(query, [subject.subjID, subject.subjName, subject.subjDesc, subject.userID]);
  }

  getAllUsers() {
    const query = 'SELECT * FROM Users';
    return this.pool.query(query);
  }

  getUserByName(name) {
    const query = `SELECT UserID
      FROM Users
      WHERE UserName LIKE ?
      LIMIT 1`;
    return this.pool.query(query, name);
  }

  getUserNameByID(id) {
    const query = `SELECT UserName
    FROM Users
    WHERE UserID = ?`;
    return this.pool.query(query, id);
  }

  async deleteSubject(id) {
    await this.pool.query(
      `DELETE FROM Assignments
      WHERE SubjID = ?`,
      id,
    );

    await this.pool.query(
      `DELETE FROM Subjects
      WHERE SubjID = ?`,
      id,
    );
  }

  getSubjectAssignments(id) {
    const query = `SELECT *
    FROM Assignments
    WHERE SubjID = ?`;
    return this.pool.query(query, id);
  }

  insertAssignment(assignment) {
    const query = `INSERT INTO Assignments(SubjID, ADesc, DueDate, FileName)
    VALUES (?, ?, ?, ?)`;
    return this.pool.query(query, [assignment.subjID, assignment.hwDesc, assignment.dueDate, assignment.fileName]);
  }

  getSubjectDescription(subjID) {
    const query = `SELECT SubjDesc
    FROM Subjects
    WHERE SubjID = ?`;
    return this.pool.query(query, subjID);
  }

  getAssignmentFile(id) {
    const query = `SELECT FileName
    FROM Assignments
    WHERE AID = ?`;
    return this.pool.query(query, id);
  }

  deleteAssignment(id) {
    const query = `DELETE FROM Assignments
    WHERE AID = ?`;
    return this.pool.query(query, id);
  }
}

const db = new SubjectHandler();
try {
  await db.setupTables();
} catch (err) {
  console.error(`Table Setup Error: ${err.message}`);
  process.exit(1);
}
export default db;
