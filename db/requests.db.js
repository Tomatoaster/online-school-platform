import mysql from 'mysql2/promise.js';

/*
Host: sql11.freesqldatabase.com
Database name: sql11706392
Database user: sql11706392
Database password: S68HviUySF
Port number: 3306
*/

export class RequestRepo {
  constructor() {
    this.pool = mysql.createPool({
      connectionLimit: 10,
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

    await this.pool.query(`CREATE TABLE IF NOT EXISTS Requests (
      ReqID INT PRIMARY KEY AUTO_INCREMENT,
      Method VARCHAR(32),
      URL VARCHAR(256),
      Date DATE
    )`);

    console.log('Tables created successfully!');
  }

  findAllRequests() {
    const query = 'SELECT * FROM Requests';
    return this.pool.query(query);
  }

  insertRequest(req) {
    const date = new Date();
    const query = 'INSERT INTO Requests VALUES (?, ?, ?)';
    return this.pool.query(query, [req.method, req.url, date]);
  }

  async deleteAllRequests() {
    const query = 'DELETE FROM Requests';
    const [result] = await this.pool.query(query);
    return result.affectedRows > 0;
  }
}

const db = new RequestRepo();
try {
  await db.setupTables();
} catch (err) {
  console.error(`Table Setup Error: ${err.message}`);
  process.exit(1);
}
export default db;
