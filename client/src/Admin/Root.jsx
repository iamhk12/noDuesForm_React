import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Root.css"
import NavAdmin from "./NavAdmin";
const Root = () => {
    const navigate = useNavigate();
    const [students, setStudents] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const response = await fetch("http://10.0.0.5:5000/getAllStudents");
                if (response.ok) {
                    const data = await response.json();
                    setStudents(data.students);
                    console.log(students)
                } else {
                    // Handle error when fetching students
                }
            } catch (error) {
                // Handle error that occurred during the request
            }
        };

        fetchStudents();
        //eslint-disable-next-line
    }, []);

    useEffect(() => {
        const storedID = localStorage.getItem("id");
        const storedPassword = localStorage.getItem("password");
        const expirationDate = new Date(localStorage.getItem("expirationDate"));

        if (storedID && storedPassword && expirationDate > new Date()) {
            if (storedID === "admin" && storedPassword === "rait") {
                console.log("Good");
            } else {
                localStorage.removeItem("id");
                localStorage.removeItem("password");
                localStorage.removeItem("expirationDate");

                navigate("/admin/login");
            }
        }
        //eslint-disable-next-line
    }, []);

    const handleSearch = (event) => {
        setSearchQuery(event.target.value);
    };

    const filteredStudents = students.filter(
        (student) =>
            student.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            student.rollNumber.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <>
        <NavAdmin />
            <div className="rootPage">
                <h1 className="head" style={{ textAlign: "center" }}>All Students</h1>

                <div className="root_content">
                    <input
                        type="text"
                        placeholder="Search by Name or Roll Number"
                        value={searchQuery}
                        onChange={handleSearch}
                    />
                    <table>
                        <thead>
                            <tr>
                                <th>Roll Number</th>
                                <th>Dep</th>
                                <th>Name</th>
                                <th>Class</th>
                                <th>Passed Out Year</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredStudents.map((student) => (
                                <tr key={student.rollNumber}>
                                    <td>{student.rollNumber}</td>
                                    <td>{student.department}</td>
                                    <td>{student.fullName}</td>
                                    <td>{student.classValue}</td>
                                    <td>{student.passedOutYear}</td>
                                    <td className={student.isCompleted ? "spanApp" : "spanPen"}>{student.isCompleted ? "Aprroved" : "Pending"}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

            </div>
        </>
    );
};

export default Root;
