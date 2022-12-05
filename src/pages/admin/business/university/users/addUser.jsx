import axios from 'axios';
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate,useParams } from 'react-router-dom';
import { Row, Col, message } from 'antd';
import { Button, Card, Space, DatePicker } from 'antd';
import { Form, Input, Select } from 'antd';
import { Breadcrumb, Layout, Spin } from 'antd';
import { ImageUpload } from '../../../../../comp'
import { HomeOutlined } from '@ant-design/icons';
import moment from 'moment';
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import PsContext from '../../../../../context';

const AddUser = (props) => {
    const context = useContext(PsContext);
const {userId}=useParams();
    const { Content } = Layout;
    const navigate = useNavigate();
    const [addForm] = Form.useForm();
    const { TextArea } = Input;
    const [loader, setLoader] = useState(false);
    useEffect(() => {


    }, []);
    const onUploadFinish = (fileName) => {
        addForm.setFieldsValue({
            photo: fileName
        })
    }
    const onChangeDob = (date) => {

        addForm.setFieldsValue({
            dob: moment(date).format('YYYY-MM-DD')
        })
    };
    const onFinish = (values) => {

        setLoader(true);
        var processedValues = {};
        Object.entries(values).forEach(([key, value]) => {
            if (value) processedValues[key] = value;
        });
        //var salt = bcrypt.genSaltSync(10);
        processedValues['password'] = context.psGlobal.encrypt(processedValues['password']);


        var form = new FormData();
        var reqData = { //if array of queries pass [] outside
            query_type: 'insert',
            // query: "select * from members where id='" + id + "'",
            table: 'users',
            // where:{id:'1'},
            values: processedValues

        };
        form.append('queries', context.psGlobal.encrypt(JSON.stringify(reqData)))
        axios.post('v1/admin/db-query', form).then(res => {
            if (res['data'].status === '1') {

                //if inserted created member id using id  // store log
                var createdId = res['data'].data;
                var form1 = new FormData();
                var reqData1 = { //if array of queries pass [] outside
                    query_type: 'update',
                    // query: "select * from members where id='" + id + "'",
                    table: 'users',
                    where: { id: createdId },
                    values: { user_id: 'TM' + createdId.padStart(5, '0') }

                };
                form1.append('queries', encodeURI(context.psGlobal.encrypt(JSON.stringify(reqData1))))
                axios.post('v1/admin/db-query', form1).then(res => {
                    if (res['data'].status === '1') {

                        setLoader(false);
                        message.success(res['data'].message || 'Success');
                        navigate('/'+userId+'/admin/users')
                        //navigate('/'+userId+'/admin/members/make-payment/' + createdId)
                    }
                });

            }
            else {
                message.error(res['data'].message || 'Error');
                setLoader(false);
            }

        });
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };
    const disabledDate = (current) => {
        // Can not select days before today and today
        return current && current > moment().subtract(18, "years");
    };
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
                        <span>Manage Users</span>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>Add User</Breadcrumb.Item>
                </Breadcrumb>
                <Card title="Add User" extra={<Button href={"#/"+userId+"/admin/users"} ><i className="fa-solid fa-list pe-2" ></i>List Users</Button>}>

                    <Spin spinning={loader} >
                        <Form
                            name="basic"
                            form={addForm}
                            labelAlign="left"
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 20 }}
                            initialValues={{ remember: true }}
                            onFinish={onFinish}
                            onFinishFailed={onFinishFailed}
                            autoComplete="off"
                        >

                            <Row gutter={16}> {/* tow column row start */}
                                <Col className='gutter-row' xs={24} xl={12}>
                                    <Form.Item
                                        label="Title"
                                        name="title"
                                        rules={[{ required: true, message: 'Select Title' }]}
                                    >
                                        <Select placeholder="Title" style={{ width: '90px' }} >
                                            {context.psGlobal.collectionOptions(context.psGlobal.collectionData, 'name-title')}
                                        </Select>
                                    </Form.Item>
                                    <Form.Item

                                        label="First Name"
                                    >



                                        <Form.Item
                                            // labelCol={{ span: 8 }}
                                            wrapperCol={{ span: 24 }}
                                            name="first_name"
                                            rules={[{ required: true, message: 'Enter Name' }]}
                                        >
                                            <Input placeholder="First Name" />
                                        </Form.Item>




                                    </Form.Item>
                                    <Form.Item
                                        label="Last Name"

                                        name="last_name"

                                    >
                                        <Input placeholder="Last Name" />
                                    </Form.Item>
                                </Col>
                                <Col className='gutter-row' xs={24} xl={12}>
                                    <Form.Item
                                        label="Photo"
                                        name='photo'


                                    // rules={[{ required: true, message: 'Feature Image is required' }]}
                                    >
                                        <ImageUpload
                                            name="photo"
                                            cropRatio="1/1"
                                            storeFileName={'public/uploads/' + new Date().valueOf() + '.jpg'}
                                            onFinish={onUploadFinish}
                                        >

                                        </ImageUpload>
                                    </Form.Item>
                                </Col>
                            </Row> {/* tow column row end */}
                            <Row gutter={16}> {/* tow column row start */}
                                <Col className='gutter-row' xs={24} xl={7}>
                                    <Form.Item
                                        label="Birth Date"
                                        name="dob"
                                        // labelCol={{ span: 8 }}
                                        wrapperCol={{ offset: 6, span: 12 }}
                                        // value={selDate}
                                        rules={[{
                                            // type: 'object',
                                            required: true,
                                            message: 'Please input Birth date',
                                            whitespace: true,
                                        }]}
                                    >
                                        <Space direction="vertical">

                                            <DatePicker onChange={onChangeDob} format='DD/MM/YYYY'
                                                defaultValue={moment(moment().subtract(18, "years"), 'DD/MM/YYYY')}
                                                disabledDate={disabledDate}
                                                allowClear={false}
                                            //dateRender={(currentDate,today)=>{}}
                                            />

                                        </Space>
                                    </Form.Item>

                                </Col>
                                <Col className='gutter-row' xs={24} xl={5}>
                                    <Form.Item
                                        label="Gender"
                                        name="gender"
                                        //labelCol={{ span: 8 }}
                                        // wrapperCol={{ offset: 6, span: 6 }}
                                        rules={[{ required: true, message: 'Birth Date required' }]}
                                    >
                                        <Select placeholder="Select Gender" >
                                            {context.psGlobal.collectionOptions(context.psGlobal.collectionData, 'gender')}
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col className='gutter-row' xs={24} xl={12}>
                                    <Form.Item
                                        label="Mobile No"
                                        name="mobile_no"
                                        rules={[{ required: true, message: 'Please input mobile no' }]}

                                    >
                                        <PhoneInput
                                            country={'in'}
                                        //value={this.state.phone}
                                        // onChange={phone => this.setState({ phone })}
                                        />
                                    </Form.Item>
                                </Col>
                            </Row> {/* tow column row end */}


                            <Row gutter={16} style={{ backgroundColor: 'cyan-1' }}> {/* tow column row start */}
                                <Col className='gutter-row' xs={24} xl={12}>
                                    <Form.Item
                                        label="Email"
                                        name="email"
                                        rules={[{
                                            type: 'email',
                                            message: 'The input is not valid E-mail!',
                                        }]}

                                    >
                                        <Input />
                                    </Form.Item>
                                </Col>
                                <Col className='gutter-row' xs={24} xl={12}>
                                    <Form.Item
                                        label="Password"
                                        name="password"
                                        rules={[{ required: true, message: 'Please input password' }]}

                                    >
                                        <Input.Password placeholder="input password" />
                                    </Form.Item>
                                </Col>
                            </Row> {/* tow column row end */}
                            <Row gutter={16}> {/* tow column row start */}
                                <Col className='gutter-row' xs={24} xl={12}>
                                    <Form.Item
                                        label="Address"
                                        name="address"
                                        rules={[{ required: true, message: 'Enter Address' }]}
                                    >
                                        <TextArea rows={4} />
                                    </Form.Item>

                                </Col>
                                <Col className='gutter-row' xs={24} xl={12}>

                                </Col>
                            </Row> {/* tow column row end */}



                            <Form.Item wrapperCol={{ offset: 12, span: 24 }}>
                                <Button size="large" type="primary" htmlType="submit" style={{}}>
                                    Submit
                                </Button>
                            </Form.Item>

                        </Form>
                    </Spin>
                </Card>

            </Content>

        </>
    );

}
export default AddUser;