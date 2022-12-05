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
import PsContext from '../../../../../context';
import StatCard from './statcard';
import { green, blue, red, cyan, grey, magenta, yellow } from '@ant-design/colors';
import { MyButton, MyTable } from '../../../../../comp';
import moment from 'moment';
const Dashboard = (props) => {
    const context = useContext(PsContext);

    const [loader, setLoader] = useState(false);
    const [countData, setCountData] = useState(null);
    const [tableCountData,setTableCountData]=useState(null)
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
        //console.log('userdata',context.adminUser(props.match.params.userId))
        // loadMemberCounts();
        loadCountData();      
        loadTableCountData()
    }, []);
    const tableColumns = [
        {
            title: 'Members',
            dataIndex: 'actionLabel',
            key: (Math.random() + 1).toString(36).substring(7),
            //render: (item) => <strong>{item}</strong>,
        },
        {
            title: 'Online',
           // dataIndex: 'online',
            key: 'online',
            render: (item) => <MyButton type='primary' shape="round" color={red[5]} href={"#/"+props.match.params.userId+"/admin/members/logs-by-action/"+item.action+"/customer"}>{item.online}</MyButton>,
        },
        {
            title: 'Employee',
            //dataIndex: 'employee',
            key: 'employee',
            render: (item) => <MyButton type='primary' shape="round" color={green[5]} href={"#/"+props.match.params.userId+"/admin/members/logs-by-action/"+item.action+"/employee"}>{item.employee}</MyButton>,
        },
        {
            title: 'Franchise',
           // dataIndex: 'franchise',
            key: 'franchise',
            render: (item) => <MyButton type='primary' shape="round" color={blue[5]} href={"#/"+props.match.params.userId+"/admin/members/logs-by-action/"+item.action+"/franchise"}>{item.franchise}</MyButton>,
        },
        {
            title: 'Broker',
           // dataIndex: 'broker',
            key: 'broker',
            render: (item) => <MyButton type='primary' shape="round" color={magenta[5]} href={"#/"+props.match.params.userId+"/admin/members/logs-by-action/"+item.action+"/broker"}>{item.broker}</MyButton>,
        },
        {
            title: 'Total',
            //dataIndex: 'total',
            key: 'total',
            render: (item) => <MyButton type='primary' shape="round" color={cyan[5]}>{item.total}</MyButton>,
        },

    ]
    const loadCountData=()=>{
        
        var reqData = [
            { 
            query_type: 'query', 
            query: "select count(*) as count from members where status=1 and member_status='Active'"
            },
            { 
                query_type: 'query', 
                query: "select count(*) as count from employees where status=1"
            },
            { 
                query_type: 'query', 
                query: "select count(*) as count from franchise where status=1"
            },
            { 
                query_type: 'query', 
                query: "select count(*) as count from brokers where status=1"
            },
            { 
                query_type: 'query', 
                query: "select count(distinct member_auto_id) as count from orders where status=1 and order_status in ('Paid','Expired')"
            },
            { 
                query_type: 'query', 
                query: "select count(distinct member_auto_id) as count from orders where status=1 and order_status in ('Payment Tried')"
            },
            { 
                query_type: 'query', 
                query: "select count(distinct member_auto_id) as count from orders where status=1 and order_status in ('Payment Failed')"
            },
            { 
                query_type: 'query', 
                query: "select count(*) as count from case_tasks where status=1 and type='Complaint'"
            },
        ]

        context.psGlobal.apiRequest(reqData,context.adminUser(props.match.params.userId).mode).then((res)=>{
            var cData={
                members:res[0][0]['count'],
                employees:res[1][0]['count'],
                franchise:res[2][0]['count'],
                brokers:res[3][0]['count'],
                paid:res[4][0]['count'],
                payment_tried:res[5][0]['count'],
                payment_failed:res[6][0]['count'],
                complaints:res[7][0]['count'],
               
            }
            setCountData(cData);
           
        }).catch(err => {
            message.error(err);
            setLoader(false);
        })
    }
    const loadTableCountData=()=>{
        var reqData = [
            { 
            query_type: 'query', 
            query: "SELECT log_name,logged_type,count(distinct ref_id) as count FROM logs where date(log_time)='"+moment().format("YYYY-MM-DD")+"' GROUP by log_name,logged_type"
            },
        ]
        context.psGlobal.apiRequest(reqData,context.adminUser(props.match.params.userId).mode).then((res)=>{
            var tCountData = [
                {actionLabel:'New Entry',action:"add-new-member",online:0,employee:0,franchise:0,broker:0,total:0},
                {actionLabel:'Profile Edit',action:"edit-member",online:0,employee:0,franchise:0,broker:0,total:0},
                {actionLabel:'Profile Close',action:"close-member",online:0,employee:0,franchise:0,broker:0,total:0},
                {actionLabel:'Photo Upload',action:"upload-photo",online:0,employee:0,franchise:0,broker:0,total:0},
                {actionLabel:'Profile Print',action:"print-profile",online:0,employee:0,franchise:0,broker:0,total:0},
                {actionLabel:'Paid',action:"make-payment",online:0,employee:0,franchise:0,broker:0,total:0},
                {actionLabel:'Visit/Login',action:"login",online:0,employee:0,franchise:0,broker:0,total:0},
                {actionLabel:'Payment Tried',action:"payment-tried",online:0,employee:0,franchise:0,broker:0,total:0},
                {actionLabel:'Payment Failed',action:"payment-failed",online:0,employee:0,franchise:0,broker:0,total:0},
            ];
            tCountData.forEach((item, index) => {
                var total = 0;
                var fOnline = res[0].find(obj => obj.log_name === item.action && obj.logged_type === "customer");
                var fEmployee = res[0].find(obj => obj.log_name === item.action && obj.logged_type === "employee");
                var fFranchise = res[0].find(obj => obj.log_name === item.action && obj.logged_type === "franchise");
                var fBroker = res[0].find(obj => obj.log_name === item.action && obj.logged_type === "broker");
               

                if (fOnline) {
                    tCountData[index].online = fOnline.count;
                    total = total + parseInt(fOnline.count);
                }
                if (fEmployee) {
                    tCountData[index].employee = fEmployee.count;
                    total = total + parseInt(fEmployee.count);
                   // console.log('test',item.actionLabel,fEmployee.count,index,tCountData[index].employee)
                }
                if (fFranchise) {
                    tCountData[index].franchise = fFranchise.count;
                    total = total + parseInt(fFranchise.count);
                }
                if (fBroker) {
                    tCountData[index].broker = fBroker.count;
                    total = total + parseInt(fBroker.count);
                }
                tCountData[index].total = total;
            })
            console.log(tCountData)
            setTableCountData(tCountData);
           
        }).catch(err => {
            message.error(err);
            setLoader(false);
        })

    }
    return (
        <>
            <Card title="Dashboard">
                <Spin spinning={loader} >

                    <Row gutter={16}>
                        <Col xs={24} sm={12} md={6}>
                            <StatCard

                                title="All Members"
                                value={countData && countData.members}
                                icon={<FontAwesomeIcon icon={faUser} />}
                                color={theme.primaryColor}
                                link={"/"+props.match.params.userId+"/admin/members"}
                            />
                        </Col>
                        <Col xs={24} sm={12} md={6}>
                            <StatCard

                                title="Employees"
                                value={countData && countData.employees}
                                icon={<FontAwesomeIcon icon={faUserTie} />}
                                color={theme.errorColor}
                                link={"/"+props.match.params.userId+"/admin/employees"}
                            />
                        </Col>
                        <Col xs={24} sm={12} md={6}>
                            <StatCard

                                title="Franchise"
                                value={countData && countData.franchise}
                                icon={<FontAwesomeIcon icon={faPeopleRoof} />}
                                color={theme.successColor}
                                link={"/"+props.match.params.userId+"/admin/franchise"}
                            />
                        </Col>
                        <Col xs={24} sm={12} md={6}>
                            <StatCard

                                title="Brokers"
                                value={countData && countData.brokers}
                                icon={<FontAwesomeIcon icon={faPeopleRobbery} />}
                                color="#fadb14"
                                link={"/"+props.match.params.userId+"/admin/broker"}
                            />
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col xs={24} sm={12} md={6}>
                            <StatCard

                                title="Paid Members"
                                value={countData && countData.paid}
                                icon={<FontAwesomeIcon icon={faIndianRupeeSign} />}
                                color="#fa8c16"
                                link={"/"+props.match.params.userId+"/admin/members/orders-by-status/Paid"}
                            />
                        </Col>
                        <Col xs={24} sm={12} md={6}>
                            <StatCard

                                title="Payment Tried"
                                value={countData && countData.payment_tried}
                                icon={<FontAwesomeIcon icon={faUserTag} />}
                                color="#006d75"
                                link={"/"+props.match.params.userId+"/admin/members/orders-by-status/Payment Tried"}
                            />
                        </Col>
                        <Col xs={24} sm={12} md={6}>
                            <StatCard

                                title="Payment Failed"
                                value={countData && countData.payment_failed}
                                icon={<FontAwesomeIcon icon={faUserXmark} />}
                                color="#10239e"
                                link={"/"+props.match.params.userId+"/admin/members/orders-by-status/Payment Failed"}
                            />
                        </Col>
                        <Col xs={24} sm={12} md={6}>
                            <StatCard

                                title="Complaints"
                                value={countData && countData.complaints}
                                icon={<FontAwesomeIcon icon={faTriangleExclamation} />}
                                color="#d4380d"
                                link={"/"+props.match.params.userId+"/admin/crm/crm-list"}
                            />
                        </Col>
                    </Row>
                    {
                        tableCountData && (<MyTable columns={tableColumns} dataSource={tableCountData} />)
                    }
                    
                </Spin>
            </Card>
        </>
    );
};

export default Dashboard;
