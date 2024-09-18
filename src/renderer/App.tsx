import "./App.css"

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppRoutes } from "./AppRoutes";
import Footer from "./components/Footer";
import Header from "./components/Header";
import { Channels } from "../shared/contants";

function App(): JSX.Element {
  const navigate = useNavigate();

  const [connectionString, setConnectionString] = useState<string | undefined>(undefined);
  const [selectedCollectionName, setSelectedCollectionName] = useState<string | undefined>(undefined);
  const [selectedDocumentName, setSelectedDocumentName] = useState<string | undefined>(undefined);
  const [isConnected, setIsConnected] = useState<boolean>(false);

  const connectHandler = async (connectionString: string) => {
    setIsConnected(true);
    setConnectionString(connectionString);
    navigate(`/collections`);
  }

  const disconnectHandler = async () => {
    await window.chromadb.disconnect();

    // reset state
    setIsConnected(false);
    setConnectionString(undefined);
    setSelectedCollectionName(undefined);
    setSelectedDocumentName(undefined);

    // go back to connection page
    navigate(`/`);
  }

  const openCollectionHandler = (collectionName: string) => {
    setSelectedCollectionName(collectionName);
    setSelectedDocumentName(undefined);
    navigate(`/collections/${collectionName}`);
  }

  const openDocumentHandler = (collectionName: string, documentName: string, documentPath: string) => {
    setSelectedDocumentName(documentName);
    navigate(`/collections/${collectionName}/${encodeURIComponent(documentPath)}`);
  }

  const connectionStringBreadcrumbHandler = () => {
    setSelectedCollectionName(undefined);
    setSelectedDocumentName(undefined);
    navigate(`/collections`);
  };

  const searchCollectionHandler = (collectionName: string, searchString: string) => {
    navigate(`/collections/${collectionName}/search/${encodeURIComponent(searchString)}`);
  }

  const checkConnectionStatus = async () => {
    const result = await window.chromadb.heartbeat();
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
        selectedDocumentName={selectedDocumentName}
        connectionStringBreadcrumbHandler={connectionStringBreadcrumbHandler}
        openCollectionHandler={openCollectionHandler}
      />

      <main className={"mainContent"}>
        <div className={"contentWrapper"}>
          <div className={"innerContent"}>
            <div className={"contentContainer"}>
              <AppRoutes
                connectHandler={connectHandler}
                openCollectionHandler={openCollectionHandler}
                searchCollectionHandler={searchCollectionHandler}
                openDocumentHandler={openDocumentHandler}
              >
              </AppRoutes>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default App
