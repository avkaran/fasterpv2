import React, { useState, useEffect,useContext } from 'react';
import { useParams } from 'react-router-dom';
import StatCard from './statcard'
import {
    Card,
    Col,
    message,
    Row,
    Spin,
} from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserClock,faUserGroup,faMale,faFemale } from '@fortawesome/free-solid-svg-icons'
import PsContext from '../../../../../context';

const Dashboard = (props) => {

    const context = useContext(PsContext);
const {userId}=useParams();
    const [loader, setLoader] = useState(false);
    const [countData, setCountData] = useState([]);
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
        loadUserCounts();

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const loadUserCounts = () => {

        setLoader(true);
        context.psGlobal.apiRequest('v1/admin/user-counts',context.adminUser(userId).mode).then((res,error)=>{
            if(res)  setCountData(res);
            else  message.error(error);
            setLoader(false);
           
        })
       /*  axios.post('v1/admin/user-counts').then(res => {
            if (res['data'].status === '1') {
                setCountData(res['data'].data);
            }
            else {
                toast.error(res['data'].message || 'Error');
            }
            setLoader(false);
        }); */

    };
    const getCount = (status) => {

        if (countData) {

            let d = countData.find((item) => item.category === status);

            return d ? parseInt(d.count):0;
        }
        else
            return ''

    }
  
    return (
        <>
            <Card title="Dashboard">
              

                <Spin spinning={loader} >

                    <Row gutter={16}>
                        <Col xs={24} sm={12} md={6}>
                            <StatCard

                                title="All Users"
                                value={getCount('all_users')}
                                icon={<FontAwesomeIcon icon={faUserGroup} />}
                                color={theme.primaryColor}
                                link='app/users'
                            />
                        </Col>
                        <Col xs={24} sm={12} md={6}>
                            <StatCard

                                title="Male"
                                value={getCount('Male')}
                                icon={<FontAwesomeIcon icon={faMale} />}
                                color={theme.errorColor}
                                link='app/users/filter/male'
                            />
                        </Col>
                        <Col xs={24} sm={12} md={6}>
                            <StatCard

                                title="Female"
                                value={getCount('Female')}
                                icon={<FontAwesomeIcon icon={faFemale} />}
                                color={theme.successColor}
                                link='app/users/filter/female'
                            />
                        </Col>
                        <Col xs={24} sm={12} md={6}>
                            <StatCard

                                title="New Users(Today)"
                                value={getCount('today_created')}
                                icon={<FontAwesomeIcon icon={faUserClock} />}
                                color={theme.processingColor}
                                link='app/users/filter/today'
                            />
                        </Col>
                    </Row>
                </Spin>
            </Card>
        </>
    );
};

export default Dashboard;
