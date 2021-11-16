// get the client
const mysql = require("mysql2");
const cTable = require("console.table");
const inquirer = require("inquirer");
const { registerPrompt } = require("inquirer");

// create the connection to database
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Fender49!@#",
  database: "employees_db",
});

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
        "delete department",
        "delete role",
        "delete employee",
        "Update an employee's manager",
        "view employees by department",
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
      );
    });
};

const promptnewrole = (departments) => {
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
        name: "department",
        message: "Which department is this role for?",
        type: "list",
        choices: departments.map((department) => {
          return {
            name: department.department_name,
            value: department.department_id,
          };
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
      );
      db.query(
        "SELECT department.*, roles.role_id, roles.title, roles.salary, department.department_name FROM `roles` JOIN `department` ON roles.department=department.department_id",
        function (err, results, fields) {
          console.table("\r", results); // results contains rows returned by server
        }
      );
    });
};

const getAllManagers = () => {
  return db
    .promise()
    .query(
      "SELECT CONCAT(first_name,' ', last_name) as FullName, employee_id from `employee` WHERE manager_id is NULL"
    );
};

const getAllEmployees = () => {
  return db
    .promise()
    .query(
      "SELECT CONCAT(first_name,' ', last_name) as FullName, employee_id from `employee`"
    );
};

const getAllRoles = () => {
  return db.promise().query("SELECT * FROM roles");
};

const getAllDepartments = () => {
  return db.promise().query("SELECT * FROM department");
};

const getAllChoices = async () => {
  const [managers] = await getAllManagers();
  const [roles] = await getAllRoles();
  const [departments] = await getAllDepartments();
  const [employees] = await getAllEmployees();
  managers.push("FullName: 'Noone', employee_id: NULL");

  return { managers, roles, departments, employees };
};

const viewEmployeebyDept = async () => {
  const { employees, departments } = await getAllChoices();
  inquirer
    .prompt([
      {
        name: "department",
        message: "For which department would you like to see all employees?",
        type: "list",
        choices: departments.map((department) => {
          return {
            name: department.department_name,
            value: department.department_id,
          };
        }),
      },
    ])
    .then(function (answer) {
      let departmentselect = answer.department;
      db.query(
        `SELECT CONCAT(first_name,' ', last_name) as FullName, roles.title, roles.salary, employee_id from employee JOIN roles ON employee.roles_id = roles.role_id WHERE roles.department = ${departmentselect}`,
        function (err, results, fields) {
          console.table("\r", results); // results contains rows returned by server
          if (err) throw err;
          init();
        }
      );
    });
};

const deletedepartment = async () => {
  const { departments } = await getAllChoices();

  inquirer
    .prompt([
      {
        name: "department",
        message: "Which department would you like to delete?",
        type: "list",
        choices: departments.map((department) => {
          return {
            name: department.department_name,
            value: department.department_id,
          };
        }),
      },
    ])
    .then(function (answer) {
      let departmentselect = answer.department;
      db.query(
        `DELETE FROM department WHERE department_id = ${departmentselect}`,
        function (err) {
          if (err) throw err;
          init();
        }
      );
    });
};

const deleterole = async () => {
  const { roles } = await getAllChoices();

  inquirer
    .prompt([
      {
        name: "role",
        message: "Which role would you like to delete?",
        type: "list",
        choices: roles.map((role) => {
          return {
            name: role.title,
            value: role.role_id,
          };
        }),
      },
    ])
    .then(function (answer) {
      let roleselect = answer.role;
      db.query(
        `DELETE FROM roles WHERE role_id = ${roleselect}`,
        function (err) {
          if (err) throw err;
          init();
        }
      );
    });
};

