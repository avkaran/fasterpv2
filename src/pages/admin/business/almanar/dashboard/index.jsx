import { faIndianRupeeSign, faList, faListCheck, faPeopleRobbery, faPeopleRoof, faTriangleExclamation, faUser, faUserCheck, faUserClock, faUsers, faUserTag, faUserTie, faUserTimes, faUserXmark } from '@fortawesome/free-solid-svg-icons';
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
import { useParams } from 'react-router-dom';
import PsContext from '../../../../../context';
import { Breadcrumb, Layout, Form } from 'antd';
import StatCard from './statcard';
import { green, blue, red, cyan, grey, magenta, yellow,gold } from '@ant-design/colors';
import { MyButton, MyTable } from '../../../../../comp';
import dayjs from 'dayjs';
import { HomeOutlined } from '@ant-design/icons';
import { currentInstance, businesses } from '../../../../../utils';
import HomeContainer from '../../../layout-mobile/homeContainer';
import ResponsiveLayout from '../../../layout'
const Dashboard = (props) => {
    const context = useContext(PsContext);
const {userId}=useParams();
    const { Content } = Layout;
    const [loader, setLoader] = useState(false);
    const [metalRates, setMetalRates] = useState(null);
    const [tableCountData, setTableCountData] = useState(null)
    const theme = {
        primaryColor: '#007bff',
        infoColor: '#1890ff',
        successColor: '#52c41a',
        processingColor: '#1890ff',
        errorColor: '#f5222d',
        highlightColor: '#f5222d',
        warningColor: '#faad14',
        normalColor: '#d9d9d9',
        backgroundColor: '#f7f7f9',
        darkColor: 'rgb(51, 51, 51)',
        textColor: 'rgba(0, 0, 0, .65)',
        textColorSecondary: 'rgba(0, 0, 0, .45)',

    }
    useEffect(() => {
        //console.log('userdata',context.adminUser(userId))
        // loadMemberCounts();
      //  loadCountData();
       // loadTableCountData()
      // loadMetalRates()
    }, []);
    
    const loadMetalRates = () => {
        setLoader(true)
        var reqData ={
                query_type: 'query',
                query: "select * from today_rates order by id"
            }
        context.psGlobal.apiRequest(reqData, context.adminUser(userId).mode).then((res) => {
            setMetalRates(res);
            setLoader(false)

        }).catch(err => {
            message.error(err);
            setLoader(false);
        })
    }
   
    return (
        <>
        <ResponsiveLayout 
         userId={userId}
         customHeader={null}
         bottomMenues={null}
         breadcrumbs={[{name:'Dashboard',link:'#/'+userId+'/admin'}]}
        >
            <Card title="Dashboard">
             
               {/*  <Row gutter={16}>
                    <Col xs={24} sm={12} md={6}>
                        <StatCard

                            title="Gold"
                            value={metalRates && metalRates[0].rate.toFixed(2)}
                            icon={<FontAwesomeIcon icon={faIndianRupeeSign} />}
                            color={gold[5]}
                            link={"/" + userId + "/admin/members/orders-by-status/Paid"}
                        />
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <StatCard

                            title="Silver"
                            value={metalRates && metalRates[1].rate.toFixed(2)}
                            icon={<FontAwesomeIcon icon={faIndianRupeeSign} />}
                            color={grey[3]}
                            link={"/" + userId + "/admin/members/orders-by-status/Payment Tried"}
                        />
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <StatCard

                            title="Estimates"
                            value={0}
                            icon={<FontAwesomeIcon icon={faListCheck} />}
                            color="#10239e"
                            link={"/" + userId + "/admin/estimates"}
                        />
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <StatCard

                            title="Products"
                            value={0}
                            icon={<FontAwesomeIcon icon={faList} />}
                            color="#d4380d"
                            link={"/" + userId + "/admin/products"}
                        />
                    </Col>
                </Row> */}
    
            </Card>
            </ResponsiveLayout>
        </>)
 
};
export default Dashboard;
