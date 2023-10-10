import dummy_image from "../assets/dummy_image.jpeg";
import "../styles/profile-picture.css";
import ProfileIcon from "../assets/profileIcon.svg";
import { auth } from "../firebase";

const ProfilePicture = (props) => {
  const user=auth.currentUser

  return (
    <div className="profile-picture" style={props.style}>
      
     
    </div>
  );
};

export default ProfilePicture;
