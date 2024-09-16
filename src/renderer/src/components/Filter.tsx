import React from "react";

interface FilterProps {
  filterName: string;
  filter: string;
  setFilter: React.Dispatch<React.SetStateAction<string>>;
}

export const Filter: React.FC<FilterProps> = (props: FilterProps) => {

  return (
    <input data-testid="filterInput" className="filterText" placeholder={`Filter on ${props.filterName} Name`} value={props.filter} onChange={(e) => props.setFilter(e.target.value)} />
  );
};
