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
import StatCard from './statcard'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserCheck, faUser, faUserTimes, faUserClock, faEye, faCheck, faClose, faHeart, faPeoplePulling } from '@fortawesome/free-solid-svg-icons'
import { MyButton, MyTable } from '../../../../comp'
import { green, yellow, grey } from '@ant-design/colors';
import toast from 'react-hot-toast';
import axios from 'axios';
import { Tabs, Tab, Table, Nav } from 'react-bootstrap';
import { getPaymentInfo } from '../../../admin/business/matrimony/models/matrimonyCore';
const CustomerDashboard = (props) => {
  const { Option } = Select;
  const context = useContext(PsContext);
  const [visibleArticleModal, setVisibleArticleModal] = useState(false)
  const [loader, setLoader] = useState(false);
  const [countData, setCountData] = useState([]);

  const [paymentInfo,setPaymentInfo]=useState(null)
  const navigate = useNavigate();
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
    loadCountData()
    getPaymentInfo(context.customerUser.id).then(res => {
      setPaymentInfo(res)
   })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const loadCountData=()=>{
    var reqData = [
      { 
      query_type: 'query', 
      query: "select count(distinct to_member_auto_id) as count from member_actions where action='express-interest' and member_auto_id='" + context.customerUser.id + "'"
      },
      { 
          query_type: 'query', 
          query: "select count(distinct to_member_auto_id) as count from member_actions where action='contact-view' and member_auto_id='" + context.customerUser.id + "'"
      },
      { 
        query_type: 'query', 
        query: "select count(*)  as count from members m where m.caste=(select caste from members where id='"+context.customerUser.id+"')"
    },
  ]

  context.psGlobal.apiRequest(reqData,"prod").then((res,error)=>{
      var cData={
        express_interest:res[0][0]['count'],
        viewed:res[1][0]['count'],
        mymatches:res[2][0]['count'],
      }
      setCountData(cData);
     
  }).catch(err => {
      message.error(err);
      setLoader(false);
  })
  }
  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col-md-3">
            <div className="d-none d-sm-block">
              <div className="card">
                <img
                  alt="profile"
                  className="card-img"
                  src={context.customerUser.photo ? context.baseUrl + context.customerUser.photo : context.customerUser.gender === 'Male' ? context.noMale : context.noFemale}
                  style={{ maxHeight: 250, background: "rgb(239, 239, 239)" }}
                />
                <div className="card-body">
                 {/*  <div className="user-sidemenu list-group">
                    <div className="list-group-item">
                      <a href="/app/my-profile/basic">
                        Basic Details
                        <span className="float-right ">
                          <i className="icofont-check text-success font-15 font-weight-600" />
                        </span>
                      </a>
                    </div>
                    <div className="list-group-item">
                      <a href="/app/my-profile/education">
                        Education and Career
                        <span className="float-right ">
                          <i className="icofont-check text-success font-15 font-weight-600" />
                        </span>
                      </a>
                    </div>
                    <div className="list-group-item">
                      <a href="/app/my-profile/photos">
                        Media (Photos)
                        <span className="float-right ">
                          <i className="icofont-close text-danger font-15 font-weight-600" />
                        </span>
                      </a>
                    </div>
                    <div className="list-group-item">
                      <a href="/app/my-profile/family">
                        Family Details
                        <span className="float-right ">
                          <i className="icofont-check text-success font-15 font-weight-600" />
                        </span>
                      </a>
                    </div>
                    <div className="list-group-item">
                      <a href="/app/my-profile/partner_preference">
                        Partner Preference
                        <span className="float-right ">
                          <i className="icofont-check text-success font-15 font-weight-600" />
                        </span>
                      </a>
                    </div>
                  </div> */}
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-9">
            <div className="dahboard_welcome_message">
              <div className="row">
                <div className="col-md-9">
                  <div className="text-white mb-20">
                    Hi, <b>{context.customerUser.name}</b>, Welcome back <br />
                    <span className="font-13">
                      Profile Id : {context.customerUser.member_id}  <i className="icofont-envelope pe-1" />
                       {context.customerUser.email}
                      <i className="icofont-phone pe-1" /> {context.customerUser.mobile_no}
                    </span>
                  </div>
                  {paymentInfo && (paymentInfo.status!=="Paid" || paymentInfo.availableCredits<=0) && (<div role="alert" className="fade font-13 alert alert-warning show">
                   [{paymentInfo.status}, Available Credits:{paymentInfo.availableCredits}] Upgrade your plan to get more benefits.
                    <a
                      className="ms-2"
                      href="/0/customer/membership"
                      style={{ textDecoration: "underline" }}
                    >
                      Buy a Plan
                    </a>
                  </div>)}
                  {
                    paymentInfo && paymentInfo.status==="Paid" && paymentInfo.availableCredits>0 && (<div role="alert" className="fade font-13 alert alert-warning show">
                    Available Credits : {paymentInfo.availableCredits}
                   </div>)
                  }
                  
                </div>
              </div>
            </div>
            <br/>
            <Row gutter={16}>
                                <Col xs={24} sm={12} md={8}>
                                    <StatCard

                                        title="My Matches"
                                        value={countData && countData.mymatches}
                                        icon={<FontAwesomeIcon icon={faPeoplePulling} />}
                                        color={theme.primaryColor}
                                        link={'/0/customer/mymatches'}
                                    />
                                </Col>
                                <Col xs={24} sm={12} md={8}>
                                    <StatCard

                                        title="Interest Sent"
                                        value={countData && countData.express_interest}
                                        icon={<FontAwesomeIcon icon={faHeart} />}
                                        color={theme.errorColor}
                                        link={'/0/customer/express-interest/me'}
                                    />
                                </Col>
                                <Col xs={24} sm={12} md={8}>
                                    <StatCard

                                        title="Viewed Profiles"
                                        value={countData && countData.viewed}
                                        icon={<FontAwesomeIcon icon={faUserCheck} />}
                                        color={theme.successColor}
                                        link={'/0/customer/profile-views/me'}
                                    />
                                </Col>
                              
                            </Row>
            <br />
           
          </div>
        </div>
      </div>

    </>
  );

}
export default CustomerDashboard;