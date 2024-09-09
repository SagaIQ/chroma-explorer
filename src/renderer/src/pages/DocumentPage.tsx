import React, { useState } from "react";
import { useParams } from 'react-router-dom';
import { Channels } from '../../../shared/contants';

export const DocumentPage: React.FC = () => {
  const { collectionName, documentName } = useParams();

  const [documentContents, setDocumentContents] = useState<any>(undefined);

  async function loadDocument() {
    const result = await window.electron.ipcRenderer.invoke(Channels.GET_DOCUMENT, collectionName, documentName)
    console.log(result);
    setDocumentContents(result);
  }

  React.useEffect(() => {
    loadDocument()
  }, []);

  return (
    <>
      Wow, so good
      {
        JSON.stringify(documentContents)
      }
    </>
  );
};