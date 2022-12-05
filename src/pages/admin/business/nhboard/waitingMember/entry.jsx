import axios from 'axios';
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Col, message } from 'antd';
import { Button, Card, Checkbox, Upload, Space, DatePicker, Radio } from 'antd';
import { Form, Input, Select, InputNumber } from 'antd';
import { Breadcrumb, Layout, Spin } from 'antd';
import { baseUrl } from '../../../../../utils';
import { HomeOutlined, LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { CountryDropdown, RegionDropdown } from 'react-country-region-selector';
import { listCollections } from '../../../../../models/core'
import moment from 'moment';
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import bcrypt from 'bcryptjs'
import { Steps } from 'antd';
import PsContext from '../../../../../context';
import { lettersOnly, integerIndMobile, momentDate, pincode } from '../utilFunctions'
import $ from 'jquery';
import toast from 'react-hot-toast';


const WaitingEntry = (props) => {
    const context = useContext(PsContext);
    const { Step } = Steps;
    const { Content } = Layout;
    const navigate = useNavigate();
    const [addForm] = Form.useForm();
    const { Option } = Select;
    const { TextArea } = Input;
    const [loader, setLoader] = useState(false);
    const [imgLoading, setImgLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState();
    const [showLoader, setShowLoader] = useState(false);

    const [data, setData] = useState({});
    const [getSub, setGetSub] = useState({});
    const [country, setCountry] = useState('');
    const [subscription, setSubScription] = useState([]);
    const [sub, setSub] = useState([]);
    const [date, setDate] = useState(new Date());
    const [checkValue, setCheckValue] = useState("");
    const [certificateTemplate,setCertificateTemplate]=useState(null);
    const [approveTemplate,setApproveTemplate]=useState(null);
    const dateFormat = 'YYYY/MM/DD';
    const [paidDate,setPaidDate]=useState(moment())

    const onMemberFormFinish = (values) => {
        var form = new FormData();
        form.append('subId', JSON.stringify(getSub));
        form.append('employee_auto_id', data.id);
        form.append('employeeId', data.member_id);
        form.append('payment_status', checkValue);
        Object.entries(values).forEach(([key, value]) => {
            form.append(key, value);
        });
        axios.post('/v1/admin/paymentwaitingentry', form).then(res => {
            if (res['data'].status == '1') {
                document.getElementById("addform").reset();
                processSms()
                toast.success('Enrollment Made Successfully');
                navigate('/' + props.match.params.userId + '/admin');
            }
            else {
                toast.error(res['data'].message);
                setShowLoader(false);
            }
        });
    }

    useEffect(() => {
        listStaffData();
        loadSmsTemplates();

    }, []);
    const loadSmsTemplates=()=>{
        var reqData = [
            { 
            query_type: 'query', 
            query: "select * from sms_templates where template_for='approved-application' and status='1'"
            },
            { 
                query_type: 'query', 
                query: "select * from sms_templates where template_for='certificate-download' and status='1'"
            },
        ]

        context.psGlobal.apiRequest(reqData,context.adminUser(props.match.params.userId).mode).then((res)=>{
            console.log(res)
            setApproveTemplate(res[0][0]);
            setCertificateTemplate(res[1][0]);
           
        }).catch(err => {
            message.error(err);
            setLoader(false);
        })
    }
    const listStaffData = () => {
        try {
            setShowLoader(true);
            var form = new FormData();
            form.append('id', props.match.params.id);
            axios.post('v1/admin/liststaffdata', form).then(res => {
                if (res['data'].status == '1') {
                    var d = res['data'].data;
                    setData(d);
                    loadMemberCounts(d);
                }
                else {
                    setShowLoader(false);
                }
            });
        }
        catch (er) {

        }
    }

    const loadMemberCounts = (d) => {
        setLoader(true);
        axios.post('v1/admin/getsubscription?mstatus=' + d.member_status).then(res => {
            if (res['data'].status == '1') {
                setGetSub(res['data'].data);
            }
            else {
                toast.error(res['data'].message || 'Error');
            }
            setLoader(false);
        });

    };

    // const handleChange = (e) => {
    //     var d = sub.find((item) => {
    //         return item.id == e;
    //     });
    //     setGetSub(d);
    // }

    // const checkChange = (e) => {
    //     setCheckValue(e.target.checked);
    // }
    const processSms = () => {

        //approved sms
        var renewalDate=moment(paidDate).add(5,"years").format("DD/MM/YYYY")
        var smsData = {
            template_id: approveTemplate.template_id, //query_type=insert | update | delete | query
            unicode: approveTemplate.is_unicode,
            messages: [
                {
                    mobile_no: data.mobile,
                    message: approveTemplate.template.replace("{Name}", data.doctor_name).replace("{MemberId}",data.member_id).replace("{RenewalDate}",renewalDate)
                }
            ]
        };
        context.psGlobal.sendSms(smsData).then((res) => {
            // console.log('otp when resend'+ otp)
        }).catch(err => {
            message.error(err);
        })

        //certificate sms
        
        var smsData = {
            template_id: certificateTemplate.template_id, //query_type=insert | update | delete | query
            unicode: certificateTemplate.is_unicode,
            messages: [
                {
                    mobile_no: data.mobile,
                    message: certificateTemplate.template.replace("{Name}", data.doctor_name)
                }
            ]
        };
        context.psGlobal.sendSms(smsData).then((res) => {
            // console.log('otp when resend'+ otp)
        }).catch(err => {
            message.error(err);
        })
    }

    return (
        <>

            <Content
                className="site-layout-background"
                style={{
                    padding: '5px 24px 0px 24px',
                    margin: 0

                }}
            >
                <Breadcrumb style={{ margin: '0', padding: '8px 0px 8px 0px' }}>
                    <Breadcrumb.Item href="">
                        <HomeOutlined />
                    </Breadcrumb.Item>
                    <Breadcrumb.Item >
                        <span>New Enrollment</span>
                    </Breadcrumb.Item>
                </Breadcrumb>
                <Card title="New Enrollment" headStyle={{ backgroundColor: '#1F5F54', color: '#ffffff' }} >
                    <Spin spinning={loader} >
                        { approveTemplate && certificateTemplate && (<Form
                            name="basic"
                            form={addForm}
                            id="addform"
                            labelAlign="left"
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 20 }}
                            initialValues={{ remember: true }}
                            onFinish={onMemberFormFinish}
                            autoComplete="off"
                        >
                            <Row gutter={16}> {/* tow column row start */}
                                <Col className='gutter-row' xs={24} xl={12}>
                                    <Form.Item
                                        label="Hospital Name"
                                    >
                                        <Input value={data.name} style={{ color: 'black' }} disabled />
                                    </Form.Item>
                                </Col>
                                <Col className='gutter-row' xs={24} xl={12}>
                                    <Form.Item
                                        label="Doctor Name"
                                    >
                                        <Input value={data.doctor_name} style={{ color: 'black' }} disabled />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={16} style={{ marginTop: '5px' }}>
                                <Col className='gutter-row' xs={24} xl={12}>
                                    <Form.Item
                                        label="Address"
                                    >
                                        <Input value={data.address} style={{ color: 'black' }} disabled />
                                    </Form.Item>
                                </Col>
                                <Col className='gutter-row' xs={24} xl={12}>
                                    <Form.Item
                                        label="Ownership"
                                    >
                                        <Input value={data.type_of_ownership} style={{ color: 'black' }} disabled />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={16} style={{ marginTop: '5px' }}>

                                <Col className='gutter-row' xs={24} xl={12}>
                                    <Form.Item
                                        label="Membership Plan"
                                    >
                                        <Input value={getSub.sub_type} style={{ color: 'black' }} disabled />
                                    </Form.Item>
                                </Col>
                                <Col className='gutter-row' xs={24} xl={12}>
                                    <Form.Item
                                        label="Total Amount"
                                    >
                                        <Input value={getSub.total_amount} style={{ color: 'black' }} disabled />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={16}>
                                <Col className='gutter-row' xs={24} xl={12}>
                                    <Form.Item
                                        label="General Fund"
                                    >
                                        <Input value={getSub.general_fund} style={{ color: 'black' }} disabled />
                                    </Form.Item>
                                </Col>
                                <Col className='gutter-row' xs={24} xl={12}>
                                    <Form.Item
                                        label="Journal Fund"
                                    >
                                        <Input value={getSub.journal_fund} style={{ color: 'black' }} disabled />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={16} style={{ marginTop: '5px' }}>

                                <Col className='gutter-row' xs={24} xl={12}>
                                    <Form.Item
                                        label="Paid Date"
                                        name='paid_date'
                                        rules={[{ required: true, message: 'Paid Date is required' }]}
                                    >
                                        <Space direction="vertical">
                                            <Input type="date" defaultValue={moment(new Date()).format('MM/DD/YYYY')}  onChange={(date)=>setPaidDate(date)} />
                                        </Space>
                                    </Form.Item>
                                </Col>
                                <Col className='gutter-row' xs={24} xl={12}>
                                    <Form.Item
                                        label="Bank Name"
                                        name='bank_name'
                                    >
                                        <Input placeholder='bankname' onKeyPress={lettersOnly} />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={16}>
                                <Col className='gutter-row' xs={24} xl={12}>
                                    <Form.Item
                                        label="Payment Method"
                                        name='payment_method'
                                        rules={[{ required: true, message: 'Payment Method is required' }]}
                                    >
                                        <Select placeholder="Payment Method">
                                            <option value="Cheque">Cheque</option>
                                            <option value="MO">MO</option>
                                            <option value="DD">DD</option>
                                            <option value="NEFT/IMPS">NEFT/IMPS</option>
                                            <option value="Cash">Cash</option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col className='gutter-row' xs={24} xl={12}>
                                    <Form.Item
                                        label="Payment Notes"
                                        name="payment_notes"
                                    >
                                        <TextArea />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Form.Item wrapperCol={{ offset: 21, span: 24 }}>
                                <Button size="large" type="primary" htmlType="submit">
                                    Save payment
                                </Button>
                            </Form.Item>
                        </Form>)
                        }
                    </Spin>
                </Card>
            </Content>

        </>
    );

}
export default WaitingEntry;