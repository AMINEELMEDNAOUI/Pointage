import React from 'react'
import { BrowserRouter,Routes,Route } from 'react-router-dom'
import Home from './home'
import Login from './Login'
import Register from './Register';

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route exact path='/' element={<Home/>}></Route>
      <Route path='/Login' element ={<Login/>}></Route>
      <Route path='/Register' element ={<Register/>}></Route>
    </Routes>
    </BrowserRouter>
  )
}

export default App