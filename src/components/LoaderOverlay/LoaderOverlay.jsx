import React from "react";
import { PacmanLoader } from "react-spinners";

const LoaderOverlay = () => {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
      }}
    >
      <div className="spinner-border text-light" role="status">
        <span className="visually-hidden">
          <PacmanLoader color="red" />
        </span>
      </div>
    </div>
  );
};

export default LoaderOverlay;
