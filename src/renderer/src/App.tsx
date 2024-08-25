import "./App.css"
import { MainContentRoutes } from "./AppRoutes";
import Footer from "./components/Footer";
import Header from "./components/Header";
// import { useState } from "react";
// import { DBConnection } from "./components/DBConnection"
// import { DBExplorer } from "./components/DBExplorer"
// import { Channels } from '../../shared/contants'
// import { ConnectionType } from "../../shared/chroma-service";
//import { ConnectionPage } from "./pages/ConnectionPage";

function App(): JSX.Element {
  // const [isConnected, setIsConnected] = useState<boolean>(false);
  // const [connectionErrorMessage, setConnectionErrorMessage] = useState<string | undefined>(undefined);

  // const connect = async (endpoint: string) => {
  //   const result = await window.electron.ipcRenderer.invoke(Channels.CONNECT, { 
  //     endpoint,
  //     connectionType: ConnectionType.NO_AUTH,
  //     connectionOptions: {}
  //   });
  //   setIsConnected(result.connected);
  //   setConnectionErrorMessage(result.errorMessage);
  // }

  // const disconnect = async () => {
  //   await window.electron.ipcRenderer.invoke(Channels.DISCONNECT);
  //   setIsConnected(false);
  // }

  return (
    <>
    <div className={"frame"}>
        <Header />
        <main className={"mainContent"}>
          <div className={"contentWrapper"}>
            <div className={"innerContent"}>
              <div className={"contentContainer"}>
                <MainContentRoutes></MainContentRoutes>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>    
      {/* <ConnectionPage /> */}
    {/* {
      isConnected 
        ? <DBExplorer onDisconnect={disconnect} />
        : <div style={{display: "flex", alignItems: "center", justifyContent: "center", marginTop: "300px"}}>
            <DBConnection onConnect={connect} />
            <p>{connectionErrorMessage}</p>
          </div>
    } */}
    </>
  )
}

export default App
