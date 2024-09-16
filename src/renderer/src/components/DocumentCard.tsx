import React from 'react';
import { DocumentMetadata } from '../../../shared/chroma-service';

type DocumentCardProps = {
  collectionName: string;
  documentMetadata: DocumentMetadata
  openDocumentHandler(collectionName: string, documentName: string, documentPath: string): void;
}

export const DocumentCard: React.FC<DocumentCardProps> = (props: DocumentCardProps) => {
  return (
    <article className="card">
      <div className="cardContent">
        <header className="cardHeader">
          <div className={"titleWrapper"}>
            <div className="titleIcon">
              {/* <img 
                loading="lazy" 
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/dfee676bd88451033b03c5f04fa0a54c02742a031723cf1a8db8f709a0e19c5d?placeholderIfAbsent=true&apiKey=ec77cbb3cd35477ead1cb38ab83dc66b" 
                className="icon"
                alt=""
              /> */}
              <h4 title={props.documentMetadata.path}>{props.documentMetadata.name.length < 24 ? props.documentMetadata.name : `${props.documentMetadata.name.substring(0, 24)}...`}</h4>
            </div>
          </div>
          <p className="itemCount">
            {props.documentMetadata.chunkCount} <span style={{ fontSize: '20px' }}>Document Chunks</span>
          </p>
        </header>
        <footer className="cardFooter">
          <div className="divider" />
          <button className="button" style={{marginTop: '20px'}} onClick={() => props.openDocumentHandler(props.collectionName, props.documentMetadata.name, props.documentMetadata.path)}>
            Open
          </button>
        </footer>
      </div>
    </article>
  );
};     