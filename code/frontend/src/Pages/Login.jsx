/*
			Using React Hook Form (library) to make things a little easier here. 
*/

import React from "react"; 
import { useState, useEffect } from 'react';
import {useForm} from 'react-hook-form'
import app from "../firebase";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import {Link} from "react-router-dom";
import "./Login.css"; 

const auth = getAuth(app); 




function Login() {
	const {
		//hooks from react-hook-form library below

		register, //connects input fields.
		handleSubmit, //wraps onSubmit so validation runs first
		formState: {errors} //holds validation error msg's
	} = useForm(); 


	


	//onSubmit runs when form is submitted successfuly. 
	const onSubmit =  async (data) =>{
		try{
			const userCredential = await signInWithEmailAndPassword(
				auth, 
				data.email,
				data.password
			);

			console.log("Logged in: ", userCredential.user.email); 

			 

		} catch (error) {
			console.error("Login failed: ", error.message); 
		}
	};
	
	return (
		<div className="login-side">
			<div className="login-form">
			<h2>Welcome back</h2>
			<p>Please enter your details...</p>
			
		<form onSubmit={handleSubmit(onSubmit)}>
		  <input
			type="email"
			placeholder="Email"
			{...register("email", { required: true })}
		  />
		  {errors.email && <span>Email is required!</span>}
	
		  <input
			type="password"
			placeholder="Password"
			{...register("password", { required: true })}
		  />
		  {errors.password && <span>Password is required!</span>}
	
		  <button type="submit">Login</button>
		</form>

		<p>
			Don't have an account? <Link to="/register">Register here!</Link>
		</p>
		</div>

		<div className="login-page-image">
			<img src="logo-image.jpeg" alt="loginImage" />
		</div>
		</div>

	  );
	
}


export default Login;