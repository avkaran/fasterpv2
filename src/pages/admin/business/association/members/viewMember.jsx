import React, { useState, useEffect, useContext } from 'react';
import { Button, Form, Spin, Row, Col, Card, message, Modal } from 'antd';
import { useNavigate,useParams } from 'react-router-dom';
//import { Row, Col } from 'react-bootstrap';
import { CardFixedTop, momentDate } from '../../../../../utils';
import toast from 'react-hot-toast';
import axios from 'axios';
//import EditWebPage from './editWebPage';
//import ViewWebPage from './viewWebPage';
//import AddWebPage from './addWebPage';
import PsContext from '../../../../../context';
import ViewProfile from '../matrimony/viewProfile'
import { MyButton, ViewItem } from '../../../../../comp';
import PhoneInput from 'react-phone-input-2'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFilter } from '@fortawesome/free-solid-svg-icons'
import { faMobileAlt, faClose } from '@fortawesome/free-solid-svg-icons';
import { green, blue, red, cyan, grey } from '@ant-design/colors';
const ViewMember = (props) => {
    const navigate = useNavigate();
    const context = useContext(PsContext);
    const {userId,memberId}=  useParams();
    const [mobileApproveForm] = Form.useForm()
    const [loader, setLoader] = useState(false);
    const [viewData, setViewData] = useState(null);
   
    const [activateLoading, setActivateLoading] = useState(false);
    const [mobileApproveLoading, setMobileApproveLoading] = useState(false);
    const [visibleApproveMobileNumber, setVisibleApproveMobileNumber] = useState(false);
    useEffect(() => {
        loadData(memberId);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const loadData = (id) => {


        setLoader(true);
        var form = new FormData();
        var reqData = { //if array of queries pass [] outside
            query_type: 'query',
            query: "select * from members where id='" + id + "'",
            // table:'test',
            // where:{id:'1'},
            //values:{name:'senthil',age:'13'}

        };
        form.append('queries', context.psGlobal.encrypt(JSON.stringify(reqData)))
        axios.post('v1/admin/db-query', form).then(res => {
            if (res['data'].status === '1') {
                setViewData(res['data'].data[0]);
                mobileApproveForm.setFieldsValue({ mobile_no: res['data'].data[0].mobile_no })
                setLoader(false);
            }
            else {
                toast.error(res['data'].message || 'Error');
            }

        });

    };
    const activateMember = () => {
        setActivateLoading(true);
        var reqData = {
            query_type: 'update', //query_type=insert | update | delete | query
            table: 'members',
            where: { id: viewData.id },
            values: { member_status: 'active',payment_status:'paid' }
        };


        context.psGlobal.apiRequest(reqData, context.adminUser(userId).mode).then((res) => {
            message.success("Member Activated");
            var mydata = viewData;
            mydata.member_status = "active";
            setViewData(mydata);
            setActivateLoading(false);

        }).catch(err => {
            message.error(err);
            setActivateLoading(false);
        })
    }
    const onFinishMobileApprove = (values) => {
        setMobileApproveLoading(true);


        var reqData = {
            query_type: 'query', //query_type=insert | update | delete | query
            query: "select * from members where status='1' and mobile_no='" + values.mobile_no + "' and id<>'" + viewData.id + "'"
        };


        context.psGlobal.apiRequest(reqData, context.adminUser(userId).mode).then((res) => {
            if(res.length>0){
                message.error("Mobile Number Exist for another member");
                setMobileApproveLoading(false);
            }else{
                var reqDataInner = {
                    query_type: 'update', //query_type=insert | update | delete | query
                    table: 'members',
                    where: { id: viewData.id },
                    values: { is_otp_verified: '1' }
                };
        
        
                context.psGlobal.apiRequest(reqDataInner, context.adminUser(userId).mode).then((resInner) => {
                    message.success("Mobile Number Approved");
                    var mydata = viewData;
                    mydata.is_otp_verified = "1";
                    setViewData(mydata);
                    setMobileApproveLoading(false);
                    setVisibleApproveMobileNumber(false);
        
                }).catch(err => {
                    message.error(err);
                    setMobileApproveLoading(false);
                })

            }



        }).catch(err => {
            message.error(err);
            setMobileApproveLoading(false);
        })
        
    }
    return (
        <>
            <Card title="View Member" extra={<Button variant="white" className='border-start ms-2' onClick={() => { navigate.goBack() }}>
                <i className='fa fa-arrow-rotate-left fs-5 px-1'></i> Back
            </Button>}>
                <Row gutter={16}>
                    <Col className='gutter-row' xs={24} xl={12}>Member Status : {viewData && viewData.member_status} {viewData && viewData.member_status !== 'active' && (<MyButton type="primary" onClick={activateMember} loading={activateLoading}>Activate</MyButton>)}</Col>
                    <Col className='gutter-row' xs={24} xl={12}>Mobile Number : {viewData && viewData.mobile_no} {viewData && parseInt(viewData.is_otp_verified) !== 1 && (<MyButton type="primary" onClick={() => setVisibleApproveMobileNumber(true)}>Verify/Approve Mobile Number</MyButton>)}</Col>
                </Row>

                {
                    viewData && (<><ViewItem label="Payment Status" value={viewData.payment_status} labelCol={12} wrapperCol={12} />
                        <ViewItem label="Paid Date" value={viewData.paid_date} labelCol={12} wrapperCol={12} />
                        <ViewItem label="Payment Mode" value={viewData.payment_mode} labelCol={12} wrapperCol={12} />
                        <ViewItem label="Amount" value={viewData.amount} labelCol={12} wrapperCol={12} />
                        <ViewItem label="Payment Info" value={viewData.payment_note} labelCol={12} wrapperCol={12} />
                    </>)
                }
            </Card>


            <div className="fnew-device-page-wrapper" style={{ backgroundColor: '#FFFFFF', padding: '10px 20px 15px 20px' }}>
                <Spin spinning={loader} >
                    {
                        viewData && (<ViewProfile memberData={viewData} showBackButton={false} onBack={() => {
                            // setIsViewProfile(false);
                        }} />)
                    }
                </Spin>


            </div>
            <Modal
                visible={visibleApproveMobileNumber}
                zIndex={10000}
                footer={null}
                closeIcon={<MyButton type="outlined" shape="circle" ><FontAwesomeIcon icon={faClose} /></MyButton>}
                centered={false}
                closable={true}
                style={{ marginTop: '20px' }}
                width={600}
                // footer={null}
                onCancel={() => { setVisibleApproveMobileNumber(false) }}
                title={<span style={{ color: cyan[4] }} ><FontAwesomeIcon icon={faMobileAlt} /> &nbsp; Approve Mobile Number</span>}
            >
                <Form
                    name="basic"
                    form={mobileApproveForm}
                    labelAlign="left"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 20 }}
                    initialValues={{ remember: true }}
                    onFinish={onFinishMobileApprove}
                    autoComplete="off"
                >


                    <Form.Item
                        label="Mobile No"
                        name="mobile_no"
                        rules={[{ required: true, message: 'Please Enter Mobile No' }]}
                    >

                        <PhoneInput
                        // country={'in'}

                        //onChange={phone => {}}
                        />
                    </Form.Item>
                    <Form.Item wrapperCol={{ offset: 12, span: 24 }}>
                        <Button size="large" type="primary" htmlType="submit" style={{}} loading={mobileApproveLoading}>
                            Approve Mobile Number
                        </Button>
                    </Form.Item>

                </Form>


            </Modal>
        </>
    );
};

export default ViewMember;