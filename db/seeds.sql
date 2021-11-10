INSERT INTO department (department_name)
VALUES ("Technology"),
       ("Sales"),
       ("Marketing"),
       ("Finance"),
       ("HR");

INSERT INTO roles (title, salary, department)
VALUES ("Head of department", 200000, 1),
       ("Junior Marketer", 5000, 3),
       ("Senior Sales", 70000, 2),
       ("Team Lead", 100000, 5),
       ("Intern", 10000, 1);

INSERT INTO employee (first_name, last_name, roles, manager_id)
VALUES ("Adrian", "Szonyi", 1, 1),
       ("Francis", "Cucumber", 1, 1),
       ("Sarah", "Salad", 2, NULL),
       ("Geoff", "Green", 4, NULL),
       ("Arthur", "Ash", 3, NULL);
       
