import React from 'react';

interface CollectionCardProps {
  name: string;
  openCollectionHandler(collectionName: string): void;
}

export const CollectionCard: React.FC<CollectionCardProps> = (props: CollectionCardProps) => {
  return (
    <article className="card">
      <div className="cardContent">
        <header className="cardHeader">
          <div className={"titleWrapper"}>
            <div className="titleIcon">
              <h4>{props.name.length < 24 ? props.name : `${props.name.substring(0, 24)}...`}</h4>
            </div>
          </div>
        </header>
        <footer className="cardFooter">
          <div className="divider" />
          <button className="button" style={{marginTop: '20px'}} onClick={() => props.openCollectionHandler(props.name)}>
            Open
          </button>
        </footer>
      </div>
    </article>
  );
};     