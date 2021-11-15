// get the client
const mysql = require("mysql2");
const cTable = require("console.table");
const inquirer = require("inquirer");

// create the connection to database
const db = mysql.createConnection(
  {
    host: "localhost",
    user: "root",
    password: "Fender49!@#",
    database: "employees_db",
  },
  console.log(`Connected to the employees_db database.`)
);

const promptUser = () => {
  return inquirer.prompt([
    {
      type: "list",
      name: "commands",
      choices: [
        "view all departments",
        "view all roles",
        "view all employees",
        "add a department",
        "add a role",
        "add an employee",
        "update an employee role",
        "Finished",
      ],
      message: "What would you like to do?",
    },
  ]);
};
const promptnewdept = () => {
  return inquirer
    .prompt([
      {
        type: "input",
        name: "newdepartment",
        message: "What's the name of the new department?",
      },
    ])
    .then(function (answer) {
      var newDept = answer.newdepartment;
      db.query(
        "INSERT INTO department (department_name) VALUES (?)",
        [newDept],
        function (err) {
          if (err) throw err;
          promptUser();
        }
      )
        .then(
          db.query(
            "SELECT * FROM `department`",
            function (err, results, fields) {
              console.table("\r", results); // results contains rows returned by server
            }
          )
        )
        .then(init());
    });
};

const promptnewrole = () => {
  db.query("SELECT * FROM `department`", function (err, results, fields) {
    console.table("\r", results); // results contains rows returned by server
    console.log(
      "before adding a new role, note down the department_id number for the department the role belongs to"
    );
  }).then(
    inquirer
      .prompt([
        {
          type: "input",
          name: "title",
          message: "What's the title of the new role?",
        },
        {
          type: "input",
          name: "salary",
          message: "What is the salary for the new role?",
        },
        {
          type: "input",
          name: "department",
          message: "What is the department_id for the new role?",
        },
      ])
      .then(function (answer) {
        let title = answer.title;
        let salary = answer.salary;
        let department = answer.department;
        db.query(
          "INSERT INTO roles (title, salary, department) VALUES (?, ?, ?)",
          [title, salary, department],
          function (err) {
            if (err) throw err;
            promptUser();
          }
        )
          .then(
            db.query("SELECT department.*, roles.role_id, roles.title, roles.salary, department.department_name FROM `roles` JOIN `department` ON roles.department=department.department_id", function (err, results, fields) {
              console.table("\r", results); // results contains rows returned by server
            })
          )
          .then(init());
      })
  );
};

const promptnewemployee = () => {
  db.query("SELECT * FROM `department`", function (err, results, fields) {
    console.table("\r", results); // results contains rows returned by server
    console.log(
      "before adding a new role, note down the department_id number for the department the role belongs to"
    );
  }).then(
    inquirer
      .prompt([
        {
          type: "input",
          name: "first_name",
          message: "What's the new employee's first name?",
        },
        {
          type: "input",
          name: "last_name",
          message: "What is the new employee's last name?",
        },
        {
          type: "input",
          name: "department",
          message: "What department do they work for?",
        },
        {
          type: "input",
          name: "role",
          message: "What is their title?",
        },
        {
          type: "input",
          name: "manager",
          message: "What is their manager's employee id number?",
        },
      ])
  )
      .then(function (answer) {
        let role = answer.role;
        let first_name = answer.first_name;
        let last_name = answer.last_name;
        let department = answer.department;
        let manager_id = answer.manager_id;
        db.query(
          "INSERT INTO employee (first_name, last_name, role, department, manager_id) VALUES (?, ?, ?, ?, ?)",
          [first_name, last_name, role, department, manager_id],
          function (err) {
            if (err) throw err;
            promptUser();
          })
        })
          .then(
            db.query(
              "SELECT employee.*, roles.title, department.department_name FROM `employee` JOIN `roles` ON employee.roles=roles.role_id JOIN `department` ON roles.department=department.department_id",
              function (err, results, fields) {
                console.table("\r", results); // results contains rows returned by server
              }
            )
            )
          .then(init())
        
      };

(async function init() {
  await promptUser().then((answers) => {
    let Command = answers.commands;
    switch (Command) {
      case "view all departments":
        db.query("SELECT * FROM `department`", function (err, results, fields) {
          console.table("\r", results); // results contains rows returned by server
        }).then(init());
        break;
      case "view all roles":
        db.query(
          "SELECT department.*, roles.title, roles.role_id, roles.salary, department.department_name FROM `roles` JOIN `department` ON roles.department=department.department_id",
          function (err, results, fields) {
            console.table("\r", results); // results contains rows returned by server
          }
        ).then(init());
        break;
      case "view all employees":
        db.query(
          "SELECT employee.*, roles.title, department.department_name FROM `employee` JOIN `roles` ON employee.roles=roles.role_id JOIN `department` ON roles.department=department.department_id",
          function (err, results, fields) {
            console.table("\r", results); // results contains rows returned by server
          }
        ).then(init());
        break;
      case "add a department":
        promptnewdept();
        break;
      case "add a role":
        promptnewrole();
        break;
      case "add an employee":
        promptnewemployee();
        break;
      case "update an employee role":
        db.query(
          "SELECT employee.*, roles.title, department.department_name FROM `employee` JOIN `roles` ON employee.roles=roles.role_id JOIN `department` ON roles.department=department.department_id",
          function (err, results, fields) {
            console.table("\r", results); // results contains rows returned by server
          }
        );
        break;
      case "Finished":
        // End the program (by breaking out of the while loop
        break;
    }
  });
  // await init();
})();
