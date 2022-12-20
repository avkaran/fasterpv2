import { faIndianRupeeSign, faPeopleRobbery, faPeopleRoof, faTriangleExclamation, faUser, faUserCheck, faUserClock, faUsers, faUserTag, faUserTie, faUserTimes, faUserXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    Card,
    Col,
    Row,
    Spin,
    message,
    Button
} from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import PsContext from '../../../context';
import { Breadcrumb, Layout, Form } from 'antd';
import { green, blue, red, cyan, grey, magenta, yellow } from '@ant-design/colors';
import { MyButton, MyTable } from '../../../comp';
import dayjs from 'dayjs';
import { HomeOutlined } from '@ant-design/icons';
import { currentInstance, businesses } from '../../../utils';
import HomeContainer from '../layout-mobile/homeContainer';

const ResponsiveLayout = (props) => {
    const context = useContext(PsContext);
    const { Content } = Layout;
    const { userId, customHeader, bottomMenues, breadcrumbs,showNav, ...other } = props;
    if (context.isMobile) {

        return <HomeContainer
            role={context.adminUser(userId).role}
            userId={userId}
            customHeader={customHeader}
            bottomMenues={null}
            breadcrumbs={null}
            showNav={showNav}
        >

            {props.children}

        </HomeContainer>

    } else {
        return <Content
            className="site-layout-background"
            style={{
                padding: '5px 24px 0px 24px',
                margin: 0

            }}
        >
            {
                 breadcrumbs && (<Breadcrumb style={{ margin: '0', padding: '8px 0px 8px 0px' }}>
                 <Breadcrumb.Item href="">
                     <HomeOutlined />
                 </Breadcrumb.Item>
                 {
                     breadcrumbs.map(item => {
                         return <> <Breadcrumb.Item>
                            {item.link?<a href={item.link}>{item.name}</a>:<span>{item.name}</span>} 
                         </Breadcrumb.Item></>
                     })
                 }
             </Breadcrumb>)
            }
            
            {props.children}
        </Content>

    }
}

export default ResponsiveLayout;