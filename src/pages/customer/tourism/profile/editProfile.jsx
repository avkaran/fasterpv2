import React, { useState, useEffect, useContext } from 'react';
import { Navigate, useParams, Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Row, Col, message } from 'antd';
import { ImageUpload } from '../../../../comp'
import { Spin, Card } from 'antd';
import { Button, Checkbox, Space, DatePicker } from 'antd';
import { Form, Input, Select, InputNumber, Modal, Image } from 'antd';
import PsContext from '../../../../context';
import dayjs from 'dayjs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserCheck, faUser, faUserTimes, faUserClock, faEye, faCheck, faClose } from '@fortawesome/free-solid-svg-icons'
import { MyButton, MyTable } from '../../../../comp'
import { green, yellow, grey } from '@ant-design/colors';
import { FormViewItem } from '../../../../comp';
import moment from 'moment'
import { FormItem } from '../../../../comp';
import PhoneInput from 'react-phone-input-2'
const MyProfileEdit = (props) => {
    const context = useContext(PsContext);
    const [addeditFormUser] = Form.useForm();
    const navigate = useNavigate();
    const [viewData, setViewData] = useState(null);
    const [loader, setLoader] = useState(false)
    const [selDob, setSelDob] = useState(dayjs().subtract(18, "years"))
    useEffect(() => {
        loadViewData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const loadViewData = () => {
        setLoader(true);
        var reqData = {
            query_type: 'query',
            query: "select * from users where id=" + context.customerUser.id
        };
        context.psGlobal.apiRequest(reqData, "prod").then((res) => {
            setViewData(res[0]);
            setEditValues(res[0])
            setLoader(false);
        }).catch(err => {
            message.error(err);
            setLoader(false);

        })
    }
    const setEditValues = (mydata) => {
        setSelDob(dayjs(mydata['dob'], "YYYY-MM-DD"));
        addeditFormUser.setFieldsValue({

            users: {
                title: mydata.title,

                first_name: mydata.first_name,

                last_name: mydata.last_name,

                dob: mydata.dob,

                gender: mydata.gender,

                mobile_no: mydata.mobile_no,

                email: mydata.email,
            }
        });
    }
    const addeditFormUserOnFinish = (values) => {
        setLoader(true);
        var processedValues = {};
        Object.entries(values.users).forEach(([key, value]) => {
            if (value) {
                processedValues[key] = value;
            }
        });
        var form = new FormData();
        Object.entries(processedValues).forEach(([key, value], index) => {
            form.append(key, value)
        })
        form.append('id', context.customerUser.id)

        context.psGlobal.apiRequest('admin/user/update-user', "prod", form).then((res) => {


            setLoader(false);
            message.success('User Details Saved Successfullly');
            props.onSaveFinish();

        }).catch(err => {
            message.error(err);
            setLoader(false);
        })

    };
    const dobOnChange = (date) => {
        //  console.log('dchange', date)
        setSelDob(date);
        addeditFormUser.setFieldsValue({
            users: { dob: dayjs(date).format('YYYY-MM-DD') }
        })

    };
    const dobDisabled = (current) => {
        // Can not select days before today and today
        return current && current > dayjs().subtract(18, "years");
    };
    return (
        <>

                    <Card title="Edit Profile">

                        <Spin spinning={loader}>
                            {
                                viewData && (<>
                                    <Form
                                        name="basic"
                                        form={addeditFormUser}
                                        labelAlign="left"
                                        labelCol={{ span: 8 }}
                                        wrapperCol={{ span: 20 }}
                                        initialValues={{ remember: true }}
                                        onFinish={addeditFormUserOnFinish}
                                        autoComplete="off"
                                    >
                                        <Col className='gutter-row' xs={24} xl={12}>

                                            <FormItem
                                                label="Title"
                                                name={['users', 'title']}
                                                rules={[{ required: true, message: 'Please Enter Title' }]}
                                            >

                                                <Select
                                                    showSearch
                                                    placeholder="Title"

                                                    optionFilterProp="children"
                                                    //onChange={titleOnChange}
                                                    filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                                                >
                                                    <Select.Option value="Mr.">Mr.</Select.Option>
                                                    <Select.Option value="Mrs.">Mrs.</Select.Option>
                                                    <Select.Option value="Miss.">Miss.</Select.Option>
                                                    <Select.Option value="Ms.">Ms.</Select.Option>
                                                    <Select.Option value="Master.">Master.</Select.Option>
                                                </Select>
                                            </FormItem>

                                        </Col>

                                        <Col className='gutter-row' xs={24} xl={12}>

                                            <FormItem
                                                label="First Name"
                                                name={['users', 'first_name']}
                                                rules={[{ required: true, message: 'Please Enter First Name' }]}
                                            >
                                                <Input placeholder="First Name" />
                                            </FormItem>

                                        </Col>

                                        <Col className='gutter-row' xs={24} xl={12}>

                                            <FormItem
                                                label="Last Name"
                                                name={['users', 'last_name']}

                                            >
                                                <Input placeholder="Last Name" />
                                            </FormItem>

                                        </Col>

                                        <Col className='gutter-row' xs={24} xl={12}>

                                            <FormItem
                                                label="Dob"
                                                name={['users', 'dob']}

                                            >

                                                <Space direction="vertical">
                                                    <DatePicker 

                                                        onChange={dobOnChange}
                                                        value={selDob}
                                                        disabledDate={dobDisabled}
                                                        format='DD/MM/YYYY'
                                                        //disabledDate={dobDisabled}
                                                        allowClear={false}
                                                    />
                                                </Space>
                                            </FormItem>

                                        </Col>

                                        <Col className='gutter-row' xs={24} xl={12}>

                                            <FormItem
                                                label="Gender"
                                                name={['users', 'gender']}
                                                rules={[{ required: true, message: 'Please Enter Gender' }]}
                                            >

                                                <Select
                                                    showSearch
                                                    placeholder="Gender"

                                                    optionFilterProp="children"
                                                    //onChange={genderOnChange}
                                                    filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                                                >
                                                    {context.psGlobal.collectionOptions(context.psGlobal.collectionData, 'gender')}
                                                </Select>
                                            </FormItem>

                                        </Col>

                                        <Col className='gutter-row' xs={24} xl={12}>

                                            <FormItem
                                                label="Mobile No"
                                                name={['users', 'mobile_no']}
                                                rules={[
                                                    { required: true, message: 'Please Enter Mobile No' },
                                                    ({ getFieldValue }) => ({
                                                        validator(_, value) {
                                                            if (value && value.toString().startsWith("91") && value.toString().length < 12) {
                                                                return Promise.reject(new Error('Invalid Indian Mobile Number'))
                                                            }

                                                            return Promise.resolve();
                                                        },
                                                    }),
                                                ]}
                                            >

                                                <PhoneInput
                                                    country={'in'}

                                                //onChange={phone => {}}
                                                />
                                            </FormItem>

                                        </Col>

                                        <Col className='gutter-row' xs={24} xl={12}>

                                            <FormItem
                                                label="Email"
                                                name={['users', 'email']}
                                                rules={[{
                                                    type: 'email',
                                                    message: 'The input is not valid E-mail!',
                                                }]}
                                            >
                                                <Input placeholder="Email" />
                                            </FormItem>

                                        </Col>


                                        <FormItem wrapperCol={{ offset: 10, span: 24 }}>
                                            <Space>
                                                <Button size="large" type="outlined" onClick={() => props.onCancel()}>
                                                    Cancel
                                                </Button>
                                                <MyButton size="large" type="primary" htmlType="submit">
                                                    Save
                                                </MyButton>
                                            </Space>

                                        </FormItem>

                                    </Form>
                                </>)
                            }

                        </Spin>
                    </Card>

        </>
    );

}
export default MyProfileEdit;