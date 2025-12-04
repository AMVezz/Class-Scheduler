import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { auth } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import "./Register.css";
import { useNavigate } from "react-router-dom";
import {provider} from "../firebase"; 				//google authentication stuff
import { signInWithPopup } from "firebase/auth";
import { FcGoogle } from "react-icons/fc"; 

//pop-up library below
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Register() {
  const navigate = useNavigate(); 
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log("Registered with Google:", user.email);
      toast.success("Google Sign-In successful!", { position: "top-center", autoClose: 3000 });
      setTimeout(() => navigate("/schedule"), 3000);
    } catch (error) {
      console.error("Google Sign-In failed:", error.message);
      toast.error("Google Sign-In failed", { position: "top-center", autoClose: 3000 });
    }
  };

  const onSubmit = async (data) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      console.log("Registered new user:", userCredential.user.email);
      
      //popup msg
      toast.success("Registration successful!", {
        position: "top-center",
        autoClose: 3000,
      });

      setTimeout(() => {
        navigate("/login");
      }, 3000);

    } catch (error) {

      console.error("Registration failed:", error.message);
    }
  };

  return (

    <div className = "register-page">
      {/*Background container*/}
      <div className = "register-container">
        {/*Floating box*/}
        <div className = "register-box">
          <h2>Create an Account</h2>
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className = "register-field">
      <input
        type="email"
        placeholder="Email"
        {...register("email", { required: true })}
      />
      {errors.email && <span>Email is required...</span>}
      </div>

      <div className = "register-field">
      <input
        type="password"
        placeholder="Password"
        {...register("password", { required: true, minLength: 6 })}
      />
      {errors.password && (
        <span>Password must be at least 6 characters...</span>
      )}
      </div>

      <button type="submit">Register</button>
      <h3>or</h3>
      <button type="button" onClick={handleGoogleSignIn} className="google-login">
		  <FcGoogle size={20} style={{ marginRight: "4px" }} />
        Register with Google
		  </button>
      
    </form>
    </div>
    </div>
    <ToastContainer />
    </div>
    
  );
}

export default Register;