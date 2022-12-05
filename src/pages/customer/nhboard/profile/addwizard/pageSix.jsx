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

const PageSix = (props) => {
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
        form.append('page_id', 6);
        axios.post('/v1/admin/editnoofstaff', form).then(res => {
            if (res['data'].status == '1') {
                document.getElementById("addform").reset();
                toast.success('Staff Status Updated Successfully');
                props.onFormFinish();
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
                    navigate('/' + context.customerUser.id + '/admin/members');
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
            form.append('id', context.customerUser.id);
            axios.post('v1/admin/liststaffdata', form).then(res => {
                if (res['data'].status == '1') {
                    var d = res['data'].data;
                    addForm.setFieldsValue({
                        doctors: d.doctors,
                        nurses: d.nurses,
                        pharmacist: d.pharmacist,
                        technicians: d.technicians,
                        housekeeping_workers: d.housekeeping_workers,
                        admin_staffs: d.admin_staffs,
                    })
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

                <Row style={{ background: '#0000', padding: '5px 30px 5px 30px', textAlign: 'center' }}>
                    <Col md={24} style={{ textAlign: 'center' }}>

                    </Col>
                </Row>

                <Card title="NO. OF STAFF" bordered headStyle={{ backgroundColor: '#0b0c26', color: '#ffffff' }} bodyStyle={{ backgroundColor: '#FFF' }}>
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
                            <Input type="hidden" name="id" value={context.customerUser.id} />
                            <Row style={{ background: '#0000', padding: '5px 30px 5px 30px', textAlign: 'center' }}>
                                <Col md={4}></Col>
                                <Col md={16} style={{ textAlign: 'center' }}>
                                    <Table responsive bordered striped>
                                        <tbody className="text-center">
                                            <tr>
                                                <th>Doctors</th>
                                                <td>
                                                    <Form.Item name='doctors' 
                                                     rules={[{ required: true, message: 'Doctors is required' }]}>
                                                        <InputNumber type='number' size="small" />
                                                    </Form.Item>
                                                </td>
                                            </tr>
                                            <tr>
                                                <th>Nurses</th>
                                                <td>
                                                    <Form.Item name='nurses' 
                                                     rules={[{ required: true, message: 'Nurses is required' }]}>
                                                        <InputNumber type='number' size="small" />
                                                    </Form.Item>
                                                </td>
                                            </tr>
                                            <tr>
                                                <th>Pharmacist</th>
                                                <td>
                                                    <Form.Item name='pharmacist' 
                                                     rules={[{ required: true, message: 'Pharmacist is required' }]}>
                                                        <InputNumber type='number' size="small" />
                                                    </Form.Item>
                                                </td>
                                            </tr>
                                            <tr>
                                                <th>Technicians</th>
                                                <td>
                                                    <Form.Item name='technicians' 
                                                     rules={[{ required: true, message: 'Technicians is required' }]}>
                                                        <InputNumber type='number' size="small" />
                                                    </Form.Item>
                                                </td>
                                            </tr>
                                            <tr>
                                                <th>Housekeeping workers</th>
                                                <td>
                                                    <Form.Item name='housekeeping_workers' 
                                                     rules={[{ required: true, message: 'Housekeeping workers is required' }]}>
                                                        <InputNumber type='number' size="small" />
                                                    </Form.Item>
                                                </td>
                                            </tr>
                                            <tr>
                                                <th>Admin Staffs</th>
                                                <td>
                                                    <Form.Item name='admin_staffs' 
                                                     rules={[{ required: true, message: 'Admin Staffs is required' }]}>
                                                        <InputNumber type='number' size="small" />
                                                    </Form.Item>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </Table>
                                </Col>
                            </Row>
                            
                            {context.customerUser.member_status=='initiated' 
                                    && (<Form.Item wrapperCol={{ offset: 21, span: 24 }}>
                                        <Button size="large" type="primary" htmlType="submit">
                                            Save & next
                                        </Button>
                                    </Form.Item>)}
                        </Form>
                    </Spin>
                </Card>
            </Content>

        </>
    );

}
export default PageSix;