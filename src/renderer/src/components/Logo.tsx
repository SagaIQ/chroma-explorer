/**
 * This code was generated by Builder.io.
 */
import React from "react";

const Logo: React.FC = () => {
  return (
    <div className={"logoWrapper"}>
      <div className={"logoMain"}>
        <div className={"logoIconWrapper"}>
          <img
            loading="lazy"
            src={`./images/logo-a.svg`}
            className={"logoIcon"}
            alt=""
          />
          <img
            loading="lazy"
            src="./images/logo-b.svg"
            className={"logoIcon2"}
            alt=""
          />
        </div>
        <h1 className={"logoText"}>Chroma Explorer</h1>
      </div>
    </div>
  );
};

export default Logo;
