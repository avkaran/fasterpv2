import React, { } from 'react';
import DropDownNavItem from './DropDownNavItem';

const DropDownNav = (props) => {

    const { name, icon } = props.menu;

    const { menuId, setMenuId, childrens, role } = props;

    const renderMenus = () => {

        return childrens.map((item, index) => item.allowed.indexOf(role) > -1 ? <DropDownNavItem key={"sub" + index.toString()} menu={item} /> : null);
    };

    const handleMenuClick = () => {
        if (menuId === name) {
            setMenuId(null);
        }
        else {
            setMenuId(name);
        }
    };

    return (

        <li key={name.replace(" ", "_")} className={`${menuId === name ? 'active' : ''}`} >
            {
                // eslint-disable-next-line no-script-url, jsx-a11y/anchor-is-valid
                (<a href="javascript:void(0)" onClick={handleMenuClick} >
                    <i className={`sidebar-item-icon ${icon}`}></i>
                    <span className="nav-label">{name}</span>
                    <i className="fa fa-angle-left arrow"></i>
                </a>)
            }
            <ul className={`nav-2-level collapse ${menuId === name ? 'in' : ''}`}>
                {renderMenus()}
            </ul>
        </li>
    );
};

export default DropDownNav;