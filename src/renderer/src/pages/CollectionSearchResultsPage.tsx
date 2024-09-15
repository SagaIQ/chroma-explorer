import React, { useState } from "react";
import { useParams } from 'react-router-dom';
import { Document } from "../../../shared/chroma-service";
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
        JSON.stringify(documents, null, 2)
      }
    </>
  );
};