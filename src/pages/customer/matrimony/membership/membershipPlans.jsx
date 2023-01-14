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
import { faUserCheck, faUser, faUserTimes, faUserClock, faEye, faCheck, faClose, faIndianRupeeSign } from '@fortawesome/free-solid-svg-icons'
import { MyButton, MyTable } from '../../../../comp'
import { green, yellow, grey, red } from '@ant-design/colors';
import './price-table.css'
const MembershipPlans = (props) => {
    const context = useContext(PsContext);
    const navigate = useNavigate();
    const [planData, setPlanData] = useState([]);
    const [discountData, setDiscountData] = useState([])
    const { isPublic, ...other } = props;
    const [buyLoader, setBuyLoader] = useState(false)

    useEffect(() => {

        loadPlanData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const loadPlanData = () => {

        var reqData = [{
            query_type: 'query',
            query: "select * from packages  where status=1 and category='Plan' and package_for='Customer(Online)' and package_status='Active' order by package_price",
            // encrypt: ['mobile_no', 'mobile_alt_no_1', 'mobile_alt_no_2', 'whatsapp_no']
        },
        {
            query_type: 'query',
            query: "select * from package_discounts where status=1 and active_status='Active'  and valid_from<=curdate() and valid_to>=curdate()",
        }
        ];
        context.psGlobal.apiRequest(reqData, "prod").then((res) => {
            setPlanData(res[0]);
            setDiscountData(res[1]);


        }).catch(err => {
            message.error(err);


        })
    }
    const getDiscountInfo = (type, selPlanData) => {

        var percentage = 0;
        var discountAmount = 0;

        var finalAmount = selPlanData && selPlanData.package_price ? parseFloat(selPlanData.package_price) : 0;
        var myDiscountData = discountData.find(item => item.discount_for === selPlanData.id)
        if (myDiscountData) {
            percentage = parseInt(myDiscountData.percentage);
            discountAmount = (parseFloat(selPlanData.package_price) * percentage) / 100;
            finalAmount = parseFloat(selPlanData.package_price) - discountAmount;

        }
        if (type === 'discount-amount')
            return discountAmount;
        else if (type === 'discount-percentage')
            return percentage;
        else if (type === 'final-amount')
            return parseFloat(finalAmount).toFixed(2);


    }
    const getFeatures = (plan) => {
        var features = [];
        features.push(<li><FontAwesomeIcon icon={faCheck} style={{ color: green[7] }} /> {plan.consume_credits} Contacts, {getDiscountInfo('discount-percentage', plan) > 0 && (<span style={{ fontWeight: 'bold', color: 'green' }}>{getDiscountInfo('discount-percentage', plan)}% Discount</span>)}</li>);
        features.push(<li><FontAwesomeIcon icon={faCheck} style={{ color: green[7] }} /> Express Interest</li>)

        if (parseInt(plan['is_send_sms']) === 1)
            features.push(<li><FontAwesomeIcon icon={faCheck} style={{ color: green[7] }} /> Send SMS</li>)
        else
            features.push(<li><FontAwesomeIcon icon={faClose} style={{ color: red[7] }} /> Send SMS</li>)

        if (parseInt(plan['is_send_whatsapp']) == 1)
            features.push(<li><FontAwesomeIcon icon={faCheck} style={{ color: green[7] }} /> Send WhatsApp</li>)
        else
            features.push(<li><FontAwesomeIcon icon={faClose} style={{ color: red[7] }} /> Send WhatsApp</li>)

        if (parseInt(plan['is_vip']) == 1)
            features.push(<li><FontAwesomeIcon icon={faCheck} style={{ color: green[7] }} /> VIP Plan</li>)
        else
            features.push(<li><FontAwesomeIcon icon={faClose} style={{ color: red[7] }} /> VIP Plan</li>)


        return features;
    }
    const onBuyClick = (item) => {
        if (isPublic) {
            navigate('/public/login')
        } else {
            Modal.confirm({
               // icon: <ExclamationCircleOutlined />,
                content: <>You will be redirected to payment Page, Proceed?</>,
                onOk() {

                    setBuyLoader(true);
                    //console.log(context.customerUser.member_id)
                    var processedValues = {};
                    processedValues['member_auto_id'] = context.customerUser.id;
                    processedValues['member_id'] = context.customerUser.member_id;
                    processedValues['plan_name'] = item.plan_name;
                    processedValues['daily_limit'] = item.daily_limit;
                    processedValues['monthly_limit'] = item.monthly_limit;
                    processedValues['validity_months'] = item.validity_months;
                    processedValues['consume_credits'] = item.consume_credits;
                    processedValues['is_send_sms'] = item.is_send_sms;
                    processedValues['is_send_whatsapp'] = item.is_send_whatsapp;
                    processedValues['is_vip'] = item.is_vip;
                    processedValues['category'] = item.category;
                    processedValues['package_for'] = item.package_for;
                    processedValues['is_current_plan'] = 2;
                    processedValues['package_price'] = getDiscountInfo('final-amount', item);
                    processedValues['order_date'] = dayjs().format("YYYY-MM-DD");
                    processedValues['paid_date'] = dayjs().format("YYYY-MM-DD");
                    processedValues['expiry_date'] = dayjs().add(parseInt(item.validity_months) * 30, "days").format("YYYY-MM-DD");
                    processedValues['order_status'] = 'Payment Tried';
                    processedValues['payment_mode'] = 'Online';

                    processedValues['paid_by'] = 'customer';
                    //processedValues['paid_by_ref'] = context.adminUser(userId).ref_id2;

                    var reqDataInsert = [
                        {
                            query_type: 'insert',
                            table: 'orders',
                            values: processedValues

                        }
                    ];
                    context.psGlobal.apiRequest(reqDataInsert, "prod").then((res) => {
                        var createdId = res[0];
                        var padOrderId = 'RCC' + createdId.padStart(9, '0')
                        var reqDataInner = {
                            query_type: 'update',
                            table: 'orders',
                            where: { id: createdId },
                            values: { order_id: padOrderId }

                        };
                        context.psGlobal.apiRequest(reqDataInner, "prod").then(resInner => {
                             context.psGlobal.addLog({
                                log_name: 'payment-tried',
                                logged_type: "customer",
                                logged_by: context.customerUser.id,
                                ref_table_column: 'orders.id',
                                ref_id: createdId,
                                ref_id2: padOrderId,
                                description: 'New Payment Initiate ' + context.customerUser.member_id
                            }).then(logRes => {
                                message.success("moving")
                                setBuyLoader(false)
                                window.location.replace('https://rajmatrimony.com/api/v2_0/make-payment/' + padOrderId)
                            }).catch(err=>{
                                message.error(err)
                            })
                          
                           
                        }).catch(err => {
                            message.error(err);
                            setBuyLoader(false);
                        })



                    }).catch(err => {
                        message.error(err);
                        setBuyLoader(false);
                    })

                },
                onCancel() {
                    //console.log('Cancel');
                },
            })


        }
    }
    return (
        <>
            <section id="pricing-tables">
                <div className="container">
                    <Spin spinning={buyLoader}>
                        <Row gutter={48}>
                            {
                                planData.map(item => {
                                    return <Col className='gutter-row' xs={24} xl={8}>
                                        <div className="single-table text-center">
                                            <div className="plan-header">
                                                <h3>{item.plan_name}</h3>
                                                <p> {item.validity_months} Month</p>
                                                {
                                                    parseInt(getDiscountInfo('discount-percentage', item)) > 0 && (<>
                                                        <h4 className="plan-price">

                                                            <FontAwesomeIcon icon={faIndianRupeeSign} /> <span style={{ textDecoration: 'line-through', fontSize: '30px' }}>{item.package_price}</span> &nbsp; <span style={{ fontSize: '30px' }}>{getDiscountInfo('final-amount', item)}</span></h4>

                                                    </>)
                                                }
                                                {
                                                    parseInt(getDiscountInfo('discount-percentage', item)) === 0 && (<>
                                                        <h4 className="plan-price"><FontAwesomeIcon icon={faIndianRupeeSign} />

                                                            {item.package_price}<span></span></h4>
                                                    </>)
                                                }

                                            </div>
                                            <ul className="plan-features">
                                                {getFeatures(item)}
                                            </ul>
                                            <a className="plan-submit hvr-bounce-to-right" onClick={() => onBuyClick(item)}>buy now</a>
                                        </div>
                                    </Col>
                                })
                            }
                        </Row>
                    </Spin>
                </div>
            </section>

        </>
    );

}
export default MembershipPlans;