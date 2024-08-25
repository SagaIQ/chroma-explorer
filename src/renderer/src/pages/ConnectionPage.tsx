import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Channels } from '../../../shared/contants'
import { ConnectionOptions, ConnectionStatus, ConnectionType } from "../../../shared/chroma-service";

export const ConnectionPage: React.FC = () => {
  const navigate = useNavigate();
  const [connectionString, setConnectionString] = useState<string>('http://localhost:8001');

  const handleConnectionStringChange = (event) => {
    setConnectionString(event.target.value);
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    const connectionOptions: ConnectionOptions = {
        connectionString,
        connectionType: ConnectionType.NO_AUTH,
        connectionOptions: {}
    }

    const result: ConnectionStatus = await window.electron.ipcRenderer.invoke(Channels.CONNECT, connectionOptions);

    if (result.connected) {
      navigate('/collections');
    } else {
      console.log(`failed to connect with error message: ${result.errorMessage}`);
    }
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
              <select id="authentication" className={"dropdown"} aria-label="Authentication">
                <option className={"dropdownItemSelected"}>None</option>
                <option className={"dropdownItem"}>Username / Password</option>
                <option className={"dropdownItem"}>Token Based</option>
              </select>
            </div>
          </div>

          <div className={"inputGroup"}>
            <div className={"inputWrapper"}>
              <label htmlFor="token" className={"inputLabel"}>
                Token
              </label>
              <input type="text" id="token" className="inputField" aria-label="Token" />
            </div>
          </div>

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

          <div className={"buttonWrapper"}>
            <span className={"buttonText"}>Save and Continue</span>
            <button type="submit" className={"button-primary"}>
              Connect
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
