// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import { Route, Routes } from 'react-router-dom';
import { ConnectionPage } from './pages/ConnectionPage';
import { CollectionsPage } from './pages/CollectionsPage';
import { CollectionPage } from './pages/CollectionPage';
// import ChromaExplorer from './pages/ChromaExplorer';
// import Collections from './pages/Collections';
// import Collection from './pages/Collection';


export const MainContentRoutes = () => (
  <Routes>
    <Route path="/" element={<ConnectionPage />} />
    <Route path="/collections" element={<CollectionsPage />} />
    <Route path="/collections/:collectionName" element={<CollectionPage />} />
  </Routes>
);