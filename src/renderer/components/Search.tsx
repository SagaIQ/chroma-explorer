import React, { useState } from "react";

type SearchProps = {
  collectionName: string;
  searchCollectionHandler(collectionName: string, searchString: string): void;
}

export const Search: React.FC<SearchProps> = (props: SearchProps) => {
  const [searchString, setSearchString] = useState<string>('');

  return (
    <div className="searchContainer">
      <input aria-label="searchCollectionInput" className="searchText" placeholder={`Search for content across all documents in the '${props.collectionName}' collection`} value={searchString} onChange={(e) => setSearchString(e.target.value)} />
      <button disabled={searchString.length <= 1} className={searchString.length > 1 ? "button" : "buttonDisabled"} style={{padding: '0 5em', marginLeft: '10px'}} title="type at least 2 characters to enable search" onClick={() => props.searchCollectionHandler(props.collectionName, searchString)}>
        Search
      </button>
    </div>
  );
};
