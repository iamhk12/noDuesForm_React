import React from 'react';
import { Routes, Route } from 'react-router-dom'
import Login from './Pages/Login'
import Form from './Pages/Form'
import Logout from './Pages/Logout';
import Request from './Pages/Request';
import "./App.css"
import AdminLogin from './Admin/AdminLogin';
import AdminRequests from './Admin/AdminRequests';

function App() {
  return (
    <>
      <Routes>
        <Route path='/login' element={<Login/>} />
        <Route path='/form' element={<Form/>} />
        <Route path='/request' element={<Request/>}/>
        <Route path='/logout' element={<Logout/>} />
        <Route path='/admin/login' element={<AdminLogin/>} />
        <Route path='/adminrequests' element={<AdminRequests/>} />
      </Routes>
    </>
  );
}

export default App;