import axios from 'axios';
import React, { useState, useEffect, useContext } from 'react';
import { Navigate,useNavigate } from 'react-router-dom';
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
import { lettersOnly, integerIndMobile, pincode, website } from '../../utilFunctions'
import $ from 'jquery';
import { Tabs, Tab, Table } from 'react-bootstrap';
import toast from 'react-hot-toast';

const PageOne = (props) => {
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

    const [collectionData, setCollectionData] = useState([]);
    const [country, setCountry] = useState('');
    const [one, setOne] = useState(0);
    const [two, setTwo] = useState(0);
    const [three, setThree] = useState(0);
    const [four, setFour] = useState(0);
    const [five, setFive] = useState(0);
    const [six, setSix] = useState(0);
    const [data, setData] = useState(null);
    //const [total, setTotal] = useState('');

    useEffect(() => {
        listStaffData();
        if(context.customerUser.member_status=='waiting'){
            $('input').attr('disabled', true);            
        }
       
    }, []);

    const onMemberFormFinish = (values) => {

        var form = new FormData();
        Object.entries(values).forEach(([key, value]) => {
            form.append(key, value);
        });
        form.append('id', context.customerUser.id);
        form.append('page_id', 1);
        axios.post('/v1/admin/editmember', form).then(res => {
            if (res['data'].status == '1') {
                //document.getElementById("editform").reset();
                toast.success('Member Details Updated Successfully');
                props.onFormFinish();
            }
            else {
                toast.error(res['data'].message);
                setShowLoader(false);
            }
        });
    }
    useEffect(() => {
        // navigate()
        listStaffData();
    }, []);
    if (context.customerLogged !== 'yes') {
        return (<Navigate to="/login" />);
    }
    const listStaffData = () => {
        try {
            setShowLoader(true);
            var form = new FormData();
            form.append('id', context.customerUser.id);
            axios.post('v1/admin/liststaffdata', form).then(res => {
                if (res['data'].status == '1') {
                    var d = res['data'].data;

                    addForm.setFieldsValue({
                        name: d.name,
                        doctor_name: d.doctor_name,
                        mobile: d.mobile,
                        ownership: d.type_of_ownership,
                        email_id: d.email_id,
                        mobile_2: d.mobile_2,
                        phone: d.phone,
                        alt_email_id: d.alt_email_id,
                        address: d.address,
                        city: d.city_taluk,
                        district: d.district,
                        pincode: d.pincode,
                        website: d.website,
                        hospital_type: d.hospital_type,
                        speciality: d.speciality,
                        '24hour': d.full_hours,
                        page_id:d.page_id,
                    })

                    setData(d);
                }
                else {
                    setShowLoader(false);
                }
            });
        }
        catch (er) {

        }
    }
    const onChangeValueOne = (value) => {
        setOne(value);
        var total = 0;
        total += value + two + three + four + five + six;
        addForm.setFieldsValue({ total_room: total });
    }
    const onChangeValueTwo = (value) => {
        setTwo(value);
        var total = 0;
        total += one + value + three + four + five + six;
        addForm.setFieldsValue({ total_room: total });
    }
    const onChangeValueThree = (value) => {
        setThree(value);
        var total = 0;
        total += one + two + value + four + five + six;
        addForm.setFieldsValue({ total_room: total });
    }
    const onChangeValueFour = (value) => {
        setFour(value);
        var total = 0;
        total += one + two + three + value + five + six;
        addForm.setFieldsValue({ total_room: total });
    }
    const onChangeValueFive = (value) => {
        setFive(value);
        var total = 0;
        total += one + two + three + four + value + six;
        addForm.setFieldsValue({ total_room: total });
    }
    const onChangeValueSix = (value) => {
        setSix(value);
        var total = 0;
        total += one + two + three + four + five + value;
        addForm.setFieldsValue({ total_room: total });
    }

    // const totalValue = () => {
    //     var total = 1;
    //     total = one + two + three + four + five + six;
    //     addForm.setFieldsValue({ total_room: total });
    // }




    return (
        <>
            <Content
                className="site-layout-background"
                style={{
                    padding: '5px 24px 0px 24px',
                    margin: 0

                }}
            >

                <Row style={{ background: '#0000', padding: '5px 30px 5px 30px', textAlign: 'center' }}>
                    <Col md={24} style={{ textAlign: 'center' }}>


                    </Col>
                </Row>

                <Card title="General Information" headStyle={{ backgroundColor: '#0b0c26', color: '#ffffff' }} bodyStyle={{ backgroundColor: '#FFF' }}><Form
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
                                                name='name'
                                                rules={[{ required: true, message: 'Name is required' }]}
                                                onKeyPress={lettersOnly}
                                                readOnly
                                            >
                                                <Input placeholder="Name" />
                                            </Form.Item>
                                        </Col>
                                        <Col className='gutter-row' xs={24} xl={12}>
                                            <Form.Item
                                                label="Doctor Name"
                                                name='doctor_name'
                                                rules={[{ required: true, message: 'Doctor Name is required' }]}
                                                onKeyPress={lettersOnly}
                                            >
                                                <Input placeholder="Doctor Name" />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row gutter={16}> {/* tow column row start */}
                                        <Col className='gutter-row' xs={24} xl={12}>
                                            <Form.Item
                                                label="Types of ownership"
                                                name='ownership'
                                                rules={[{ required: true, message: 'Ownership is required' }]}
                                            >
                                                <Select placeholder="Types of ownership">
                                                    <option value="Proprietary">Proprietary</option>
                                                    <option value="Partnership">Partnership</option>
                                                    <option value="Public Limited">Public Limited</option>
                                                    <option value="Private Limited">Private Limited</option>
                                                    <option value="Charitable Trust">Charitable Trust</option>
                                                </Select>
                                            </Form.Item>
                                        </Col>
                                        <Col className='gutter-row' xs={24} xl={12}>
                                            <Form.Item
                                                label="Mobile"
                                                name='mobile'
                                                onKeyPress={integerIndMobile}
                                                rules={[{ required: true, message: 'Mobile is required' }]}
                                            >
                                                <Input placeholder="Mobile No" />
                                            </Form.Item>
                                        </Col>

                                    </Row>
                                    <Row gutter={16}> {/* tow column row start */}
                                        <Col className='gutter-row' xs={24} xl={12}>
                                            <Form.Item
                                                label="Mobile 2"
                                                name='mobile_2'
                                                onKeyPress={integerIndMobile}
                                                
                                            >
                                                <Input placeholder="Mobile No" />
                                            </Form.Item>
                                        </Col>
                                        <Col className='gutter-row' xs={24} xl={12}>
                                            <Form.Item
                                                label="Phone"
                                                name='phone'
                                                onKeyPress={integerIndMobile}
                                            >
                                                <Input placeholder="Phone No" />
                                            </Form.Item>
                                        </Col>

                                    </Row>
                                    <Row gutter={16}>

                                        <Col className='gutter-row' xs={24} xl={12}>
                                            <Form.Item
                                                label="Email Id"
                                                name='email_id'
                                                rules={[{ required: true, message: 'Email is required' }]}
                                            >
                                                <Input placeholder="Email Id" type='email' />
                                            </Form.Item>
                                        </Col>
                                        <Col className='gutter-row' xs={24} xl={12}>
                                            <Form.Item
                                                label="Alt Email Id"
                                                name='alt_email_id'
                                            >
                                                <Input placeholder="Alt Email" type="email" />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row gutter={16}>
                                        <Col className='gutter-row' xs={24} xl={12}>
                                            <Form.Item
                                                label="Address"
                                                name='address'
                                                rules={[{ required: true, message: 'Address is required' }]}
                                            >
                                                <Input placeholder="Address" />
                                            </Form.Item>
                                        </Col>
                                        <Col className='gutter-row' xs={24} xl={12}>
                                            <Form.Item
                                                label="City / Taluk"
                                                name='city'
                                                rules={[{ required: true, message: 'City is required' }]}
                                            >
                                                <Input placeholder="City / Taluk" />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row gutter={16}>
                                        <Col className='gutter-row' xs={24} xl={12}>
                                            <Form.Item
                                                label="District"
                                                name='district'
                                                onKeyPress={lettersOnly}
                                                rules={[{ required: true, message: 'District is required' }]}
                                            >
                                                <Input placeholder="District" />
                                            </Form.Item>
                                        </Col>
                                        <Col className='gutter-row' xs={24} xl={12}>
                                            <Form.Item
                                                label="Pincode"
                                                name='pincode'
                                                onKeyPress={pincode}
                                                rules={[{ required: true, message: 'Pincode is required' }]}
                                            >
                                                <Input placeholder="Pincode" />
                                            </Form.Item>
                                        </Col>
                                    </Row>

                                    <Row gutter={16}>
                                        <Col className='gutter-row' xs={24} xl={12}>
                                            <Form.Item
                                                label="Website"
                                                name='website' 
                                                defaultValue={website}
                                                onChange={website}
                                            >
                                                <Input placeholder="Website"  type="url"/>
                                                Ex: http://www.test.com
                                            </Form.Item>
                                        </Col>
                                        <Col className='gutter-row' xs={24} xl={12}>
                                            <Form.Item
                                                label="Hospital Type"
                                                name='hospital_type'
                                            >
                                                <Select placeholder="Hospital Type">
                                                    <option value="Multi Speciality">Multi Speciality</option>
                                                    <option value="Single Speciality">Single Speciality</option>
                                                </Select>
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row gutter={16}>
                                        <Col className='gutter-row' xs={24} xl={12}>
                                            <Form.Item
                                                label="24 Hrs"
                                                name='24hour'
                                                rules={[{ required: true, message: '24Hours is required' }]}
                                            >
                                                <Radio.Group>
                                                    <Radio value="yes">Yes</Radio>
                                                    <Radio className='ms-5' value="no">No</Radio>
                                                </Radio.Group>
                                            </Form.Item>
                                        </Col>
                                        <Col className='gutter-row' xs={24} xl={12}>
                                            <Form.Item
                                                label="If single specialty"
                                                name='speciality'
                                                //rules={[{ required: true, message: 'Specialty is required' }]}
                                            >
                                                <Input placeholder="Specialty" />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    {context.customerUser.member_status=='initiated' 
                                    && (<Form.Item wrapperCol={{ offset: 21, span: 24 }}>
                                        <Button size="large" type="primary" htmlType="submit">
                                            Save & next
                                        </Button>
                                    </Form.Item>)}
                                    
                                </Form></Card></Content>

        </>
    );

}
export default PageOne;