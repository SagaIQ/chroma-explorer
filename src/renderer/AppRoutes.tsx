import { Route, Routes } from 'react-router-dom';
import { ConnectionPage } from './pages/ConnectionPage';
import { CollectionsPage } from './pages/CollectionsPage';
import { CollectionPage } from './pages/CollectionPage';
import { DocumentPage } from './pages/DocumentPage';
import { CollectionSearchResultsPage } from './pages/CollectionSearchResultsPage';

type AppRoutesProps = {
  connectHandler(connectionString: string): void;
  openCollectionHandler(collectionName: string): void;
  searchCollectionHandler(collectionName: string, searchString: string): void;
  openDocumentHandler(collectionName: string, documentName: string, documentPath: string): void;
}

export const AppRoutes = (props: AppRoutesProps) => (
  <Routes>
    <Route path="/" element={<ConnectionPage connectHandler={props.connectHandler} />} />
    <Route path="/collections" element={<CollectionsPage openCollectionHandler={props.openCollectionHandler} />} />
    <Route path="/collections/:collectionName" element={<CollectionPage searchCollectionHandler={props.searchCollectionHandler} openDocumentHandler={props.openDocumentHandler} />} />
    <Route path="/collections/:collectionName/search/:searchString" element={<CollectionSearchResultsPage openDocumentHandler={props.openDocumentHandler} />} />
    <Route path="/collections/:collectionName/:documentName" element={<DocumentPage />} />
  </Routes>
);