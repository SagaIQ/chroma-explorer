import React, { useState } from "react";
import { useParams } from 'react-router-dom';
import { Channels } from '../../../shared/contants';
import { DocumentMetadata } from "../../../shared/chroma-service";
import { DocumentCard } from "@renderer/components/DocumentCard";
import { Search } from "@renderer/components/Search";

type CollectionPageProps = {
  searchCollectionHandler(collectionName: string, searchString: string): void;
  openDocumentHandler(collectionName: string, documentName: string, documentPath: string): void;
}

export const CollectionPage: React.FC<CollectionPageProps> = (props: CollectionPageProps) => {
  const { collectionName } = useParams();

  const [loading, setLoading] = useState<boolean>(true);
  const [documents, setDocuments] = useState<Array<DocumentMetadata>>([]);

  async function loadCollection() {
    setLoading(true);
    const result = await window.electron.ipcRenderer.invoke(Channels.GET_COLLECTION, collectionName)
    setDocuments(result);
    setLoading(false);
  }

  React.useEffect(() => {
    loadCollection()
  }, []);

  return (
    <>
      {loading ? <div className="loading" /> :
        <>
          <div className="row">
            <div className="column">
              <Search
                collectionName={collectionName!}
                searchCollectionHandler={props.searchCollectionHandler} />
            </div>
          </div>
          <div className="column">
            <div className="row">
              {
                documents.map((document: DocumentMetadata) => (
                  <DocumentCard
                    collectionName={collectionName!}
                    documentMetadata={document}
                    openDocumentHandler={props.openDocumentHandler} />
                ))
              }
            </div>
          </div>
        </>
      }
    </>
  );
};