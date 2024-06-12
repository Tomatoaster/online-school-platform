import mysql from 'mysql2/promise.js';
import crypto from 'crypto';

function hashPassword(password) {
  const salt = crypto.randomBytes(16);
  const hash = crypto.createHash('sha512').update(password).update(salt).digest();
  const hashWithSalt = `${salt.toString('base64')}:${hash.toString('base64')}`;
  return hashWithSalt;
}

export class SubjectHandler {
  // Setup: createDb.sql
  constructor() {
    this.pool = mysql.createPool({
      connectionLimit: 20,
      database: 'WebProg_ltim2261',
      host: 'localhost',
      port: 3306,
      user: 'webprog2024',
      password: 'zxcvb',
    });
  }

  async setupTables() {
    await this.pool.query('DROP TABLE IF EXISTS Assignments');
    await this.pool.query('DROP TABLE IF EXISTS Subjects');
    await this.pool.query('DROP TABLE IF EXISTS Users');

    await this.pool.query(`CREATE TABLE IF NOT EXISTS Users (
      UserID INT PRIMARY KEY AUTO_INCREMENT,
      UserName VARCHAR(64) UNIQUE,
      Role VARCHAR(32) DEFAULT "student",
      Password VARCHAR(512)
    );`);

    await this.pool.query(`CREATE TABLE IF NOT EXISTS Subjects (
      SubjID VARCHAR(64),
      SubjName VARCHAR(256),
      SubjDesc VARCHAR(256),
      UserID VARCHAR(64),
      PRIMARY KEY (SubjID),
      FOREIGN KEY (UserID) REFERENCES Users(UserName)
    );`);

    await this.pool.query(`CREATE TABLE IF NOT EXISTS Assignments (
      AID INT PRIMARY KEY AUTO_INCREMENT,
      SubjID VARCHAR(64),
      ADesc VARCHAR(256),
      DueDate DATE,
      FileName VARCHAR(256),
      FOREIGN KEY (SubjID) REFERENCES Subjects(SubjID)
    )`);

    await this.pool.query(
      `INSERT INTO Users(UserName, Role, Password)
      VALUES
        ("Tanar1", "teacher", ?),
        ("Tanar2", "teacher", ?),
        ("Diak1", "student", ?),
        ("Diak2", "student", ?),
        ("Teljes Nev", "student", ?),
        ("ltim2261", "admin", ?)`,
      [
        hashPassword('tanar1jelszo'),
        hashPassword('tanar2jelszo'),
        hashPassword('diak1jelszo'),
        hashPassword('diak2jelszo'),
        hashPassword('teljesnevjelszo'),
        hashPassword('adminjelszo'),
      ],
    );

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

  getUserDetails(name) {
    const query = `SELECT UserName, Password, Role
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

  getSubjectOwner(id) {
    const query = `SELECT UserID
    FROM Subjects
    WHERE SubjID = ?`;
    return this.pool.query(query, id);
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

  getAssignmentSubject(id) {
    const query = `SELECT SubjID
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
// try {
//   await db.setupTables();
// } catch (err) {
//   console.error(`Table Setup Error: ${err.message}`);
//   process.exit(1);
// }
export default db;
