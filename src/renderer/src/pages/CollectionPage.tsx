import React, { useState } from "react";
import { useParams } from 'react-router-dom';
import { Channels } from '../../../shared/contants';
import { DocumentMetadata } from "../../../shared/chroma-service";
import { DocumentCard } from "@renderer/components/DocumentCard";
import { Filter } from "@renderer/components/Filter";

type CollectionPageProps = {
  openDocumentHandler(collectionName: string, documentName: string, documentPath: string): void;
}

export const CollectionPage: React.FC<CollectionPageProps> = (props: CollectionPageProps) => {
  const { collectionName } = useParams();

  const [filter, setFilter] = useState<string>('');
  const [documents, setDocuments] = useState<Array<DocumentMetadata>>([]);  
  const [filteredDocuments, setFilteredDocuments] = useState<Array<DocumentMetadata>>([]);

  async function loadCollection() {
    const result = await window.electron.ipcRenderer.invoke(Channels.GET_COLLECTION, collectionName)
    setDocuments(result);
    setFilteredDocuments(result);
  }

  React.useEffect(() => {
    loadCollection()
  }, []);

  React.useEffect(() => {
    if (filter.length === 0) {
      setFilteredDocuments(documents);
    } else {
      setFilteredDocuments(documents.filter(c => c.name.startsWith(filter)));
    }
  }, [filter]);

  return (
    <>
      <div className="row">
        <div className="column">
          <Filter filter={filter} setFilter={setFilter} filterName="Document" />
        </div>
      </div>
      <div className="column">
        <div className="row">
          {
            filteredDocuments.map((document: DocumentMetadata) => {
              console.log(document);
              return (
                <DocumentCard collectionName={collectionName!} documentMetadata={document} openDocumentHandler={props.openDocumentHandler} />
              )
            })
          }
        </div>
      </div>
    </>
  );
};