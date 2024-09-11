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

    console.log(document);
  }

  React.useEffect(() => {
    loadDocument()
  }, []);

  return (
    <>
      {
        !document ? <></> : 
        <>
            <table>
              <tr>
                <th>Chunk ID</th>
                <th>Metadata</th>
              </tr>
              {document.chunks.map((chunk: DocumentChunk) => {
                return (
                  <>
                    <tr>
                      <td>{chunk.id}</td>
                      <td>{JSON.stringify(chunk.metadata)}</td>
                    </tr>
                    <tr>
                      <td colSpan={2}>{chunk.content}</td>
                    </tr>
                  </>
                )
              })}
            </table>
        </>
      }
    </>
  );
};