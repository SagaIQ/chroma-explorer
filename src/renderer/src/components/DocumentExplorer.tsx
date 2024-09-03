import React from "react";
import { useState } from "react";
import { Channels } from '../../../shared/contants'
import ClipLoader from "react-spinners/ClipLoader";
import Splitter, { SplitDirection } from '@devbookhq/splitter'
import { Collection, Document } from "../../../shared/chroma-service";

export type DocumentExplorerProps = {
  selectedCollection?: Collection
}

export const DocumentExplorer = (props: DocumentExplorerProps) => {
  const [documents, setDocuments] = useState<Array<string>>([]);
  const [documentsLoading, setDocumentsLoading] = useState<boolean>(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | undefined>(undefined);


  const [searchString, setSearchString] = useState<string | undefined>(undefined);
  const [searchResults, setSearchResults] = useState<Array<Document> | undefined>(undefined);
  const [searchResultsCount, setSearchResultsCount] = useState<number | undefined>(undefined);

  async function loadDocuments(collection: Collection) {
    setDocumentsLoading(true);

    const result = await window.electron.ipcRenderer.invoke(Channels.GET_COLLECTION, collection?.name);
    setDocuments(result);
    setDocumentsLoading(false);
  }

  React.useEffect(() => {
    if (props.selectedCollection === undefined || props.selectedCollection === null) {
      return;
    }

    setDocuments([]);
    setSelectedDocument(undefined);
    setSearchString(undefined);
    setSearchResults(undefined)
    setSearchResultsCount(undefined);

    loadDocuments(props.selectedCollection)
  }, [props.selectedCollection]);

  const onSelectDocument = async (selectedDocument) => {
    const result = await window.electron.ipcRenderer.invoke(Channels.GET_DOCUMENT, props.selectedCollection?.name, selectedDocument);
    console.log(result);
    setSelectedDocument(result);
  }

  const handleSearchStringChange = (event) => {
    setSearchString(event.target.value);
  }

  const handleSearch = async (event) => {
    event.preventDefault();
    const result = await window.electron.ipcRenderer.invoke(Channels.SEARCH_COLLECTION_FOR_CONTENT, props.selectedCollection?.name, searchString);
    setSearchResults(result);

    
    setSearchResultsCount(result.length);
  }

  return (
    <>
      {
        props.selectedCollection
          ? 
          <div>
              {documentsLoading ? <ClipLoader size={100} /> : 
                <div>
                  <h2>Collection '{props.selectedCollection.name}' has ({documents.length}) documents</h2> <br />

                  <Splitter direction={SplitDirection.Vertical} >
                    <div style={{maxHeight: "300px", overflowY: "scroll"}}>
                      <ul>
                        {
                          documents.map(document => {
                            return (
                              <li key={document} onClick={() => onSelectDocument(document)}>
                                <div>{document}</div>
                              </li>
                            )
                          })
                        }
                      </ul>
                    </div>
                    <div>
                      <h3>Selected Document Contents</h3><br />
                      { selectedDocument ? 
                        <>
                          <div style={{borderTop: "1px solid gray", padding: "3px", marginLeft: "10px"}}>
                              <h3>Document Chunk ID: {selectedDocument.name}</h3>
                              <p>Document Chunk Content {JSON.stringify(selectedDocument.chunks)}</p>
                          </div>
                        </>
                        : <></>
                      }
                    </div>
                    <div style={{height: "400px",  overflowY: "scroll"}}>
                      <h3>Search for content in selected collection</h3><br />
                      <form onSubmit={handleSearch}>
                        <input type="text" value={searchString} onChange={handleSearchStringChange} />
                        <button type="submit">Search</button>
                      </form>
                      <>
                        { searchResults
                            ? 
                            <div>
                              Found the search term: <b>{searchResultsCount}</b> times 
                              <ul>
                                {
                                  searchResults.map(searchResult => {
                                    return (
                                      <li key={searchResult.path}>
                                        <div style={{borderTop: "1px solid gray", padding: "3px", marginLeft: "10px"}}>
                                          <h3>Document Chunk ID: {searchResult.name}</h3>
                                          <p>Document Chunk Content {JSON.stringify(searchResult.chunks)}</p>
                                        </div>
                                      </li>
                                    )
                                  })
                                }
                              </ul>
                            </div>
                          
                            : <></> 
                          }
                      </>
                    </div>
                  </Splitter>
                </div>}
            </div>
          : <div>
              <p>select a collection from the left to view its documents</p>
            </div>
      }
    </>
  )
}