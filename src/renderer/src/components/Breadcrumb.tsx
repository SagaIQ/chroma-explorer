import React from "react";

type BreadcrumbProps = {
  connectionString: string | undefined;
  selectedCollectionName: string | undefined;
  selectedDocumentName: string | undefined;
  connectionStringBreadcrumbHandler(): void;
  openCollectionHandler(collectionName: string): void;
}

const Breadcrumb: React.FC<BreadcrumbProps> = (props: BreadcrumbProps) => {
  return (
    <div className={"breadcrumbSection"}>
      <nav>
        <ol>
          { props.connectionString 
            ? <li aria-label="connectionStringBreadcrumb" onClick={props.connectionStringBreadcrumbHandler}>{props.connectionString.length > 30 ? `${props.connectionString.substring(0, 27)}...` : props.connectionString}</li>
            : <></>
          }
          { props.selectedCollectionName 
            ? <>/ <li aria-label="collectionBreadcrumb" onClick={() => props.openCollectionHandler(props.selectedCollectionName!)}>{props.selectedCollectionName.length > 30 ? `${props.selectedCollectionName.substring(0, 27)}...` : props.selectedCollectionName}</li></>
            : <></>
          }
          { props.selectedDocumentName 
            ? <>/ <li aria-label="documentBreadcrumb">{props.selectedDocumentName.length > 30 ? `${props.selectedDocumentName.substring(0, 27)}...` : props.selectedDocumentName}</li></>
            : <></>
          } 
        </ol>
      </nav>
    </div>
  );
};

export default Breadcrumb;
