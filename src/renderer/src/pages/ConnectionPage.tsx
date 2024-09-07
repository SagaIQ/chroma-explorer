import React, { useState } from "react";
import { Channels } from '../../../shared/contants'
import { ConnectionOptions, ConnectionStatus, ConnectionType } from "../../../shared/chroma-service";

type ConnectionPageProps = {
  connectHandler(connectionString: string): void;
}

export const ConnectionPage: React.FC<ConnectionPageProps> = (props: ConnectionPageProps) => {
  const [connectionString, setConnectionString] = useState<string>('http://localhost:8001');
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);

  const connectionTypes: Array<{name: string; value: ConnectionType; }> = [
    { name: 'None', value: ConnectionType.NO_AUTH },
    { name: 'Username / Password', value: ConnectionType.USERNAME_PASSWORD },
    { name: 'Access Token', value: ConnectionType.ACCESS_TOKEN }
  ]

  const [selectedConnectionType, setSelectedConnectionType] = useState<ConnectionType>(ConnectionType.NO_AUTH);

  const handleConnectionStringChange = (event) => {
    setConnectionString(event.target.value);
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    const connectionOptions: ConnectionOptions = {
        connectionString,
        connectionType: selectedConnectionType,
        connectionOptions: {}
    }

    const result: ConnectionStatus = await window.electron.ipcRenderer.invoke(Channels.CONNECT, connectionOptions);

    if (result.connected) {
      setErrorMessage(undefined);
      props.connectHandler(connectionString);
    } else {
      setErrorMessage(result.errorMessage);
      console.log(`failed to connect with error message: ${result.errorMessage}`);
    }
  }

  let authFormOptions;
  if (selectedConnectionType == ConnectionType.NO_AUTH) {
    authFormOptions = <></>
  } else if (selectedConnectionType == ConnectionType.USERNAME_PASSWORD) {
    authFormOptions = 
      <>
        <div className={"inputGroup"}>
          <div className={"inputWrapper"}>
            <label htmlFor="username" className={"inputLabel"}>
              Username
            </label>
            <input type="text" id="username" className="inputField" aria-label="Username" />
          </div>
        </div>

        <div className={"inputGroup"}>
          <div className={"inputWrapper"}>
            <label htmlFor="password" className={"inputLabel"}>
              Password
            </label>
            <input type="text" id="password" className="inputField" aria-label="Password" />
          </div>
        </div>
      </>
  } else {
    authFormOptions = 
      <div className={"inputGroup"}>
        <div className={"inputWrapper"}>
          <label htmlFor="token" className={"inputLabel"}>
            Token
          </label>
          <input type="text" id="token" className="inputField" aria-label="Token" />
        </div>
      </div>
  }

  return (
    <div className="formContent">
      <div className={"formContainer"}>
        <form className={"formWrapper"}  onSubmit={handleSubmit}>
          <div className={"formHeader"}>
            <h2 className={"formTitle"}>Get Started</h2>
          </div>
          <div className={"inputGroup"}>
            <div className={"inputWrapper"}>
              <label htmlFor="connectionString" className={"inputLabel"}>
                Connection String
              </label>
              <input
                type="text"
                id="connectionString"
                className={"inputField"}
                aria-label="Connection String"
                placeholder="http://localhost:8001"
                onChange={handleConnectionStringChange}
              />
            </div>
          </div>

          <div className={"dropdownGroup"}>
            <div className={"dropdownWrapper"}>
              <label htmlFor="authentication" className={"inputLabel"}>
                Authentication
              </label>
              <select id="authentication" className={"dropdown"} aria-label="Authentication"
                value={selectedConnectionType}
                onChange={e => setSelectedConnectionType(e.target.value as ConnectionType)}
              >
                {connectionTypes.map(connectionType => (
                  <option id={connectionType.value} value={connectionType.value} className={"dropdownItem"}>{connectionType.name}</option>
                ))}
              </select>
            </div>
          </div>
          
          {authFormOptions}

          <div className={"buttonWrapper"}>
            <span className={"buttonText"}>Save and Continue</span>
            <button type="submit" className={"button-primary"}>
              Connect
            </button>
          </div>
          {errorMessage ? <h4 style={{color: 'red'}}>{errorMessage}</h4> : <></>}
        </form>
      </div>
    </div>
  );
};
