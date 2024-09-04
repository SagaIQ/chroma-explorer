import React from "react";
import { useNavigate } from "react-router-dom";

type BreadcrumbProps = {
  connectionString: string | undefined;
  selectedCollectionName: string | undefined;
  connectionStringBreadcrumbHandler(): void;
}

const Breadcrumb: React.FC<BreadcrumbProps> = (props: BreadcrumbProps) => {
  const navigate = useNavigate();

  const clickSelectedCollectionNameHandler = () => {
    navigate(`/collections/${props.selectedCollectionName}`);
  };

  React.useEffect(() => {
    console.log('what is changing???')
    console.log(`props.connectionString=${props.connectionString}`)
    console.log(`props.selectedCollectionName=${props.selectedCollectionName}`)
  }, [props.connectionString, props.selectedCollectionName])

  return (
    <div className={"breadcrumbSection"}>
      <nav>
        <ol>
          { props.connectionString 
            ? <li onClick={props.connectionStringBreadcrumbHandler}>{props.connectionString}</li>
            : <></>
          }
          { props.selectedCollectionName 
            ? <>/ <li onClick={clickSelectedCollectionNameHandler}>{props.selectedCollectionName}</li></>
            : <></>
          } 
        </ol>
      </nav>
    </div>
  );
};

export default Breadcrumb;
