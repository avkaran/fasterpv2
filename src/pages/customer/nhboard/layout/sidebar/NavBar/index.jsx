import React, { useState } from 'react';

import DropDownNav from './DropDownNav';
import SingleNav from './SingleNav';
const NavBar=(props)=>{

    const { menus } = props;

    const [menuId, steActiveMenuId] = useState(null);

    const ROLE = props.role.toLowerCase();

    const renderMenus=()=>{

        return menus.map((item) => item.allowed.indexOf(ROLE)>-1 ? item.childrens ? 
             <DropDownNav menu={item} key={item.name}  childrens={item.childrens} menuId={menuId} setMenuId={(id)=>steActiveMenuId(id)} role={ROLE} /> :
            <SingleNav key={item.name}  menu={item} /> : null);
    };

	return renderMenus();
};

export default NavBar;