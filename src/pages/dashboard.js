import React, { useEffect } from "react";
import "../styles/dashboard.css";
import { db } from "../firebase";
import {
  collection,
  getCountFromServer,
  getDocs,
  Firestore,
  addDoc,
  updateDoc,
  query,
} from "firebase/firestore";
import { AiOutlineArrowDown, AiOutlineArrowUp } from "react-icons/ai"
import { useState } from "react";
import LoadingSpinner from "../components/LoadingSpinner";
import TopUsersChart from "../components/dashboard/MostSubscribedUsersChart";
import UsersAgeChart from "../components/dashboard/UsersAgeChart";
import WaveIcon from "../assets/waveIcon.svg";
import UsersTbody from "../components/users/UsersTbody";
import MostUserEventsTbody from "../components/dashboard/MostUserEventsTbody";

export default function Dashboard() {
  const [totalChatRooms, settotalChatRooms] = useState(0);
  const [totalUsers, settotalUsers] = useState(0);
  const [revenueVariations, setRevenueUserVariations] = useState({});
  const [mostSubscribedUsers, setmostSubscribedUsers] = useState([]);
  const [loading, setloading] = useState(false);
  const [totalPosts, settotalPosts] = useState(0);
  const [user, setUser] = useState([]); // Initialize user as an empty array
  const [event, setEvent] = useState([])
  const [mostUserEvents, setmostUserEvents] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [dropDown, setToggleDropDown] = useState(false)
  const [price, setPrice] = useState(1);
  const [eventPricelength,setEventPriceLength]=useState(0);

  const getAllUsers = async () => {
    try {

      const userLocations = {}; // Create an object to store revenue by location
      let totalRev = 0;


      const usersCollectionRef = collection(db, "UserData");
      const eventPrice = collection(db, "eventPrice");
      const querySnapshotPrice=await getDocs(eventPrice);
      console.log("Event Price",querySnapshotPrice);
      let eventPriceData=undefined;
      for(const doc of querySnapshotPrice.docs){
        eventPriceData=doc.data();
      }
      // if(eventPriceData){
        // }
        setPrice(eventPriceData.price)
        setEventPriceLength(eventPriceData);
      const querySnapshot = await getDocs(usersCollectionRef);

      settotalUsers(querySnapshot.docs.length);
      const users = [];

      for (const doc of querySnapshot.docs) {
        const user = doc.data();
        user.events = [];

        const eventCollectionRef = collection(doc.ref, "EventData");
        const eventSnapshot = await getDocs(eventCollectionRef);
        const allEventData = []; // Create an array to store all event data

        const eventPromises = querySnapshot.docs.map(async (userDoc) => {
          const eventCollection = collection(userDoc.ref, "EventData");
          const eventSnapshot = await getDocs(eventCollection);

          eventSnapshot.forEach((eventDoc) => {
            allEventData.push(eventDoc.data());
          });
        });

        await Promise.all(eventPromises); // Wait for all events to be collected

        setEvent(allEventData); // Set all event data in the state
        eventSnapshot.forEach((eventDoc) => {
          user.events.push(eventDoc.data());
        });

        users.push(user);
      }

      setUser(users);
      user.forEach((userData) => {

        userData.events.forEach((event) => {
          const userLocation = event.Location;
          const userRevenue = Number(event.Total);

          userLocations[userLocation] = (userLocations[userLocation] || 0) + Number(userRevenue);
          totalRev += userRevenue;
        });
      });

      setTotalRevenue(totalRev)
      // alert(totalRev)

      const revenueDistribution = {};
      for (const location in userLocations) {
        if (userLocations.hasOwnProperty(location)) {
          const revenue = userLocations[location];
          const percentage = (revenue / totalRev) * 100;
          revenueDistribution[location] = percentage;
        }
      }

      setRevenueUserVariations(revenueDistribution);


    } catch (error) {
      console.error('Error fetching data:', error);

    }
  };

  const getMostUserEvent = async () => {
    const sortedUsers = [...user];
    sortedUsers.sort((a, b) => b.events.length - a.events.length);

    setmostUserEvents(sortedUsers)
  };

  const FETCH_DATA = async () => {
    await getAllUsers();
  }
  useEffect(() => { FETCH_DATA() }, [])
  const getData = () => {

    setloading(true);
    Promise.all([getAllUsers(), getMostUserEvent()])
      .then((res) => {
        setloading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    // Add event listener for screen size changes
    window.addEventListener("resize", handleResize);

    // Remove the event listener when the component is unmounted
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    getData();
  }, []);
  const [apiCall, setCall] = useState(false);

  useEffect(() => {
    if (apiCall < 5) { // Limit API calls to 5
      const data = async () => {
        await getAllUsers();
        await getMostUserEvent();
        setCall(true); // Update apiCall here
      };

      data().catch(console.error);
      console.log(apiCall, "x")
    }
  }, [apiCall]);
  const addEventPrice = async () => {
    try {
      // Reference the "eventPrice" collection
      const eventPriceCollectionRef = collection(db, "eventPrice");
  
      // Query the collection to check if a document already exists
      const querySnapshot = await getDocs(eventPriceCollectionRef);
  
      if (!querySnapshot.empty) {
        console.log("Document already exists. You can update it if needed.");
      } else {
        // If no document exists, create a new one
        const eventPriceData = {
          price: price, // or the value you want to store
        };
  
        // Add a new document to the collection
        const docRef = await addDoc(eventPriceCollectionRef, eventPriceData);
  
        console.log("Document written with ID: ", docRef.id);
      }
    } catch (error) {
      console.error("Error creating Docs", error);
    }
  };
  
 
  
  const updatePrice = async (newPrice) => {
    try {
      // Reference the "eventPrice" collection
      const eventPriceCollectionRef = collection(db, "eventPrice");
  
      // Query the collection to check if a document already exists
      const querySnapshot = await getDocs(eventPriceCollectionRef);
  
      if (!querySnapshot.empty) {
        console.log("Document already exists. You can update it if needed.");
        // If the document exists, update it
        const docToUpdate = querySnapshot.docs[0].ref; // Assuming only one document exists
        const eventPriceData = { price: newPrice };
  
        await updateDoc(docToUpdate, eventPriceData);
  
        console.log("Document updated successfully.");
      } else {
        console.log("Document not found. You can add a new one if needed.");
        // If the document doesn't exist, add a new one
        const eventPriceData = {
          price: newPrice,
        };
  
        // Add a new document to the collection
        const docRef = await addDoc(eventPriceCollectionRef, eventPriceData);
  
        console.log("Document written with ID: ", docRef.id);
      }
    } catch (error) {
      console.error("Error updating/adding document:", error);
    }
  };
  
  // Usage in your component
  const handlePriceChange = async (newPrice) => {
    setPrice(newPrice);
    await updatePrice(newPrice);
    setToggleDropDown(false);
    
  };

  



  return (
    <div className="dashboad">
      <h2 className="main-heading underline">Dashboard</h2>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div>
          <div className="dashboard-top">
            <div className="dashboard-card">
              <div>
                <h4 className="card-top-heading">Total Users</h4>
                <p className=" font-normal">{totalUsers} Users</p>
              </div>
              <img src={WaveIcon} />
            </div>
            <div className="dashboard-card">
              <div>
                <h4 className="card-top-heading">Total Events</h4>
                <p className="font-normal">{event.length} Posts</p>
              </div>
              <img src={WaveIcon} />
            </div>

          </div>
          <div className="dashboard-top">
            <div className="dashboard-card">
              <div>
                <h4 className="card-top-heading">Total Revenue</h4>
                <p className="font-normal">$ {totalRevenue} </p>
              </div>
              <img src={WaveIcon} />
            </div>
            <div className=" dashboard-card relative">
              <div className=" flex justify-between w-full">
                <div>
                  Set Price
                  <p className="font-normal">
                  ${price?price:1} 
                  </p>
                </div>
                <div className={`${dropDown ? "hidden" : ""}`} onClick={() => {
                  setToggleDropDown(true)
                }}>
                  <AiOutlineArrowDown className=" text-2xl" />
                </div>
                <div className={`${dropDown ? "" : "hidden"}`} onClick={() => {
                  setToggleDropDown(false)
                }}>
                  <AiOutlineArrowUp className=" text-2xl" />
                </div>
              </div>
              <div className={`absolute z-10 left-4 top-20 ${dropDown ? "" : "hidden"}`}>
                <div id="dropdown-menu" className=" absolutex mt-2 w-[300px] border-black border-2 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 border-opacity-20">

                  <div className="py-2 p-2" role="menu" aria-orientation="vertical" aria-labelledby="dropdown-button">

                    <input value={`$0`} onClick={()=>{
                      handlePriceChange(0)
                    }} className={` outline-none rounded-md px-4 py-2 text-sm ${price===0?"text-gray-700":"text-gray-500"} hover:bg-gray-100 active:bg-blue-100 cursor-pointer`} >
                    </input>
                    <input  value={`$1`} onClick={()=>{
                      handlePriceChange(1)
                    }} className={`${price===1?"text-gray-700":"text-gray-500"} outline-none rounded-md px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 active:bg-blue-100 cursor-pointer`} >
                    </input>
                    <input  value={`$5`} onClick={()=>{
                      handlePriceChange(5)
                    }} className={` ${price===5?"text-gray-700":"text-gray-500"} outline-none rounded-md px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 active:bg-blue-100 cursor-pointer`} >
                    </input>
                    <input  value={`$10`} onClick={()=>{
                      handlePriceChange(10)
                    }} className={` ${price===10?"text-gray-700":"text-gray-500"} outline-none rounded-md px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 active:bg-blue-100 cursor-pointer`}>
                    </input>
                  </div>

                </div>

              </div>
            </div>

          </div>
          <div>


            {/* <div className=" mt-10 ">


              <div className="users-age-wrapper ">
                <h2 className="  text-xl ">Revenue Variation by GeoLocation</h2>
                <div className="users-age-chart-wrapper  mt-10">
                  <UsersAgeChart
                    screenWidth={screenWidth}
                    usersData={revenueVariations}
                    totalUsers={totalUsers}

                  />
                </div>
              </div>

            </div> */}
          </div>

          <div className="dashboard-table-wrapper mt-10">
            <h2 className=" text-xl">Most Events By Users</h2>
            <div className="table w-full">
              <table >
                <tr
                  style={{
                    backgroundColor: "transparent",
                    borderBottom: "0.5px solid rgba(124, 124, 124, 0.27)",
                  }}
                >
                  <th className=" text-black" style={{ color: "black", fontSize: "18px", fontWeight: "bold" }}>Name</th>
                  <th className=" text-black" style={{ color: "black", fontSize: "18px", fontWeight: "bold" }}>Email</th>
                  <th className=" text-black" style={{ color: "black", fontSize: "18px", fontWeight: "bold" }}>Events</th>
                </tr>
                {mostUserEvents && mostUserEvents.map((usr, index) => {
                  return <MostUserEventsTbody
                    key={index}
                    username={usr.Name}
                    noOfEvents={usr.events.length}
                    email={usr.Email}
                  />
                })

                }

              </table>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
