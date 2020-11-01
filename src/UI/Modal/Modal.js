import React from "react";

import classes from "./Modal.module.css";
import Backdrop from "../Backdrop/Backdrop";

const Modal = (props) => {

  return (
    <React.Fragment>
      <Backdrop show={props.show} clicked={props.modalClosed} />
      <div
        className={classes.Modal}
        style={{
          display: props.show ? "flex" : "none",
          opacity: props.show ? "1" : "0",
          top: props.top,
        }}
      >
        {props.children}
      </div>
    </React.Fragment>
  );
};

export default Modal;
