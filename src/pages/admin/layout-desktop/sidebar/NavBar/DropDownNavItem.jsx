import React from 'react';
import  { NavLink } from 'react-router-dom';

const DropDownNavItem=(props)=>{

    const { name, path, exact } = props.menu;

    return(
        <li key={name.replace(" ","_")}>
            <NavLink 
                activeClassName='active'
                to={path.replace(":userId",props.user)}
                exact={exact}
            >
                {name}
            </NavLink>
        </li>
    );
   
};

export default DropDownNavItem;