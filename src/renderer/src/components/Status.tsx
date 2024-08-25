import React from "react";

const Status: React.FC = () => {
  return (
    <div className={"statusSection"}>
      <div className={"statusContainer"}>
        <div className={"status"}>
          <div className={"statusBackground"}>
            <div className={"statusText"}>API</div>
            <div className={"statusIndicator"} aria-hidden="true" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Status;
