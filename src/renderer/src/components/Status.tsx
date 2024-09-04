import React from "react";

type StatusProps = {
  isConnected: boolean;
  disconnectHandler(): void;
}

const Status: React.FC<StatusProps> = (props: StatusProps) => {

  return (
    <div className={"statusSection"}>
      <button hidden={!props.isConnected} className="disconnectButton" onClick={() => props.disconnectHandler()}>
        Disconnect
        <span className='visually-hidden'>Disconnect from the current database</span>
      </button>
      <div className={"statusContainer"}>
        <div className={"status"}>
          <div className={"statusBackground"}>
            <div className={"statusText"}>API</div>
            {
              props.isConnected ? <div className={"statusIndicatorGreen"} aria-hidden="true" /> : <div className={"statusIndicatorRed"} aria-hidden="true" />
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default Status;
