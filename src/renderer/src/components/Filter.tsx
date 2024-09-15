import React from "react";

interface FilterProps {
  filterName: string;
  filter: string;
  setFilter: React.Dispatch<React.SetStateAction<string>>;
}

export const Filter: React.FC<FilterProps> = (props: FilterProps) => {

  return (
    <form className="filterContainer">
      <img
        loading="lazy"
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/632e6fd17efce14cb30c4c159c1644ec7d9aac16644dfcf582856a127ab1237e?placeholderIfAbsent=true&apiKey=ec77cbb3cd35477ead1cb38ab83dc66b"
        className="searchIcon"
      />
      <input className="filterText" placeholder={`Filter on ${props.filterName} Name`} value={props.filter} onChange={(e) => props.setFilter(e.target.value)} />
    </form>
  );
};
