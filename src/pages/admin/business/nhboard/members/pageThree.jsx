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
import { Table } from 'react-bootstrap';

const PageThree = (props) => {
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

    const onMemberFormFinish = (values) => {
        var form = new FormData();
        Object.entries(values).forEach(([key, value]) => {
            form.append(key, value);
        });
        form.append('id', props.match.params.Id);
        axios.post('/v1/admin/editoxygenstatus', form).then(res => {
            if (res['data'].status == '1') {
                document.getElementById("addform").reset();
                toast.success('Oxygen Status Updated Successfully');
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
                    navigate('/' + props.match.params.userId + '/admin/members/pagefour/' + Id);
                }
                else {
                    setShowLoader(false);
                }
            });
        }
        catch (er) {

        }
    }

    const listStaffData = () => {
        try {
            setShowLoader(true);
            var form = new FormData();
            form.append('id', props.match.params.Id);
            axios.post('v1/admin/liststaffdata', form).then(res => {
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

    const onChangeValueOne = (value) => {
        setOne(value);
        var total = 0;
        total += value + two + three + four + five + six;
        addForm.setFieldsValue({ total_oxygen: total });
    }
    const onChangeValueTwo = (value) => {
        setTwo(value);
        var total = 0;
        total += one + value + three + four + five + six;
        addForm.setFieldsValue({ total_oxygen: total });
    }
    const onChangeValueThree = (value) => {
        setThree(value);
        var total = 0;
        total += one + two + value + four + five + six;
        addForm.setFieldsValue({ total_oxygen: total });
    }
    const onChangeValueFour = (value) => {
        setFour(value);
        var total = 0;
        total += one + two + three + value + five + six;
        addForm.setFieldsValue({ total_oxygen: total });
    }
    const onChangeValueFive = (value) => {
        setFive(value);
        var total = 0;
        total += one + two + three + four + value + six;
        addForm.setFieldsValue({ total_oxygen: total });
    }
    const onChangeValueSix = (value) => {
        setSix(value);
        var total = 0;
        total += one + two + three + four + five + value;
        addForm.setFieldsValue({ total_oxygen: total });
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

                <Card title="DETAILS OF BEDS – OXYGEN STATUS" headStyle={{ backgroundColor: '#1F5F54', color: '#ffffff' }} >
                    {/* <Table responsive bordered>
                        <tbody className="text-center">
                            <tr>
                                <th width='25%'>Name</th>
                                <td width='25%'>{collectionData && collectionData[0] ? collectionData[0].name : ''}</td>
                                <th width='25%'>Ownership</th>
                                <td width='25%'>{collectionData && collectionData[0] ? collectionData[0].type_of_ownership : ''}</td>
                            </tr>
                            <tr>
                                <th width='25%'>Mobile</th>
                                <td width='25%'>{collectionData && collectionData[0] ? collectionData[0].mobile : ''}</td>
                            </tr>
                        </tbody>
                    </Table> */}
                    <Spin spinning={loader}>
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
                            <Input type="hidden" name="id" value={props.match.params.Id} />
                            <Row style={{ background: '#0000', padding: '5px 30px 5px 30px', textAlign: 'center' }}>
                                <Col md={4}></Col>
                                <Col md={16} style={{ textAlign: 'center' }}>
                                    <Table responsive bordered striped>
                                        <thead>
                                            <tr>
                                                <th>Type of Bed</th>
                                                <th>No. of Beds</th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-center">
                                            <tr>
                                                <th>ICU- BEDS</th>
                                                <td>
                                                    <Form.Item name='icu_beds' noStyle>
                                                        <InputNumber type='number' size="small" onChange={onChangeValueOne} />
                                                    </Form.Item>
                                                </td>
                                            </tr>
                                            <tr>
                                                <th>OXYGEN - BEDS</th>
                                                <td>
                                                    <Form.Item name='oxygen_beds' noStyle>
                                                        <InputNumber type='number' size="small" onChange={onChangeValueTwo} />
                                                    </Form.Item>

                                                </td>
                                            </tr>
                                            <tr>
                                                <th>NON-OXYGEN - BEDS</th>
                                                <td>
                                                    <Form.Item name='non_oxygen_beds' noStyle>
                                                        <InputNumber type='number' size="small" onChange={onChangeValueThree} />
                                                    </Form.Item>
                                                </td>
                                            </tr>
                                            <tr>
                                                <th>VENTILATORS</th>
                                                <td>
                                                    <Form.Item name='ventilators' noStyle>
                                                        <InputNumber type='number' size="small" onChange={onChangeValueFour} />
                                                    </Form.Item>
                                                </td>
                                            </tr>
                                            <tr>
                                                <th>LABOUR WARDS</th>
                                                <td>
                                                    <Form.Item name='labour_wards' noStyle>
                                                        <InputNumber type='number' size="small" onChange={onChangeValueFive} />
                                                    </Form.Item>
                                                </td>
                                            </tr>
                                            <tr>
                                                <th>OPERATION THEATERS</th>
                                                <td>
                                                    <Form.Item name='operation_theaters_total' noStyle>
                                                        <InputNumber type='number' size="small" onChange={onChangeValueSix} />
                                                    </Form.Item>

                                                </td>
                                            </tr>
                                            <tr>
                                                <th>Total</th>
                                                <td>
                                                    <Form.Item name="total_oxygen" noStyle>
                                                        <InputNumber type='number' size="small" readOnly />
                                                    </Form.Item>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </Table>

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
export default PageThree;