import { Route, Routes } from 'react-router-dom';
import { ConnectionPage } from './pages/ConnectionPage';
import { CollectionsPage } from './pages/CollectionsPage';
import { CollectionPage } from './pages/CollectionPage';

type MainContentRoutesProps = {
  connectHandler(connectionString: string): void;
  openCollectionHandler(collectionName: string): void;
}

export const MainContentRoutes = (props: MainContentRoutesProps) => (
  <Routes>
    <Route path="/" element={<ConnectionPage connectHandler={props.connectHandler} />} />
    <Route path="/collections" element={<CollectionsPage openCollectionHandler={props.openCollectionHandler} />} />
    <Route path="/collections/:collectionName" element={<CollectionPage />} />
  </Routes>
);