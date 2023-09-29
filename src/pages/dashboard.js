import React, { useEffect } from "react";
import "../styles/dashboard.css";
import { db } from "../firebase";
import {
  collection,
  getCountFromServer,
  getDocs,
  Firestore,
  query,
} from "firebase/firestore";
import moment from "moment";
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




  const getAllUsers = async () => {

    try {

      const userLocations = {}; // Create an object to store revenue by location
      let totalRevenue = 0; // Initialize the total revenue


      const usersCollectionRef = collection(db, "UserData");
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
          const userLocation = event.Location; // Replace with your actual location property
          const userRevenue = event.Total; // Replace with your actual revenue property

          // Accumulate revenue by location
          userLocations[userLocation] = (userLocations[userLocation] || 0) + userRevenue;
          totalRevenue += userRevenue;

        });
      });
      const revenueDistribution = {};

      for (const location in userLocations) {
        if (userLocations.hasOwnProperty(location)) {
          const revenue = userLocations[location];
          const percentage = (revenue / totalRevenue) * 100;
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
  const totalRevenue = event.reduce((total, data) => total + data.Total, 0);
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



  return (
    <div className="dashboad">
      {/* <div>

        {JSON.stringify(user)}
      </div> */}




      <h2 className="main-heading underline">Dashboard</h2>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div>
          <div className="dashboard-top">
            <div className="dashboard-card">
              <div>
                <h4 className="card-top-heading">Total Users</h4>
                <h2>{totalUsers} Users</h2>
              </div>
              <img src={WaveIcon} />
            </div>
            <div className="dashboard-card">
              <div>
                <h4 className="card-top-heading">Total Events</h4>
                <h2>{event.length} Posts</h2>
              </div>
              <img src={WaveIcon} />
            </div>
            <div className="dashboard-card">
              <div>
                <h4 className="card-top-heading">Total Revenue</h4>
                <h2>$ {totalRevenue} </h2>
              </div>
              <img src={WaveIcon} />
            </div>

          </div>
          <div>
            <div className=" mt-10 ">
              {/* <div className="top-users-wrapper">
                <h2 className="main-heading center">Most Revenue By Users</h2>
                <div className="top-users-chart-wrapper">
                  <TopUsersChart
                    screenWidth={screenWidth}
                    usersData={mostSubscribedUsers}
                  // subsCount={mostSubscribedUsers.map(
                  //   (user) => user.subscribers.length + 1
                  // )}
                  // userLabels={mostSubscribedUsers.map((user) => user.username)}
                  />
                </div>
              </div> */}

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

            </div>
          </div>

          <div className="dashboard-table-wrapper">
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
