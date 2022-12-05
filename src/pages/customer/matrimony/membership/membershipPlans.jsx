import React, { useState, useEffect, useContext } from 'react';
import { Navigate, withRouter, Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Row, Col, message } from 'antd';
import { ImageUpload } from '../../../../comp'
import { Spin, Card } from 'antd';
import { Button, Checkbox, Space, DatePicker } from 'antd';
import { Form, Input, Select, InputNumber, Modal, Image } from 'antd';
import PsContext from '../../../../context';
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserCheck, faUser, faUserTimes, faUserClock, faEye, faCheck, faClose, faIndianRupeeSign } from '@fortawesome/free-solid-svg-icons'
import { MyButton, MyTable } from '../../../../comp'
import { green, yellow, grey,red } from '@ant-design/colors';
import './price-table.css'
const MembershipPlans = (props) => {
    const context = useContext(PsContext);
    const navigate = useNavigate();
    const [planData, setPlanData] = useState([]);
    const { isPublic, ...other } = props;

    useEffect(() => {

        loadPlanData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const loadPlanData = () => {

        var reqData = {
            query_type: 'query',
            query: "select * from packages  where status=1 and category='Plan' and package_for='Customer(Online)' and package_status='Active' order by package_price desc",
            encrypt: ['mobile_no', 'mobile_alt_no_1', 'mobile_alt_no_2', 'whatsapp_no']
        };
        context.psGlobal.apiRequest(reqData, "prod").then((res) => {
            setPlanData(res);


        }).catch(err => {
            message.error(err);


        })
    }
    const getFeatures=(plan)=>{
       var features=[];
        features.push(<li><FontAwesomeIcon icon={faCheck} style={{color:green[7]}}/> {plan.consume_credits} Contacts</li>);
        features.push( <li><FontAwesomeIcon icon={faCheck} style={{color:green[7]}}/> Express Interest</li>)
        
        if (parseInt(plan['is_send_sms']) === 1)
          features.push(<li><FontAwesomeIcon icon={faCheck} style={{color:green[7]}}/> Send SMS</li>)
        else
         features.push(<li><FontAwesomeIcon icon={faClose} style={{color:red[7]}}/> Send SMS</li>)

        if (parseInt(plan['is_send_whatsapp']) == 1)
        features.push(<li><FontAwesomeIcon icon={faCheck} style={{color:green[7]}}/> Send WhatsApp</li>)
        else
        features.push(<li><FontAwesomeIcon icon={faClose} style={{color:red[7]}}/> Send WhatsApp</li>)

        if (parseInt(plan['is_vip']) == 1)
        features.push(<li><FontAwesomeIcon icon={faCheck} style={{color:green[7]}}/> VIP Plan</li>)
        else
        features.push(<li><FontAwesomeIcon icon={faClose} style={{color:red[7]}}/> VIP Plan</li>)


        return features;
    }
    const onBuyClick=(item)=>{
        if(isPublic){
            navigate('/public/login')
        }else{
       // setViewOrEditData(item); 
       // setCurAction("view")
        }
    }
    return (
        <>
            <section id="pricing-tables">
                <div className="container">
                    <Row gutter={48}>
                        {
                            planData.map(item=>{
                                return <Col className='gutter-row' xs={24} xl={8}>
                                <div className="single-table text-center">
                                    <div className="plan-header">
                                        <h3>{item.plan_name}</h3>
                                        <p> {item.validity_months} Month</p>
                                        <h4 className="plan-price"><FontAwesomeIcon icon={faIndianRupeeSign}/> {item.package_price}<span></span></h4>
                                    </div>
                                    <ul className="plan-features">
                                        {getFeatures(item)}
                                    </ul>
                                    <a className="plan-submit hvr-bounce-to-right"  onClick={()=>onBuyClick(item)}>buy now</a>
                                </div>
                            </Col>
                            })
                        }
                    </Row>

                </div>
            </section>

        </>
    );

}
export default MembershipPlans;