
// get the client
const mysql = require('mysql2');
const cTable = require('console.table');
const inquirer = require('inquirer');

// create the connection to database
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'employees_db'
},
console.log(`Connected to the employees_db database.`)
);


const promptUser = () => {
  return inquirer.prompt([
    {
      type: "list",
      name: "commands",
      choices: ["view all departments", "view all roles", "view all employees", "add a department", "add a role", "add an employee", "update an employee role", "Finished"],
      message: "What would you like to do?",
    }
  ]);
};

 promptUser()
 .then((answers) =>{

  let Command = answers.commands;
    switch (Command) {
      case "View all departments":
        db.query(
          'SELECT * FROM `department`',
          function(err, results, fields) {
            console.log(results); // results contains rows returned by server
            console.log(fields); // fields contains extra meta data about results, if available
          }
        );
        break;
        case "View all roles":
        db.query(
          'SELECT * FROM `roles`',
          function(err, results, fields) {
            console.log(results); // results contains rows returned by server
            console.log(fields); // fields contains extra meta data about results, if available
          }
        );
        break;
        case "View all employees":
        db.query(
          'SELECT * FROM `employee`',
          function(err, results, fields) {
            console.log(results); // results contains rows returned by server
            console.log(fields); // fields contains extra meta data about results, if available
          }
        );
        break;
      case "Finished":
        // End the program (by breaking out of the while loop
        break;
    }
  }
 
 );
  
init()
    