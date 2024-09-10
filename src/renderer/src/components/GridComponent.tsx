import React from 'react';

interface GridCellProps {
  content: string;
  flexCell?: boolean;
}

const GridCell: React.FC<GridCellProps> = ({ content, flexCell = false }) => {
  const cellClass = flexCell ? "gridCellFlex" : "gridCell";
  return <div className={cellClass}>{content}</div>;
};

interface GridRowProps {
  cells: string[];
  flexRow?: boolean;
}

const GridRow: React.FC<GridRowProps> = ({ cells, flexRow = false }) => {
  const rowClass = flexRow ? "gridRowFlex" : "gridRow";
  return (
    <div className={rowClass}>
      {cells.map((cell, index) => (
        <GridCell key={index} content={cell} flexCell={flexRow} />
      ))}
    </div>
  );
};

interface GridComponentProps {
  data: string[][];
}

const GridComponent: React.FC<GridComponentProps> = ({ data }) => {
  return (
    <section>
      <div className="gridContent">
        {data.map((row, index) => (
          <GridRow key={index} cells={row} flexRow={index !== 0} />
        ))}
      </div>
    </section>
  );
};

export default GridComponent;