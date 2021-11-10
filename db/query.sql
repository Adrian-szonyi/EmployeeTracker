SELECT *
FROM employee
JOIN employee ON employee_id = manager.id;