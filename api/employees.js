import express from "express";
const router = express.Router();

// TODO: this file!
import {
  createEmployee,
  deleteEmployee,
  getEmployee,
  getEmployees,
  updateEmployee,
} from "#db/queries/employees";

// GET /employees
router.get("/", async (req, res) => {
  try {
    const employees = await getEmployees();
    res.send(employees);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

// POST /employees
router.post("/", async (req, res) => {
  try {
    if (!req.body) return res.status(400).send("Request body required.");

    const { name, birthday, salary } = req.body;
    if (!name || !birthday || !salary) {
      return res
        .status(400)
        .send("Missing required fields: name, birthday, salary");
    }

    const employee = await createEmployee({ name, birthday, salary });
    res.status(201).send(employee);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

// Param middleware for employee ID validation
router.param("id", async (req, res, next, id) => {
  try {
    if (!/^\d+$/.test(id))
      return res.status(400).send("ID must be a positive integer.");

    const employee = await getEmployee(id);
    if (!employee) return res.status(404).send("Employee not found.");

    req.employee = employee;
    next();
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

// GET /employees/:id
router.get("/:id", (req, res) => {
  res.send(req.employee);
});

// DELETE /employees/:id
router.delete("/:id", async (req, res) => {
  try {
    await deleteEmployee(req.employee.id);
    res.sendStatus(204);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

// PUT /employees/:id
router.put("/:id", async (req, res) => {
  try {
    if (!req.body) return res.status(400).send("Request body required.");

    const { name, birthday, salary } = req.body;
    if (!name || !birthday || !salary) {
      return res
        .status(400)
        .send("Missing required fields: name, birthday, salary");
    }

    const employee = await updateEmployee({
      id: req.employee.id,
      name,
      birthday,
      salary,
    });
    res.send(employee);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

export default router;
