import React, { useState } from "react";
import { AccessTokenConnectionOptions, ConnectionOptions, ConnectionStatus, ConnectionType, NoAuthConnectionOptions, UsernamePasswordConnectionOptions } from "../../shared/chroma-service";

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

  const [username, setUsername] = useState<string | undefined>(undefined);
  const [password, setPassword] = useState<string | undefined>(undefined);
  const [accessToken, setAccessToken] = useState<string | undefined>(undefined);

  const [connectionType, setConnectionType] = useState<ConnectionType>(ConnectionType.NO_AUTH);

  const handleConnectionTypeChanged = (connectionType: ConnectionType) => {
    setConnectionType(connectionType);

    setUsername(undefined);
    setPassword(undefined);
    setAccessToken(undefined);
    setErrorMessage(undefined);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmit = async (event: any) => {
    event.preventDefault();

    let credentials: NoAuthConnectionOptions | UsernamePasswordConnectionOptions | AccessTokenConnectionOptions;
    if (connectionType === ConnectionType.NO_AUTH) {
      credentials = {}
    } else if (connectionType === ConnectionType.USERNAME_PASSWORD) {
      credentials = {
        username,
        password
      }
    } else {
      credentials = {
        accessToken
      }
    }

    const connectionOptions: ConnectionOptions = {
        connectionString,
        connectionType,
        credentials
    }

    const result: ConnectionStatus = await window.chromadb.connect(connectionOptions);

    if (result.connected) {
      setErrorMessage(undefined);
      setUsername(undefined);
      setPassword(undefined);
      setAccessToken(undefined);
      props.connectHandler(connectionString);
    } else {
      setErrorMessage(result.errorMessage);
      console.log(`failed to connect with error message: ${result.errorMessage}`);
    }
  }

  let authFormOptions;
  if (connectionType == ConnectionType.NO_AUTH) {
    authFormOptions = <></>
  } else if (connectionType == ConnectionType.USERNAME_PASSWORD) {
    authFormOptions = 
      <>
        <div className={"inputGroup"}>
          <div className={"inputWrapper"}>
            <label htmlFor="username" className={"inputLabel"}>
              Username
            </label>
            <input type="text" id="username" className="inputField" aria-label="usernameInput" value={username} onChange={(e) => setUsername(e.target.value)} />
          </div>
        </div>

        <div className={"inputGroup"}>
          <div className={"inputWrapper"}>
            <label htmlFor="password" className={"inputLabel"}>
              Password
            </label>
            <input type="text" id="password" className="inputField" aria-label="passwordInput" value={password} onChange={(e) => setPassword(e.target.value)} />
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
          <input type="text" id="token" className="inputField" aria-label="accessTokenInput" value={accessToken} onChange={(e) => setAccessToken(e.target.value)} />
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
              <label className={"inputLabel"}>
                Connection String
              </label>
              <input
                type="text"
                aria-label="connectionStringInput"
                className={"inputField"}
                value={connectionString}
                onChange={(e) => setConnectionString(e.target.value)} />
            </div>
          </div>

          <div className={"dropdownGroup"}>
            <div className={"dropdownWrapper"}>
              <label className={"inputLabel"}>
                Authentication
              </label>
              <select className={"dropdown"} 
                aria-label="authenticationSelect"
                value={connectionType}
                onChange={e => handleConnectionTypeChanged(e.target.value as ConnectionType)}
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
