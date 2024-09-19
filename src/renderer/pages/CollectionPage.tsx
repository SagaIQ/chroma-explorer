import React, { useState } from "react";
import { useParams } from 'react-router-dom';
import { DocumentMetadata } from "../../shared/chroma-service";
import { Search } from "../components/Search";
import { DocumentCard } from "../components/DocumentCard";

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
    const result = await window.chromadb.loadCollection(collectionName);
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
          <h3>{`Documents (${documents.length})`}</h3>
          <Search
            collectionName={collectionName}
            searchCollectionHandler={props.searchCollectionHandler} />
          <div className="column">
            <div className="row">
              {
                documents.map((document: DocumentMetadata) => (
                  <DocumentCard
                    collectionName={collectionName}
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