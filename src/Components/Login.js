import React from 'react';
import { useState } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';

export default function Login (){
  const navigate = useNavigate();
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [mode, setMode ] = useState('Login')
  
  function handleInput(e){
    if (e.target.name === 'email'){
      setEmail(e.target.value)
    } else if (e.target.name === 'password'){
      setPassword(e.target.value)
    }
    console.log(`email: ${email} and password: ${password}`)
  }

  function handleSubmit(e){
    e.preventDefault();
    if(e.name === 'login'){
      console.log('login')
      if (email === '' || password === ''){
        alert('Please enter an email and passowrd')
      } else{
        signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed in
          console.log('signed in!')
          console.log(userCredential)
          const user = userCredential.user;
          setUser(user);
          navigate('/feed')
        })
        .catch((error) => {
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
    } else if (e.name === 'signup'){
      console.log('signup')
      if (email === '' || password === ''){
        alert('Please enter an email and passowrd')
      } else if(email.indexOf('@')===-1 || email.indexOf('@') === email.length-1){
        alert('Please use a valid email format')
      } else {
        createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
        // Signed in
        console.log(userCredential)
        const user = userCredential.user;
        setUser(user);
        navigate('/feed')
      })
      .catch((error) => {
        console.log(error.message);
        console.log(error.code)
        });
      } 
    }
  }
  
  function changeLogin(e){
    setMode('Login')
    console.log(mode)
  }
  
  function changeRegister(e){
    setMode('Register')
    console.log(mode)
  }

  return(
    <div>
      <button onClick ={changeLogin}>Login</button>
      <button onClick ={changeRegister}>Register</button>
      <form onSubmit = {handleSubmit}>
        <input type= 'text' name= 'email' placeholder = 'Email' value = {email} onChange = {handleInput}/>
        <input type= 'text' name= 'password' placeholder = 'Password' value = {password} onChange = {handleInput}/>
        { mode === 'Login'
        ? <input name = 'login' type = 'submit' value = 'Login'/>
        : <input name = 'signup' type = 'submit' value = 'Sign Up'/>
        }
      </form>
    </div>
  )
}