const deleteEmployee = async () => {
  const { employees } = await getAllChoices();

  inquirer
    .prompt([
      {
        name: "employee",
        message: "Which employee would you like to delete?",
        type: "list",
        choices: employees.map((employee) => {
          return {
            name: employee.FullName,
            value: employee.employee_id,
          };
        }),
      },
    ])
    .then(function (answer) {
      let employeeselect = answer.employee;
      db.query(
        `DELETE FROM employee WHERE employee_id = ${employeeselect}`,
        function (err) {
          if (err) throw err;
          init();
        }
      );
    });
};

const promptnewemployee = async () => {
  const { roles, managers } = await getAllChoices();

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
        }
      );
      init();
    });
};
const updateEmployee = async () => {
  const { employees, roles } = await getAllChoices();

  inquirer
    .prompt([
      {
        name: "employee",
        message: "Which employee would you like to update?",
        type: "list",
        choices: employees.map((employees) => {
          return { name: employees.FullName, value: employees.employee_id };
        }),
      },
      {
        name: "new_role",
        message: "What is the employee's new role?",
        type: "list",
        choices: roles.map((role) => {
          return { name: role.title, value: role.role_id };
        }),
      },
    ])
    .then(function (answer) {
      let role = answer.new_role;
      let employee = answer.employee;
      db.query(
        `UPDATE employee SET roles_id = ${role} WHERE employee_id = ${employee}`,
        function (err) {
          if (err) throw err;
          init();
        }
      );
    });
};

const updateEmployeeManager = async () => {
  const { employees, roles } = await getAllChoices();

  inquirer
    .prompt([
      {
        name: "employee",
        message: "Which employee would you like to update?",
        type: "list",
        choices: employees.map((employees) => {
          return { name: employees.FullName, value: employees.employee_id };
        }),
      },
      {
        name: "new_manager",
        message: "Who is this employee's new manager?",
        type: "list",
        choices: employees.map((employees) => {
          return { name: employees.FullName, value: employees.employee_id };
        }),
      },
    ])
    .then(function (answer) {
      let manager = answer.new_manager;
      let employee = answer.employee;
      db.query(
        `UPDATE employee SET manager_id = ${manager} WHERE employee_id = ${employee}`,
        function (err) {
          if (err) throw err;
          init();
        }
      );
    });
};

async function init() {
  await promptUser().then((answers) => {
    let Command = answers.commands;
    switch (Command) {
      case "view all departments":
        db.query("SELECT * FROM `department`", function (err, results, fields) {
          console.table("\r", results); // results contains rows returned by server
        });
        init();
        break;
      case "view all roles":
        db.query(
          "SELECT department.*, roles.title, roles.role_id, roles.salary, department.department_name FROM `roles` JOIN `department` ON roles.department=department.department_id",
          function (err, results, fields) {
            console.table("\r", results); // results contains rows returned by server
          }
        );
        init();
        break;
      case "view all employees":
        db.query(
          "SELECT employee.*, roles.title, department.department_name FROM `employee` JOIN `roles` ON employee.roles_id=roles.role_id JOIN `department` ON roles.department=department.department_id",
          function (err, results, fields) {
            console.table("\r", results); // results contains rows returned by server
          }
        );
        init();
        break;
      case "add a department":
        promptnewdept();
        break;
      case "add a role":
        db.query("SELECT * FROM `department`", function (err, results, fields) {
          promptnewrole(results);
        });
        break;
      case "add an employee":
        promptnewemployee();
        // promptnewemployee(results);

        break;
      case "update an employee role":
        updateEmployee();
        break;
      case "delete department":
        deletedepartment().then(console.log("Department successfully deleted"));
        break;
      case "delete role":
        deleterole().then(console.log("role successfully deleted"));
        break;
      case "delete employee":
        deleteEmployee().then(console.log("employee successfully deleted"));
        break;
      case "Update an employee's manager":
        updateEmployeeManager();
        break;
      case "view employees by department":
        viewEmployeebyDept();
        break;
      case "Finished":
        console.log("Employee database up to date.");
        break;
    }
  });
}
init();
