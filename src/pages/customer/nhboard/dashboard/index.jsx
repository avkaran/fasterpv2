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
import StatCard from './statcard'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserCheck, faUser, faUserTimes, faUserClock, faEye, faCheck, faClose } from '@fortawesome/free-solid-svg-icons'
import { MyButton, MyTable } from '../../../../comp'
import { green, yellow, grey } from '@ant-design/colors';
import toast from 'react-hot-toast';
import axios from 'axios';
import { Tabs, Tab, Table, Nav } from 'react-bootstrap';
const CustomerDashboard = (props) => {
  const { Option } = Select;
  const context = useContext(PsContext);
  const [visibleArticleModal, setVisibleArticleModal] = useState(false)
  const [loader, setLoader] = useState(false);
  const [countData, setCountData] = useState([]);
  const [articleData, setArticleData] = useState([])
  const [viewArticle, setViewArticle] = useState({});
  const [checkstatus, setCheckStatus] = useState('');
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
    if (context.customerUser.member_status == 'initiated') {
      navigate('/0/customer/register-wizard')
    }
    var reqData = {
      query_type: 'query', //query_type=insert | update | delete | query
      query: "select * from subscription_payments where member_auto_id='" + context.customerUser.id + "'  ORDER BY id DESC LIMIT 1"
      //query: "select * from subscription_payments where member_auto_id='4535'"
    };
    context.psGlobal.apiRequest(reqData, "prod").then((res, error) => {
      if (res[0]) {
        setCheckStatus(res[0].id);
      }
      /*else  message.error("Member Not Found")*/
    }).catch(err => {
      message.error(err);

    })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const checkUser = () => {
    if (context.customerUser.member_status == 'initiated') {

      toast.error("Please completer your registration" || 'Error');
    } else {

    }
  }

  return (
    <>
      <div class="site-main mainpad" style={{ padding: '0px 50px 10px 90px' }}>
        <div>
          <Card title={(context.customerUser.name && 'Welcome ' + context.customerUser.name)}>
            <Tab.Container id="left-tabs-example" defaultActiveKey="1" className="mb-3" fill>
              <Row>
                <Col sm={5}>
                  <Nav variant="pills" className="flex-column">
                    {
                      context.customerUser.member_status == 'waiting' && (<Nav.Item>
                        <Nav.Link eventKey="1">Download Your Filled Form</Nav.Link>
                      </Nav.Item>)
                    }

                    {/* <Nav.Item>
              <Nav.Link href={"#/0/customer/register-wizard"} >View Profile</Nav.Link>
            </Nav.Item> */}
                    {
                      context.customerUser.member_status === 'LIVE' && (<><Nav.Item>
                        <Nav.Link eventKey="3">Certificate</Nav.Link>
                      </Nav.Item>
                        <Nav.Item>
                          <Nav.Link eventKey="4">Receipt</Nav.Link>
                        </Nav.Item></>)
                    }


                  </Nav>
                </Col>
                <Col sm={9}>
                  <Tab.Content style={{ padding: '0 0 0 30px' }}>
                    {
                      context.customerUser.member_status == 'waiting' && (<Tab.Pane eventKey="1">
                        <Card title={context.customerUser.member_status == 'initiated' ? "Registration Pending" : "Registration Completed"}>
                          {context.customerUser.member_status == 'initiated' ? <Button type='primary' onClick={checkUser} target="__blank" >Download Form
                          </Button> : <Button type='primary' target="__blank" href={"https://imanhb.org//nhboard/api/v2_0/v1/admin/downloadform?q=" + context.psGlobal.encrypt("userid-" + context.customerUser.id.toString())} >Download Form
                          </Button>}

                        </Card>
                      </Tab.Pane>)
                    }
                    {
                      context.customerUser.member_status === 'LIVE' && (<> <Tab.Pane eventKey="3">
                        <Card title={context.customerUser.member_status == 'LIVE' ? "Download Certificate" : "Waiting for Approval"}>
                          {context.customerUser.member_status == 'LIVE' ? <Button type='primary' target="__blank" href={"https://imanhb.org//nhboard/api/v2_0/v1/admin/downloadcertificate?q=" + context.psGlobal.encrypt("userid-" + context.customerUser.id.toString())} >Download Certificate
                          </Button> : "Waiting for Approval"}
                        </Card>
                      </Tab.Pane>
                        <Tab.Pane eventKey="4">
                          <Card title={checkstatus > 0 ? "Download Receipt" : "No Receipts Available"}>
                            {checkstatus > 0 ? <Button type='primary' target="__blank" href={"https://imanhb.org//nhboard/api/v2_0/v1/admin/downloadreceipt?q=" + context.psGlobal.encrypt("receipt-" + checkstatus)} >Download Receipt
                            </Button> : " No Receipts Available"}
                          </Card>
                        </Tab.Pane></>)
                    }

                  </Tab.Content>
                </Col>
              </Row>
            </Tab.Container>
          </Card>
        </div>


      </div>

    </>
  );

}
export default CustomerDashboard;