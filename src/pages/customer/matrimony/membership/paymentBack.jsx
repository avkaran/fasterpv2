import React, { useState, useEffect, useContext } from 'react';
import { Navigate, useParams, Link, useSearchParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Row, Col, message } from 'antd';
import { FormViewItem, ImageUpload } from '../../../../comp'
import { Spin, Card } from 'antd';
import { Button, Checkbox, Space, DatePicker } from 'antd';
import { Form, Input, Select, InputNumber, Modal, Image } from 'antd';
import PsContext from '../../../../context';
import dayjs from 'dayjs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserCheck, faUser, faUserTimes, faUserClock, faEye, faCheck, faClose, faIndianRupeeSign } from '@fortawesome/free-solid-svg-icons'
import { MyButton, MyTable } from '../../../../comp'
import { green, yellow, grey } from '@ant-design/colors';
import { getPaymentInfo } from '../../../admin/business/matrimony/models/matrimonyCore';
const MyPaymentBack = (props) => {
    const context = useContext(PsContext);
    const navigate = useNavigate();
    const { orderNumber } = useParams();
    //const [searchParams, setSearchParams] = useSearchParams();
    // searchParams.get("order")
    const [orderInfo, setOrderInfo] = useState(null);

    useEffect(() => {
        loadOrderData(orderNumber)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const loadOrderData = (orderId) => {
        var reqData = {
            query_type: 'query',
            query: "select * from orders  where order_id='" + orderId + "'"

        };
        context.psGlobal.apiRequest(reqData, "prod").then((res) => {
            if (res.length > 0)
                setOrderInfo(res[0]);
        }).catch(err => {
            message.error(err);
        })
    }
    return (
        <>
            <div className="container">
                <Card title={"Order Details  : " + orderNumber}>
                    {
                        orderInfo && (<>
                            <Row>
                                <Col xs={24} xl={18}>
                                <span style={{ color: 'blue' }}>Note: If payment is not reflected but debited in your bank,it will take 2 hours to process, do not make new payment within 2 hours.</span>
                                </Col>
                                <Col xs={24} xl={6}>
                                </Col>
                            </Row>
                            <Row style={{ border: '2px solid green', borderRadius: '10px', marginBottom: '20px', padding: '5px 5px 5px 5px' }}>
                                <Col xs={24} xl={6}>
                                    {
                                        orderInfo.order_status === 'Paid' ? <span style={{ fontSize: '25px', color: 'green' }}>{orderInfo.order_status}</span> : <span style={{ fontSize: '30px', color: 'red' }}>{orderInfo.order_status}</span>
                                    }

                                </Col>
                                <Col xs={24} xl={6}>
                                    <span style={{ fontSize: '25px', color: 'green' }}> <FontAwesomeIcon icon={faIndianRupeeSign} />  {orderInfo.package_price}</span>
                                </Col>
                                <Col xs={24} xl={12}>
                                    {orderInfo.payment_note}
                                   
                                </Col>

                            </Row>


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
                                        <FormViewItem label="Order Id">{orderInfo.order_id}</FormViewItem>
                                    </Col>
                                    <Col className='gutter-row' xs={24} xl={12}>
                                        <FormViewItem label="Plan Name">{orderInfo.plan_name}</FormViewItem>
                                    </Col>
                                    <Col className='gutter-row' xs={24} xl={12}>
                                        <FormViewItem label="Daily Limit">{orderInfo.daily_limit}</FormViewItem>
                                    </Col>
                                    <Col className='gutter-row' xs={24} xl={12}>
                                        <FormViewItem label="Monthly Limit">{orderInfo.monthly_limit}</FormViewItem>
                                    </Col>
                                    <Col className='gutter-row' xs={24} xl={12}>
                                        <FormViewItem label="Validity Months">{orderInfo.validity_months}</FormViewItem>
                                    </Col>
                                    <Col className='gutter-row' xs={24} xl={12}>
                                        <FormViewItem label="Consume Credits">{orderInfo.consume_credits}</FormViewItem>
                                    </Col>
                                    <Col className='gutter-row' xs={24} xl={12}>
                                        <FormViewItem label="Used Credits">{orderInfo.used_credits}</FormViewItem>
                                    </Col>
                                    <Col className='gutter-row' xs={24} xl={12}>
                                        <FormViewItem label="Is Send Sms">{parseInt(orderInfo.is_send_sms) === 1 ? 'Yes' : 'No'}</FormViewItem>
                                    </Col>
                                    <Col className='gutter-row' xs={24} xl={12}>
                                        <FormViewItem label="Is Send Whatsapp">{parseInt(orderInfo.is_send_whatsapp) === 1 ? "Yes" : "No"}</FormViewItem>
                                    </Col>
                                    <Col className='gutter-row' xs={24} xl={12}>
                                        <FormViewItem label="Is Vip">{parseInt(orderInfo.is_vip) === 1 ? "Yes" : "No"}</FormViewItem>
                                    </Col>
                                    <Col className='gutter-row' xs={24} xl={12}>
                                        <FormViewItem label="Order Date">{dayjs(orderInfo.order_date).format("DD/MM/YYYY")}</FormViewItem>
                                    </Col>
                                    <Col className='gutter-row' xs={24} xl={12}>
                                        <FormViewItem label="Paid Date">{dayjs(orderInfo.paid_date).format("DD/MM/YYYY")}</FormViewItem>
                                    </Col>
                                    <Col className='gutter-row' xs={24} xl={12}>
                                        <FormViewItem label="Payment Mode">{orderInfo.payment_mode}</FormViewItem>
                                    </Col>
                                    <Col className='gutter-row' xs={24} xl={12}>
                                        <FormViewItem label="Expiry Date">{dayjs(orderInfo.expiry_date).format("DD/MM/YYYY")}</FormViewItem>
                                    </Col>
                                </Row>

                            </Form>
                        </>)
                    }
                </Card>
            </div>
        </>
    );

}
export default MyPaymentBack;