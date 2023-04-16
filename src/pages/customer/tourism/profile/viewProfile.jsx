import React, { useState, useEffect, useContext } from 'react';
import { Navigate, useParams, Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Row, Col, message } from 'antd';
import { ImageUpload } from '../../../../comp'
import { Spin, Card } from 'antd';
import { Button, Checkbox, Space, DatePicker } from 'antd';
import { Form, Input, Select, InputNumber, Modal, Image } from 'antd';
import PsContext from '../../../../context';
import dayjs from 'dayjs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserCheck, faUser, faUserTimes, faUserClock, faEye, faCheck, faClose } from '@fortawesome/free-solid-svg-icons'
import { MyButton, MyTable } from '../../../../comp'
import { green, yellow, grey } from '@ant-design/colors';
import { FormViewItem } from '../../../../comp';
import moment from 'moment'
const MyProfileView = (props) => {
    const context = useContext(PsContext);
    const navigate = useNavigate();
    const [viewData, setViewData] = useState(null);
    const [loader, setLoader] = useState(false)
    useEffect(() => {
        loadViewData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const loadViewData = () => {
        setLoader(true);
        var reqData = {
            query_type: 'query',
            query: "select * from users where id=" + context.customerUser.id
        };
        context.psGlobal.apiRequest(reqData, "prod").then((res) => {
            setViewData(res[0]);
            setLoader(false);
        }).catch(err => {
            message.error(err);
            setLoader(false);

        })
    }
    return (
        <>

                    <Card title={<>My Profile</>} extra={<MyButton type="outlined" onClick={()=>props.onEditClick()}>Edit</MyButton>}>

                        <Spin spinning={loader}>
                            {
                                viewData && (<>
                                    <Form
                                        name="basic"
                                        labelAlign="left"
                                        labelCol={{ span: 4 }}
                                        wrapperCol={{ span: 20 }}
                                        initialValues={{ remember: true }}
                                        autoComplete="off"
                                    >
                                        <Row gutter={16}>
                                        <Col className='gutter-row' xs={24} xl={24}>
                                                <FormViewItem label="User Id">{viewData.user_id}</FormViewItem>
                                            </Col>
                                            <Col className='gutter-row' xs={24} xl={24}>
                                                <FormViewItem label="Name">{viewData.title +" "+ viewData.first_name +" "+ (viewData.last_name?viewData.last_name:'')}</FormViewItem>
                                            </Col>
                                            <Col className='gutter-row' xs={24} xl={24}>
                                                <FormViewItem label="Gender">{viewData.gender}</FormViewItem>
                                            </Col>
                                            <Col className='gutter-row' xs={24} xl={24}>
                                                <FormViewItem label="Birth Date">{moment(viewData.dob).format("DD-MMM-YYYY")}</FormViewItem>
                                            </Col>
                                            <Col className='gutter-row' xs={24} xl={24}>
                                                <FormViewItem label="Mobile">{viewData.mobile_no}</FormViewItem>
                                            </Col>
                                            <Col className='gutter-row' xs={24} xl={24}>
                                                <FormViewItem label="Email">{viewData.email}</FormViewItem>
                                            </Col>
                                           
                                        </Row>

                                    </Form>
                                </>)
                            }

                        </Spin>
                    </Card>

        </>
    );

}
export default MyProfileView;