import React from "react";
import { useNavigate } from "react-router-dom";

interface NavItemProps {
  icon: string;
  text: string;
  badgeContent?: string;
}

const NavItem: React.FC<NavItemProps> = ({ icon, text, badgeContent }) => {
  const navigate = useNavigate();
  const routeChange = () => {
    navigate('/collections');
  };

  return (
    <div className="navItem">
      <div className="buttonSidebar" onClick={routeChange}>
        <img loading="lazy" src={icon} alt="" className="icon" />
        <div className="buttonText">{text}</div>
        {badgeContent && (
          <div className="badge">
            <div className="badgeContent">{badgeContent}</div>
          </div>
        )}
      </div>
    </div>
  );
};

const SidebarNavigation: React.FC = () => {
  return (
    <nav className="sidebarNavigation">
      <div className="leftSidebar">
        <div className="navbar">
          <div className="mainNav">
            <NavItem
              icon="https://cdn.builder.io/api/v1/image/assets/TEMP/3f969072ef9947608f8e89d2602d54ed327104e8cae82e1844b840a0e05a2d53?placeholderIfAbsent=true&apiKey=ec77cbb3cd35477ead1cb38ab83dc66b"
              text="Back"
              // badgeContent="120"
            />
            <div className="search">
              <img
                loading="lazy"
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/53a5a1a5d8e875233ae4f01116b3551a53447a4831bf3bad21ad55f10848287c?placeholderIfAbsent=true&apiKey=ec77cbb3cd35477ead1cb38ab83dc66b"
                alt=""
                className="searchIcon"
              />
              <div className="searchText">Search</div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default SidebarNavigation;
