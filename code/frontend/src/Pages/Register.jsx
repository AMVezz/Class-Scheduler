import React from "react";
import { useForm } from "react-hook-form";
import { auth } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";

function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      console.log("Registered new user:", userCredential.user.email);
    } catch (error) {
      console.error("Registration failed:", error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        type="email"
        placeholder="Email"
        {...register("email", { required: true })}
      />
      {errors.email && <span>Email is required...</span>}

      <input
        type="password"
        placeholder="Password"
        {...register("password", { required: true, minLength: 6 })}
      />
      {errors.password && (
        <span>Password must be at least 6 characters...</span>
      )}

      <button type="submit">Register</button>
    </form>
  );
}

export default Register;