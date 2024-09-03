import React from 'react';
import { useParams } from 'react-router-dom';
import { Channels } from '../../../shared/contants';
// import SidebarNavigation from '../components/Sidebar';
// import PageContent from '../components/PageContent';

export const CollectionPage: React.FC = () => {
  const { collectionName } = useParams();

  console.log(`collectionName: ${collectionName}`)

  async function loadCollection() {
    const result = await window.electron.ipcRenderer.invoke(Channels.GET_COLLECTION, collectionName)
    console.log(`get-collection: ${result}`);
  }

  React.useEffect(() => {
    loadCollection()
  }, []);

  return (
    <>
      ooooo fancy collection wow
    </>
  );
};