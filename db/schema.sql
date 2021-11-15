DROP DATABASE IF EXISTS employees_db;
CREATE DATABASE employees_db;

USE employees_db;

DROP TABLE IF EXISTS department;
CREATE TABLE department (
  department_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  department_name VARCHAR(30) NOT NULL
);
DROP TABLE IF EXISTS roles;
CREATE TABLE roles (
    role_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL(8,2) NOT NULL,
    department INT, FOREIGN KEY (department)
    REFERENCES department(department_id)
    ON DELETE SET NULL
);
DROP TABLE IF EXISTS employee;
CREATE TABLE employee (
   employee_id INT NOT NULL  AUTO_INCREMENT PRIMARY KEY,
   first_name VARCHAR(30) NOT NULL,
   last_name VARCHAR(30) NOT NULL,
   roles_id INT,
   manager_id INT, FOREIGN KEY (roles_id)
   REFERENCES roles(role_id)
    ON DELETE SET NULL,
  FOREIGN KEY (manager_id)
  REFERENCES employee(employee_id)
   ON DELETE SET NULL
);
