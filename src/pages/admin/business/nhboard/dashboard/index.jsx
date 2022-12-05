import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

import axios from 'axios';
import StatCard from './statcard'
import {
    Card,
    Col,
    Row,
    Spin,
} from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserCheck, faUser, faUserTimes, faUserClock, faUserLock, faUserUnlock } from '@fortawesome/free-solid-svg-icons'
import { PaginatedTable } from '../../../../../comp';
const Dashboard = () => {

    const [loader, setLoader] = useState(false);
    const [countData, setCountData] = useState([]);
    const [renewal, setRenewal] = useState({});
    const [wait, setWait] = useState({});
    const [live, setLive] = useState({});
    const [refreshTable, setRefreshTable] = useState(0);
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
        loadMemberCounts();

    }, []);

    const loadMemberCounts = () => {

        setLoader(true);

        axios.get('v1/admin/getdashboarddata').then(res => {
            if (res['data'].status === '1') {
                setRenewal(res['data'].renew);
                setWait(res['data'].waiting);
                setLive(res['data'].live);
            }
            else {
                toast.error(res['data'].message || 'Error');
            }
            setLoader(false);
        });

    };
    const columns = [

        {
            title: "Distrct",
            //  align: "left",
            render: (text, item) => (
                <>
                    <div>{(item.district)}</div>

                </>
            )
        },
        {
            title: "Status",
            render: (text, record, index) => (
                <>
                    <div> {(record.member_status)}</div>

                </>
            ),
        },
        {
            title: "members",
            render: (text, record, index) => (
                <>
                    <div> {(record.count)}</div>

                </>
            ),
        },

    ];
    return (
        <>
            <Card title="Dashboard">
                <Spin spinning={loader} >
                    <Row gutter={16}>
                        <Col xs={24} sm={12} md={6}>
                            <StatCard
                                title="Pending Enrollment"
                                value={wait.waiting}
                                icon={<FontAwesomeIcon icon={faUser} />}
                                color={theme.primaryColor}
                                link='admin/waitingmember'
                            />
                        </Col>
                        <Col xs={24} sm={12} md={6}>
                            <StatCard
                                title="Pending Renewals"
                                value={renewal.renew}
                                icon={<FontAwesomeIcon icon={faUserLock} />}
                                color={theme.errorColor}
                                link='admin/renewalmember'
                            />
                        </Col>
                        <Col xs={24} sm={12} md={6}>
                            <StatCard
                                title="Live Hospital"
                                value={live.live}
                                icon={<FontAwesomeIcon icon={faUserCheck} />}
                                color={theme.successColor}
                                link='admin/livehospital'
                            />
                        </Col>
                    </Row>
                </Spin>
            </Card>

            <Card title="Members">
                <PaginatedTable
                    columns={columns}
                    refresh={refreshTable}
                    countQuery={"select count(*) as count FROM `hospital_members` where district is not null and district<>'' group by district,member_status"}
                    listQuery={"select district,member_status,count(*) as count,@rownum:=@rownum+1 as row_number FROM `hospital_members`   CROSS JOIN (SELECT @rownum:={rowNumberVar}) c where district is not null and district<>'' group by district,member_status order by district"}
                    itemsPerPage={100}
                />
            </Card>
        </>
    );
};
export default Dashboard;
