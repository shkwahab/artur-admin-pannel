import { useNavigate, NavLink } from "react-router-dom";
import Logo from "./Logo";
import { navigationOptions } from "../constants/navigationOptions";
import signOutImage from "../assets/logoutIcon.svg";
import "../styles/navigationPanel.css";
import { useContext } from "react";
import { AuthContext } from "../contexts/userContext";
import LogoImg from "../assets/icon.png";
import {ImArrowRight2 } from "react-icons/im"

const NavigationPanel = (props) => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const signOut = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="navigation-panel">
      <div className="">
        <img src={LogoImg} className=" w-24" />
      </div>
      <div className="options-container">
        <ul>
          {navigationOptions.map((option) => {
            return (
              <li className="text-black hover:text-black">
                <NavLink
                  to={option.path}
                  className={({ isActive }) =>
                    isActive
                      ? "link-active center-container"
                      : "link center-container"
                  }
                  children={({ isActive }) => {
                    if (isActive) {
                      return (
                        <>
                          <div className="active-mark active"></div>
                          <span>{option.name}</span>
                        </>
                      );
                    } else {
                      return (
                        <>
                          <div className="active-mark inactive"></div>
                          <span>{option.name}</span>
                        </>
                      );
                    }
                  }}
                ></NavLink>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="sign-out-container">
        <ImArrowRight2 className=" mx-2 text-xl font-bol text-[#887010]"/>
        <button  className="sign-out" onClick={signOut}>
          Sign out
        </button>
      </div>
    </div>
  );
};

export default NavigationPanel;
