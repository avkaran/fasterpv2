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
import { useParams } from 'react-router-dom';
import PsContext from '../../../../../context';
import StatCard from './statcard';
import { green, blue, red, cyan, grey, magenta, yellow } from '@ant-design/colors';
import { MyButton, MyTable } from '../../../../../comp';
import moment from 'moment';
import AdminDashboard from './adminDashboard';
import EmployeeDashboard from './employeeDashboard';
const Dashboard = (props) => {
    const context = useContext(PsContext);
    const { userId } = useParams();


    useEffect(() => {

    }, []);

    return (
        <>
            <Card title="Dashboard">
                {
                    context.adminUser(userId).role === 'admin' && (<AdminDashboard userId={userId} />)
                }
                {
                    context.adminUser(userId).role === 'employee' && (<EmployeeDashboard userId={userId} />)
                }
            </Card>
        </>
    );
};

export default Dashboard;
