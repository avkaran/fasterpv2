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
import { lettersOnly, integerIndMobile, momentDate, pincode } from '../../../../../utils';
import $, { event } from 'jquery';
import toast from 'react-hot-toast';
import { Tabs, Tab, Table } from 'react-bootstrap';
//import logoone from '../../../../../assets/images/nhb1.png';
//import logotwo from '../../../../../assets/images/nhb2.png';


const ViewPage = (props) => {
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


    const [country, setCountry] = useState('');
    const [one, setOne] = useState('');
    const [two, setTwo] = useState('');
    const [three, setThree] = useState('');
    const [four, setFour] = useState('');
    const [five, setFive] = useState('');
    const [six, setSix] = useState('');
    //const [total, setTotal] = useState('');

    useEffect(() => {
        listStaffData();
    }, []);

    const listStaffData = () => {
        try {
            setShowLoader(true);
            var form = new FormData();
            form.append('id', props.match.params.id);
            axios.post('v1/admin/liststaffdata', form).then(res => {
                if (res['data'].status == '1') {
                    var d = res['data'].data;
                }
                else {
                    setShowLoader(false);
                }
            });
        }
        catch (er) {

        }
    }

    console.log(props.data);


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

                {/* <Card title="Member View" headStyle={{ backgroundColor: '#1F5F54', color: '#ffffff' }} > */}
                {/* <Tabs
                        defaultActiveKey="1"
                        id="fill-tab-example"
                        className="mb-3"
                        fill
                    >
                        <Tab eventKey="1" title="General Information">
                            <ViewMember data={props.data} />
                        </Tab>
                        <Tab eventKey="2" title="Room status">
                            <ViewPageTwo data={props.data} />
                        </Tab>
                        <Tab eventKey="3" title="Oxygen status">
                            <ViewPageThree data={props.data} />
                        </Tab>
                        <Tab eventKey="4" title="Facilitis status">
                            <ViewPageFour data={props.data} />
                        </Tab>
                        <Tab eventKey="5" title="Immaging services status">
                            <ViewPageFive data={props.data} />
                        </Tab>
                        <Tab eventKey="6" title="No of staffs">
                            <ViewPageSix data={props.data} />
                        </Tab>
                        <Tab eventKey="7" title="Membership Manage">

                        </Tab>
                    </Tabs> */}

                <Row>
                    <Col className='gutter-row' xs={24} xl={4}>
                        {/* <img src={logoone} width="50%" className='ms-5' /> */}
                    </Col>
                    <Col className='gutter-row' xs={24} xl={16}>
                        <div style={{ textAlign: 'center', fontSize: '20px' }}><b>INDIAN MEDICAL ASSOCIATION – TAMILNADU STATE BRANCH</b></div>
                        <div style={{ textAlign: 'center', fontSize: '20px' }}><b>NURSING HOME AND HOSPITAL BOARD</b></div>
                    </Col>
                    <Col className='gutter-row' xs={24} xl={4}>
                        {/* <img src={logotwo} width="50%" className='ms-5' /> */}
                    </Col>
                </Row>

                <Row className='mt-4'>
                    <Col className='gutter-row' xs={24} xl={2}>

                    </Col>
                    <Col className='gutter-row' xs={24} xl={20}>
                        <div style={{ textAlign: 'left', fontSize: '17px' }}><b>I . GENERAL INFORMATION :</b></div>
                    </Col>
                </Row>
                <Row className='mt-4'>
                    <Col className='gutter-row' xs={24} xl={2}>

                    </Col>
                    <Col className='gutter-row' xs={24} xl={5}>
                        <div style={{ textAlign: 'left', fontSize: '15px' }}><b>Name of Health Care Unit</b></div>
                    </Col>
                    <Col className='gutter-row' xs={24} xl={1}>
                        :
                    </Col>
                    <Col className='gutter-row' xs={24} xl={5}>
                        <div style={{ textAlign: 'left', fontSize: '15px' }}>{props.data.name == "null" || props.data.name == 'undefined' ? '--' : props.data.name}</div>
                    </Col>
                    <Col className='gutter-row' xs={24} xl={5}>
                        <div style={{ textAlign: 'left', fontSize: '15px' }}><b>Doctor Name</b></div>
                    </Col>
                    <Col className='gutter-row' xs={24} xl={1}>
                        :
                    </Col>
                    <Col className='gutter-row' xs={24} xl={5}>
                        <div style={{ textAlign: 'left', fontSize: '15px' }}>{props.data.doctor_name == "null" || props.data.doctor_name == 'undefined' ? '--' : props.data.doctor_name}</div>
                    </Col>
                    <Col className='gutter-row' xs={24} xl={2}>

                    </Col>
                </Row>
                <Row className='mt-4'>
                    <Col className='gutter-row' xs={24} xl={2}>

                    </Col>
                    <Col className='gutter-row' xs={24} xl={5}>
                        <div style={{ textAlign: 'left', fontSize: '15px' }}><b>Types of ownership</b></div>
                    </Col>
                    <Col className='gutter-row' xs={24} xl={1}>
                        :
                    </Col>
                    <Col className='gutter-row' xs={24} xl={5}>
                        <div style={{ textAlign: 'left', fontSize: '15px' }}>{props.data.type_of_ownership == "null" || props.data.type_of_ownership == 'undefined' ? '--' : props.data.type_of_ownership}</div>
                    </Col>
                    <Col className='gutter-row' xs={24} xl={5}>
                        <div style={{ textAlign: 'left', fontSize: '15px' }}><b>Mobile</b></div>
                    </Col>
                    <Col className='gutter-row' xs={24} xl={1}>
                        :
                    </Col>
                    <Col className='gutter-row' xs={24} xl={5}>
                        <div style={{ textAlign: 'left', fontSize: '15px' }}>{props.data.mobile == "null" || props.data.mobile == 'undefined' ? '--' : props.data.mobile}</div>
                    </Col>
                    <Col className='gutter-row' xs={24} xl={2}>

                    </Col>
                </Row>
                <Row className='mt-4'>
                    <Col className='gutter-row' xs={24} xl={2}>

                    </Col>
                    <Col className='gutter-row' xs={24} xl={5}>
                        <div style={{ textAlign: 'left', fontSize: '15px' }}><b>Mobile 2</b></div>
                    </Col>
                    <Col className='gutter-row' xs={24} xl={1}>
                        :
                    </Col>
                    <Col className='gutter-row' xs={24} xl={5}>
                        <div style={{ textAlign: 'left', fontSize: '15px' }}>{props.data.mobile_2 == "null" || props.data.mobile_2 == 'undefined' ? '--' : props.data.mobile_2}</div>
                    </Col>
                    <Col className='gutter-row' xs={24} xl={5}>
                        <div style={{ textAlign: 'left', fontSize: '15px' }}><b>Phone</b></div>
                    </Col>
                    <Col className='gutter-row' xs={24} xl={1}>
                        :
                    </Col>
                    <Col className='gutter-row' xs={24} xl={5}>
                        <div style={{ textAlign: 'left', fontSize: '15px' }}>{props.data.phone == "null" || props.data.phone == 'undefined' ? '--' : props.data.phone}</div>
                    </Col>
                    <Col className='gutter-row' xs={24} xl={2}>

                    </Col>
                </Row>
                <Row className='mt-4'>
                    <Col className='gutter-row' xs={24} xl={2}>

                    </Col>
                    <Col className='gutter-row' xs={24} xl={5}>
                        <div style={{ textAlign: 'left', fontSize: '15px' }}><b>Email Id</b></div>
                    </Col>
                    <Col className='gutter-row' xs={24} xl={1}>
                        :
                    </Col>
                    <Col className='gutter-row' xs={24} xl={5}>
                        <div style={{ textAlign: 'left', fontSize: '15px' }}>{props.data.email_id == "null" || props.data.email_id == 'undefined' ? '--' : props.data.email_id}</div>
                    </Col>
                    <Col className='gutter-row' xs={24} xl={5}>
                        <div style={{ textAlign: 'left', fontSize: '15px' }}><b>Alt Email Id</b></div>
                    </Col>
                    <Col className='gutter-row' xs={24} xl={1}>
                        :
                    </Col>
                    <Col className='gutter-row' xs={24} xl={5}>
                        <div style={{ textAlign: 'left', fontSize: '15px' }}>{props.data.alt_email_id == "null" || props.data.alt_email_id == 'undefined' ? '--' : props.data.alt_email_id}</div>
                    </Col>
                    <Col className='gutter-row' xs={24} xl={2}>

                    </Col>
                </Row>
                <Row className='mt-4'>
                    <Col className='gutter-row' xs={24} xl={2}>

                    </Col>
                    <Col className='gutter-row' xs={24} xl={5}>
                        <div style={{ textAlign: 'left', fontSize: '15px' }}><b>Address</b></div>
                    </Col>
                    <Col className='gutter-row' xs={24} xl={1}>
                        :
                    </Col>
                    <Col className='gutter-row' xs={24} xl={5}>
                        <div style={{ textAlign: 'left', fontSize: '15px' }}>{props.data.address == "null" || props.data.address == 'undefined' ? '--' : props.data.address}</div>
                    </Col>
                    <Col className='gutter-row' xs={24} xl={5}>
                        <div style={{ textAlign: 'left', fontSize: '15px' }}><b>City / Taluk</b></div>
                    </Col>
                    <Col className='gutter-row' xs={24} xl={1}>
                        :
                    </Col>
                    <Col className='gutter-row' xs={24} xl={5}>
                        <div style={{ textAlign: 'left', fontSize: '15px' }}>{props.data.city_taluk == "null" || props.data.city_taluk == 'undefined' ? '--' : props.data.city_taluk}</div>
                    </Col>
                    <Col className='gutter-row' xs={24} xl={2}>

                    </Col>
                </Row>
                <Row className='mt-4'>
                    <Col className='gutter-row' xs={24} xl={2}>

                    </Col>
                    <Col className='gutter-row' xs={24} xl={5}>
                        <div style={{ textAlign: 'left', fontSize: '15px' }}><b>District</b></div>
                    </Col>
                    <Col className='gutter-row' xs={24} xl={1}>
                        :
                    </Col>
                    <Col className='gutter-row' xs={24} xl={5}>
                        <div style={{ textAlign: 'left', fontSize: '15px' }}>{props.data.district == "null" || props.data.district == 'undefined' ? '--' : props.data.district}</div>
                    </Col>
                    <Col className='gutter-row' xs={24} xl={5}>
                        <div style={{ textAlign: 'left', fontSize: '15px' }}><b>Pincode</b></div>
                    </Col>
                    <Col className='gutter-row' xs={24} xl={1}>
                        :
                    </Col>
                    <Col className='gutter-row' xs={24} xl={5}>
                        <div style={{ textAlign: 'left', fontSize: '15px' }}>{props.data.pincode == "null" || props.data.pincode == 'undefined' ? '--' : props.data.pincode}</div>
                    </Col>
                    <Col className='gutter-row' xs={24} xl={2}>

                    </Col>
                </Row>
                <Row className='mt-4'>
                    <Col className='gutter-row' xs={24} xl={2}>

                    </Col>
                    <Col className='gutter-row' xs={24} xl={5}>
                        <div style={{ textAlign: 'left', fontSize: '15px' }}><b>Hospital Type</b></div>
                    </Col>
                    <Col className='gutter-row' xs={24} xl={1}>
                        :
                    </Col>
                    <Col className='gutter-row' xs={24} xl={5}>
                        <div style={{ textAlign: 'left', fontSize: '15px' }}>{props.data.hospital_type == "null" || props.data.hospital_type == 'undefined' ? '--' : props.data.hospital_type}</div>
                    </Col>
                    <Col className='gutter-row' xs={24} xl={5}>
                        <div style={{ textAlign: 'left', fontSize: '15px' }}><b>Speciality</b></div>
                    </Col>
                    <Col className='gutter-row' xs={24} xl={1}>
                        :
                    </Col>
                    <Col className='gutter-row' xs={24} xl={5}>
                        <div style={{ textAlign: 'left', fontSize: '15px' }}>{props.data.speciality == "null" || props.data.speciality == 'undefined' ? '--' : props.data.speciality}</div>
                    </Col>
                    <Col className='gutter-row' xs={24} xl={2}>

                    </Col>
                </Row>
                <Row className='mt-4'>
                    <Col className='gutter-row' xs={24} xl={2}>

                    </Col>
                    <Col className='gutter-row' xs={24} xl={20}>
                        <div style={{ textAlign: 'left', fontSize: '17px' }}><b>II . DETAILS OF BEDS – ROOM STATUS :</b></div>
                    </Col>
                </Row>
                <Row className='mt-4'>
                    <Col className='gutter-row' xs={24} xl={4}>

                    </Col>
                    <Col className='gutter-row' xs={24} xl={16}>
                        <Table responsive bordered>
                            <thead>
                                <tr>
                                    <th style={{ textAlign: 'center', fontSize: '15px' }}>Type of Bed</th>
                                    <th style={{ textAlign: 'center', fontSize: '15px' }}>No. of Beds</th>
                                </tr>
                            </thead>
                            <tbody className="text-center">
                                <tr>
                                    <th style={{ textAlign: 'left' }}>General Ward - Male</th>
                                    <td>
                                        {props.data.general_ward_male == "null" || props.data.general_ward_male == 'undefined' ? '--' : props.data.general_ward_male}
                                    </td>
                                </tr>
                                <tr>
                                    <th style={{ textAlign: 'left' }}>General Ward - Female</th>
                                    <td>
                                        {props.data.general_ward_female == "null" || props.data.general_ward_female == 'undefined' ? '--' : props.data.general_ward_female}

                                    </td>
                                </tr>
                                <tr>
                                    <th style={{ textAlign: 'left' }}>Single Bed</th>
                                    <td>
                                        {props.data.single_bed == "null" || props.data.single_bed == 'undefined' ? '--' : props.data.single_bed}

                                    </td>
                                </tr>
                                <tr>
                                    <th style={{ textAlign: 'left' }}>Twin Sharing</th>
                                    <td>
                                        {props.data.twin_sharing == "null" || props.data.twin_sharing == 'undefined' ? '--' : props.data.twin_sharing}

                                    </td>
                                </tr>
                                <tr>
                                    <th style={{ textAlign: 'left' }}>A.C. / Deluxe / Suite</th>
                                    <td>
                                        {props.data.ac_deluxe_suite == "null" || props.data.ac_deluxe_suite == 'undefined' ? '--' : props.data.ac_deluxe_suite}
                                    </td>
                                </tr>
                                <tr>
                                    <th style={{ textAlign: 'left' }}>Day Care</th>
                                    <td>
                                        {props.data.day_care == "null" || props.data.day_care == 'undefined' ? '--' : props.data.day_care}
                                    </td>
                                </tr>
                                <tr>
                                    <th style={{ textAlign: 'left' }}>Total</th>
                                    <td>{props.data.total_beds == "null" || props.data.total_beds == 'undefined' ? '--' : props.data.total_beds}
                                    </td>
                                </tr>
                            </tbody>
                        </Table>
                    </Col>
                    <Col className='gutter-row' xs={24} xl={4}>

                    </Col>
                </Row>
                <Row className='mt-4'>
                    <Col className='gutter-row' xs={24} xl={2}>

                    </Col>
                    <Col className='gutter-row' xs={24} xl={20}>
                        <div style={{ textAlign: 'left', fontSize: '17px' }}><b>III . DETAILS OF BEDS – OXYGEN STATUS :</b></div>
                    </Col>
                </Row>
                <Row className='mt-4'>
                    <Col className='gutter-row' xs={24} xl={4}>

                    </Col>
                    <Col className='gutter-row' xs={24} xl={16}>
                        <Table responsive bordered>
                            <thead>
                                <tr>
                                    <th style={{ textAlign: 'center', fontSize: '15px' }}>Type of Bed</th>
                                    <th style={{ textAlign: 'center', fontSize: '15px' }}>No. of Beds</th>
                                </tr>
                            </thead>
                            <tbody className="text-center">
                                <tr>
                                    <th style={{ textAlign: 'left' }}>ICU- BEDS</th>
                                    <td>{props.data.icu_beds == "null" || props.data.icu_beds == 'undefined' ? '--' : props.data.icu_beds}

                                    </td>
                                </tr>
                                <tr>
                                    <th style={{ textAlign: 'left' }}>OXYGEN - BEDS</th>
                                    <td>
                                        {props.data.oxygen_beds == "null" || props.data.oxygen_beds == 'undefined' ? '--' : props.data.oxygen_beds}

                                    </td>
                                </tr>
                                <tr>
                                    <th style={{ textAlign: 'left' }}>NON-OXYGEN - BEDS</th>
                                    <td>
                                        {props.data.non_oxygen_beds == "null" || props.data.non_oxygen_beds == 'undefined' ? '--' : props.data.non_oxygen_beds}
                                    </td>
                                </tr>
                                <tr>
                                    <th style={{ textAlign: 'left' }}>VENTILATORS</th>
                                    <td>{props.data.ventilators == "null" || props.data.ventilators == 'undefined' ? '--' : props.data.ventilators}

                                    </td>
                                </tr>
                                <tr>
                                    <th style={{ textAlign: 'left' }}>LABOUR WARDS</th>
                                    <td>
                                        {props.data.labour_wards == "null" || props.data.labour_wards == 'undefined' ? '--' : props.data.labour_wards}
                                    </td>
                                </tr>
                                <tr>
                                    <th style={{ textAlign: 'left' }}>OPERATION THEATERS</th>
                                    <td>
                                        {props.data.operation_theaters_total == "null" || props.data.operation_theaters_total == 'undefined' ? '--' : props.data.operation_theaters_total}
                                    </td>
                                </tr>
                                <tr>
                                    <th style={{ textAlign: 'left' }}>Total</th>
                                    <td>
                                        {props.data.total_oxygen == "null" || props.data.total_oxygen == 'undefined' ? '--' : props.data.total_oxygen}
                                    </td>
                                </tr>
                            </tbody>
                        </Table>
                    </Col>
                    <Col className='gutter-row' xs={24} xl={4}>

                    </Col>
                </Row>
                <Row className='mt-4'>
                    <Col className='gutter-row' xs={24} xl={2}>

                    </Col>
                    <Col className='gutter-row' xs={24} xl={20}>
                        <div style={{ textAlign: 'left', fontSize: '17px' }}><b>IV. FACILITIE STATUS :</b></div>
                    </Col>
                </Row>
                <Row className='mt-4'>
                    <Col className='gutter-row' xs={24} xl={4}>

                    </Col>
                    <Col className='gutter-row' xs={24} xl={16}>
                        <Table responsive bordered>
                            <thead>
                                <tr>
                                    <th style={{ textAlign: 'center', fontSize: '15px' }}>Type of Bed</th>
                                    <th style={{ textAlign: 'center', fontSize: '15px' }}>No. of Beds</th>
                                </tr>
                            </thead>
                            <tbody className="text-center">
                                <tr>
                                    <th style={{ textAlign: 'left' }}>Emergency & Casualty</th>
                                    <td>{props.data.emergency_casualty == "null" || props.data.emergency_casualty == 'undefined' ? '--' : props.data.emergency_casualty}
                                    </td>
                                </tr>
                                <tr>
                                    <th style={{ textAlign: 'left' }}>Intensive Care Unit</th>
                                    <td>
                                        {props.data.intensive_care_unit == "null" || props.data.intensive_care_unit == 'undefined' ? '--' : props.data.intensive_care_unit}
                                    </td>
                                </tr>
                                <tr>
                                    <th style={{ textAlign: 'left' }}>Operation Theatre</th>
                                    <td>
                                        {props.data.operation_theatre == "null" || props.data.operation_theatre == 'undefined' ? '--' : props.data.operation_theatre}

                                    </td>
                                </tr>
                                <tr>
                                    <th style={{ textAlign: 'left' }}>CSSD/Sterilizations</th>
                                    <td>
                                        {props.data.cssd_sterilizations == "null" || props.data.cssd_sterilizations == 'undefined' ? '--' : props.data.cssd_sterilizations}
                                    </td>
                                </tr>
                                <tr>
                                    <th style={{ textAlign: 'left' }}>Laboratory</th>
                                    <td>
                                        {props.data.laboratory == "null" || props.data.laboratory == 'undefined' ? '--' : props.data.laboratory}
                                    </td>
                                </tr>
                                <tr>
                                    <th style={{ textAlign: 'left' }}>Pharmacy</th>
                                    <td>
                                        {props.data.pharmacy == "null" || props.data.pharmacy == 'undefined' ? '--' : props.data.pharmacy}
                                    </td>
                                </tr>
                                <tr>
                                    <th style={{ textAlign: 'left' }}>Kitchen /Mess</th>
                                    <td>
                                        {props.data.kitchen_mess == "null" || props.data.kitchen_mess == 'undefined' ? '--' : props.data.kitchen_mess}

                                    </td>
                                </tr>
                                <tr>
                                    <th style={{ textAlign: 'left' }}>Bio-Medical Waste Dept.</th>
                                    <td>
                                        {props.data.bio_medical_waste_dept == "null" || props.data.bio_medical_waste_dept == 'undefined' ? '--' : props.data.bio_medical_waste_dept}
                                    </td>
                                </tr>
                            </tbody>
                        </Table>
                    </Col>
                    <Col className='gutter-row' xs={24} xl={4}>

                    </Col>
                </Row>
                <Row className='mt-4'>
                    <Col className='gutter-row' xs={24} xl={2}>

                    </Col>
                    <Col className='gutter-row' xs={24} xl={20}>
                        <div style={{ textAlign: 'left', fontSize: '17px' }}><b>V. IMMAGING SERVICES STATUS :</b></div>
                    </Col>
                </Row>
                <Row className='mt-4'>
                    <Col className='gutter-row' xs={24} xl={4}>

                    </Col>
                    <Col className='gutter-row' xs={24} xl={16}>
                        <Table responsive bordered>
                            <thead>
                                <tr>
                                    <th style={{ textAlign: 'center', fontSize: '15px' }}>Type of Service</th>
                                    <th style={{ textAlign: 'center', fontSize: '15px' }}>Yes/No</th>
                                </tr>
                            </thead>
                            <tbody className="text-center">
                                <tr>
                                    <th style={{ textAlign: 'left' }}>X-Ray</th>
                                    <td>
                                        {props.data.x_ray == "null" || props.data.x_ray == 'undefined' ? '--' : props.data.x_ray}
                                    </td>
                                </tr>
                                <tr>
                                    <th style={{ textAlign: 'left' }}>Portable X-Ray</th>
                                    <td>
                                        {props.data.portable_x_ray == "null" || props.data.portable_x_ray == 'undefined' ? '--' : props.data.portable_x_ray}
                                    </td>
                                </tr>
                                <tr>
                                    <th style={{ textAlign: 'left' }}>Ultrasound</th>
                                    <td>
                                        {props.data.ultrasound == "null" || props.data.ultrasound == 'undefined' ? '--' : props.data.ultrasound}
                                    </td>
                                </tr>
                                <tr>
                                    <th style={{ textAlign: 'left' }}>Mammogram</th>
                                    <td>
                                        {props.data.mammogram == "null" || props.data.mammogram == 'undefined' ? '--' : props.data.mammogram}

                                    </td>
                                </tr>
                                <tr>
                                    <th style={{ textAlign: 'left' }}>CT- SCAN</th>
                                    <td>
                                        {props.data.ct_scan == "null" || props.data.ct_scan == 'undefined' ? '--' : props.data.ct_scan}

                                    </td>
                                </tr>
                                <tr>
                                    <th style={{ textAlign: 'left' }}>MRI</th>
                                    <td>
                                        {props.data.mri == "null" || props.data.mri == 'undefined' ? '--' : props.data.mri}

                                    </td>
                                </tr>
                                <tr>
                                    <th style={{ textAlign: 'left' }}>PET Scan</th>
                                    <td>
                                        {props.data.pet_scan == "null" || props.data.pet_scan == 'undefined' ? '--' : props.data.pet_scan}
                                    </td>
                                </tr>
                                <tr>
                                    <th style={{ textAlign: 'left' }}>Nuclear Scan</th>
                                    <td>
                                        {props.data.nuclear_scan == "null" || props.data.nuclear_scan == 'undefined' ? '--' : props.data.nuclear_scan}
                                    </td>
                                </tr>
                            </tbody>
                        </Table>
                    </Col>
                    <Col className='gutter-row' xs={24} xl={4}>

                    </Col>
                </Row>
                <Row className='mt-4'>
                    <Col className='gutter-row' xs={24} xl={2}>

                    </Col>
                    <Col className='gutter-row' xs={24} xl={20}>
                        <div style={{ textAlign: 'left', fontSize: '17px' }}><b>VI. NO. OF STAFF :</b></div>
                    </Col>
                </Row>
                <Row className='mt-4'>
                    <Col className='gutter-row' xs={24} xl={4}>

                    </Col>
                    <Col className='gutter-row' xs={24} xl={16}>
                        <Table responsive bordered>
                            <thead>
                                <tr>
                                    <th style={{ textAlign: 'center', fontSize: '15px' }}>Category</th>
                                    <th style={{ textAlign: 'center', fontSize: '15px' }}>No. of staffs</th>
                                </tr>
                            </thead>
                            <tbody className="text-center">
                                <tr>
                                    <th style={{ textAlign: 'left' }}>Doctors</th>
                                    <td>
                                        {props.data.doctors == "null" || props.data.doctors == 'undefined' ? '--' : props.data.doctors}
                                    </td>
                                </tr>
                                <tr>
                                    <th style={{ textAlign: 'left' }}>Nurses</th>
                                    <td>
                                        {props.data.nurses == "null" || props.data.nurses == 'undefined' ? '--' : props.data.nurses}
                                    </td>
                                </tr>
                                <tr>
                                    <th style={{ textAlign: 'left' }}>Pharmacist</th>
                                    <td>
                                        {props.data.pharmacist == "null" || props.data.pharmacist == 'undefined' ? '--' : props.data.pharmacist}
                                    </td>
                                </tr>
                                <tr>
                                    <th style={{ textAlign: 'left' }}>Technicians</th>
                                    <td>
                                        {props.data.technicians == "null" || props.data.technicians == 'undefined' ? '--' : props.data.technicians}
                                    </td>
                                </tr>
                                <tr>
                                    <th style={{ textAlign: 'left' }}>Housekeeping workers</th>
                                    <td>
                                        {props.data.housekeeping_workers == "null" || props.data.housekeeping_workers == 'undefined' ? '--' : props.data.housekeeping_workers}
                                    </td>
                                </tr>
                                <tr>
                                    <th style={{ textAlign: 'left' }}>Admin Staffs</th>
                                    <td>
                                        {props.data.admin_staffs == "null" || props.data.admin_staffs == 'undefined' ? '--' : props.data.admin_staffs}
                                    </td>
                                </tr>
                            </tbody>
                        </Table>
                    </Col>
                    <Col className='gutter-row' xs={24} xl={4}>

                    </Col>
                </Row>

                {/* </Card> */}
            </Content>
        </>
    );
}
export default ViewPage;