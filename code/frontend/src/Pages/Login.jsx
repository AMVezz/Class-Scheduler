/*
			Using React Hook Form (library) to make things a little easier here. 
*/

import React from "react"; 
import { useState, useEffect } from 'react';
import {useForm} from 'react-hook-form'
import app from "../firebase";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import {Link} from "react-router-dom";

const auth = getAuth(app); 




function Login() {
	const {
		//hooks from react-hook-form library below

		register, //connects input fields.
		handleSubmit, //wraps onSubmit so validation runs first
		formState: {errors} //holds validation error msg's
	} = useForm(); 


	//navigate used to send user to different pages
	//const navigate = useNavigate(); 


	//onSubmit runs when form is submitted successfuly. 
	const onSubmit =  async (data) =>{
		try{
			const userCredential = await signInWithEmailAndPassword(
				auth, 
				data.email,
				data.password
			);

			console.log("Logged in: ", userCredential.user.email); 

			//brings user to class search page
			//navigate("/classSearch"); 

		} catch (error) {
			console.error("Login failed: ", error.message); 
		}
	};
	
	return (
		<div>
		<form onSubmit={handleSubmit(onSubmit)}>
		  <input
			type="email"
			placeholder="Email"
			{...register("email", { required: true })}
		  />
		  {errors.email && <span>Email is required!</span>}
	
		  <input
			type="password"
		