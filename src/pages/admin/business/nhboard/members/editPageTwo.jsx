import axios from 'axios';
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Col, message } from 'antd';
import { Button, Card, Checkbox, Upload, Space, DatePicker, Radio, Tabs } from 'antd';
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
import { faCommentsDollar } from '@fortawesome/free-solid-svg-icons';

const EditPageTwo = (props) => {
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
    //const [total, setTotal] = useState('');

    useEffect(() => {
        listStaffData();
    }, []);


    useEffect(() => {
        addForm.setFieldsValue({ general_ward_male: props.data.general_ward_male, general_ward_female: props.data.general_ward_female, single_bed: props.data.single_bed, twin_sharing: props.data.twin_sharing, ac_deluxe_suite: props.data.ac_deluxe_suite, day_care: props.data.day_care, total_room: props.data.total_beds });
    }, [props.data]);

    // useEffect(() => {
    //     setOne(parseInt(props.data.general_ward_male));
    //     console.log(setOne(parseInt(props.data.general_ward_male)));
    //     setTwo(parseInt(props.data.general_ward_female));
    //     console.log(setTwo(parseInt(props.data.general_ward_female)));
    //     setThree(parseInt(props.data.single_bed));
    //     console.log(setThree(parseInt(props.data.single_bed)));
    //     setFour(parseInt(props.data.twin_sharing));
    //     console.log(setFour(parseInt(props.data.twin_sharing)));
    //     setFive(parseInt(props.data.ac_deluxe_suite));
    //     console.log(setFive(parseInt(props.data.ac_deluxe_suite)));
    //     setSix(parseInt(props.data.day_care));
    //     console.log(setSix(parseInt(props.data.day_care)));
    // }, [props.data]);

    const onMemberFormFinish = (values) => {
        var form = new FormData();
        Object.entries(values).forEach(([key, value]) => {
            form.append(key, value);
        });
        form.append('id', props.data.id);
        axios.post('/v1/admin/reeditroomstatus', form).then(res => {
            if (res['data'].status == '1') {
                document.getElementById("addform").reset();
                toast.success('Roomstatus Updated Successfully');

            }
            else {
                toast.error(res['data'].message);
                setShowLoader(false);
            }
        });
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
        console.log(value);
        setOne(value);
        var total = 0;
        total += value + two + three + four + five + six;
        console.log(total);
        addForm.setFieldsValue({ total_room: total });
    }

    const onChangeValueTwo = (value) => {
        console.log(value);
        setTwo(value);
        var total = 0;
        total += one + value + three + four + five + six;
        console.log(total);
        addForm.setFieldsValue({ total_room: total });
    }

    const onChangeValueThree = (value) => {
        console.log(value);
        setThree(value);
        var total = 0;
        total += one + two + value + four + five + six;
        console.log(total);
        addForm.setFieldsValue({ total_room: total });
    }

    const onChangeValueFour = (value) => {
        console.log(value);
        setFour(value);
        var total = 0;
        total += one + two + three + value + five + six;
        console.log(total);
        addForm.setFieldsValue({ total_room: total });
    }

    const onChangeValueFive = (value) => {
        console.log(value);
        setFive(value);
        var total = 0;
        total += one + two + three + four + value + six;
        console.log(total);
        addForm.setFieldsValue({ total_room: total });
    }

    const onChangeValueSix = (value) => {
        console.log(value);
        setSix(value);
        var total = 0;
        total += one + two + three + four + five + value;
        console.log(total);
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

                <Card headStyle={{ backgroundColor: '#1F5F54', color: '#ffffff' }}>

                    <Spin spinning={loader}>
                        {props.data && Object.keys(props.data).length > 0 && (<Form
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
                                                <th>General Ward - Male</th>
                                                <td>
                                                    <Form.Item name='general_ward_male' noStyle>
                                                        <InputNumber type='number' size="small" onChange={onChangeValueOne} defaultValue={props.data.general_ward_male} />
                                                    </Form.Item>
                                                </td>
                                            </tr>
                                            <tr>
                                                <th>General Ward - Female</th>
                                                <td>
                                                    <Form.Item name='general_ward_female' noStyle>
                                                        <InputNumber type='number' size="small" onChange={onChangeValueTwo} defaultValue={props.data.general_ward_female} />
                                                    </Form.Item>

                                                </td>
                                            </tr>
                                            <tr>
                                                <th>Single Bed</th>
                                                <td>
                                                    <Form.Item name='single_bed' noStyle>
                                                        <InputNumber type='number' size="small" onChange={onChangeValueThree} defaultValue={props.data.single_bed} />
                                                    </Form.Item>

                                                </td>
                                            </tr>
                                            <tr>
                                                <th>Twin Sharing</th>
                                                <td>
                                                    <Form.Item name='twin_sharing' noStyle>
                                                        <InputNumber type='number' size="small" onChange={onChangeValueFour} defaultValue={props.data.twin_sharing} />
                                                    </Form.Item>

                                                </td>
                                            </tr>
                                            <tr>
                                                <th>A.C. / Deluxe / Suite</th>
                                                <td>
                                                    <Form.Item name='ac_deluxe_suite' noStyle>
                                                        <InputNumber type='number' size="small" onChange={onChangeValueFive} defaultValue={props.data.ac_deluxe_suite} />
                                                    </Form.Item>

                                                </td>
                                            </tr>
                                            <tr>
                                                <th>Day Care</th>
                                                <td>
                                                    <Form.Item name='day_care' noStyle>
                                                        <InputNumber type='number' size="small" onChange={onChangeValueSix} defaultValue={props.data.day_care} />
                                                    </Form.Item>

                                                </td>
                                            </tr>
                                            <tr>
                                                <th>Total</th>
                                                <td>
                                                    <Form.Item name="total_room" noStyle>
                                                        <InputNumber type='number' size="small" readOnly defaultValue={props.data.total_beds} />
                                                    </Form.Item>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </Table>

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
export default EditPageTwo;