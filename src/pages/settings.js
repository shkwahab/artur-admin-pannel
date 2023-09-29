import React, { useState} from "react";
import { IoLockClosedOutline} from "react-icons/io5";
import "../styles/settings.css";
import { auth} from "../firebase";

import {
  updatePassword,
} from "firebase/auth";
const Settings = (props) => {
  const [passwordupdate, setpasswordupdate] = useState("");
  const updateuser = async () => {
    try {
      const user = auth.currentUser;
      console.log(user)
      if (passwordupdate) {
        try {
          await updatePassword(user, passwordupdate);
          window.location.reload();
        } catch (err) {
          alert("Relogin to Update the password");
        }
      }
    } catch (err) {
      alert("Please login again to update your email and password");
    }

  };



  return (
    <div className="settings">
      <h2 className="settings-title">Settings</h2>
      <div>
        <h3>Security</h3>
        <div className="settings-fields-container">
          <div className="field">
            <input
              value={passwordupdate}
              onChange={(e) => setpasswordupdate(e.target.value)}
              placeholder="Change Password"
            />
            <IoLockClosedOutline className="icon" />
          </div>
          <button className=" my-4 text-xl " onClick={updateuser}>
            Update
          </button>
        </div>
      </div>

    </div>
  );
};

export default Settings;
