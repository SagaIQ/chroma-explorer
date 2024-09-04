import "./App.css"

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MainContentRoutes } from "./AppRoutes";
import Footer from "./components/Footer";
import Header from "./components/Header";
import { Channels } from "../../shared/contants";

function App(): JSX.Element {
  const navigate = useNavigate();

  const [connectionString, setConnectionString] = useState<string | undefined>(undefined);
  const [selectedCollectionName, setSelectedCollectionName] = useState<string | undefined>(undefined);
  const [isConnected, setIsConnected] = useState<boolean>(false);

  const connectHandler = async (connectionString: string) => {
    setIsConnected(true);
    setConnectionString(connectionString);
    navigate(`/collections`);
  }

  const disconnectHandler = async () => {
    await window.electron.ipcRenderer.invoke(Channels.DISCONNECT)

    // reset state
    setIsConnected(false);
    setConnectionString(undefined);
    setSelectedCollectionName(undefined);

    // go back to connection page
    navigate(`/`);
  }

  const openCollectionHandler = (collectionName: string) => {
    setSelectedCollectionName(collectionName);
    navigate(`/collections/${collectionName}`);
  }

  const connectionStringBreadcrumbHandler = () => {
    navigate(`/collections`);
    setSelectedCollectionName(undefined);
  };

  const checkConnectionStatus = async () => {
    const result = await window.electron.ipcRenderer.invoke(Channels.HEARTBEAT)
    setIsConnected(result);
  }

  useEffect(() => { 
    setInterval(checkConnectionStatus, 5000);
  }, []);

  return (
    <div className={"frame"}>
      <Header
        isConnected={isConnected}
        disconnectHandler={disconnectHandler}  
        connectionString={connectionString}
        selectedCollectionName={selectedCollectionName}
        connectionStringBreadcrumbHandler={connectionStringBreadcrumbHandler}
      />

      <main className={"mainContent"}>
        <div className={"contentWrapper"}>
          <div className={"innerContent"}>
            <div className={"contentContainer"}>
              <MainContentRoutes
                connectHandler={connectHandler}
                openCollectionHandler={openCollectionHandler}>
              </MainContentRoutes>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default App
