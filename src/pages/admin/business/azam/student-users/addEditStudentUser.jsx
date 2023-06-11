import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Col, message, Space } from 'antd';
import { Button, Card } from 'antd';
import { Form, Input, Select, InputNumber, Radio, Checkbox, DatePicker } from 'antd';
import { Breadcrumb, Layout, Spin } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import PsContext from '../../../../../context';
import { Editor } from '@tinymce/tinymce-react';
import { ImageUpload, FormItem, MyButton } from '../../../../../comp';
import { capitalizeFirst } from '../../../../../utils';
import { Button as MButton } from 'antd-mobile'
import PhoneInput from 'react-phone-input-2'
import { CountryDropdown, RegionDropdown } from 'react-country-region-selector';
import dayjs from 'dayjs'

import esES from 'antd/lib/locale-provider/es_ES';
const AddEditStudentUser = (props) => {
    const context = useContext(PsContext);
    const { Content } = Layout;
    const navigate = useNavigate();
    const [addeditFormUsers] = Form.useForm();
    const [loader, setLoader] = useState(false);
    const [curAction, setCurAction] = useState('add');
    const [editData, setEditData] = useState(null);
    const [heading] = useState('User');
    const { editIdOrObject, onListClick, onSaveFinish, userId, formItemLayout, ...other } = props;
    const [editId, setEditId] = useState(null);
    const [country, setCountry] = useState('India');
    const [districts, setDistricts] = useState([]);
    const [districtLoading, setDistrictLoading] = useState(false);
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
            onStateChange("Tamil Nadu");
            
            addeditFormUsers.setFieldsValue(
                { users: { dob: dayjs(),country:'India',state:'Tamil Nadu' } }
            )
        }

    }, [editIdOrObject]);
    const onStateChange = (value) => {
        setDistrictLoading(true);
        LoadDistrict(country, value).then(res => {
            setDistricts(res);
            setDistrictLoading(false);
            addeditFormUsers.setFieldsValue({
                users: { district: '' }
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
    const loadEditData = (id) => {
        setLoader(true);
        var reqData = {
            query_type: 'query',
            query: "SELECT * from users where status=1 and id=" + id
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
        LoadDistrict(mydata['country'], mydata['state']).then(res => {
            setDistricts(res);
        }).catch(err => {
            message.error(err);

        })
        setCountry(mydata.country)

        addeditFormUsers.setFieldsValue({

            users: {
                first_name: mydata.first_name,

                dob: dayjs(mydata.dob),

                gender: mydata.gender,

                mobile_no: mydata.mobile_no,

                email: mydata.email,

                country: mydata.country,

                state: mydata.state,

                photo: mydata.photo,

                id_proof: mydata.id_proof,

                prefix: mydata.prefix,
                last_name:mydata.last_name,

                address: mydata.address,

                aadhaar_no: mydata.aadhaar_no,

                district: mydata.district,
            }
        });
    }
    const onFinish = (values) => {
        setLoader(true);
        var processedValues = {};
        Object.entries(values.users).forEach(([key, value]) => {
            if (value) {
                processedValues[key] = value;
            }
        });
        processedValues['dob'] = dayjs(values.users.dob).format("YYYY-MM-DD");
        processedValues['password'] = context.psGlobal.encrypt('ysmazam@2023');


        var form = new FormData();
        Object.entries(processedValues).forEach(([key, value], index) => {
            form.append(key, value)
        })

        if (curAction === "add") {
            context.psGlobal.apiRequest('admin/users/add-user', context.adminUser(userId).mode, form).then((res) => {
                setLoader(false);
                message.success(heading + ' Added Successfullly');
                onSaveFinish();
                //navigate('/' + userId + '/admin/courses');
            }).catch(err => {
                message.error(err);
                setLoader(false);
            })
        } else if (curAction === "edit") {
            form.append('id', editData.id);
            if (processedValues['photo'] !== editData.photo) {
                if (editData.photo)
                    form.append('old_photo', editData.photo);
            }
            else {
                form.delete('photo');
            }
            if (processedValues['id_proof'] !== editData.id_proof) {
                if (editData.id_proof)
                    form.append('old_id_proof', editData.id_proof);
            }
            else {
                form.delete('id_proof');
            }
            context.psGlobal.apiRequest('admin/users/update-user', context.adminUser(userId).mode, form).then((res) => {
                setLoader(false);
                message.success(heading + ' Saved Successfullly');
                onSaveFinish();
                //navigate('/' + userId + '/admin/courses');
            }).catch(err => {
                message.error(err);
                setLoader(false);
            })
        }


    };
    return (
        <>

            <Spin spinning={loader} >
                {
                    (curAction === "add" || (curAction === "edit" && editData)) && (<Form
                        name="basic"
                        form={addeditFormUsers}
                        labelAlign="left"
                        labelCol={{ span: formItemLayout === 'two-column' || formItemLayout === 'one-column' ? 8 : 24 }}
                        wrapperCol={{ span: 24 }}
                        initialValues={{ remember: true }}
                        onFinish={onFinish}
                        autoComplete="off"
                    >
                        <Row gutter={16}>


                            <Col className='gutter-row' xs={24} xl={formItemLayout === 'one-column' ? 24 : 12}>

                                <FormItem
                                    label="First Name"
                                    name={['users', 'first_name']}
                                    rules={[{ required: true, message: 'Please Enter First Name' }]}
                                >
                                    <Input placeholder="First Name" />
                                </FormItem>

                            </Col>

                            <Col className='gutter-row' xs={24} xl={formItemLayout === 'one-column' ? 24 : 12}>
                                <Form.Item
                                    label="Last Name"
                                // name="membership_plan"
                                // rules={[{ required: true, message: 'Enter Amount' }]}
                                >
                                    <Input.Group compact>
                                        <Form.Item
                                            // label="Prefix"
                                            name={['users', 'prefix']}
                                            rules={[{ required: true, message: 'Please Enter Prefix' }]}
                                            noStyle
                                        >

                                            <Select
                                                showSearch
                                                placeholder="Prefix"

                                                optionFilterProp="children"
                                                //onChange={prefixOnChange}
                                                filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}

                                                style={{ width: '100px' }}
                                            >
                                                {context.psGlobal.collectionOptions(context.psGlobal.collectionData, 'lastname-prefix')}
                                            </Select>
                                        </Form.Item>
                                        <Form.Item
                                            //label="Last Name"
                                            noStyle
                                            name={['users', 'last_name']}
                                            rules={[{ required: true, message: 'Enter Last Name' }]}

                                        >
                                            <Input placeholder="Last Name" style={{ width: '200px' }} />
                                        </Form.Item>

                                    </Input.Group>
                                </Form.Item>


                            </Col>

                            <Col className='gutter-row' xs={24} xl={formItemLayout === 'one-column' ? 24 : 12}>

                                <FormItem
                                    label="Dob"
                                    name={['users', 'dob']}
                                    rules={[{ required: true, message: 'Please Enter Dob' }]}
                                >


                                    <DatePicker //onChange={dobOnChange} 
                                        format='DD/MM/YYYY'
                                        locale={esES}
                                        //disabledDate={dobDisabled}
                                        allowClear={false}
                                    />

                                </FormItem>

                            </Col>

                            <Col className='gutter-row' xs={24} xl={formItemLayout === 'one-column' ? 24 : 12}>

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

                            <Col className='gutter-row' xs={24} xl={formItemLayout === 'one-column' ? 24 : 12}>

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

                            <Col className='gutter-row' xs={24} xl={formItemLayout === 'one-column' ? 24 : 12}>

                                <FormItem
                                    label="Email"
                                    name={['users', 'email']}
                                // rules={[{ required: true, message: 'Please Enter Email' }]}
                                >
                                    <Input placeholder="Email" />
                                </FormItem>

                            </Col>

                            <Col className='gutter-row' xs={24} xl={formItemLayout === 'one-column' ? 24 : 12}>

                                <FormItem
                                    label="Country"
                                    name={['users', 'country']}
                                    rules={[{ required: true, message: 'Please Enter Country' }]}
                                >

                                    <CountryDropdown
                                        className="ant-input"
                                        value={country}
                                        onChange={(val) => setCountry(val)} />
                                </FormItem>

                            </Col>

                            <Col className='gutter-row' xs={24} xl={formItemLayout === 'one-column' ? 24 : 12}>

                                <FormItem
                                    label="State"
                                    name={['users', 'state']}
                                    rules={[{ required: true, message: 'Please Enter State' }]}
                                >

                                    <RegionDropdown
                                        country={country}
                                        className="ant-input"
                                        onChange={onStateChange}
                                    // value={viewData.state}

                                    //onChange={(val) => this.selectRegion(val)} 
                                    />
                                </FormItem>

                            </Col>
                            <Col className='gutter-row' xs={24} xl={formItemLayout === 'one-column' ? 24 : 12}>

                                <FormItem
                                    label="District"
                                    name={['users', 'district']}
                                    rules={[{ required: true, message: 'Please Enter District' }]}
                                >
                                    <Select
                                        showSearch
                                        placeholder="District"
                                        loading={districtLoading}

                                        optionFilterProp="children"
                                        //onChange={childrenLiving_statusOnChange}
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

                            <Col className='gutter-row' xs={24} xl={formItemLayout === 'one-column' ? 24 : 12}>

                                <FormItem
                                    label="Aadhaar No"
                                    name={['users', 'aadhaar_no']}
                                    rules={[{ required: true, message: 'Please Enter Aadhaar No' }]}
                                >
                                    <Input placeholder="Aadhaar No" />
                                </FormItem>

                            </Col>

                            <Col className='gutter-row' xs={24} xl={formItemLayout === 'one-column' ? 24 : 12}>

                                <FormItem
                                    label="Address"
                                    name={['users', 'address']}
                                    rules={[{ required: true, message: 'Please Enter Address' }]}
                                >
                                    <Input.TextArea rows={3} />
                                </FormItem>

                            </Col>

                            <Col className='gutter-row' xs={24} xl={formItemLayout === 'one-column' ? 24 : 12}>

                                <FormItem
                                    label="Photo"
                                    name={['users', 'photo']}
                                // rules={[{ required: true, message: 'Please Enter Photo' }]}
                                >

                                    <ImageUpload
                                        cropRatio="1/1"
                                        defaultImage={editData && editData.photo ? '/cloud-file/' + encodeURIComponent(encodeURIComponent(editData.photo)) : null}
                                        storeFileName={'public/uploads/' + new Date().valueOf() + '.jpg'}
                                        onFinish={(fileName) => { addeditFormUsers.setFieldsValue({ users: { photo: fileName } }) }}
                                    />
                                </FormItem>

                            </Col>

                            <Col className='gutter-row' xs={24} xl={formItemLayout === 'one-column' ? 24 : 12}>

                                <FormItem
                                    label="Id Proof"
                                    name={['users', 'id_proof']}
                                //rules={[{ required: true, message: 'Please Enter Id Proof' }]}
                                >
                                    <ImageUpload
                                        //cropRatio="4/3"
                                        defaultImage={editData && editData.id_proof ? '/cloud-file/' + encodeURIComponent(encodeURIComponent(editData.id_proof)) : null}
                                        storeFileName={'public/uploads/' + new Date().valueOf() + '1.jpg'}
                                        onFinish={(fileName) => { addeditFormUsers.setFieldsValue({ users: { id_proof: fileName } }) }}
                                    />

                                </FormItem>

                            </Col>
                        </Row>


                        <FormItem wrapperCol={context.isMobile ? null : { offset: 8, span: 24 }}
                        >
                            {
                                !context.isMobile && (
                                    <Space>
                                        <MyButton size="large" type="outlined" style={{}} onClick={onListClick}>
                                            Cancel
                                        </MyButton>
                                        <MyButton size="large" type="primary" htmlType="submit" style={{}}>
                                            {curAction === "edit" ? "Update" : "Submit"}
                                        </MyButton>
                                    </Space>

                                )
                            }
                            {
                                context.isMobile && (<Row gutter={2}>
                                    <Col span={12}>
                                        <MButton block color='primary' size='small' fill='outline' onClick={onListClick}>
                                            Cancel
                                        </MButton>
                                    </Col>
                                    <Col span={12}>
                                        <MButton block type='submit' color='primary' size='small'>
                                            {curAction === "edit" ? "Update" : "Submit"}
                                        </MButton>
                                    </Col>
                                </Row>)
                            }

                        </FormItem>


                    </Form>)
                }

            </Spin>



        </>
    );

}
export default AddEditStudentUser;