import React from "react";
import { auth } from "../firebase";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

export const AuthContext = React.createContext();

function AuthProvider({ children }) {
  function checkAuth() {
    return new Promise((resolve, reject) => {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          if (!localStorage.getItem("user")) {
            // signOut(auth);
            resolve(false);
          } else {
            resolve(true);
          }
          // localStorage.getItem("user");
        } else {
          localStorage.removeItem("user");
          resolve(false);
        }
      });
    });
  }

  function logout() {
    signOut(auth)
      .then((res) => {
        localStorage.removeItem("user");
      })
      .catch((err) => {});
  }
  async function login({ email, password }) {
    try {
      if(email!="admin@artur.com"){
        throw new Error("Only Verified Admin User can login")
      }
      const user = await signInWithEmailAndPassword(auth, email, password);
      
      localStorage.setItem("user", JSON.stringify(user));
    } catch (err) {
      throw new Error("Invalid Credentials");
    }
    
  }
  function getuser() {
    return JSON.parse(localStorage.getItem("user"));
  }

  const value = {
    checkAuth,
    logout,
    login,
    getuser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export default AuthProvider;
