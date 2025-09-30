/*
			Using React Hook Form (library) to make things a little easier here. 
*/

import { useState, useEffect } from 'react';
import {useForm} from 'react-hook-form'

function Login() {
	
	
	const {
		//hooks from react-hook-form library below

		register, //connects input fields.
		handleSubmit, //wraps onSubmit so validation runs first
		formState: {errors} //holds validation error msg's
	} = useForm(); 


	//onSubmit runs when form is submitted successfuly. 
	const onSubmit = (data) =>{
		console.log("Form data: ", data); //we'll send data to backend API when thats set up. data = (email+password)
	}
	
	return (
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
	  );
	
}


export default Login;