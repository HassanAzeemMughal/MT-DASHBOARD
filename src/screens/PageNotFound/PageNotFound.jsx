import React from "react";
import PageNotFount from "../../assets/page-misc-error-light.png";
import { Link } from "react-router-dom";

const PageNotFound = () => {
  return (
    <div
      className="container-xxl container-p-y"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <div className="misc-wrapper text-center">
        <h1
          className="mb-2 mx-2"
          style={{ lineHeight: "6rem", fontSize: "6rem" }}
        >
          404
        </h1>
        <h4 className="mb-2 mx-2">Page Not Found️ ⚠️</h4>
        <p className="mb-6 mx-2">
          We couldn't find the page you are looking for
        </p>
        <Link to={"/dashboard"} className="btn btn-primary">
          Back to home
        </Link>
        <div className="mt-6">
          <img
            src={PageNotFount}
            alt="page-misc-error-light"
            width="500"
            className="img-fluid"
            data-app-light-img="illustrations/page-misc-error-light.png"
            data-app-dark-img="illustrations/page-misc-error-dark.png"
          />
        </div>
      </div>
    </div>
  );
};

export default PageNotFound;
