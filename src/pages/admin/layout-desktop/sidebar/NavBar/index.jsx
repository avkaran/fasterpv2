import React, { useState,useContext } from 'react';
import DropDownNav from './DropDownNav';
import SingleNav from './SingleNav';
import PsContext from '../../../../../context'
const NavBar=(props)=>{
    const context = useContext(PsContext);
    const { menus } = props;

    const [menuId, steActiveMenuId] = useState(null);

    const ROLE = props.role.toLowerCase();
    const getMenues=()=>{
       // console.log('menues',menus)
        var permittedMenues=[];
        menus.forEach(item => {
            if(item.childrens){
               var permittedChildrens=[];
               if(item.childrens.length>0){
                    item.childrens.forEach(childMenu=>{
                        if(childMenu.resourceName){
                            if(context.isAdminResourcePermit(props.user,childMenu.resourceName))
                            permittedChildrens.push(childMenu);
                        }else permittedChildrens.push(childMenu);

                    })
               }
               if(permittedChildrens.length>0){
                var modifiedMenu=item;
                modifiedMenu.childrens=permittedChildrens;
                permittedMenues.push(modifiedMenu);
               }
            }
            else{
                if(item.resourceName){
                    if(context.isAdminResourcePermit(props.user,item.resourceName))
                    permittedMenues.push(item);
                }else permittedMenues.push(item);
            }
           
        });
        
      
        return permittedMenues;
       
    }

    const renderMenus=()=>{

        if(ROLE==='employee'){
            return getMenues().map((item) => item.allowed.indexOf(ROLE)>-1 ? item.childrens ? 
            <DropDownNav menu={item} user={props.user} key={item.name}  childrens={item.childrens} menuId={menuId} setMenuId={(id)=>steActiveMenuId(id)} role={ROLE} /> :
           <SingleNav key={item.name}  menu={item} user={props.user}/> : null);
        }else{
            return menus.map((item) => item.allowed.indexOf(ROLE)>-1 ? item.childrens ? 
            <DropDownNav menu={item} user={props.user} key={item.name}  childrens={item.childrens} menuId={menuId} setMenuId={(id)=>steActiveMenuId(id)} role={ROLE} /> :
           <SingleNav key={item.name}  menu={item} user={props.user}/> : null);
        }
       
    };

	return  renderMenus();
};

export default NavBar;