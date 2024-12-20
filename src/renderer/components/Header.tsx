import React from "react";
import Logo from "./Logo";
import Status from "./Status";
import Breadcrumb from "./Breadcrumb";

type HeaderProps = {
  connectionString: string | undefined;
  selectedCollectionName: string | undefined;
  selectedDocumentName: string | undefined;
  isConnected: boolean;
  disconnectHandler(): void
  connectionStringBreadcrumbHandler(): void;
  openCollectionHandler(collectionName: string): void;
}

const Header: React.FC<HeaderProps> = (props: HeaderProps) => {
  return (
    <header className={"topbar"}>
      <nav className={"menu"}>
        <div className={"topbarInner"}>
          <div className={"headerContent"}>
            <Logo />
            <Breadcrumb
              connectionString={props.connectionString}
              selectedCollectionName={props.selectedCollectionName}
              selectedDocumentName={props.selectedDocumentName}
              openCollectionHandler={props.openCollectionHandler}
              connectionStringBreadcrumbHandler={props.connectionStringBreadcrumbHandler} />
            <Status isConnected={props.isConnected} disconnectHandler={props.disconnectHandler} />
          </div>
          <div className={"divider"} />
        </div>
      </nav>
    </header>
  );
};

export default Header;
