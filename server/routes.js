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
        department: '',
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
        offerLetter: {},
        internship: {},
        letterOfJoining: {},
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
      department,
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
      internship,
      letterOfJoining
    } = req.body;
    const student = await Student.findOne({ rollNumber });
    if (!student) {
      res.status(404).json({ message: 'Student not found' });
      return;
    }

    student.fullName = fullName;
    student.classValue = classValue;
    student.department = department;
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
    student.internship = internship;
    student.letterOfJoining = letterOfJoining;
    student.isFilled = true;

    await student.save();

    let rq = await Request.findOne({ rollNumber });

    if (rq) {
      rq.fullName = fullName;
      rq.classValue = classValue;
      rq.department = department;
      rq.semester = semester;
      rq.deplabs = false;
      rq.commonlabs = false;
      rq.accounts = false;
      rq.exam = false;
      rq.library = false;
      rq.deplib = false;
      rq.store = false;
      rq.tpc = false;

      await rq.save();
    } else {
      rq = new Request({
        rollNumber,
        fullName,
        classValue,
        department,
        semester,
        areYouPlaced,
        deplabs: false,
        commonlabs: false,
        accounts: false,
        exam: false,
        library: false,
        deplib: false,
        store: false,
        tpc: false
      });

      await rq.save();
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



router.post('/adminrequests', async (req, res) => {
  try {
    const { section } = req.body;
    let request = [];
    // Find requests with false in the given section
    if (section !== 'tpc') {
      request = await Request.find({ [section]: false });
    } else if (section === 'tpc') {
      request = await Request.find({ [section]: false });
      for (var i = 0; i < request.length; i++) {
        if (request[i].areYouPlaced === true) {
          const temp = await Student.findOne({ rollNumber: request[i].rollNumber });
          const newrequest = {
            rollNumber: request[i].rollNumber,
            fullName: request[i].fullName,
            department: request[i].department,
            classValue: request[i].classValue,
            semester: request[i].semester,
            areYouPlaced: request[i].areYouPlaced,
            deplabs: request[i].deplabs,
            commonlabs: request[i].commonlabs,
            accounts: request[i].accounts,
            exam: request[i].exam,
            library: request[i].library,
            deplib: request[i].deplib,
            store: request[i].store,
            tpc: request[i].tpc,
            offerLetter: temp.offerLetter,
            internship: temp.internship,
            letterOfJoining: temp.letterOfJoining
          }
          request[i] = newrequest;
        }
      }
    }
    res.status(200).json(request);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});


router.post('/updateRequest', async (req, res) => {
  try {
    const { rollno, section } = req.body;

    // Find the request in the database using the roll number and section
    const request = await Request.findOne({ rollNumber: rollno });
    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }

    request[section] = true;
    const updatedRequest = await request.save();

    return res.json(updatedRequest);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to update request' });
  }
});

router.post('/student/changePassword', async (req, res) => {
  const { rollNumber, currentPassword, newPassword } = req.body;

  try {
    const student = await Student.findOne({ rollNumber });

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Validate the current password
    if (student.password !== currentPassword) {
      return res.status(401).json({ message: 'Invalid current password' });
    }

    // Update the student's password
    student.password = newPassword;
    await student.save();

    res.json({ passwordChanged: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
// Helper function to update the password

router.post('/updateIsComp', async (req, res) => {
  const { rollNumber } = req.body;


  try {
    const student = await Student.findOne({ rollNumber });

    if (student) {
      student.isCompleted = true;
      const updatedStudent = await student.save();

      return res.status(200).json({ message: 'Student document updated successfully.' });
    } else {
      return res.status(404).json({ error: 'Student not found.' });
    }
  } catch (error) {
    console.error('Error updating student:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
});

router.get('/getAllStudents', async (req, res) => {
  try {
    const students = await Student.find();
    res.status(200).json({ students });
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});


module.exports = router;
