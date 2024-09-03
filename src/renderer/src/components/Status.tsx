import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Channels } from "../../../shared/contants";

const Status: React.FC = () => {
  const navigate = useNavigate();
  const [isConnected, setIsConnected] = useState<boolean>(false);

  const handleDisconnect = async () => {
    await window.electron.ipcRenderer.invoke(Channels.DISCONNECT)
    setIsConnected(false);
    navigate(`/`);
  }

  const checkConnectionStatus = async () => {
    const result = await window.electron.ipcRenderer.invoke(Channels.HEARTBEAT)
    setIsConnected(result);
  }

  useEffect(() => {
    setInterval(checkConnectionStatus, 5000);
  }, []);

  return (
    <div className={"statusSection"}>
      <button hidden={!isConnected} className="disconnectButton" onClick={() => handleDisconnect()}>
        Disconnect
        <span className='visually-hidden'>Disconnect from the current database</span>
      </button>
      <div className={"statusContainer"}>
        <div className={"status"}>
          <div className={"statusBackground"}>
            <div className={"statusText"}>API</div>
            {
              isConnected ? <div className={"statusIndicatorGreen"} aria-hidden="true" /> : <div className={"statusIndicatorRed"} aria-hidden="true" />
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default Status;
