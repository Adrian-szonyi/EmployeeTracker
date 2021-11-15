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
          init();
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

const promptnewrole = (departments) => {

    (inquirer
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
          name: "department",
          message: "Which department is this role for?",
          type: "list",
          choices: departments.map((department) => {
            return { name: department.department_name, value: department.department_id };
          }),
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
            init();
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

const getAllManagers = () => {
  // db.query("SELECT * FROM `employee` WHERE manager_id is NULL", function (err, results, fields) {
  // console.table("\r", results)
  // }
  db.query("SELECT first_name +' ' + last_name as FullName from `employee` WHERE manager_id is NULL", function (err, results, fields) {
  let manager = results;
  console.log(manager)
  }
  )
}

const getAllRoles = () => {
  db.query("SELECT title FROM roles", function (err, results, fields) {
  let roles = results
  console.log(roles)
})
}

const promptnewemployee = (department1, roles, manager) => {

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
          name: "department",
          message: "Which department is this role for?",
          type: "list",
          choices: department1.map((department) => {
            return { name: department.department_name, value: department.department_id };
          }),
        },
        {
          name: "role",
          message: "What role will they have?",
          type: "list",
          choices: roles.map((roles) => {
            return { name: roles.title, value: roles.salary };
          }),
        },
        {
          name: "manager",
          message: "Who will be their manager?",
          type: "list",
          choices: manager.map((manager) => {
            return { name: employee.first_name, value: employee.last_name, value: employee.role };
          }),
        },
      ])
  
      .then(function (answer) {
        let role = answer.role;
        let first_name = answer.first_name;
        let last_name = answer.last_name;
        let department3 = answer.department;
        let manager_id = answer.manager;
        db.query(
          "INSERT INTO employee (first_name, last_name, role, department, manager_id) VALUES (?, ?, ?, ?, ?)",
          [first_name, last_name, role, department3, manager_id],
          function (err) {
            if (err) throw err;
            init();
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
        
      };

async function init() {
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
          "SELECT employee.*, roles.title, department.department_name FROM `employee` JOIN `roles` ON employee.roles_id=roles.role_id JOIN `department` ON roles.department=department.department_id",
          function (err, results, fields) {
            console.table("\r", results); // results contains rows returned by server
          }
        ).then(init());
        break;
      case "add a department":
        promptnewdept();
        break;
      case "add a role":
        db.query("SELECT * FROM `department`", function (err, results, fields) {
          promptnewrole(results);
        })
        break;
      case "add an employee":
        getAllManagers() 
        getAllRoles()
          // promptnewemployee(results);

        break;
      case "update an employee role":
        db.query(
          "SELECT employee.*, roles.title, department.department_name FROM `employee` JOIN `roles` ON employee.role_id=roles.role_id JOIN `department` ON roles.department=department.department_id",
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
};
init();
