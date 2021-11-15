INSERT INTO department (department_name)
VALUES ("Technology"),
       ("Sales"),
       ("Marketing"),
       ("Finance"),
       ("HR");

INSERT INTO roles (title, salary, department)
VALUES ("Head of department", 200000, 1),
       ("Head of Marketing", 200000, 3),
       ("Junior Marketer", 5000, 3),
       ("Senior Sales", 70000, 2),
       ("Team Lead", 100000, 5),
       ("Intern", 10000, 1);

INSERT INTO employee (first_name, last_name, roles, manager_id)
VALUES ("Adrian", "Szonyi", 1, NULL),
       ("Francis", "Cucumber", 6, 1),
       ("Sarah", "Salad", 2, NULL),
       ("Geoff", "Green", 3, 3),
       ("Arthur", "Ash", 3, NULL);
       
