import React from "react";
import { useNavigate } from "react-router-dom";

type BreadcrumbProps = {
  connectionString: string | undefined;
  selectedCollectionName: string | undefined;
  selectedDocumentName: string | undefined;
  connectionStringBreadcrumbHandler(): void;
}

const Breadcrumb: React.FC<BreadcrumbProps> = (props: BreadcrumbProps) => {
  const navigate = useNavigate();

  const clickSelectedCollectionNameHandler = () => {
    navigate(`/collections/${props.selectedCollectionName}`);
  };

  const clickSelectedDocumentNameHandler = () => {
    navigate(`/collections/${props.selectedCollectionName}/${props.selectedDocumentName}`);
  };

  React.useEffect(() => {
    console.log('what is changing???')
    console.log(`props.connectionString=${props.connectionString}`)
    console.log(`props.selectedCollectionName=${props.selectedCollectionName}`)
    console.log(`props.selectedDocumentName=${props.selectedDocumentName}`)
  }, [props.connectionString, props.selectedCollectionName])

  return (
    <div className={"breadcrumbSection"}>
      <nav>
        <ol>
          { props.connectionString 
            ? <li onClick={props.connectionStringBreadcrumbHandler}>{props.connectionString.length > 30 ? `${props.connectionString.substring(0, 27)}...` : props.connectionString}</li>
            : <></>
          }
          { props.selectedCollectionName 
            ? <>/ <li onClick={clickSelectedCollectionNameHandler}>{props.selectedCollectionName.length > 30 ? `${props.selectedCollectionName.substring(0, 27)}...` : props.selectedCollectionName}</li></>
            : <></>
          }
          { props.selectedDocumentName 
            ? <>/ <li onClick={clickSelectedDocumentNameHandler}>{props.selectedDocumentName.length > 30 ? `${props.selectedDocumentName.substring(0, 27)}...` : props.selectedDocumentName}</li></>
            : <></>
          } 
        </ol>
      </nav>
    </div>
  );
};

export default Breadcrumb;
