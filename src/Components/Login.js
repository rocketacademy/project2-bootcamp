import React, { useEffect } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserAuth } from '../Context/AuthContext'
import "./Login.css";

export default function Login (){
  const navigate = useNavigate();
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mode, setMode ] = useState('Login')

  const { createUser, signIn, user } = UserAuth();
  
  function handleInput(e){
    if (e.target.name === 'email'){
      setEmail(e.target.value)
    } else if (e.target.name === 'password'){
      setPassword(e.target.value)
    }
  }

  function handleSubmit (e) {
    e.preventDefault();
    console.log('run')
    
    if(mode === 'Login'){
      console.log('loginrun')
      if (email === '' || password === ''){
        alert('Please enter an email and passowrd')
      } else{
        signIn(email, password).then(()=>{
        navigate('/feed')
      }).catch((error) => {
          const errorMessage = error.message;
          console.log(errorMessage);
          console.log(error.code)
          if (error.code ==='auth/invalid-email'){
            alert('Invalid Email')
          } else if (error.code ==='auth/wrong-password'){
            alert('Incorrect Password')
          } else{
            alert(`Error: ${error.code}`)
          }
        });
      }
    } else if (mode === 'Register'){
      console.log('signup run')
      if (email === '' || password === ''){
        alert('Please enter an email and passowrd')
      } else if(email.indexOf('@')===-1 || email.indexOf('@') === email.length-1 || email.indexOf('@') === 0){
        alert('Please use a valid email format')
      } else {
        createUser(email, password).then(()=>{
          navigate('/create-profile')
        }).catch((error) => {
          const errorMessage = error.message;
          console.log(errorMessage);
          console.log(error.code)
          })
        };
      } 
    }
  
  
  function changeLogin(e){
    setMode('Login')
    console.log(mode)
    setPassword('')
    setEmail('')
  }
  
  function changeRegister(e){
    setMode('Register')
    console.log(mode)
    setPassword('')
    setEmail('')
  }

  return(
    <>
      <header className='header-div'>
        <h1>Film-O-Rama</h1>
        <p>Your One-Stop Movie Tracker App</p>
      </header>
      <div className='login-panel'>
        <div className='mode-panel'>
          <button className={mode === "Login"? 'active-button' : 'inactive-button'} onClick ={changeLogin}>Login</button>
          <button className={mode === "Register"? 'active-button' : 'inactive-button'} onClick ={changeRegister}>Register</button>
        </div>
        <form className='form-panel' onSubmit = {handleSubmit}>
          <input className='login-form-fields' type= 'text' name= 'email' placeholder = 'Email' value = {email} onChange = {handleInput}/>
          <input className='login-form-fields' type= 'password' name= 'password' placeholder = 'Password' value = {password} onChange = {handleInput}/>
          { mode === 'Login'
          ? <input className="submit-button" name = 'login' type = 'submit' value = 'Login'/>
          : <input className="submit-button" name = 'signup' type = 'submit' value = 'Register'/>
          }
        </form>
      </div>
    </>
  )
}