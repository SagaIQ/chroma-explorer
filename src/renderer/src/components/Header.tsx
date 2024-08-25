import React from "react";
import Logo from "./Logo";
import Status from "./Status";

const Header: React.FC = () => {
  return (
    <header className={"topbar"}>
      <nav className={"menu"}>
        <div className={"topbarInner"}>
          <div className={"headerContent"}>
            <Logo />
            <Status />
          </div>
          <div className={"divider"} />
        </div>
      </nav>
    </header>
  );
};

export default Header;
