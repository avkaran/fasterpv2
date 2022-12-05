import React from 'react';
import  { NavLink } from 'react-router-dom';
const SingleNav=(props)=>{

    const { name, icon, path, exact } = props.menu;
    return(
        <li key={name.replace(" ","_")}>
            <NavLink 
                
                activeClassName='active'
                to={path.replace(":userId",props.user)}
                exact={exact}
            >
                <i className={`sidebar-item-icon ${icon}`}></i>
                <span className="nav-label">
                    {name}
                </span>
            </NavLink>
        </li>
    );
   
};

export default SingleNav;