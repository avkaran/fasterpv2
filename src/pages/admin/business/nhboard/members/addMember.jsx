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

const AddMember = (props) => {
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

    const onMemberFormFinish = (values) => {
        var form = new FormData();
        Object.entries(values).forEach(([key, value]) => {
            form.append(key, value);
        });
        axios.post('/v1/admin/addmember', form).then(res => {
            if (res['data'].status == '1') {
                document.getElementById("addform").reset();
                toast.success('Member Added Successfully');
                listMember();
            }
            else {
                toast.error(res['data'].message);
                setShowLoader(false);
            }
        });
    }

    const listMember = () => {
        try {
            setShowLoader(true);
            axios.get('v1/admin/listmembers').then(res => {
                if (res['data'].status == '1') {
                    var d = res['data'].data;
                    var Id = d[0].id;
                    navigate('/' + props.match.params.userId + '/admin/members/pagetwo/' + Id);
                }
                else {
                    setShowLoader(false);
                }
            });
        }
        catch (er) {

        }
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
                        <span>Manage Members</span>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>Add Member</Breadcrumb.Item>
                </Breadcrumb>
                <Row style={{ background: '#fff', padding: '5px 30px 5px 30px', textAlign: 'center' }}>
                    <Col md={24} style={{ textAlign: 'center' }}>
                        <h5 className='mt-2'><b></b></h5>
                        <h5><b></b></h5>
                    </Col>
                </Row>
                <Card title="General Information" headStyle={{ backgroundColor: '#1F5F54', color: '#ffffff' }} extra={<Button href={'#' + props.match.params.userId + "/admin/members"}><i className="fa-solid fa-list pe-2" ></i>List Members</Button>}>
                    <Spin spinning={loader} >
                        <Form
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
                                            <option value="Pvt.Ltd">Pvt.Ltd</option>
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
                                    >
                                        <Input placeholder="Address" />
                                    </Form.Item>
                                </Col>
                                <Col className='gutter-row' xs={24} xl={12}>
                                    <Form.Item
                                        label="City / Taluk"
                                        name='city'
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
                                    >
                                        <Input placeholder="District" />
                                    </Form.Item>
                                </Col>
                                <Col className='gutter-row' xs={24} xl={12}>
                                    <Form.Item
                                        label="Pincode"
                                        name='pincode'
                                        onKeyPress={pincode}
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
                                    >
                                        <Input placeholder="Website" />
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
                                    >
                                        <Input placeholder="Specialty" />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Form.Item wrapperCol={{ offset: 21, span: 24 }}>
                                <Button size="large" type="primary" htmlType="submit">
                                    Save & next
                                </Button>
                            </Form.Item>
                        </Form>
                    </Spin>
                </Card>
            </Content>

        </>
    );

}
export default AddMember;