import React from "react";

interface SearchInputProps {
  placeholder?: string;
}

export const Search: React.FC<SearchInputProps> = ({ placeholder = "Search" }) => {
  return (
    <form className="searchContainer" role="search">
      <label htmlFor="searchInput" className="visually-hidden">
        Search
      </label>
      <img
        loading="lazy"
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/632e6fd17efce14cb30c4c159c1644ec7d9aac16644dfcf582856a127ab1237e?placeholderIfAbsent=true&apiKey=ec77cbb3cd35477ead1cb38ab83dc66b"
        className="searchIcon"
        alt=""
      />
      <input type="search" id="searchInput" className="searchText" placeholder={placeholder} aria-label="Search" />
    </form>
  );
};
