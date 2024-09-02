import React from 'react';

interface CollectionCardProps {
  name: string;
  itemCount: number;
}

export const CollectionCard: React.FC<CollectionCardProps> = ({ name, itemCount }) => {
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
              <h3>{name.length < 20 ? name : `${name.substring(0, 20)}...`}</h3>
            </div>
          </div>
          <p className="itemCount">
            {itemCount} <span style={{ fontSize: '20px' }}>Documents</span>
          </p>
        </header>
        <footer className="cardFooter">
          <div className="divider" />
          <button className="openButton">
            Open
            <span className='visually-hidden'>Open {name} collection</span>
          </button>
        </footer>
      </div>
    </article>
  );
};     