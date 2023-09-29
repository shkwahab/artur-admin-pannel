import React, { useState, useEffect } from "react";
import { IoSearchOutline } from "react-icons/io5";
import "../styles/users.css";
import "../styles/table.css";
import InputField from "../components/InputField";
import Modal from "../components/Modal";
import "../styles/categories.css";
import { db, auth } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { getMessaging, getToken } from "firebase/messaging";

import { collection, getDocs } from "firebase/firestore";
import UsersTbody from "../components/users/UsersTbody";
import LoadingSpinner from "../components/LoadingSpinner";

export default function Users() {
  const [isLoading, setIsLoading] = useState(false);
  const [addname, setaddname] = useState("");
  const [addemail, setaddemail] = useState("");
  const [addphone, setaddphone] = useState("");
  const [modal, setmodal] = useState(false);
  const [message, setmessage] = useState("");
  const [apiCalled, setapiCalled] = useState(false);

  const addName = (e) => setaddname(e.target.value);
  const addEmail = (e) => setaddemail(e.target.value);
  const addPhone = (e) => setaddphone(e.target.value);
  const [user, setUser] = useState([]); // Initialize user as an empty array


  const getUsers = async () => {
    setIsLoading(true);
    const usersCollectionRef = collection(db, "UserData");
    const querySnapshot = await getDocs(usersCollectionRef);
    const users = [];

    for (const doc of querySnapshot.docs) {
      const user = doc.data();
      user.id = doc.id; // Store the document ID in the user object
    
      user.events = [];
    
      const eventCollectionRef = collection(doc.ref, "EventData");
      const eventSnapshot = await getDocs(eventCollectionRef);
    
      const allEventData = []; // Create an array to store all event data
    
      const eventPromises = eventSnapshot.docs.map(async (eventDoc) => {
        allEventData.push(eventDoc.data());
      });
    
      await Promise.all(eventPromises); // Wait for all events to be collected
    
      user.events = allEventData; // Store event data in the user object
    
      users.push(user);
    }
    
    setUser(users);
    
    
    setIsLoading(false);
  };

  const keys = ["Name","Email","AccountType"];
  const [search, setsearch] = useState("");
  const searches = (datas) => {
    return datas.filter((item) =>
      keys.some((key) => item[key]?.toLowerCase().includes(search.toLowerCase()))
    );
  };





  useEffect(() => {
    setTimeout(() => {
      if (message) setmessage("");
    }, 2000);

    getUsers();
  }, []);
  console.log(user)

  return (
    <>
      <div className="users">
        {message && <h4 className="message">{message}</h4>}
        <div className="flexing">

        </div>
        <div className="search-bar">
          <IoSearchOutline className="icon" />
          <input
            value={search}
            onChange={(e) => setsearch(e.target.value)}
            placeholder="Search user by name or email..."
          />
        </div>

        <div className="table w-full">
          <table style={{ height: "auto" }}>
            <tr
              style={{
                backgroundColor: "transparent",
                borderBottom: "0.5px solid rgba(124, 124, 124, 0.27)",
              }}
            >
              <th className=" text-black" style={{color:"black", fontSize:"18px", fontWeight:"bold"}}>Name</th>
              <th className=" text-black" style={{color:"black", fontSize:"18px", fontWeight:"bold"}}>Email</th>
              <th className=" text-black" style={{color:"black", fontSize:"18px", fontWeight:"bold"}}>Account Type</th>
            </tr>

            {searches(user).map((val, ind) => {
              
              return (
                <UsersTbody
                  key={ind}
                  profilePic={val.image}
                  id={val.id}
                  Source={val.Source}
                  name={val.AccountType}
                  username={val.Name}
                  email={val.Email}
                  events={val.events}
                />
              );
            })}
          </table>
        </div>
      </div>


      {isLoading ? <LoadingSpinner /> : Users}
    </>
  );
}
