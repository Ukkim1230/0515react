import './App.css';
import { useEffect, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Join from './components/Join';
import Login from './components/Login';
import Home from './components/Home';
import MyPage from './components/MyPage';
import { ToastContainer, Zoom } from 'react-toastify';
function App() {
  const [isLogin,setIsLogin] = useState(false);
  useEffect(()=>{
    const token = localStorage.getItem('token');
    if(token){
      setIsLogin(true);
    }
  },[])
  return (
    <BrowserRouter>
      <Header isLogin={isLogin} setIsLogin={setIsLogin}></Header>
      <Routes>
        <Route path='login' element={
          !isLogin?
        <Login setIsLogin={setIsLogin}/>:<Navigate to="/"/>
        }/>
        <Route path='join' element={
          !isLogin?
        <Join/>:<Navigate to="/"/>
        }/>
         <Route path='/' element={
          isLogin?
        <Home/>:<Navigate to="/login"/>
        }/>
        <Route path='/my-page' element={
          isLogin?
        <MyPage/>:<Navigate to="/login"/>
        }/>
      </Routes>

    <ToastContainer
      position='bottom-right'
      autoClose={3000}
      theme='dark'
      transition={Zoom}/>
    </BrowserRouter>
  );
}

export default App;
