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

const PageFour = (props) => {
    const context = useContext(PsContext);
    const { Step } = Steps;
    const { Content } = Layout;
    const navigate = useNavigate();
    const [addForm] = Form.useForm();
    const { Option } = Select;
    const { TextArea } = Input;
    const [loader, setLoader] = useState(false);
    const [showLoader, setShowLoader] = useState(false);

    const [collectionData, setCollectionData] = useState([]);


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
        axios.post('/v1/admin/editfacilitiestatus', form).then(res => {
            if (res['data'].status == '1') {
                document.getElementById("addform").reset();
                toast.success('Facilitie Status Updated Successfully');
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
                    navigate('/' + context.customerUser.id + '/admin/members/pagefive/' + Id);
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
                        emergency_casualty: d.emergency_casualty,
                        intensive_care_unit: d.intensive_care_unit,
                        operation_theatre: d.operation_theatre,
                        cssd_sterilizations: d.cssd_sterilizations,
                        laboratory: d.laboratory,
                        pharmacy: d.pharmacy,
                        kitchen_mess: d.kitchen_mess,
                        bio_medical_waste_dept: d.bio_medical_waste_dept,
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

                <Card title="FACILITIE STATUS" headStyle={{ backgroundColor: '#0b0c26', color: '#ffffff' }} bodyStyle={{ backgroundColor: '#FFF' }}>
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
                                                <th>Emergency & Casualty</th>
                                                <td>
                                                    <Form.Item name='emergency_casualty' noStyle
                                                    rules={[{ required: true, message: 'Emergency & Casualty is required' }]}>
                                                        <Radio.Group>
                                                            <Radio value="yes">Yes</Radio>
                                                            <Radio className='ms-5' value="no">No</Radio>
                                                        </Radio.Group>
                                                    </Form.Item>
                                                </td>
                                            </tr>
                                            <tr>
                                                <th>Intensive Care Unit</th>
                                                <td>
                                                    <Form.Item name='intensive_care_unit' noStyle
                                                    rules={[{ required: true, message: 'Intensive Care Unit is required' }]}>
                                                        <Radio.Group>
                                                            <Radio value="yes">Yes</Radio>
                                                            <Radio className='ms-5' value="no">No</Radio>
                                                        </Radio.Group>
                                                    </Form.Item>

                                                </td>
                                            </tr>
                                            <tr>
                                                <th>Operation Theatre</th>
                                                <td>
                                                    <Form.Item name='operation_theatre' noStyle
                                                    rules={[{ required: true, message: 'Operation Theatre is required' }]}>
                                                        <Radio.Group>
                                                            <Radio value="yes">Yes</Radio>
                                                            <Radio className='ms-5' value="no">No</Radio>
                                                        </Radio.Group>
                                                    </Form.Item>

                                                </td>
                                            </tr>
                                            <tr>
                                                <th>CSSD/Sterilizations</th>
                                                <td>
                                                    <Form.Item name='cssd_sterilizations' noStyle
                                                    rules={[{ required: true, message: 'CSSD/Sterilizations is required' }]}>
                                                        <Radio.Group>
                                                            <Radio value="yes">Yes</Radio>
                                                            <Radio className='ms-5' value="no">No</Radio>
                                                        </Radio.Group>
                                                    </Form.Item>

                                                </td>
                                            </tr>
                                            <tr>
                                                <th>Laboratory</th>
                                                <td>
                                                    <Form.Item name='laboratory' noStyle
                                                    rules={[{ required: true, message: 'Laboratory is required' }]}>
                                                        <Radio.Group>
                                                            <Radio value="yes">Yes</Radio>
                                                            <Radio className='ms-5' value="no">No</Radio>
                                                        </Radio.Group>
                                                    </Form.Item>

                                                </td>
                                            </tr>
                                            <tr>
                                                <th>Pharmacy</th>
                                                <td>
                                                    <Form.Item name='pharmacy' noStyle
                                                    rules={[{ required: true, message: 'Pharmacy is required' }]}>
                                                        <Radio.Group>
                                                            <Radio value="yes">Yes</Radio>
                                                            <Radio className='ms-5' value="no">No</Radio>
                                                        </Radio.Group>
                                                    </Form.Item>

                                                </td>
                                            </tr>
                                            <tr>
                                                <th>Kitchen /Mess</th>
                                                <td>
                                                    <Form.Item name='kitchen_mess' noStyle
                                                    rules={[{ required: true, message: 'Kitchen /Mess is required' }]}>
                                                        <Radio.Group>
                                                            <Radio value="yes">Yes</Radio>
                                                            <Radio className='ms-5' value="no">No</Radio>
                                                        </Radio.Group>
                                                    </Form.Item>

                                                </td>
                                            </tr>
                                            <tr>
                                                <th>Bio-Medical Waste Dept.</th>
                                                <td>
                                                    <Form.Item name='bio_medical_waste_dept' noStyle
                                                    rules={[{ required: true, message: 'Bio-Medical Waste Dept is required' }]}>
                                                        <Radio.Group>
                                                            <Radio value="yes">Yes</Radio>
                                                            <Radio className='ms-5' value="no">No</Radio>
                                                        </Radio.Group>
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
export default PageFour;