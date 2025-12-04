import React, { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";   // ✅ import your auth instance
import "./Dashboard.css";


function Dashboard(){
//retrieving user info
const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  if (!user) return <h2>Loading user info...</h2>;

  return (
    <div>
      <h2>Welcome back {user.email}</h2>
    </div>

    );
}



export default Dashboard; 