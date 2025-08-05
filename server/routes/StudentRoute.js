
const express = require("express");
const router = express.Router();
const studentModel = require("../models/Student");
const authenticateToken = require("../middleware/authMiddleware");

router.post("/create", authenticateToken, async (req, res) => {
  try {
    const school_id = req.user.id;
    const result = await studentModel.createStudent(req.body, school_id);
    res.status(201).json({ 
      success: true, 
      message: "Student added successfully", 
      data: result 
    });
  } catch (err) {
    console.error("Error creating student:", err);
    if (err.message.includes("Duplicate student_id")) {
      return res.status(409).json({ 
        success: false, 
        message: "Student ID already in use",
        error: err.message 
      });
    }
    if (err.message.includes("Missing required fields")) {
      return res.status(400).json({ 
        success: false, 
        message: "Missing required fields",
        error: err.message 
      });
    }
    if (err.message.includes("Invalid email format")) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid email format",
        error: err.message 
      });
    }
    if (err.message.includes("Invalid date format")) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid date format for DOB",
        error: err.message 
      });
    }
    res.status(500).json({ 
      success: false, 
      message: "Failed to create student",
      error: err.message 
    });
  }
});

router.get("/getallstudents", authenticateToken, async (req, res) => {
  try {
    const school_id = req.user.id;
    const students = await studentModel.getAllStudents(school_id);
    res.json({ 
      success: true, 
      message: "Students retrieved successfully", 
      data: students 
    });
  } catch (err) {
    console.error("Error fetching students:", err);
    res.status(500).json({ 
      success: false, 
      message: "Failed to retrieve students",
      error: err.message 
    });
  }
});

router.get("/getstudent/:id", authenticateToken, async (req, res) => {
  try {
    const school_id = req.user.id;
    const student = await studentModel.getStudentById(req.params.id, school_id);
    res.json({ 
      success: true, 
      message: "Student retrieved successfully", 
      data: student 
    });
  } catch (err) {
    console.error("Error fetching student:", err);
    if (err.message === "Student not found") {
      return res.status(404).json({ 
        success: false, 
        message: `No student with ID ${req.params.id} found for this school`,
        error: err.message 
      });
    }
    res.status(500).json({ 
      success: false, 
      message: "Failed to retrieve student",
      error: err.message 
    });
  }
});

router.put("/updatestudent/:id", authenticateToken, async (req, res) => {
  try {
    const id = req.params.id;
    const school_id = req.user.id;
    const data = req.body;

    const result = await studentModel.updateStudent(id, school_id, data);
    res.json({ 
      success: true, 
      message: "Student updated successfully", 
      data: result 
    });
  } catch (err) {
    console.error("Error updating student:", err);
    if (err.message === "Student not found") {
      return res.status(404).json({ 
        success: false, 
        message: `No student with ID ${req.params.id} found for this school`,
        error: err.message 
      });
    }
    if (err.message === "No fields to update") {
      return res.status(400).json({ 
        success: false, 
        message: "No valid fields provided for update",
        error: err.message 
      });
    }
    if (err.message.includes("Invalid email format")) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid email format",
        error: err.message 
      });
    }
    if (err.message.includes("Invalid date format")) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid date format for DOB",
        error: err.message 
      });
    }
    res.status(500).json({ 
      success: false, 
      message: "Failed to update student",
      error: err.message 
    });
  }
});

router.delete("/deletestudent/:id", authenticateToken, async (req, res) => {
  try {
    const school_id = req.user.id;
    const result = await studentModel.deleteStudent(req.params.id, school_id);
    res.json({ 
      success: true, 
      message: "Student deleted successfully", 
      data: result 
    });
  } catch (err) {
    console.error("Error deleting student:", err);
    if (err.message === "Student not found") {
      return res.status(404).json({ 
        success: false, 
        message: `No student with ID ${req.params.id} found for this school`,
        error: err.message 
      });
    }
    if (err.message.includes("Cannot delete student")) {
      return res.status(400).json({ 
        success: false, 
        message: "Cannot delete student due to associated records (e.g., fees)",
        error: err.message 
      });
    }
    res.status(500).json({ 
      success: false, 
      message: "Failed to delete student",
      error: err.message 
    });
  }
});

module.exports = router;
