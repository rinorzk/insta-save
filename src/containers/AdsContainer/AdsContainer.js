import React, { useState } from "react";

import classes from "./AdsContainer.module.scss";
import Arrow from "../../assets/light-arrow.png";

function AdsContainer() {
  const [showMultiSelect, setShowMultiSelect] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [leaderboard, setLeaderboard] = useState(false);
  const [rectangle, setRectangle] = useState(false);
  const [minimal, setMinimal] = useState(false);

  const sumbitHandler = (e) => {
    e.preventDefault();
    const emailObject = {
      name,
      email,
      message,
      position: []
    }

    if(leaderboard) {
      emailObject.position.push("Leaderboard")
    }
    if(rectangle) {
      emailObject.position.push("Rectangle")
    }
    if(minimal) {
      emailObject.position.push("Minimal")
    }

    console.log(emailObject);
  }

  return (
    <div className={classes.container}>
      <div className={classes.formHolder}>
        <p>Advertise here?</p>
        <p>If you want to advertise at our site please fill the form below.</p>
        <form className={classes.form} method="post" action="mailto:youremail@test.com">
          <input
            name="name"
            type="text"
            placeholder="Full name"
            className={classes.input}
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            name="email"
            type="email"
            placeholder="Email adress"
            className={classes.input}
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div
            className={classes.chooseInput}
            onClick={() => setShowMultiSelect(!showMultiSelect)}
          >
            Choose the ad position
            <img src={Arrow} />
          </div>
          {showMultiSelect && 
          <div className={classes.multiSelectHolder}>
            <label>
              <input
                name="Leaderboard"
                type="checkbox"
                value="Leaderboard"
                checked={leaderboard}
                onChange={() => setLeaderboard(!leaderboard)}  
              />
              Leaderboard
            </label>
            <label>
              <input
                name="Rectangle"
                type="checkbox"
                value="Rectangle"
                checked={rectangle}
                onChange={() => setRectangle(!rectangle)}
              />
              Rectangle
            </label>
            <label>
              <input
                name="Minimal"
                type="checkbox"
                value="Minimal"
                checked={minimal}
                onChange={() => setMinimal(!minimal)}
              />
              Minimal
            </label>
          </div> }
          <textarea
            placeholder="Your message"
            className={classes.input}
            id={classes.textArea}
            style={{ height: "125px" }}
            required
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            name="message"
          />
          <input
            type="submit"
            className={classes.submitButton}
            value="Send Message"
          />
        </form>
      </div>
    </div>
  );
}

export default AdsContainer;
