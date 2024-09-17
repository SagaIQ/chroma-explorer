import React, { useState } from "react";
import { useParams } from 'react-router-dom';
import { Channels } from '../../../shared/contants';
import { Document, DocumentChunk } from "../../../shared/chroma-service";

export const DocumentPage: React.FC = () => {
  const { collectionName, documentName } = useParams();

  const [loading, setLoading] = useState<boolean>(true);
  const [document, setDocument] = useState<Document | undefined>(undefined);

  async function loadDocument() {
    setLoading(true);
    const result: Document | undefined = await window.electron.ipcRenderer.invoke(Channels.GET_DOCUMENT, collectionName, documentName)
    setDocument(result);
    setLoading(false);
  }

  React.useEffect(() => {
    loadDocument()
  }, []);

  return (
    <>
      {loading ? <div className="loading" /> :
        <>
          {
            !document ? <></> :
              <>

                <h3>{`Document Chunks (${document.chunks.length})`}</h3>
                <table className="gridContainer">
                  <tr>
                    <th style={{ textAlign: 'left', width: '340px', minWidth: '340px', maxWidth: '340px' }}>Chunk ID</th>
                    <th style={{ textAlign: 'left' }}>Metadata</th>
                  </tr>
                  {document.chunks.map((chunk: DocumentChunk) => {
                    return (
                      <>
                        <tr>
                          <td style={{ textAlign: 'left', width: '340px', minWidth: '340px', maxWidth: '340px', color: 'black' }}>{chunk.id}</td>
                          <td style={{ textAlign: 'left', color: 'black' }}>{JSON.stringify(chunk.metadata)}</td>
                        </tr>
                        <tr>
                          <td colSpan={2}>
                            <div style={{ paddingTop: '10px', paddingBottom: '10px' }}>
                              <div style={{ color: '#606266' }}>
                                {chunk.content}
                              </div>
                              <div className="rowDivider" />
                            </div>
                          </td>
                        </tr>
                      </>
                    )
                  })}
                </table>
              </>
          }
        </>
      }
    </>
  );
};