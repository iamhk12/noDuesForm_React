const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const cors = require("cors");

const { Student, Request } = require('./schema');

router.use(cors());
router.post('/student/login', async (req, res) => {
  try {
    const { rollNumber, password } = req.body;

    // Check if user exists
    const student = await Student.findOne({ rollNumber });

    if (!student) {
      // Roll number does not exist, create a new student record with the default password and empty fields
      const newStudent = new Student({
        rollNumber,
        password: 'dypatil@123',
        fullName: '',
        classValue: '',
        passedOutYear: '',
        postalAddress: '',
        email: '',
        semester: '',
        phone: '',
        date: null,
        feeReceiptNumber: '',
        amount: '',
        areYouPlaced: false,
        offerLetter: '',
        letterOfJoining: '',
        isFilled: false,
        isCompleted: false
      });

      await newStudent.save();
      res.json({ authenticated: true, created: true }); // Authentication successful and a new student record is created
    } else {
      // Roll number exists, check the password
      if (student.password === password) {
        res.json({ authenticated: true, created: false }); // Authentication successful
      } else {
        res.json({ authenticated: false }); // Authentication failed
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
router.post('/getStudent', async (req, res) => {
  const { rollNumber } = req.body;
  const student = await Student.findOne({ rollNumber });
  if (!student) res.status(401).json({ message: "Student not found" })
  else res.status(200).json(student);

})

router.post('/submitform', async (req, res) => {
  try {
    const {
      rollNumber,
      fullName,
      classValue,
      passedOutYear,
      postalAddress,
      email,
      semester,
      phone,
      date,
      feeReceiptNumber,
      amount,
      areYouPlaced,
      offerLetter,
      letterOfJoining
    } = req.body;

    const student = await Student.findOne({ rollNumber });

    if (!student) {
      res.status(404).json({ message: 'Student not found' });
      return;
    }

    student.fullName = fullName;
    student.classValue = classValue;
    student.passedOutYear = passedOutYear;
    student.postalAddress = postalAddress;
    student.email = email;
    student.semester = semester;
    student.phone = phone;
    student.date = date;
    student.feeReceiptNumber = feeReceiptNumber;
    student.amount = amount;
    student.areYouPlaced = areYouPlaced;
    student.offerLetter = offerLetter;
    student.letterOfJoining = letterOfJoining;
    student.isFilled = true;

    await student.save();

    const rq = await Request.findOne({ rollNumber })

    if (!rq) {
      const newReq = new Request({
        rollNumber,
        fullName,
        classValue,
        semester,
        labs: false,
        store: false,
        tpc: false,
        library: false
      });

      await newReq.save();
    }


    res.status(200).json({ message: 'Form submitted successfully' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/getStudentRequest', async (req, res) => {
  const { rollNumber } = req.body;

  try {
    const request = await Request.findOne({ rollNumber });

    if (request) {
      res.status(200).json({ success: true, request });
    } else {
      res.status(404).json({ success: false, message: 'Request not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'An error occurred while retrieving the request' });
  }
});

module.exports = router;
