import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavRoot from "./NavRoot";
import "./AllRequests.css";

const AllRequests = () => {
    const navigate = useNavigate();
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

    const [requests, setRequests] = useState([]);

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const response = await fetch("http://10.0.0.5:5000/getAllRequests");
            const data = await response.json();
            setRequests(data.requests);
        } catch (error) {
            console.error("Error fetching requests:", error);
        }
    };

    const handleStatusChange = async (rollNumber, field, value) => {
        try {
            await fetch("http://10.0.0.5:5000/rootUpdateRequest", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ rollNumber, section: field, value }),
            });
            fetchRequests(); // Refresh the requests after updating
        } catch (error) {
            console.error("Error updating request:", error);
        }
    };

    const getStatusLabel = (value) => {
        return (
            <span className={value ? "spanApp" : "spanPen"}>
                {value ? "Approved" : "Pending"}
            </span>
        );
    };
    const [searchQuery, setSearchQuery] = useState("");
    const handleUpdateRequest = async (rollNumber) => {
        try {
            const request = requests.find((req) => req.rollNumber === rollNumber);
            if (request) {
                await handleStatusChange(rollNumber, "areYouPlaced", request.areYouPlaced);
                await handleStatusChange(rollNumber, "deplabs", request.deplabs);
                await handleStatusChange(rollNumber, "commonlabs", request.commonlabs);
                await handleStatusChange(rollNumber, "accounts", request.accounts);
                await handleStatusChange(rollNumber, "exam", request.exam);
                await handleStatusChange(rollNumber, "library", request.library);
                await handleStatusChange(rollNumber, "deplib", request.deplib);
                await handleStatusChange(rollNumber, "store", request.store);
                await handleStatusChange(rollNumber, "tpc", request.tpc);
                fetchRequests(); // Refresh the requests after updating
            }
        } catch (error) {
            console.error("Error updating request:", error);
        }
    };
    const filteredRequests = requests.filter((request) => {
        return (
            request.rollNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
            request.fullName.toLowerCase().includes(searchQuery.toLowerCase())
        );
    });
    return (
        <>
            <NavRoot />
            <div className="allRequestsPage">
                <h2>All Requests</h2>
                <div className="centeringdiv">
                    <div className="searchBox ">
                        <input
                            type="text"
                            placeholder="Search by name or roll number"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>Roll Number</th>
                            <th>Full Name</th>
                            <th>Department</th>
                            <th>Class</th>
                            <th>DEP Labs</th>
                            <th>Common Labs</th>
                            <th>Accounts</th>
                            <th>Exam</th>
                            <th>Library</th>
                            <th>DEP Library</th>
                            <th>Store</th>
                            <th>TPC</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredRequests.map((request) => (
                            <tr key={request._id}>
                                <td><span style={{fontWeight : 780}}>{request.rollNumber}</span></td>
                                <td>{request.fullName}</td>
                                <td>{request.department}</td>
                                <td>{request.classValue}</td>
                                <td>
                                    {getStatusLabel(request.deplabs)}
                                    <select
                                        value={request.deplabs}
                                        onChange={(e) =>
                                            handleUpdateRequest(request.rollNumber, "deplabs", e)
                                        }
                                    >
                                        <option value="true">Approved</option>
                                        <option value="false">Pending</option>
                                    </select>
                                </td>
                                <td>
                                    {getStatusLabel(request.commonlabs)}
                                    <select
                                        value={request.commonlabs}
                                        onChange={(e) =>
                                            handleUpdateRequest(request.rollNumber, "commonlabs", e)
                                        }
                                    >
                                        <option value="true">Approved</option>
                                        <option value="false">Pending</option>
                                    </select>
                                </td>
                                <td>
                                    {getStatusLabel(request.accounts)}
                                    <select
                                        value={request.accounts}
                                        onChange={(e) =>
                                            handleUpdateRequest(request.rollNumber, "accounts", e)
                                        }
                                    >
                                        <option value="true">Approved</option>
                                        <option value="false">Pending</option>
                                    </select>
                                </td>
                                <td>
                                    {getStatusLabel(request.exam)}
                                    <select
                                        value={request.exam}
                                        onChange={(e) =>
                                            handleUpdateRequest(request.rollNumber, "exam", e)
                                        }
                                    >
                                        <option value="true">Approved</option>
                                        <option value="false">Pending</option>
                                    </select>
                                </td>
                                <td>
                                    {getStatusLabel(request.library)}
                                    <select
                                        value={request.library}
                                        onChange={(e) =>
                                            handleUpdateRequest(request.rollNumber, "library", e)
                                        }
                                    >
                                        <option value="true">Approved</option>
                                        <option value="false">Pending</option>
                                    </select>
                                </td>
                                <td>
                                    {getStatusLabel(request.deplib)}
                                    <select
                                        value={request.deplib}
                                        onChange={(e) =>
                                            handleUpdateRequest(request.rollNumber, "deplib", e)
                                        }
                                    >
                                        <option value="true">Approved</option>
                                        <option value="false">Pending</option>
                                    </select>
                                </td>
                                <td>
                                    {getStatusLabel(request.store)}
                                    <select
                                        value={request.store}
                                        onChange={(e) =>
                                            handleUpdateRequest(request.rollNumber, "store", e)
                                        }
                                    >
                                        <option value="true">Approved</option>
                                        <option value="false">Pending</option>
                                    </select>
                                </td>
                                <td>
                                    {getStatusLabel(request.tpc)}
                                    <select
                                        value={request.tpc}
                                        onChange={(e) =>
                                            handleUpdateRequest(request.rollNumber, "tpc", e)
                                        }
                                    >
                                        <option value="true">Approved</option>
                                        <option value="false">Pending</option>
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default AllRequests;