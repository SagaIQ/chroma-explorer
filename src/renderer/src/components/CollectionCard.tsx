import React from 'react';
import { useNavigate } from "react-router-dom";

interface CollectionCardProps {
  name: string;
  itemCount: number;
}

export const CollectionCard: React.FC<CollectionCardProps> = (props: CollectionCardProps) => {
  const navigate = useNavigate();

  console.log(props.itemCount);

  const handleOpenCollection = () => {
    navigate(`/collections/${props.name}`);
  }
  
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
              <h3>{props.name.length < 20 ? props.name : `${props.name.substring(0, 20)}...`}</h3>
            </div>
          </div>
          {/* <p className="itemCount">
            {itemCount} <span style={{ fontSize: '20px' }}>Documents</span>
          </p> */}
        </header>
        <footer className="cardFooter">
          <div className="divider" />
          <button className="openButton" onClick={() => handleOpenCollection()}>
            Open
            <span className='visually-hidden'>Open {props.name} collection</span>
          </button>
        </footer>
      </div>
    </article>
  );
};     