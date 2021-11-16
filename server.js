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
  return db.promise().query("SELECT CONCAT(first_name,' ', last_name) as FullName, employee_id from `employee` WHERE manager_id is NULL")
  }
  
const getAllEmployees = () => {
  return db.promise().query("SELECT CONCAT(first_name,' ', last_name) as FullName, employee_id from `employee`")
}

const getAllRoles = () => {
  return db.promise().query("SELECT * FROM roles")
}

const getAllDepartments = () => {
 return db.promise().query("SELECT * FROM department")
}

const getAllChoices = async () => {
  const [managers] = await getAllManagers();
  const [roles] = await getAllRoles();
  const [departments] = await getAllDepartments();
  const [employees] = await getAllEmployees();

  return {managers, roles, departments, employees}
}

const promptnewemployee = async() => {
 const {roles, managers} = await getAllChoices();

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
        name: "role",
        message: "What role will they have?",
        type: "list",
        choices: roles.map((role) => {
          return { name: role.title, value: role.role_id };
        }),
      },
      {
        name: "manager",
        message: "Who will be their manager?",
        type: "list",
        choices: managers.map((manager) => {
          return { name: manager.FullName, value: manager.employee_id };
        }),
      },
    ])

    .then(function (answer) {
      let role = answer.role;
      let first_name = answer.first_name;
      let last_name = answer.last_name;
      let manager_id = answer.manager;
      db.query(
        "INSERT INTO employee (first_name, last_name, roles_id, manager_id) VALUES (?, ?, ?, ?)",
        [first_name, last_name, role, manager_id],
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
          }

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
        promptnewemployee();
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
