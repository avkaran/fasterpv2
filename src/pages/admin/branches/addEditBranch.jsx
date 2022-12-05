import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Col, message, Space } from 'antd';
import { Button, Card } from 'antd';
import { Form, Input, Select, InputNumber, Radio, Checkbox } from 'antd';
import { Breadcrumb, Layout, Spin } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import PsContext from '../../../context';
import { Editor } from '@tinymce/tinymce-react';
import { ImageUpload, FormItem, MyButton } from '../../../comp';
import { capitalizeFirst } from '../../../utils';
import PhoneInput from 'react-phone-input-2'
import { CountryDropdown, RegionDropdown } from 'react-country-region-selector';
const AddEditBranch = (props) => {
    const context = useContext(PsContext);
    const navigate = useNavigate();
    const [addeditFormBranch] = Form.useForm();
    const [loader, setLoader] = useState(false);
    const [curAction, setCurAction] = useState('add');
    const [editData, setEditData] = useState(null);
    const [heading] = useState('Branch');
    const { editIdOrObject, onListClick, onSaveFinish, userId, ...other } = props;
    const [editId, setEditId] = useState(null);
    const [country, setCountry] = useState('');
    const [districts, setDistricts] = useState([]);
    const [districtLoading, setDistrictLoading] = useState(false)
    useEffect(() => {

        if (editIdOrObject) {
            if (typeof editIdOrObject === 'object') {
                setCurAction("edit");
                setEditId(editIdOrObject.id);
                setEditData(editIdOrObject);
                setEditValues(editIdOrObject);

            } else {
                setCurAction("edit");
                setEditId(editIdOrObject)
                loadEditData(editIdOrObject);
            }


        } else {
            setCurAction("add");
            addeditFormBranch.setFieldsValue({

                branches: {
                    branch_status: 'Active',
                    branch_country: 'India',
                    branch_state: 'Tamil Nadu',
                }
            });
            setCountry("India");
            LoadDistrict("India", "Tamil Nadu").then(res => setDistricts(res));

            //addForm.setFieldsValue({ category: 'Plan', package_for: 'Customer(Online)', package_status: 'Active' })
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const loadEditData = (id) => {
        setLoader(true);
        var reqData = {
            query_type: 'query',
            query: "SELECT * from branches  where status=1 and id=" + id
        };
        context.psGlobal.apiRequest(reqData, context.adminUser(userId).mode).then((res) => {
            setEditData(res[0]);
            setEditValues(res[0]);

            setLoader(false);

        }).catch(err => {
            message.error(err);
            setLoader(false);

        })
    }
    const setEditValues = (mydata) => {
        addeditFormBranch.setFieldsValue({

            branches: {
                branch_name: mydata.branch_name,

                branch_address: mydata.branch_address,

                branch_country: mydata.branch_country,

                mobile_no: mydata.mobile_no,

                branch_district: mydata.branch_district,

                alternative_phone_1: mydata.alternative_phone_1,

                branch_state: mydata.branch_state,

                alternative_phone_2: mydata.alternative_phone_2,

                email_id: mydata.email_id,

                whatsapp_no: mydata.whatsapp_no,

                branch_status: mydata.branch_status,
            }
        });
        setCountry(mydata.branch_country)
    }
    const addeditFormBranchOnFinish = (values) => {
        setLoader(true);
        var processedValues = {};
        Object.entries(values.branches).forEach(([key, value]) => {
            if (value) {
                processedValues[key] = value;
            }
        });
        if (curAction === "add") {
            var reqDataInsert = {
                query_type: 'insert',
                table: 'branches',
                values: processedValues

            };
            context.psGlobal.apiRequest(reqDataInsert, context.adminUser(userId).mode).then((res) => {

                setLoader(false);
                message.success(heading + ' Added Successfullly');
                onSaveFinish();

            }).catch(err => {
                message.error(err);
                setLoader(false);
            })
        } else if (curAction === "edit") {
            var reqDataUpdate = {
                query_type: 'update',
                table: 'branches',
                where: { id: editId },
                values: processedValues

            };
            context.psGlobal.apiRequest(reqDataUpdate, context.adminUser(userId).mode).then((res) => {
                setLoader(false);
                message.success(heading + ' Saved Successfullly');
                onSaveFinish();

            }).catch(err => {
                message.error(err);
                setLoader(false);
            })
        }
    };
    const onStateChange = (value) => {
        setDistrictLoading(true);
        LoadDistrict(country, value).then(res => {
            setDistricts(res);
            setDistrictLoading(false);
            addeditFormBranch.setFieldsValue({
                branches: { branch_district: '' }
            })
        }).catch(err => {
            message.error(err);
            setDistrictLoading(false);
        })
    }
    const LoadDistrict = async (country, state) => {

        return new Promise((resolve, reject) => {
            var reqData = {
                query_type: 'query', //query_type=insert | update | delete | query
                query: "select district_name from districts where status=1 and country='" + country + "' and state='" + state + "'"
            };


            context.psGlobal.apiRequest(reqData, context.adminUser(userId).mode).then((res) => {
                resolve(res);
            }).catch(err => {
                reject(err);
            })
        })
    }

    return (
        <>
            <Spin spinning={loader} >
                <Form
                    name="basic"
                    form={addeditFormBranch}
                    labelAlign="left"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 20 }}
                    initialValues={{ remember: true }}
                    onFinish={addeditFormBranchOnFinish}
                    autoComplete="off"
                >
                    <Row gutter={16}>
                        <Col className='gutter-row' xs={24} xl={12}>

                            <FormItem
                                label="Branch Name"
                                name={['branches', 'branch_name']}
                                rules={[{ required: true, message: 'Please Enter Branch Name' }]}
                            >
                                <Input placeholder="Branch Name" />
                            </FormItem>

                        </Col>
                        <Col className='gutter-row' xs={24} xl={12}>

                            <FormItem
                                label="Branch Address"
                                name={['branches', 'branch_address']}
                                rules={[{ required: true, message: 'Please Enter Branch Address' }]}
                            >
                                <Input.TextArea rows={3} />
                            </FormItem>

                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col className='gutter-row' xs={24} xl={12}>

                            <FormItem
                                label="Branch Country"
                                name={['branches', 'branch_country']}
                                rules={[{ required: true, message: 'Please Enter Branch Country' }]}
                            >

                                <CountryDropdown
                                    className="ant-input"
                                    value={country}
                                    onChange={(val) => setCountry(val)} />
                            </FormItem>

                        </Col>
                        <Col className='gutter-row' xs={24} xl={12}>

                            <FormItem
                                label="Mobile No"
                                name={['branches', 'mobile_no']}
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
                    </Row>
                    <Row gutter={16}>
                        <Col className='gutter-row' xs={24} xl={12}>

                            <FormItem
                                label="Branch State"
                                name={['branches', 'branch_state']}
                                rules={[{ required: true, message: 'Please Enter Branch State' }]}
                            >

                                <RegionDropdown
                                    country={country}
                                    className="ant-input"
                                    // value={viewData.state}

                                    onChange={onStateChange}
                                />
                            </FormItem>

                        </Col>
                        <Col className='gutter-row' xs={24} xl={12}>

                            <FormItem
                                label="Alternative Phone_1"
                                name={['branches', 'alternative_phone_1']}
                                rules={[
                                    //   { required: true, message: 'Please Enter Alternative Phone_1' },
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
                    </Row>
                    <Row gutter={16}>
                        <Col className='gutter-row' xs={24} xl={12}>

                            <FormItem
                                label="Branch District"
                                name={['branches', 'branch_district']}
                                rules={[{ required: true, message: 'Please Enter Branch District' }]}
                            >

                                <Select
                                    showSearch
                                    placeholder="Branch District"
                                    loading={districtLoading}

                                    optionFilterProp="children"
                                    //onChange={branchDistrictOnChange}
                                    filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                                >
                                    {
                                        districts.map(district => {
                                            return <Select.Option value={district.district_name}>{district.district_name}</Select.Option>

                                        })
                                    }

                                </Select>
                            </FormItem>

                        </Col>
                        <Col className='gutter-row' xs={24} xl={12}>

                            <FormItem
                                label="Alternative Phone_2"
                                name={['branches', 'alternative_phone_2']}
                                rules={[
                                    // { required: true, message: 'Please Enter Alternative Phone_2' },
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
                    </Row>
                    <Row gutter={16}>
                        <Col className='gutter-row' xs={24} xl={12}>

                            <FormItem
                                label="Email Id"
                                name={['branches', 'email_id']}
                                rules={[
                                    { required: true, message: 'Please Enter Email Id' },
                                    {
                                        type: 'email',
                                        message: 'The input is not valid E-mail',
                                    },

                                ]}
                            >
                                <Input placeholder="Email Id" />
                            </FormItem>

                        </Col>
                        <Col className='gutter-row' xs={24} xl={12}>

                            <FormItem
                                label="Whatsapp No"
                                name={['branches', 'whatsapp_no']}
                                rules={[
                                    { required: true, message: 'Please Enter Whatsapp No' },
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
                    </Row>
                    <Row gutter={16}>
                        <Col className='gutter-row' xs={24} xl={12}>

                            <FormItem
                                label="Branch Status"
                                name={['branches', 'branch_status']}
                                rules={[{ required: true, message: 'Please Enter Branch Status' }]}
                            >


                                <Radio.Group defaultValue="Active" optionType="default" >
                                    {context.psGlobal.collectionOptions(context.psGlobal.collectionData, 'active-inactive', 'radio')}
                                </Radio.Group>

                            </FormItem>

                        </Col>
                        <Col className='gutter-row' xs={24} xl={12}>
                        </Col>
                    </Row>

                    <FormItem wrapperCol={{ offset: 10, span: 24 }}>
                        <Space>
                            <Button size="large" type="outlined" onClick={onListClick}>
                                Cancel
                            </Button>
                            <MyButton size="large" type="primary" htmlType="submit">
                                {curAction === "edit" ? "Update" : "Submit"}
                            </MyButton>
                        </Space>

                    </FormItem>

                </Form>
            </Spin>
        </>
    )
}
export default AddEditBranch;