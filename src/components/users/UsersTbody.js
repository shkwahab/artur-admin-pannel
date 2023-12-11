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
    id: event.id ? event.id : "",
    Title: event.Title ? event.Title : "",
    Total: event.Total ? event.Total : "",
    Rating: event.rating ? event.rating : "None",
    Description: event.Description ? event.Description : "",
    StartDate: event.StartDate ? event.StartDate : "",
    StartTime: event.StartTime ? event.StartTime : "",
    EndDate: event.EndDate ? event.EndDate : "",
    EndTime: event.EndTime ? event.EndTime : "",
    Website: event.Website ? event.Website : "",
    Location: event.Location ? event.Location : "",
    ArtistName: event.ArtistAddress ? event.ArtistData.map((artist) => {
      return artist.ArtistName
    }) : "",
    ArtistWebsite: event.ArtistWebsite ? event.ArtistData.map((artist) => {
      return artist.Website
    }) : "",
    ArtistAddress: event.ArtistAddress ? event.ArtistData.map((artist) => {
      return artist.ArtistAddress
    }) : ""
  }));
  const [updateEvents, setEvents] = useState(Events)

  console.log("Event Arist Name", Events)
  const showModal = () => {
    setmodal(true);
  };

  const hideModal = () => setmodal(false);

  const deleteuser = async () => {
    setIsLoading(true);
    const deletedocument = doc(db, "UserData", props.id);
    await deleteDoc(deletedocument);
    window.location.reload(true);
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

  const updateEventTitle = (e) => {
    const updatedEvents = [...updateEvents];
    updatedEvents[eventIndex].Title = e.target.value;
    setEvents(updatedEvents);
  };

  const updateEventDescription = (e) => {
    const updatedEvents = [...updateEvents];
    updatedEvents[eventIndex].Description = e.target.value;
    setEvents(updatedEvents);
  };

  const updateEventRating = (e) => {
    const updatedEvents = [...updateEvents];
    updatedEvents[eventIndex].Rating = e.target.value;
    setEvents(updatedEvents);
  };
  const updateEventTotal = (e) => {
    const updatedEvents = [...updateEvents];
    updatedEvents[eventIndex].Total = e.target.value;
    setEvents(updatedEvents);
  };
  const updateEventLocation = (e) => {
    const updatedEvents = [...updateEvents];
    updatedEvents[eventIndex].Location = e.target.value;
    setEvents(updatedEvents);
  };
  const updateEventWebsite = (e) => {
    const updatedEvents = [...updateEvents];
    updatedEvents[eventIndex].Website = e.target.value;
    setEvents(updatedEvents);
  };
  const updateEventStartDate = (e) => {
    const updatedEvents = [...updateEvents];
    updatedEvents[eventIndex].StartDate = e.target.value;
    setEvents(updatedEvents);
  };
  const updateEventStartTime = (e) => {
    const updatedEvents = [...updateEvents];
    updatedEvents[eventIndex].StartTime = e.target.value;
    setEvents(updatedEvents);
  };

  const updateEventEndDate = (e) => {
    const updatedEvents = [...updateEvents];
    updatedEvents[eventIndex].EndDate = e.target.value;
    setEvents(updatedEvents);
  };
  const updateEventEndTime = (e) => {
    const updatedEvents = [...updateEvents];
    updatedEvents[eventIndex].EndTime = e.target.value;
    setEvents(updatedEvents);
  };
  const updateEventArtistName = (e) => {
    const updatedEvents = [...updateEvents];
    const artistNames = e.target.value.split(',').map((name) => name.trim());
    const maxLength = Math.max(artistNames.length, updatedEvents[eventIndex].ArtistAddress.length, updatedEvents[eventIndex].ArtistWebsite.length);

    // Pad ArtistName, ArtistAddress, and ArtistWebsite arrays
    updatedEvents[eventIndex].ArtistName = artistNames;
    updatedEvents[eventIndex].ArtistAddress = padArray(updatedEvents[eventIndex].ArtistAddress, maxLength);
    updatedEvents[eventIndex].ArtistWebsite = padArray(updatedEvents[eventIndex].ArtistWebsite, maxLength);
    setEvents(updatedEvents);
  };

  // Function to pad an array to a certain length with empty strings
  function padArray(array, length) {
    if (array.length < length) {
      const emptyStrings = new Array(length - array.length).fill('');
      return [...array, ...emptyStrings];
    }
    return array.slice(0, length); // Truncate if it's longer
  }


  const updateEventArtistAddress = (e) => {
    const updatedEvents = [...updateEvents];
    updatedEvents[eventIndex].ArtistAddress = e.target.value.split(',').map((address) => address.trim());
    setEvents(updatedEvents);
  };

  const updateEventArtistWebsite = (e) => {
    const updatedEvents = [...updateEvents];
    updatedEvents[eventIndex].ArtistWebsite = e.target.value.split(',').map((website) => website.trim());
    setEvents(updatedEvents);
  };


  const updateuser = async (uid) => {
    setIsLoading(true);
    let userArray = {
      AccountType: nameupdate,
      Email: emailupdate,
      Name: usernameupdate,
      Source: sourceupdate
    };
    const updatedocument = doc(db, "UserData", uid);

    const res = await updateDoc(updatedocument, userArray);
    console.log(res)
    hideModal();
    window.location.reload();
    setIsLoading(false);
  };



  const updateEvent = async () => {
    const userId = props.id;
    const eventIndexToUpdate = eventIndex;
    const eventRef = doc(db, "UserData", userId, "EventData", Events[eventIndex].id);

    const artistNames = typeof updateEvents[eventIndex].ArtistName === 'string'
      ? updateEvents[eventIndex].ArtistName.split(',').map(name => name.trim())
      : Array.isArray(updateEvents[eventIndex].ArtistName)
        ? updateEvents[eventIndex].ArtistName
        : [updateEvents[eventIndex].ArtistName];

    const artistAddresses = typeof updateEvents[eventIndex].ArtistAddress === 'string'
      ? updateEvents[eventIndex].ArtistAddress.split(',').map(address => address.trim())
      : Array.isArray(updateEvents[eventIndex].ArtistAddress)
        ? updateEvents[eventIndex].ArtistAddress
        : [updateEvents[eventIndex].ArtistAddress];

    const artistWebsites = typeof updateEvents[eventIndex].ArtistWebsite === 'string'
      ? updateEvents[eventIndex].ArtistWebsite.split(',').map(website => website.trim())
      : Array.isArray(updateEvents[eventIndex].ArtistWebsite)
        ? updateEvents[eventIndex].ArtistWebsite
        : [updateEvents[eventIndex].ArtistWebsite];

    const updatedEvent = {
      Title: updateEvents[eventIndex].Title,
      Total: updateEvents[eventIndex].Total,
      Rating: updateEvents[eventIndex].Rating,
      Description: updateEvents[eventIndex].Description,
      StartDate: updateEvents[eventIndex].StartDate,
      StartTime: updateEvents[eventIndex].StartTime,
      EndDate: updateEvents[eventIndex].EndDate,
      EndTime: updateEvents[eventIndex].EndTime,
      Website: updateEvents[eventIndex].Website,
      Location: updateEvents[eventIndex].Location,
      ArtistData: artistNames.map((name, index) => ({
        ArtistName: name,
        ArtistAddress: artistAddresses[index],
        Website: artistWebsites[index],
      })),
    };

    console.log(updatedEvent)
    await updateDoc(eventRef, updatedEvent);
    setshowEventModal(false);
    window.location.reload();
    setIsLoading(false);
  };
  const deletePrompt = `Do you want to delete`
  const [deleteWarning, setWarning] = useState('no')
  const [deleteModal, setDeleteModal] = useState(false)
  const delUser = async () => {
    setDeleteModal(true)
    console.log(deleteWarning)
    if (deleteWarning === 'yes') {
      deleteuser();
    } else {
      setWarning('no')
    }
  }


  return (
    <>
      <tr className="relative">
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
          <button
            onClick={() => {
              delUser()
              // setshowEventModal(true)
              // deleteuser()

            }}
            className="decline"
            style={{ cursor: "pointer", backgroundColor: "#887010", color: "#000" }}
          >
            Delete
          </button>
        </td>
        <div id="deleteModal" tabindex="-1" aria-hidden="true" className={`${deleteModal ? "" : "hidden"} overflow-hidden absolute -top-20  right-0 left-[200px] z-50 justify-center items-center`}>
          <div className="relative p-4 w-full max-w-md h-full md:h-auto">
            <div className="relative p-4 text-center bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5">
              <button type="button" className="text-gray-400 absolute top-2.5 right-2.5 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="deleteModal">
                <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                <span className="sr-only">Close modal</span>
              </button>
              <p className="mb-4 text-gray-500 dark:text-gray-300">Are you sure you want to delete this user?</p>
              <div className="flex justify-center items-center space-x-4">
                <button onClick={() => {
                  setWarning('no')
                  setDeleteModal(false)

                }} data-modal-toggle="deleteModal" type="button" className="py-2 px-3 text-sm font-medium text-gray-500 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-primary-300 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600">
                  No, cancel
                </button>
                <button onClick={() => {
                  setWarning('yes')
                  setDeleteModal(false)
                }} type="submit" className="py-2 px-3 text-sm font-medium text-center text-white bg-red-600 rounded-lg hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 dark:bg-red-500 dark:hover:bg-red-600 dark:focus:ring-red-900">
                  Yes, I'm sure
                </button>
              </div>
            </div>
          </div>
        </div>

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
                    // value={updateEvents[eventIndex].Title}
                    value={updateEvents[eventIndex].Title}
                    changeHandler={updateEventTitle}
                  />
                </div>
                <div className="user-modal-input-label-wrapper text-white">
                  <span className="user-modal-label">Description:</span>
                  <InputField
                    style={{ width: "100%" }}
                    fieldStyle={{ height: "45px" }}
                    value={updateEvents[eventIndex].Description}
                    changeHandler={updateEventDescription}
                  />
                </div>
                <div className="user-modal-input-label-wrapper text-white">
                  <span className="user-modal-label">Rating:</span>
                  <InputField
                    style={{ width: "100%" }}
                    fieldStyle={{ height: "45px" }}
                    value={updateEvents[eventIndex].Rating}
                    changeHandler={updateEventRating}
                  />
                </div>
                <div className="user-modal-input-label-wrapper text-white">
                  <span className="user-modal-label">Total:</span>
                  <InputField
                    style={{ width: "100%" }}
                    fieldStyle={{ height: "45px" }}
                    value={updateEvents[eventIndex].Total}
                    changeHandler={updateEventTotal}
                  />
                </div>
              </div>


              <div className="user-modal-inputs-wrapper">
                <div className="user-modal-input-label-wrapper text-white">
                  <span className="user-modal-label">Location:</span>
                  <InputField
                    style={{ width: "100%" }}
                    fieldStyle={{ height: "45px" }}
                    value={updateEvents[eventIndex].Location}
                    changeHandler={updateEventLocation}
                  />
                </div>
                <div className="user-modal-input-label-wrapper text-white">
                  <span className="user-modal-label">Website:</span>
                  <InputField
                    style={{ width: "100%" }}
                    fieldStyle={{ height: "45px" }}
                    value={updateEvents[eventIndex].Website}
                    changeHandler={updateEventWebsite}
                  />
                </div>
                <div className="user-modal-input-label-wrapper text-white">
                  <span className="user-modal-label">Start Date:</span>
                  <InputField
                    style={{ width: "100%" }}
                    fieldStyle={{ height: "45px" }}
                    value={updateEvents[eventIndex].StartDate}
                    changeHandler={updateEventStartDate}
                  />
                </div>
                <div className="user-modal-input-label-wrapper text-white">
                  <span className="user-modal-label">Start Time:</span>
                  <InputField
                    style={{ width: "100%" }}
                    fieldStyle={{ height: "45px" }}
                    value={updateEvents[eventIndex].StartTime}
                    changeHandler={updateEventStartTime}
                  />
                </div>
              </div>



              <div className="user-modal-inputs-wrapper">
                <div className="user-modal-input-label-wrapper text-white">
                  <span className="user-modal-label">End Date:</span>
                  <InputField
                    style={{ width: "100%" }}
                    fieldStyle={{ height: "45px" }}
                    value={updateEvents[eventIndex].EndDate}
                    changeHandler={updateEventEndDate}
                  />
                </div>
                <div className="user-modal-input-label-wrapper text-white">
                  <span className="user-modal-label">End Time:</span>
                  <InputField
                    style={{ width: "100%" }}
                    fieldStyle={{ height: "45px" }}
                    value={updateEvents[eventIndex].EndTime}
                    changeHandler={updateEventEndTime}
                  />
                </div>
                <div className="user-modal-input-label-wrapper text-white">
                  <span className="user-modal-label">Arist Name:</span>
                  <InputField
                    style={{ width: "100%" }}
                    fieldStyle={{ height: "45px" }}
                    value={updateEvents[eventIndex].ArtistName}
                    changeHandler={updateEventArtistName}
                  />
                </div>
                <div className="user-modal-input-label-wrapper text-white">
                  <span className="user-modal-label">Artist Address:</span>
                  <InputField
                    style={{ width: "100%" }}
                    fieldStyle={{ height: "45px" }}
                    value={updateEvents[eventIndex].ArtistAddress}
                    changeHandler={updateEventArtistAddress}
                  />
                </div>

              </div>

              <div className=" flex justify-center my-4">
                <div className=" text-white">
                  <span className="">Artist Website:</span>
                  <InputField
                    value={updateEvents[eventIndex].ArtistWebsite}
                    changeHandler={updateEventArtistWebsite}
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
        {Events.length > 0 && (
          <div className=" flex justify-center">
            <button
              className="user-modal-btn"
              style={{ margin: "10px 20px", cursor: "pointer" }}
              onClick={updateEvent}
            >
              Update Event
            </button>
          </div>
        )}

      </Modal>
    </>
  );
}
