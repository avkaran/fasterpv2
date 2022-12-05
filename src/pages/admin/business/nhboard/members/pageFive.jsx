import axios from 'axios';
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate,useParams } from 'react-router-dom';
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

const PageFive = (props) => {
    const context = useContext(PsContext);
const {userId}=useParams();
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
    }, []);

    const onMemberFormFinish = (values) => {
        var form = new FormData();
        Object.entries(values).forEach(([key, value]) => {
            form.append(key, value);
        });
        form.append('id', props.match.params.Id);
        axios.post('/v1/admin/editimmagingstatus', form).then(res => {
            if (res['data'].status == '1') {
                document.getElementById("addform").reset();
                toast.success('Imaging Status Updated Successfully');
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
                    navigate('/' + userId + '/admin/members/pagesix/' + Id);
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

                <Card title="IMMAGING SERVICES STATUS" headStyle={{ backgroundColor: '#1F5F54', color: '#ffffff' }}
                >
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
                                        <tbody className="text-center">
                                            <tr>
                                                <th>X-Ray</th>
                                                <td>
                                                    <Form.Item name='x_ray' noStyle>
                                                        <Radio.Group>
                                                            <Radio value="yes">Yes</Radio>
                                                            <Radio className='ms-5' value="no">No</Radio>
                                                        </Radio.Group>
                                                    </Form.Item>
                                                </td>
                                            </tr>
                                            <tr>
                                                <th>Portable X-Ray</th>
                                                <td>
                                                    <Form.Item name='portable_x_ray' noStyle>
                                                        <Radio.Group>
                                                            <Radio value="yes">Yes</Radio>
                                                            <Radio className='ms-5' value="no">No</Radio>
                                                        </Radio.Group>
                                                    </Form.Item>

                                                </td>
                                            </tr>
                                            <tr>
                                                <th>Ultrasound</th>
                                                <td>
                                                    <Form.Item name='ultrasound' noStyle>
                                                        <Radio.Group>
                                                            <Radio value="yes">Yes</Radio>
                                                            <Radio className='ms-5' value="no">No</Radio>
                                                        </Radio.Group>
                                                    </Form.Item>

                                                </td>
                                            </tr>
                                            <tr>
                                                <th>Mammogram</th>
                                                <td>
                                                    <Form.Item name='mammogram' noStyle>
                                                        <Radio.Group>
                                                            <Radio value="yes">Yes</Radio>
                                                            <Radio className='ms-5' value="no">No</Radio>
                                                        </Radio.Group>
                                                    </Form.Item>

                                                </td>
                                            </tr>
                                            <tr>
                                                <th>CT- SCAN</th>
                                                <td>
                                                    <Form.Item name='ct_scan' noStyle>
                                                        <Radio.Group>
                                                            <Radio value="yes">Yes</Radio>
                                                            <Radio className='ms-5' value="no">No</Radio>
                                                        </Radio.Group>
                                                    </Form.Item>

                                                </td>
                                            </tr>
                                            <tr>
                                                <th>MRI</th>
                                                <td>
                                                    <Form.Item name='mri' noStyle>
                                                        <Radio.Group>
                                                            <Radio value="yes">Yes</Radio>
                                                            <Radio className='ms-5' value="no">No</Radio>
                                                        </Radio.Group>
                                                    </Form.Item>

                                                </td>
                                            </tr>
                                            <tr>
                                                <th>PET Scan</th>
                                                <td>
                                                    <Form.Item name='pet_scan' noStyle>
                                                        <Radio.Group>
                                                            <Radio value="yes">Yes</Radio>
                                                            <Radio className='ms-5' value="no">No</Radio>
                                                        </Radio.Group>
                                                    </Form.Item>

                                                </td>
                                            </tr>
                                            <tr>
                                                <th>Nuclear Scan</th>
                                                <td>
                                                    <Form.Item name='nuclear_scan' noStyle>
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
export default PageFive;