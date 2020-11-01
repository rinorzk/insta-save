import React, { useState, useEffect, useRef } from "react";
import request from "request-promise";
import cheerio from "cheerio";
import config from "../../config";

import classes from "./Dashboard.module.scss";
import Sidebar from "../../components/Sidebar/Sidebar";
import FeedContainer from "../../containers/FeedContainer/FeedContainer";
import ProfileContainer from "../../containers/ProfileContainer/ProfileContainer";
import AdsContainer from "../../containers/AdsContainer/AdsContainer";
import instaLogo from "../../assets/Logo.svg";
import Home from '../../assets/home.svg';
import Profile from '../../assets/menu.svg';
import Advertise from '../../assets/star.svg'
import TermsOfServices from "../TermsOfServices/TermsOfServices";
import PrivacyPolicy from "../PrivacyPolicy/PrivacyPolicy";

function Dashboard() {
  const [homePageContent, setHomePageContent] = useState("Home");
  const [toggle, setToggle] = useState(false);
  const [profile, setProfile] = useState({});
  const [edges, setEdges] = useState([])
  const [searchValue, setSearchValue] = useState("");
  const [postType, setPostType] = useState("");

  const inputRef = useRef()

  useEffect(() => {
    getProfileData();
  }, []);

  // RENDER WHICH HOME PAGE IS CURRENT
  const renderHomeContent = () => {
    switch (homePageContent) {
      case "Home":
        return <FeedContainer postType={postType} changePostType={(e) => setPostType(e)} searchValue={searchValue} changeInputValue={(e) => setSearchValue(e)} inputRef={inputRef} />;
      case "Profile":
        return <ProfileContainer edges={edges} profilePic={profile.profile_pic} isSearched={false} />;
      case "Advertise":
        return <AdsContainer />;
      case "TOS":
        return <TermsOfServices />;
      case "Privacy":
        return <PrivacyPolicy />
      default:
        break;
    }
  };

  const getProfileData = async () => {
    const BASE_URL = `https://www.instagram.com/${config.profileUsername}`;

    let response = null;
    try {
      response = await request(BASE_URL);
    } catch (error) {
      console.log(error);
    }

    let $ = cheerio.load(response);
    let script = $('script[type="text/javascript"]').eq(3).html();
    let script_regex = /window._sharedData = (.+);/g.exec(script);
    let { entry_data: data } = JSON.parse(script_regex[1]);
    console.log(data);

    let {
      ProfilePage: {
        [0]: {
          graphql: {
            user: {
              full_name: profile_name,
              username: profile_username,
              profile_pic_url: profile_picture,
              edge_follow: profile_follows,
              edge_followed_by: profile_followers,
              edge_owner_to_timeline_media: profile_posts,
              edge_owner_to_timeline_media: { edges }
            },
          },
        },
      },
    } = data;

    setProfile({
      name: profile_name,
      username: profile_username,
      profile_pic: profile_picture,
      follow: profile_follows.count,
      followedBy: profile_followers.count,
      posts: profile_posts.count,
    });

    setEdges(edges)
  };

  const toggleIcon = () => {
    if (!toggle) {
      document.getElementsByTagName("body")[0].style.overflow = "hidden";
      setToggle(!toggle)
    } else {
      setToggle(!toggle)
      document.getElementsByTagName("body")[0].style.overflow = "scroll";
    }
  }

  const clickedSideLink = (e) => {
    setHomePageContent(e);
    setToggle(false)
    if (!toggle) {
      document.getElementsByTagName("body")[0].style.overflow = "hidden";
    } else {
      document.getElementsByTagName("body")[0].style.overflow = "scroll";
    }
  }

  var SI_SYMBOL = ["", "k", "M", "G", "T", "P", "E"];

  function shortNumberHandler(number){
    var tier = Math.log10(number) / 3 | 0;

    if(tier == 0) return number;

    var suffix = SI_SYMBOL[tier];
    var scale = Math.pow(10, tier * 3);

    var scaled = number / scale;

    return scaled.toFixed(1) + suffix;
}

  const backToHomeHandler = () => {
    setHomePageContent("Home");
    // inputRef.current.value = "";
    setSearchValue("")
    setPostType("")
    setToggle(false)
  }

  return (
    <div className={classes.container}>
      <Sidebar clicked={(e) => setHomePageContent(e)} profile={profile} homePageContent={homePageContent} returnToHome={backToHomeHandler} />

      {/* NavBar for mobile */}
      <div className={classes.navBarMobile}>
        <img src={instaLogo} onClick={backToHomeHandler} />
        <div
          id={classes.navicon4}
          className={toggle ? classes.open : classes.closed}
          onClick={toggleIcon}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>

      <div
        className={classes.sideBarMobile}
        style={{ right: toggle ? "0%" : "-100%" }}
      >
        <a className={classes.profilePicHolder} href={`https://www.instagram.com/${profile.username}`}>
          <div className={classes.profilePicWrapper}>
            <img src={profile.profile_pic} />
          </div>
        </a>
        <p className={classes.profileName}>{profile.name}</p>
        <a className={classes.profileUsername} href={`https://www.instagram.com/${profile.username}`}>@{profile.username}</a>

        <div className={classes.profileStats}>
          <div style={{ borderRight: "1px solid #E4E4E4", paddingRight: "10px" }}>
            <p className={classes.statInfo}>{shortNumberHandler(profile.posts)}</p>
            <p className={classes.statType}>Posts</p>
          </div>
          <div style={{ paddingLeft: "10px", paddingRight: "10px" }}>
            <p className={classes.statInfo}>{shortNumberHandler(profile.followedBy)}</p>
            <p className={classes.statType}>Followers</p>
          </div>
          <div style={{ borderLeft: "1px solid #E4E4E4", paddingLeft: "10px" }}>
            <p className={classes.statInfo}>{shortNumberHandler(profile.follow)}</p>
            <p className={classes.statType}>Following</p>
          </div>
        </div>

        <a className={classes.followButton} href={`https://www.instagram.com/${config.profileUsername}`}>Follow</a>

        <div className={classes.menuLinkHolder}>
          <div className={classes.menuLinkMobile} style={{ backgroundColor: homePageContent == "Home" ? "#EBEBEB" : "white" }} onClick={() => backToHomeHandler("Home")}>
            <img src={Home} />
            <a>Home</a>
            <div className={classes.manuLinkLine} style={{ display: homePageContent == "Home" ? "block" : "none" }}></div>
          </div>
          <div className={classes.menuLinkMobile} style={{ backgroundColor: homePageContent == "Profile" ? "#EBEBEB" : "white" }} onClick={() => clickedSideLink("Profile")}>
            <img src={Profile} />
            <a>Profile</a>
            <div className={classes.manuLinkLine} style={{ display: homePageContent == "Profile" ? "block" : "none" }}></div>
          </div>
          <div className={classes.menuLinkMobile} style={{ backgroundColor: homePageContent == "Advertise" ? "#EBEBEB" : "white" }} onClick={() => clickedSideLink("Advertise")}>
            <img src={Advertise} />
            <a>Advertise</a>
            <div className={classes.manuLinkLine} style={{ display: homePageContent == "Advertise" ? "block" : "none" }}></div>
          </div>
        </div>

        <div className={classes.privacyHolder}>
          <a onClick={() => clickedSideLink("TOS")}>TOS</a>
          <a onClick={() => clickedSideLink("Privacy")}>Privacy Policy</a>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className={classes.homeContentContainer}>{renderHomeContent()}</div>
    </div>
  );
}

export default Dashboard;
