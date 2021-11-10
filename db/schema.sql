DROP DATABASE IF EXISTS employees_db;
CREATE DATABASE employees_db;

USE employees_db;

CREATE TABLE department (
  department_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  department_name VARCHAR(30) NOT NULL
);

CREATE TABLE roles (
    role_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL NOT NULL,
    department INT, FOREIGN KEY (department)
    REFERENCES department(department_id)
    ON DELETE SET NULL
);

CREATE TABLE employee (
   employee_id INT NOT NULL  AUTO_INCREMENT PRIMARY KEY,
   first_name VARCHAR(30) NOT NULL,
   last_name VARCHAR(30) NOT NULL,
   roles INT, FOREIGN KEY (roles)
   REFERENCES roles(role_id)
    ON DELETE SET NULL,
   manager_id INT NULL
);
