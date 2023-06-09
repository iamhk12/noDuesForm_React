import React from 'react';
import { Routes, Route } from 'react-router-dom'
import Login from './Pages/Login'
import Form from './Pages/Form'
import Logout from './Pages/Logout';
import Request from './Pages/Request';
import "./App.css"

function App() {


  return (
    <>
      <Routes>
        <Route path='/' element={<Login/>} />
        <Route path='/form' element={<Form/>} />
        <Route path='/request' element={<Request/>}/>
        <Route path='/logout' element={<Logout/>} />
      </Routes>
    </>
  );
}

export default App;