import { Route, Routes } from 'react-router-dom';
import { ConnectionPage } from './pages/ConnectionPage';
import { CollectionsPage } from './pages/CollectionsPage';
import { CollectionPage } from './pages/CollectionPage';
import { DocumentPage } from './pages/DocumentPage';

type MainContentRoutesProps = {
  connectHandler(connectionString: string): void;
  openCollectionHandler(collectionName: string): void;
  openDocumentHandler(collectionName: string, documentName: string): void;
}

export const MainContentRoutes = (props: MainContentRoutesProps) => (
  <Routes>
    <Route path="/" element={<ConnectionPage connectHandler={props.connectHandler} />} />
    <Route path="/collections" element={<CollectionsPage openCollectionHandler={props.openCollectionHandler} />} />
    <Route path="/collections/:collectionName" element={<CollectionPage openDocumentHandler={props.openDocumentHandler} />} />
    <Route path="/collections/:collectionName/:documentName" element={<DocumentPage />} />
  </Routes>
);