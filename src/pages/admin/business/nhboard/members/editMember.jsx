import axios from 'axios';
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Col, message, Tooltip } from 'antd';
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

const EditMember = (props) => {
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
        form.append('id', props.data.id);
        axios.post('/v1/admin/editmember', form).then(res => {
            if (res['data'].status == '1') {
                toast.success('Member Updated Successfully');
            }
            else {
                toast.error(res['data'].message);
                setShowLoader(false);
            }
        });
    }

    useEffect(() => {

        listStaffData();

    }, []);

    useEffect(() => {
        addForm.setFieldsValue({ name: props.data.name, doctor_name: props.data.doctor_name, ownership: props.data.type_of_ownership, mobile: props.data.mobile, mobile_2: props.data.mobile_2, phone: props.data.phone, email_id: props.data.email_id, alt_email_id: props.data.alt_email_id, address: props.data.address, district: props.data.district, city: props.data.city_taluk, pincode: props.data.pincode, website: props.data.website, hospital_type: props.data.hospital_type, full_hours: props.data.full_hours, speciality: props.data.speciality });
    }, [props.data]);

    const listStaffData = () => {
        try {
            setShowLoader(true);
            var form = new FormData();
            form.append('id', props.match.params.id);
            axios.post('v1/admin/listdata', form).then(res => {
                if (res['data'].status == '1') {
                    var d = res['data'].data;
                    setCollectionData(d);
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
                <Card headStyle={{ backgroundColor: '#1F5F54', color: '#ffffff' }} >
                    <Spin spinning={loader} >
                        {props.data && Object.keys(props.data).length > 0 && (
                            <Form
                                name="basic"
                                form={addForm}
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
                                        >
                                            <Input placeholder="Name" readOnly/>
                                        </Form.Item>
                                    </Col>
                                    <Col className='gutter-row' xs={24} xl={12}>
                                        <Form.Item
                                            label="Doctor Name"
                                            name='doctor_name'
                                            rules={[{ required: true, message: 'Doctor Name is required' }]}
                                        // onKeyPress={lettersOnly}
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
                                            <Select placeholder="Types of ownership" defaultValue={props.data.type_of_ownership}>
                                                <option value="Proprietary" selected={props.data.type_of_ownership == 'Proprietary' ? props.data.type_of_ownership : ''}>Proprietary</option>
                                                <option value="Partnership" selected={props.data.type_of_ownership == 'Proprietary' ? props.data.type_of_ownership : ''}>Partnership</option>
                                                <option value="Pvt.Ltd" selected={props.data.type_of_ownership == 'Proprietary' ? props.data.type_of_ownership : ''}>Pvt.Ltd</option>
                                                <option value="Charitable Trust" selected={props.data.type_of_ownership == 'Proprietary' ? props.data.type_of_ownership : ''}>Charitable Trust</option>
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
                                            <Input placeholder="Mobile No" defaultValue={props.data.mobile} />
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
                                            <Input placeholder="Mobile No" defaultValue={props.data.mobile_2} />
                                        </Form.Item>
                                    </Col>
                                    <Col className='gutter-row' xs={24} xl={12}>
                                        <Form.Item
                                            label="Phone"
                                            name='phone'
                                            onKeyPress={integerIndMobile}
                                        >
                                            <Input placeholder="Phone No" defaultValue={props.data.phone} />
                                        </Form.Item>
                                    </Col>

                                </Row>
                                <Row gutter={16}>

                                    <Col className='gutter-row' xs={24} xl={12}>
                                        <Form.Item
                                            label="Email Id"
                                            name='email_id'
                                        >
                                            <Input placeholder="Email Id" type='email' defaultValue={props.data.email_id} />
                                        </Form.Item>
                                    </Col>
                                    <Col className='gutter-row' xs={24} xl={12}>
                                        <Form.Item
                                            label="Alt Email Id"
                                            name='alt_email_id'
                                        >
                                            <Input placeholder="Alt Email" type="email" defaultValue={props.data.alt_email_id} />
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row gutter={16}>
                                    <Col className='gutter-row' xs={24} xl={12}>
                                        <Form.Item
                                            label="Address"
                                            name='address'
                                        >
                                            <Input placeholder="Address" defaultValue={props.data.address} />
                                        </Form.Item>
                                    </Col>
                                    <Col className='gutter-row' xs={24} xl={12}>
                                        <Form.Item
                                            label="City / Taluk"
                                            name='city'
                                        >
                                            <Input placeholder="City / Taluk" defaultValue={props.data.city_taluk} />
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
                                            <Input placeholder="District" defaultValue={props.data.district} />
                                        </Form.Item>
                                    </Col>
                                    <Col className='gutter-row' xs={24} xl={12}>
                                        <Form.Item
                                            label="Pincode"
                                            name='pincode'
                                            onKeyPress={pincode}
                                        >
                                            <Input placeholder="Pincode" defaultValue={props.data.pincode} />
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Row gutter={16}>
                                    <Col className='gutter-row' xs={24} xl={12}>
                                        <Form.Item
                                            label="Website"
                                            name='website'
                                        >
                                            <Input placeholder="Website" defaultValue={props.data.website} />
                                        </Form.Item>
                                    </Col>
                                    <Col className='gutter-row' xs={24} xl={12}>
                                        <Form.Item
                                            label="Hospital Type"
                                            name='hospital_type'
                                        >
                                            <Select placeholder="Hospital Type" defaultValue={props.data.hospital_type}>
                                                <option value="Multi Speciality" selected={props.data.hospital_type == 'Multi Speciality' ? props.data.hospital_type : ''}>Multi Speciality</option>
                                                <option value="Single Speciality" selected={props.data.hospital_type == 'Single Speciality' ? props.data.hospital_type : ''}>Single Speciality</option>
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
                                            <Radio.Group defaultValue={props.data.full_hours == 'yes' ? 'yes' : 'no'}>
                                                <Radio value="yes">Yes</Radio>
                                                <Radio className='ms-5' value="no" >No</Radio>
                                            </Radio.Group>
                                        </Form.Item>
                                    </Col>
                                    <Col className='gutter-row' xs={24} xl={12}>
                                        <Form.Item
                                            label="If single specialty"
                                            name='speciality'
                                        >
                                            <Input placeholder="Specialty" defaultValue={props.data.speciality} />
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Form.Item wrapperCol={{ offset: 21, span: 24 }}>
                                    <Button size="large" type="primary" htmlType="submit">
                                        Update
                                    </Button>
                                </Form.Item>
                            </Form>)}
                    </Spin>
                </Card>
            </Content>

        </>
    );

}
export default EditMember;