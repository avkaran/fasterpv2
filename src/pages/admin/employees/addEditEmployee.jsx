import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Col, message, Space } from 'antd';
import { Button, Card } from 'antd';
import { Form, Input, Select, InputNumber, Radio, Checkbox, DatePicker } from 'antd';
import { Breadcrumb, Layout, Spin } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import PsContext from '../../../context';
import { Editor } from '@tinymce/tinymce-react';
import { ImageUpload, FormItem, MyButton } from '../../../comp';
import { capitalizeFirst } from '../../../utils';
import PhoneInput from 'react-phone-input-2'
import { CountryDropdown, RegionDropdown } from 'react-country-region-selector';
import moment from 'moment'
const AddEditEmployee = (props) => {
    const context = useContext(PsContext);
    const navigate = useNavigate();
    const [addeditFormEmployee] = Form.useForm();
    const [loader, setLoader] = useState(false);
    const [curAction, setCurAction] = useState('add');
    const [editData, setEditData] = useState(null);
    const [heading] = useState('Employee');
    const { editIdOrObject, onListClick, onSaveFinish, userId, ...other } = props;
    const [editId, setEditId] = useState(null);
    const [designations, setDesignations] = useState([]);
    const [branches, setBranches] = useState([]);
    const [selDob, setSelDob] = useState(moment().subtract(18, "years"))
    const [selDoj, setSelDoj] = useState(moment())
    useEffect(() => {
        LoadBranches();
        LoadDesignations();
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
            addeditFormEmployee.setFieldsValue({
                employees: {
                    employee_status: 'Active',
                    active_status: 'Active',
                },
                vi_users: {
                    active_status: 'Active',
                }
            });
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
        setSelDob(moment(mydata['dob'], "YYYY-MM-DD"));
        setSelDoj(moment(mydata['doj'], "YYYY-MM-DD"));
        addeditFormEmployee.setFieldsValue({

            employees: {
                name: mydata.name,

                gender: mydata.gender,

                designation_id: mydata.designation_id,

                photo: mydata.photo,

                mobile_no: mydata.mobile_no,

                whatsapp_no: mydata.whatsapp_no,

                alternative_mobile_no: mydata.alternative_mobile_no,

                email: mydata.email,

                address: mydata.address,

                branch_id: mydata.branch_id,

                aadhar_no: mydata.aadhar_no,

                aadhar_image: mydata.aadhar_image,

                dob: mydata.dob,

                doj: mydata.doj,

                employee_status: mydata.employee_status,
            },
            vi_users: {
                username: mydata.username,

                password: context.psGlobal.decrypt(mydata.password),

                active_status: mydata.active_status,
            }
        });
    }
    const addeditFormEmployeeOnFinish = (values) => {
        setLoader(true);
        isUsernameExist(values.vi_users.username).then(isExist=>{
            if(!isExist){
               
                var processedValues = {};
                Object.entries(values.employees).forEach(([key, value]) => {
                    if (value) {
                        processedValues[key] = value;
                    }
                });
                processedValues['dob'] = selDob.format('YYYY-MM-DD');
                processedValues['doj'] = selDoj.format('YYYY-MM-DD');
                var processedUserValues = {};
                Object.entries(values.vi_users).forEach(([key, value]) => {
                    if (value) {
                        processedUserValues[key] = value;
                    }
                });
                processedUserValues['password'] = context.psGlobal.encrypt(processedUserValues['password']);
        
                if (curAction === "add") {
        
                    var reqDataInsert = {
                        query_type: 'insert',
                        table: 'employees',
                        values: processedValues
        
                    };
                    context.psGlobal.apiRequest(reqDataInsert, context.adminUser(userId).mode).then((res) => {
                        var createdId = res;
                        var empId = 'EM' + createdId.padStart(4, '0');
        
                        processedUserValues['ref_table_column'] = "employees.id";
                        processedUserValues['ref_id'] = createdId;
                        processedUserValues['ref_id2'] = empId;
                        processedUserValues['role'] = "employee";
        
                        var reqDataInner = [{
                            query_type: 'update',
                            table: 'employees',
                            where: { id: createdId },
                            values: { employee_code: empId }
        
                        },
                        {
                            query_type: 'insert',
                            table: 'vi_users',
                            values: processedUserValues
        
                        }
                        ];
                        context.psGlobal.apiRequest(reqDataInner, context.adminUser(userId).mode).then((resInner) => {
                            setLoader(false);
                            message.success(heading + ' Added Successfullly');
                            onSaveFinish();
                        }).catch(err => {
                            message.error(err);
                            setLoader(false);
                        })
        
        
        
                    }).catch(err => {
                        message.error(err);
                        setLoader(false);
                    })
                } else if (curAction === "edit") {
                    var reqDataUpdate = [{
                        query_type: 'update',
                        table: 'employees',
                        where: { id: editId },
                        values: processedValues
        
                    },
                    {
                        query_type: 'update',
                        table: 'vi_users',
                        where: { ref_id: editId,ref_table_column:'employees.id' },
                        values: processedUserValues
        
                    }
                    ];
                    context.psGlobal.apiRequest(reqDataUpdate, context.adminUser(userId).mode).then((res) => {
                        setLoader(false);
                        message.success(heading + ' Saved Successfullly');
                        onSaveFinish();
        
                    }).catch(err => {
                        message.error(err);
                        setLoader(false);
                    })
                }
            }
            else{
                message.error("Username already Exists, provide another username")
                setLoader(false);
            }
        })
      
       
    };
    const LoadDesignations = () => {
        var reqData = {
            query_type: 'query', //query_type=insert | update | delete | query
            query: "select id,designation from designations where status=1"
        };
        context.psGlobal.apiRequest(reqData, context.adminUser(userId).mode).then((res) => {
            setDesignations(res);
        }).catch(err => {
            message.error(err);
        })
    }
    const LoadBranches = () => {
        var reqData = {
            query_type: 'query', //query_type=insert | update | delete | query
            query: "select id,branch_name,branch_district from branches where status=1 and branch_status='Active'"
        };
        context.psGlobal.apiRequest(reqData, context.adminUser(userId).mode).then((res) => {
            setBranches(res);
        }).catch(err => {
            message.error(err);
        })
    }
    const dobDisabled = (current) => {
        // Can not select days before today and today
        return current && current > moment().subtract(18, "years");
    };
    const dobOnChange = (date) => {
        //  console.log('dchange', date)
        setSelDob(date);
        addeditFormEmployee.setFieldsValue({
            employees: { dob: moment(date).format('YYYY-MM-DD') }
        })

    };
    const dojOnChange = (date) => {
        //  console.log('dchange', date)
        setSelDoj(date);
        addeditFormEmployee.setFieldsValue({
            employees: { doj: moment(date).format('YYYY-MM-DD') }
        })

    };
    const isUsernameExist = async (username) => {
        return new Promise((resolve, reject) => {
            var reqData = null;
            if (curAction === 'add') {
                reqData = {
                    query_type: 'query',
                    query: "select * from vi_users where username='" + username + "'"
                };
            } else if (curAction === 'edit') {
                reqData = {
                    query_type: 'query',
                    query: "select * from vi_users where username='" + username + "' and ref_id<>" + editId
                };
            }
           
            context.psGlobal.apiRequest(reqData, context.adminUser(userId).mode).then((res) => {
               
                if (res.length > 0)
                    resolve(true);
                else
                    resolve(false);
            }).catch(err => {
                reject(err);

            })
        })

    }
    return (
        <>
            <Spin spinning={loader} >
                <Form
                    //name="basic"
                    form={addeditFormEmployee}
                    labelAlign="left"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 20 }}
                    initialValues={{ remember: true }}
                    onFinish={addeditFormEmployeeOnFinish}
                    autoComplete="off"
                >
                    <Row gutter={16}>
                        <Col className='gutter-row' xs={24} xl={12}>

                            <FormItem
                                label="Name"
                                name={['employees', 'name']}
                                rules={[{ required: true, message: 'Please Enter Name' }]}
                            >
                                <Input placeholder="Name" />
                            </FormItem>

                        </Col>
                        <Col className='gutter-row' xs={24} xl={12}>

                            <FormItem
                                label="Gender"
                                name={['employees', 'gender']}
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
                                label="Designation"
                                name={['employees', 'designation_id']}
                                rules={[{ required: true, message: 'Please Enter Designation' }]}
                            >

                                <Select
                                    showSearch
                                    placeholder="Designation"

                                    optionFilterProp="children"
                                    //onChange={designationIdOnChange}
                                    filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                                >
                                    {
                                        designations.map(item => {
                                            return <Select.Option value={item.id}>{item.designation}</Select.Option>
                                        })
                                    }
                                </Select>
                            </FormItem>

                        </Col>
                        <Col className='gutter-row' xs={24} xl={12}>

                            <FormItem
                                label="Branch"
                                name={['employees', 'branch_id']}
                                rules={[{ required: true, message: 'Please Enter Branch' }]}
                            >

                                <Select
                                    showSearch
                                    placeholder="Branch"

                                    optionFilterProp="children"
                                //onChange={branchIdOnChange}
                                //filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                                >
                                    {
                                        branches.map(item => {
                                            return <Select.Option value={item.id}>{item.branch_name}-{item.branch_district}</Select.Option>
                                        })
                                    }
                                </Select>
                            </FormItem>

                        </Col>
                        <Col className='gutter-row' xs={24} xl={12}>

                            <FormItem
                                label="Photo"
                                name={['employees', 'photo']}
                            //  rules={[{ required: true, message: 'Please Enter Photo' }]}
                            >

                                <ImageUpload
                                    cropRatio="1/1"
                                    defaultImage={editData && editData.photo?editData.photo:null}
                                    storeFileName={editData && editData.photo ? editData.photo : 'public/uploads/' + new Date().valueOf() + '.jpg'}
                                    onFinish={(fileName) => { addeditFormEmployee.setFieldsValue({ employees: { photo: fileName } }) }}
                                />
                            </FormItem>

                        </Col>
                        <Col className='gutter-row' xs={24} xl={12}>

                            <FormItem
                                label="Aadhar Image"
                                name={['employees', 'aadhar_image']}
                            // rules={[{ required: true, message: 'Please Enter Aadhar Image' }]}
                            >

                                <ImageUpload
                                    cropRatio="3/2"

                                    defaultImage={editData && editData.aadhar_image?editData.aadhar_image:null}
                                    storeFileName={editData && editData.aadhar_image ? editData.aadhar_image : 'public/uploads/' + new Date().valueOf() + '.jpg'}
                                    onFinish={(fileName) => { addeditFormEmployee.setFieldsValue({ employees: { aadhar_image: fileName } }) }}
                                />
                            </FormItem>

                        </Col>
                        <Col className='gutter-row' xs={24} xl={12}>

                            <FormItem
                                label="Mobile No"
                                name={['employees', 'mobile_no']}
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
                                label="Whatsapp No"
                                name={['employees', 'whatsapp_no']}
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
                        <Col className='gutter-row' xs={24} xl={12}>

                            <FormItem
                                label="Alternative Mobile No"
                                name={['employees', 'alternative_mobile_no']}
                                rules={[
                                    //  { required: true, message: 'Please Enter Alternative Mobile No' },
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
                                name={['employees', 'email']}
                                rules={[
                                    //{ required: true, message: 'Please Enter Email' },
                                    {
                                        type: 'email',
                                        message: 'The input is not valid E-mail',
                                    },
                                ]}
                            >
                                <Input placeholder="Email" />
                            </FormItem>

                        </Col>
                        <Col className='gutter-row' xs={24} xl={12}>

                            <FormItem
                                label="Address"
                                name={['employees', 'address']}
                                rules={[{ required: true, message: 'Please Enter Address' }]}
                            >
                                <Input.TextArea rows={3} />
                            </FormItem>

                        </Col>

                        <Col className='gutter-row' xs={24} xl={12}>

                            <FormItem
                                label="Aadhar No"
                                name={['employees', 'aadhar_no']}
                            // rules={[{ required: true, message: 'Please Enter Aadhar No' }]}
                            >
                                <InputNumber placeholder="Aadhar No" type="number" style={{ width: '100%' }} />
                            </FormItem>

                        </Col>

                        <Col className='gutter-row' xs={24} xl={12}>

                            <FormItem
                                label="Date of Birth"
                                name={['employees', 'dob']}
                                rules={[{ required: true, message: 'Please Enter Dob' }]}
                            >

                                <Space direction="vertical">
                                    <DatePicker
                                        //onChange={dobOnChange} 
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
                                label="Date of Join"
                                name={['employees', 'doj']}
                                rules={[{ required: true, message: 'Please Enter Doj' }]}
                            >

                                <Space direction="vertical">
                                    <DatePicker
                                        onChange={dojOnChange}

                                        value={selDoj}
                                        format='DD/MM/YYYY'
                                        //disabledDate={dojDisabled}
                                        allowClear={false}
                                    />
                                </Space>
                            </FormItem>

                        </Col>
                        <Col className='gutter-row' xs={24} xl={12}>

                            <FormItem
                                label="Employee Status"
                                name={['employees', 'employee_status']}
                                rules={[{ required: true, message: 'Please Enter Employee Status' }]}
                            >
                                <Radio.Group defaultValue="Active" optionType="default" >
                                    {context.psGlobal.collectionOptions(context.psGlobal.collectionData, 'active-inactive', 'radio')}
                                </Radio.Group>
                            </FormItem>

                        </Col>
                        <Col className='gutter-row' xs={24} xl={12}>

                            <FormItem
                                label="Login Username"
                                name={['vi_users', 'username']}
                                rules={[{ required: true, message: 'Please Enter Username' },

                                ]}
                            >
                                <Input placeholder='Username' />
                            </FormItem>

                        </Col>
                        <Col className='gutter-row' xs={24} xl={12}>

                            <FormItem
                                label="Login Password"
                                name={['vi_users', 'password']}
                                rules={[{ required: true, message: 'Please Enter Password' }]}
                            >
                                <Input.Password />
                            </FormItem>

                        </Col>
                        <Col className='gutter-row' xs={24} xl={12}>

                            <FormItem
                                label="Login Status"
                                name={['vi_users', 'active_status']}
                                rules={[{ required: true, message: 'Please Enter Active Status' }]}
                            >
                                <Radio.Group defaultValue="Active" optionType="default" >
                                    {context.psGlobal.collectionOptions(context.psGlobal.collectionData, 'active-inactive', 'radio')}
                                </Radio.Group>
                            </FormItem>

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
export default AddEditEmployee;