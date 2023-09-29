import React, { useState } from "react";
import { db } from "../../firebase";
import { updateDoc, deleteDoc, doc } from "firebase/firestore";
import InputField from "../InputField";
import Modal from "../Modal";
import "../../styles/categories.css";

export default function UsersTbody(props) {
  const [modal, setmodal] = useState(false);
  const [nameupdate, setnameupdate] = useState(props.name);
  const [sourceupdate, setsourceupdate] = useState(props.Source)
  const [emailupdate, setemailupdate] = useState(props.email);
  const [usernameupdate, setusernameupdate] = useState(props.username);
  const [isLoading, setIsLoading] = useState(false);
  const updateName = (e) => setnameupdate(e.target.value);
  const updateEmail = (e) => setemailupdate(e.target.value);
  const updateUsername = (e) => setusernameupdate(e.target.value);
  const updateSource = (e) => setsourceupdate(e.target.value);
  const [showEventModal, setshowEventModal] = useState(false);
  const [eventIndex, setEventIndex] = useState(0);
  
  const Events = props.events.map((event) => ({
    Title: event.Title,
    Total: event.Total,
    Rating: event.rating ? event.rating : "None",
    Description: event.Description,
    StartDate: event.StartDate,
    StartTime: event.StartTime,
    EndDate: event.EndDate,
    EndTime: event.EndTime,
    Website: event.Website,
    Location: event.Location,
    ArtistName:event.ArtistData.map((artist)=>{
      return artist.ArtistName
    }),
    ArtistWebsite:event.ArtistData.map((artist)=>{
      return artist.Website
    }),
    ArtistAddress:event.ArtistData.map((artist)=>{
      return artist.ArtistAddress
    })
  }));
  // const [eventupateTitle,seteventTitleUpdate]=useState(props.events.forEach((event)=>return event.ArtistName))
  const eventArtistTitles = props.events.map((event) => event.ArtistData.map((artist)=> artist.ArtistName));
  const eventArtistWebsite = props.events.map((event) => event.ArtistData.map((artist)=>artist.Website));
  const eventArtistAddress = props.events.map((event) => event.ArtistData.map((artist)=>artist.ArtistAddress));

const [eventAristTitleUpdate, setEventArtistTitleUpdate] = useState(eventArtistTitles);
const [eventAristWebsiteUpdate, setEventArtistWebsiteUpdate] = useState(eventArtistWebsite);
const [eventAristAddressUpdate, setEventArtistAddressUpdate] = useState(eventArtistAddress);


console.log("Event Arist Name",Events)
  const showModal = () => {
    setmodal(true);
  };

  const hideModal = () => setmodal(false);

  const updateuser = async (uid) => {
    setIsLoading(true);
    let userArray = {
      AccountType: nameupdate,
      Email: emailupdate,
      Name: usernameupdate,
      Source: sourceupdate
    };
    const updatedocument = doc(db, "UserData", uid);
    await updateDoc(updatedocument, userArray);
    hideModal();
    window.location.reload();
    setIsLoading(false);
  };

  const showNextEvent = () => {
    if (eventIndex < Events.length - 1) {
      setEventIndex(eventIndex + 1);
    }
  };

  const showPreviousEvent = () => {
    if (eventIndex > 0) {
      setEventIndex(eventIndex - 1);
    }
  };

  return (
    <>
      <tr>
        <td>{props.username}</td>
        <td>{props.email}</td>
        <td>{props.name}</td>
        <td style={{ whiteSpace: "nowrap" }}>
          <button
            onClick={() => {
              showModal()
            }}
            style={{ cursor: "pointer" }}
            className="accept"
            id="editBtn"
          >
            Edit
          </button>
          <button
            onClick={() => setshowEventModal(true)}
            className="decline"
            style={{ cursor: "pointer", backgroundColor: "#887010", color: "#000" }}
          >
            Events
          </button>
        </td>
      </tr>

      <Modal title="Update User" show={modal} hideModal={hideModal}>
        <div className="modal-content-center">
          <div className="user-modal-inputs-wrapper">
            <div className="user-modal-input-label-wrapper text-white">
              <span className="user-modal-label">Name:</span>
              <InputField
                style={{ width: "100%" }}
                fieldStyle={{ height: "45px" }}
                placeholder="Enter Username"
                value={usernameupdate}
                changeHandler={updateUsername}
              />
            </div>
            <div className="user-modal-input-label-wrapper text-white">
              <span className="user-modal-label">Source:</span>
              <InputField
                style={{ width: "100%" }}
                fieldStyle={{ height: "45px" }}
                placeholder="Enter Source"
                value={sourceupdate}
                changeHandler={updateSource}
              />
            </div>
          </div>
          <div className="user-modal-inputs-wrapper text-white">
            <div className="user-modal-input-label-wrapper">
              <span className="user-modal-label">Account Type:</span>
              <InputField
                style={{ width: "100%" }}
                fieldStyle={{ height: "45px" }}
                placeholder="Enter Name"
                value={nameupdate}
                changeHandler={updateName}
              />
            </div>
            <div className="user-modal-input-label-wrapper text-white">
              <span className="user-modal-label">Email:</span>
              <InputField
                style={{ width: "100%" }}
                fieldStyle={{ height: "45px" }}
                placeholder="Enter Email"
                value={emailupdate}
                changeHandler={updateEmail}
              />
            </div>
          </div>

          <button
            className="user-modal-btn"
            style={{ margin: "10px 20px", cursor: "pointer" }}
            value={props.id}
            onClick={(e) => {
              e.preventDefault()
              setmodal(false)
              updateuser(props.id)
            }}
          >
            Update User
          </button>
        </div>
      </Modal>

      <Modal
        title={`${Events.length > 0 ? "View Events" : "No Event Found"}`}
        show={showEventModal}
        hideModal={() => setshowEventModal(false)}
      >

        <div className="modal-content-center">
          {Events.length > 0 && (
            <div key={eventIndex}>
              <div className="user-modal-inputs-wrapper" >
                <div className="user-modal-input-label-wrapper text-white">
                  <span className="user-modal-label">Title:</span>
                  <InputField
                    style={{ width: "100%" }}
                    fieldStyle={{ height: "45px" }}
                    value={Events[eventIndex].Title}
                  />
                </div>
                <div className="user-modal-input-label-wrapper text-white">
                  <span className="user-modal-label">Description:</span>
                  <InputField
                    style={{ width: "100%" }}
                    fieldStyle={{ height: "45px" }}
                    value={Events[eventIndex].Description}
                  />
                </div>
                <div className="user-modal-input-label-wrapper text-white">
                  <span className="user-modal-label">Rating:</span>
                  <InputField
                    style={{ width: "100%" }}
                    fieldStyle={{ height: "45px" }}
                    value={Events[eventIndex].Rating}
                  />
                </div>
                <div className="user-modal-input-label-wrapper text-white">
                  <span className="user-modal-label">Total:</span>
                  <InputField
                    style={{ width: "100%" }}
                    fieldStyle={{ height: "45px" }}
                    value={Events[eventIndex].Total}
                  />
                </div>
              </div>


              <div className="user-modal-inputs-wrapper">
                <div className="user-modal-input-label-wrapper text-white">
                  <span className="user-modal-label">Location:</span>
                  <InputField
                    style={{ width: "100%" }}
                    fieldStyle={{ height: "45px" }}
                    value={Events[eventIndex].Location}
                  />
                </div>
                <div className="user-modal-input-label-wrapper text-white">
                  <span className="user-modal-label">Website:</span>
                  <InputField
                    style={{ width: "100%" }}
                    fieldStyle={{ height: "45px" }}
                    value={Events[eventIndex].Website}
                  />
                </div>
                <div className="user-modal-input-label-wrapper text-white">
                  <span className="user-modal-label">Start Date:</span>
                  <InputField
                    style={{ width: "100%" }}
                    fieldStyle={{ height: "45px" }}
                    value={Events[eventIndex].StartDate}
                  />
                </div>
                <div className="user-modal-input-label-wrapper text-white">
                  <span className="user-modal-label">Start Time:</span>
                  <InputField
                    style={{ width: "100%" }}
                    fieldStyle={{ height: "45px" }}
                    value={Events[eventIndex].StartTime}
                  />
                </div>
              </div>



              <div className="user-modal-inputs-wrapper">
                <div className="user-modal-input-label-wrapper text-white">
                  <span className="user-modal-label">End Date:</span>
                  <InputField
                    style={{ width: "100%" }}
                    fieldStyle={{ height: "45px" }}
                    value={Events[eventIndex].EndDate}
                  />
                </div>
                <div className="user-modal-input-label-wrapper text-white">
                  <span className="user-modal-label">End Time:</span>
                  <InputField
                    style={{ width: "100%" }}
                    fieldStyle={{ height: "45px" }}
                    value={Events[eventIndex].EndTime}
                  />
                </div>
                <div className="user-modal-input-label-wrapper text-white">
                  <span className="user-modal-label">Arist Name:</span>
                  <InputField
                    style={{ width: "100%" }}
                    fieldStyle={{ height: "45px" }}
                    value={Events[eventIndex].ArtistName}
                  />
                </div>
                <div className="user-modal-input-label-wrapper text-white">
                  <span className="user-modal-label">Artist Address:</span>
                  <InputField
                    style={{ width: "100%" }}
                    fieldStyle={{ height: "45px" }}
                    value={Events[eventIndex].ArtistAddress}
                  />
                </div>
              
              </div>

              <div className=" flex justify-center my-4">
              <div className=" text-white">
                  <span className="">Artist Website:</span>
                  <InputField
                    value={Events[eventIndex].ArtistWebsite}
                  />
                </div> 
              </div>


            </div>
          )}

          {Events.length > 1 && (
            <div className="event-navigation">
              {eventIndex > 0 && (
                <button
                  onClick={showPreviousEvent}
                  className="  bg-[#887010] rounded-md p-4"
                  style={{ cursor: "pointer" }}
                >
                  Previous Event
                </button>
              )}
              {eventIndex < Events.length - 1 && (
                <button
                  onClick={showNextEvent}
                  className=" bg-[#887010]  rounded-md p-4"
                  style={{ cursor: "pointer" }}
                >
                  Next Event
                </button>
              )}
            </div>)
          }
        </div>
      </Modal>
    </>
  );
}
