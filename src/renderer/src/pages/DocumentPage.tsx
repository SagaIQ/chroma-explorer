import React from "react";
import { useParams } from 'react-router-dom';
import { Channels } from '../../../shared/contants';

export const DocumentPage: React.FC = () => {
  const { collectionName, documentName } = useParams();

  async function loadDocument() {
    const result = await window.electron.ipcRenderer.invoke(Channels.GET_DOCUMENT, collectionName, documentName)
    console.log(result);
  }

  React.useEffect(() => {
    loadDocument()
  }, []);

  return (
    <>
      Wow, so good
    </>
  );
};