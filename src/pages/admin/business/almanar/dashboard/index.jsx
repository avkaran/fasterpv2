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
import { Breadcrumb, Layout, Form, DatePicker } from 'antd';
import StatCard from './statcard';
import { green, blue, red, cyan, grey, magenta, yellow, gold } from '@ant-design/colors';
import { MyButton, MyTable } from '../../../../../comp';
import dayjs from 'dayjs';
import { HomeOutlined } from '@ant-design/icons';
import { currentInstance, businesses } from '../../../../../utils';
import HomeContainer from '../../../layout-mobile/homeContainer';
import ResponsiveLayout from '../../../layout'
const Dashboard = (props) => {
    const context = useContext(PsContext);
    const { userId } = useParams();
    const { Content } = Layout;
    const [loader, setLoader] = useState(false);
    const [metalRates, setMetalRates] = useState(null);
    const [countData, setCountData] = useState(null)
    const [selDate, setSelDate] = useState(dayjs().format("YYYY-MM-DD"))
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
        loadCountData(selDate)
    }, []);
    const loadCountData = (date) => {
        setLoader(true)
        var reqData = [{
            query_type: 'query',
            query: "select coalesce(sum(a.qty),0) as qty,coalesce(sum(a.qty*a.cost_per),0) as sales_cost,coalesce(sum(a.qty*p.cost_price),0) as purchase_cost  from adjustments a,products p where  a.product_id=p.id and a.adjustment_type='Sales'  and a.status=1 and date(a.date)='" + date + "'"
        },
        {
            query_type: 'query',
            query: "select coalesce(sum(a.qty),0) as qty,coalesce(sum(a.qty*a.cost_per),0) as purchase_cost  from adjustments a,products p where  a.product_id=p.id and a.adjustment_type='Purchase'  and a.status=1 and date(a.date)='" + date + "'"
        },
        ]
        context.psGlobal.apiRequest(reqData, context.adminUser(userId).mode).then((res) => {
            console.log('data', res)
            setCountData(res)
            setLoader(false)
        }).catch(err => {
            message.error(err);

        })
    }

    const onDateChange = (date) => {
        setSelDate(dayjs(date).format("YYYY-MM-DD"))
        loadCountData(dayjs(date).format("YYYY-MM-DD"))
    }
    return (
        <>
            <ResponsiveLayout
                userId={userId}
                customHeader={null}
                bottomMenues={null}
                breadcrumbs={[{ name: 'Dashboard', link: '#/' + userId + '/admin' }]}
            >
                <Card title={
                    <DatePicker
                        onChange={onDateChange}
                        defaultValue={dayjs()}
                        format="DD/MM/YYYY"
                        allowClear={false}
                    />
                }>
                    <Spin spinning={loader}>

                        <Row gutter={16}>
                            <Col xs={24} sm={12} md={6}>
                                <StatCard

                                    title="Sales"
                                    value={countData[0][0].sales_cost +" ("+ countData[0][0].qty +")"}
                                    icon={<FontAwesomeIcon icon={faIndianRupeeSign} />}
                                    color={gold[5]}
                                    //link={"/" + userId + "/admin/members/orders-by-status/Paid"}
                                />
                            </Col>
                            <Col xs={24} sm={12} md={6}>
                                <StatCard

                                    title="Profit"
                                    value={countData[0] && (parseFloat(countData[0][0].sales_cost)-parseFloat(countData[0][0].purchase_cost)).toFixed(2)}
                                    icon={<FontAwesomeIcon icon={faIndianRupeeSign} />}
                                    color={grey[3]}
                                   // link={"/" + userId + "/admin/members/orders-by-status/Payment Tried"}
                                />
                            </Col>
                            <Col xs={24} sm={12} md={6}>
                               {/*  <StatCard

                                    title="Purchase"
                                    value={countData[1] && countData[1][0].purchase_cost +" ("+ countData[1][0].qty +")"}
                                    icon={<FontAwesomeIcon icon={faListCheck} />}
                                    color="#10239e"
                                   // link={"/" + userId + "/admin/estimates"}
                                /> */}
                            </Col>
                            <Col xs={24} sm={12} md={6}>
                              {/*   <StatCard

                                    title="Stock"
                                    value={0}
                                    icon={<FontAwesomeIcon icon={faList} />}
                                    color="#d4380d"
                                    link={"/" + userId + "/admin/products"}
                                /> */}
                            </Col>
                        </Row>
                    </Spin>
                </Card>
            </ResponsiveLayout>
        </>)

};
export default Dashboard;
