import React, { useState } from "react";
import { useParams } from 'react-router-dom';
import { Channels } from '../../../shared/contants';
import { Document, DocumentChunk } from "../../../shared/chroma-service";

export const DocumentPage: React.FC = () => {
  const { collectionName, documentName } = useParams();

  const [document, setDocument] = useState<Document | undefined>(undefined);

  async function loadDocument() {
    const result: Document | undefined = await window.electron.ipcRenderer.invoke(Channels.GET_DOCUMENT, collectionName, documentName)
    setDocument(result);
  }

  React.useEffect(() => {
    loadDocument()
  }, []);

  return (
    <>
      {
        !document ? <></> : 
        <>
          {document.chunks.map((chunk: DocumentChunk) => {
            return (
              <>
                {JSON.stringify(chunk.id)}
                <br />
                {JSON.stringify(chunk.metadata)}
                <br />
                {JSON.stringify(chunk.content)}
                <br />
                <br />
                <br />
              </>
            )
          })}
        </>
      }
    </>
  );
};