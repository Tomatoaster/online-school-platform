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
    await this.pool.query('DROP TABLE IF EXISTS Enrollments');
    await this.pool.query('DROP TABLE IF EXISTS Invitations');
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

    await this.pool.query(`CREATE TABLE IF NOT EXISTS Invitations (
        SubjID VARCHAR(64),
        UserName VARCHAR(64),
        FOREIGN KEY (SubjID) REFERENCES Subjects(SubjID),
        FOREIGN KEY (UserName) REFERENCES Users(UserName),
        PRIMARY KEY (SubjID, UserName)
      )`);

    await this.pool.query(`CREATE TABLE IF NOT EXISTS Enrollments (
        SubjID VARCHAR(64),
        UserName VARCHAR(64),
        FOREIGN KEY (SubjID) REFERENCES Subjects(SubjID),
        FOREIGN KEY (UserName) REFERENCES Users(UserName),
        PRIMARY KEY (SubjID, UserName)
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

  insertUser(username, role, password) {
    const query = `INSERT INTO Users(UserName, Role, Password)
      VALUES (?, ?, ?)`;
    return this.pool.query(query, [username, role, password]);
  }

  getAllSubjects() {
    const query = 'SELECT * FROM Subjects';
    return this.pool.query(query);
  }

  async insertSubject(subject) {
    const query = 'INSERT INTO Subjects VALUES (?, ?, ?, ?)';
    await this.pool.query(query, [subject.subjID, subject.subjName, subject.subjDesc, subject.userID]);

    const query2 = 'INSERT INTO Enrollments(SubjID, UserName) VALUES (?, ?)';
    return this.pool.query(query2, [subject.subjID, subject.userID]);
  }

  async getUserSubjects(name) {
    const query = `SELECT SubjID FROM Enrollments
    WHERE UserName = ?`;
    const [rows] = await this.pool.query(query, name);
    const ids = rows.map((row) => row.SubjID);

    if (ids.length === 0) {
      return [];
    }

    const placeholders = ids.map(() => '?').join(',');
    const query2 = `SELECT * FROM Subjects
    WHERE SubjID IN (${placeholders})`;
    return this.pool.query(query2, ids);
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
    const query = `SELECT AID, SubjID, ADesc, DATE_FORMAT(DueDate, '%Y-%m-%d') AS DueDate, FileName
    FROM Assignments
    WHERE SubjID = ?`;
    return this.pool.query(query, id);
  }

  insertAssignment(assignment) {
    const query = `INSERT INTO Assignments(SubjID, ADesc, DueDate, FileName)
    VALUES (?, ?, ?, ?)`;
    return this.pool.query(query, [assignment.SubjID, assignment.ADesc, assignment.DueDate, assignment.FileName]);
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

  getEnrollment(subjID, username) {
    const query = `SELECT * FROM Enrollments
    WHERE SubjID = ? AND UserName = ?`;
    return this.pool.query(query, [subjID, username]);
  }

  getInvitation(subjID, username) {
    const query = `SELECT * FROM Invitations
    WHERE SubjID = ? AND UserName = ?`;
    return this.pool.query(query, [subjID, username]);
  }

  getUserInvitations(username) {
    const query = `SELECT * FROM Invitations
    WHERE UserName = ?`;
    return this.pool.query(query, username);
  }

  insertInvitation(subjID, username) {
    const query = `INSERT INTO Invitations(SubjID, UserName)
    VALUES (? ,?)`;
    return this.pool.query(query, [subjID, username]);
  }

  insertEnrollment(subjID, username) {
    const query = `INSERT INTO Enrollments(SubjID, UserName)
    VALUES (? ,?)`;
    return this.pool.query(query, [subjID, username]);
  }

  deleteInvitation(subjID, username) {
    const query = `DELETE FROM Invitations
    WHERE SubjID = ? AND UserName = ?`;
    return this.pool.query(query, [subjID, username]);
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
