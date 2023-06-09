import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Nav from '../components/NavB'
const Request = () => {
    const navigate = useNavigate();
    const [request, setRequest] = useState(null);


    useEffect(() => {
        const fetchStudentData = async () => {
            const storedRollNumber = localStorage.getItem('rollno');
            const storedPassword = localStorage.getItem('password');
            const expirationDate = new Date(localStorage.getItem('expirationDate'));

            if (storedRollNumber && storedPassword && expirationDate > new Date()) {
                try {
                    const response = await fetch('http://localhost:5000/getStudent', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ rollNumber: storedRollNumber }),
                    });

                    if (response.ok) {
                        const student = await response.json();

                        // Check if stored password matches fetched student data password
                        if (storedPassword === student.password) {
                            console.log("Good")
                            if (student.isFilled) {
                                navigate('/request');
                            }
                        } else {
                            navigate('/logout');
                        }
                    } else {
                        navigate('/');
                    }
                } catch (error) {
                    console.log(error);
                    // Handle error that occurred during the request
                }
            } else {
                // Clear the stored values if expired or not present
                localStorage.removeItem('rollno');
                localStorage.removeItem('password');
                localStorage.removeItem('expirationDate');
                navigate('/');
            }
        };

        fetchStudentData();
    }, [navigate]);

    useEffect(() => {
        const storedRollNumber = localStorage.getItem('rollno');
        const storedPassword = localStorage.getItem('password');
        const expirationDate = new Date(localStorage.getItem('expirationDate'));

        if (storedRollNumber && storedPassword && expirationDate > new Date()) {
            getStudentRequest(storedRollNumber);
        } else {
            // Clear the stored values if expired or not present
            localStorage.removeItem('rollno');
            localStorage.removeItem('password');
            localStorage.removeItem('expirationDate');
            navigate('/');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getStudentRequest = async (rollNumber) => {
        const response = await fetch('http://localhost:5000/getStudentRequest', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ rollNumber }),
        });

        if (response.status === 401) navigate('/');

        if (response.ok) {
            const { request } = await response.json();

            // Store the request data in the state
            setRequest(request);

            return request;
        } else {
            // Handle error case
        }
    };

    return (
        <>
        <Nav/>
            {/* Display the request object */}
            {request && (
                <div>
                    <h2>Request Details</h2>
                    <p>Roll Number: {request.rollNumber}</p>
                    <p>Full Name: {request.fullName}</p>
                    <p>Class: {request.classValue}</p>
                    <p>Semester: {request.semester}</p>
                    <p>Labs: {request.labs ? 'Approved' : 'Pending'}</p>
                    <p>Store: {request.store ? 'Approved' : 'Pending'}</p>
                    <p>TPC: {request.tpc ? 'Approved' : 'Pending'}</p>
                    <p>Library: {request.library ? 'Approved' : 'Pending'}</p>
                </div>
            )}
        </>
    );

};

export default Request;
