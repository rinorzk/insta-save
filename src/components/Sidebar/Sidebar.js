import React, { useEffect, useState } from "react";

import classes from "./Sidebar.module.scss";
import Logo from "../../assets/Logo.svg";
import config from '../../config'
import Home from '../../assets/home.svg';
import Profile from '../../assets/menu.svg';
import Advertise from '../../assets/star.svg'

function Sidebar(props) {
  const { profile } = props;

  var SI_SYMBOL = ["", "k", "M", "G", "T", "P", "E"];

  function shortNumberHandler(number) {
    var tier = (Math.log10(number) / 3) | 0;

    if (tier == 0) return number;

    var suffix = SI_SYMBOL[tier];
    var scale = Math.pow(10, tier * 3);

    var scaled = number / scale;

    return scaled.toFixed(1) + suffix;
  }

  return (
    <div className={classes.container}>
      <img src={Logo} className={classes.logo} onClick={() => props.returnToHome("Home")}/>

      <a className={classes.profilePicHolder} href={`https://www.instagram.com/${config.profileUsername}`}>
        <div className={classes.profilePicWrapper}>
          <img src={profile.profile_pic} />
        </div>
      </a>
      <p className={classes.profileName}>{profile.name}</p>
      <a className={classes.profileUsername} href={`https://www.instagram.com/${config.profileUsername}`}>@{profile.username}</a>

      <div className={classes.profileStats}>
        <div style={{ borderRight: "1px solid #E4E4E4", paddingRight: "10px" }}>
          <p className={classes.statInfo}>
            {shortNumberHandler(profile.posts)}
          </p>
          <p className={classes.statType}>Posts</p>
        </div>
        <div style={{ paddingLeft: "10px", paddingRight: "10px" }}>
          <p className={classes.statInfo}>
            {shortNumberHandler(profile.followedBy)}
          </p>
          <p className={classes.statType}>Followers</p>
        </div>
        <div style={{ borderLeft: "1px solid #E4E4E4", paddingLeft: "10px" }}>
          <p className={classes.statInfo}>
            {shortNumberHandler(profile.follow)}
          </p>
          <p className={classes.statType}>Following</p>
        </div>
      </div>

      <a
        className={classes.followButton}
        href={`https://www.instagram.com/${config.profileUsername}`}
      >
        Follow
      </a>

      <div className={classes.menuLinkHolder}>
        <div
          className={classes.menuLinkMobile}
          style={{
            backgroundColor: props.homePageContent == "Home" ? "#EBEBEB" : "#F9F9F9",
          }}
          onClick={() => props.returnToHome("Home")}
        >
          <img src={Home} />
          <a>Home</a>
          <div
            className={classes.manuLinkLine}
            style={{ display: props.homePageContent == "Home" ? "block" : "none" }}
          ></div>
        </div>
        <div
          className={classes.menuLinkMobile}
          style={{
            backgroundColor: props.homePageContent == "Profile" ? "#EBEBEB" : "#F9F9F9",
          }}
          onClick={() => props.clicked("Profile")}
        >
          <img src={Profile} />
          <a>Profile</a>
          <div
            className={classes.manuLinkLine}
            style={{ display: props.homePageContent == "Profile" ? "block" : "none" }}
          ></div>
        </div>
        <div
          className={classes.menuLinkMobile}
          style={{
            backgroundColor:
              props.homePageContent == "Advertise" ? "#EBEBEB" : "#F9F9F9",
          }}
          onClick={() => props.clicked("Advertise")}
        >
          <img src={Advertise} />
          <a>Advertise</a>
          <div
            className={classes.manuLinkLine}
            style={{
              display: props.homePageContent == "Advertise" ? "block" : "none",
            }}
          ></div>
        </div>
      </div>

      <div className={classes.privacyHolder}>
        <a onClick={() => props.clicked("TOS")}>TOS</a>
        <a onClick={() => props.clicked("Privacy")}>Privacy Policy</a>
      </div>
    </div>
  );
}

export default Sidebar;
