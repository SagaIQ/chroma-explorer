import React, { useState } from "react";
import { useParams } from 'react-router-dom';
import { Document, DocumentChunk } from "../../../shared/chroma-service";
import { Channels } from "../../../shared/contants";

type CollectionSearchResultsPageProps = {
  openDocumentHandler(collectionName: string, documentName: string, documentPath: string): void;
}

export const CollectionSearchResultsPage: React.FC<CollectionSearchResultsPageProps> = (props: CollectionSearchResultsPageProps) => {
  const { collectionName, searchString } = useParams();
  const [documents, setDocuments] = useState<Array<Document>>([]);  

  async function loadSearchResults() {
    const result = await window.electron.ipcRenderer.invoke(Channels.SEARCH_COLLECTION, collectionName, searchString)
    setDocuments(result);
  }

  React.useEffect(() => {
    loadSearchResults()
  }, []);


  console.log(`collectionName: ${collectionName}`);
  console.log(`searchString: ${searchString}`);
  console.log(props);

  return (
    <>
      {
        documents.length === 0 ? <div>No search results for <b>'{searchString}'</b> in collection <b>'{collectionName}'</b></div> : 
        <>
          {
            documents.map(document => (
              <div className="gridContainer" style={{ marginBottom: '20px'}}>
                <p style={{ fontSize: '24px', color: 'black'}}>{document.name}</p>
                <p>{document.path}</p>
                <table>
                  <tr>
                    <th style={{ textAlign: 'left', width: '340px', minWidth: '340px', maxWidth: '340px'}}>Chunk ID</th>
                    <th style={{ textAlign: 'left' }}>Metadata</th>
                  </tr>
                  {
                  document.chunks.map((chunk: DocumentChunk) => {
                    return (
                      <>
                        <tr>
                          <td style={{ textAlign: 'left', width: '340px', minWidth: '340px', maxWidth: '340px', color: 'black'}}>{chunk.id}</td>
                          <td style={{ textAlign: 'left', color: 'black' }}>{JSON.stringify(chunk.metadata)}</td>
                        </tr>
                        <tr>
                          <td colSpan={2}>
                            <div style={{paddingTop: '10px', paddingBottom: '10px'}}>
                              <div style={{color: '#606266'}}>
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
              </div>
            ))
          }
        </>
      }
    </>
  );
};