import React, { useState, useEffect, useContext } from 'react';
import { Navigate, withRouter, Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Row, Col, message } from 'antd';
import { FormViewItem, ImageUpload } from '../../../../comp'
import { Spin, Card } from 'antd';
import { Button, Checkbox, Space, DatePicker } from 'antd';
import { Form, Input, Select, InputNumber, Modal, Image } from 'antd';
import PsContext from '../../../../context';
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserCheck, faUser, faUserTimes, faUserClock, faEye, faCheck, faClose } from '@fortawesome/free-solid-svg-icons'
import { MyButton, MyTable } from '../../../../comp'
import { green, yellow, grey } from '@ant-design/colors';
import { getPaymentInfo } from '../../../admin/business/matrimony/models/matrimonyCore';
const MyPlan = (props) => {
    const context = useContext(PsContext);
    const navigate = useNavigate();
    const [paymentInfo, setPaymentInfo] = useState(null);

    useEffect(() => {
        getPaymentInfo(context.customerUser.id).then(res => {
            setPaymentInfo(res)
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <div className="container">
                <Card title="My Current Plan">
                    {paymentInfo && paymentInfo.status === "Unpaid" && (<span>No Active Plan</span>)}
                    {paymentInfo && (paymentInfo.status === "Paid" || paymentInfo.status === "Expired") && (<>
                        <Form
                            name="basic"
                            labelAlign="left"
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 20 }}
                            initialValues={{ remember: true }}
                            autoComplete="off"
                        >
                            <Row gutter={16}>
                                <Col className='gutter-row' xs={24} xl={12}>
                                    <FormViewItem label="Order Id">{paymentInfo.orderData.order_id}</FormViewItem>
                                </Col>
                                <Col className='gutter-row' xs={24} xl={12}>
                                    <FormViewItem label="Plan Name">{paymentInfo.orderData.plan_name}</FormViewItem>
                                </Col>
                                <Col className='gutter-row' xs={24} xl={12}>
                                    <FormViewItem label="Daily Limit">{paymentInfo.orderData.daily_limit}</FormViewItem>
                                </Col>
                                <Col className='gutter-row' xs={24} xl={12}>
                                    <FormViewItem label="Monthly Limit">{paymentInfo.orderData.monthly_limit}</FormViewItem>
                                </Col>
                                <Col className='gutter-row' xs={24} xl={12}>
                                    <FormViewItem label="Validity Months">{paymentInfo.orderData.validity_months}</FormViewItem>
                                </Col>
                                <Col className='gutter-row' xs={24} xl={12}>
                                    <FormViewItem label="Consume Credits">{paymentInfo.orderData.consume_credits}</FormViewItem>
                                </Col>
                                <Col className='gutter-row' xs={24} xl={12}>
                                    <FormViewItem label="Used Credits">{paymentInfo.orderData.used_credits}</FormViewItem>
                                </Col>
                                <Col className='gutter-row' xs={24} xl={12}>
                                    <FormViewItem label="Is Send Sms">{parseInt(paymentInfo.orderData.is_send_sms) === 1 ? 'Yes' : 'No'}</FormViewItem>
                                </Col>
                                <Col className='gutter-row' xs={24} xl={12}>
                                    <FormViewItem label="Is Send Whatsapp">{parseInt(paymentInfo.orderData.is_send_whatsapp) === 1 ? "Yes" : "No"}</FormViewItem>
                                </Col>
                                <Col className='gutter-row' xs={24} xl={12}>
                                    <FormViewItem label="Is Vip">{parseInt(paymentInfo.orderData.is_vip) === 1 ? "Yes" : "No"}</FormViewItem>
                                </Col>
                                <Col className='gutter-row' xs={24} xl={12}>
                                    <FormViewItem label="Order Date">{moment(paymentInfo.orderData.order_date).format("DD/MM/YYYY")}</FormViewItem>
                                </Col>
                                <Col className='gutter-row' xs={24} xl={12}>
                                    <FormViewItem label="Paid Date">{moment(paymentInfo.orderData.paid_date).format("DD/MM/YYYY")}</FormViewItem>
                                </Col>
                                <Col className='gutter-row' xs={24} xl={12}>
                                    <FormViewItem label="Payment Mode">{paymentInfo.orderData.payment_mode}</FormViewItem>
                                </Col>
                                <Col className='gutter-row' xs={24} xl={12}>
                                    <FormViewItem label="Expiry Date">{moment(paymentInfo.orderData.expiry_date).format("DD/MM/YYYY")}</FormViewItem>
                                </Col>
                            </Row>

                        </Form>
                    </>)}
                </Card>
            </div>
        </>
    );

}
export default MyPlan;