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

const EditPageThree = (props) => {
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
    const [one, setOne] = useState(props.data.icu_beds);
    const [two, setTwo] = useState('');
    const [three, setThree] = useState('');
    const [four, setFour] = useState('');
    const [five, setFive] = useState('');
    const [six, setSix] = useState('');
    //const [total, setTotal] = useState('');

    useEffect(() => {
        listStaffData();

    }, []);

    useEffect(() => {
        addForm.setFieldsValue({ icu_beds: props.data.icu_beds, oxygen_beds: props.data.oxygen_beds, non_oxygen_beds: props.data.non_oxygen_beds, ventilators: props.data.ventilators, labour_wards: props.data.labour_wards, operation_theaters_total: props.data.operation_theaters_total, total_oxygen: props.data.total_oxygen });
    }, [props.data])

    const onMemberFormFinish = (values) => {
        var form = new FormData();
        Object.entries(values).forEach(([key, value]) => {
            form.append(key, value);
        });
        form.append('id', props.data.id);
        axios.post('/v1/admin/reeditoxygenstatus', form).then(res => {
            if (res['data'].status == '1') {
                document.getElementById("addform").reset();
                toast.success('Oxygen Status Updated Successfully');

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

    useEffect(() => {

    }, [props.data.total_oxygen]);

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

    // let One = $("#icu_beds").val() != "" ? parseInt($("#icu_beds").val()) : 0; 
    // let two = $("#oxygen_beds").val() != "" ? parseInt($("#oxygen_beds").val()) : 0; 
    // let three = $("#non_oxygen_beds").val() != "" ? parseInt($("#non_oxygen_beds").val()) : 0; 
    // let four = $("#ventilators").val() != "" ? parseInt($("#ventilators").val()) : 0; 
    // let five = $("#labour_wards").val() != "" ? parseInt($("#labour_wards").val()) : 0; 
    // let six = $("#operation_theaters_total").val() != "" ? parseInt($("#operation_theaters_total").val()) : 0; 




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
                                                <th>ICU- BEDS</th>
                                                <td>
                                                    <Form.Item name='icu_beds' id="icu_beds" noStyle>
                                                        <InputNumber type='number' size="small" onChange={onChangeValueOne} />
                                                    </Form.Item>
                                                </td>
                                            </tr>
                                            <tr>
                                                <th>OXYGEN - BEDS</th>
                                                <td>
                                                    <Form.Item name='oxygen_beds' id="oxygen_beds" noStyle>
                                                        <InputNumber type='number' size="small" onChange={onChangeValueTwo} />
                                                    </Form.Item>

                                                </td>
                                            </tr>
                                            <tr>
                                                <th>NON-OXYGEN - BEDS</th>
                                                <td>
                                                    <Form.Item name='non_oxygen_beds' id="non_oxygen_beds" noStyle>
                                                        <InputNumber type='number' size="small" onChange={onChangeValueThree} />
                                                    </Form.Item>
                                                </td>
                                            </tr>
                                            <tr>
                                                <th>VENTILATORS</th>
                                                <td>
                                                    <Form.Item name='ventilators' id="ventilators" noStyle>
                                                        <InputNumber type='number' size="small" onChange={onChangeValueFour} />
                                                    </Form.Item>
                                                </td>
                                            </tr>
                                            <tr>
                                                <th>LABOUR WARDS</th>
                                                <td>
                                                    <Form.Item name='labour_wards' id="labour_wards" noStyle>
                                                        <InputNumber type='number' size="small" onChange={onChangeValueFive} />
                                                    </Form.Item>
                                                </td>
                                            </tr>
                                            <tr>
                                                <th>OPERATION THEATERS</th>
                                                <td>
                                                    <Form.Item name='operation_theaters_total' id="operation_theaters_total" noStyle>
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
export default EditPageThree;