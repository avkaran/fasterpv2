import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Col, message, Space } from 'antd';
import { Button, Card } from 'antd';
import { Form, Input, Select, InputNumber, Radio, Checkbox, DatePicker } from 'antd';
import { Breadcrumb, Layout, Spin } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import PsContext from '../../../../../../context';
import { Editor } from '@tinymce/tinymce-react';
import { ImageUpload, FormItem, MyButton } from '../../../../../../comp';
import { capitalizeFirst } from '../../../../../../utils';
import PhoneInput from 'react-phone-input-2'
import { CountryDropdown, RegionDropdown } from 'react-country-region-selector';
import dayjs from 'dayjs'
const AddEditFranchise = (props) => {
    const context = useContext(PsContext);
    const navigate = useNavigate();
    const [addeditFormFranchise] = Form.useForm();
    const [loader, setLoader] = useState(false);
    const [curAction, setCurAction] = useState('add');
    const [editData, setEditData] = useState(null);
    const [heading] = useState('Franchise');
    const { editIdOrObject, onListClick, onSaveFinish, userId, ...other } = props;
    const [editId, setEditId] = useState(null);
    const [designations, setDesignations] = useState([]);
    const [country, setCountry] = useState('');
    const [branches, setBranches] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [districtLoading, setDistrictLoading] = useState(false)
    const [selDob, setSelDob] = useState(dayjs().subtract(18, "years"))
    const [selDoj, setSelDoj] = useState(dayjs())
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
                addeditFormFranchise.setFieldsValue({
                   
                    branches: {
                        franchise_status: 'Active',
                        branch_country: 'India',
                        branch_state: 'Tamil Nadu',
                    } 
            });
            setCountry("India");
            LoadDistrict("India", "Tamil Nadu").then(res => setDistricts(res));
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
        addeditFormFranchise.setFieldsValue({

            franchise: {
                name: mydata.name,

                office_name : mydata.office_name,

                designation: mydata.designation,

                photo: mydata.photo,

                mobile_no: mydata.mobile_no,

                whatsapp_no: mydata.whatsapp_no,

                email: mydata.email,

                website : mydata.website,

                country: mydata.country,

                state: mydata.state,
                
                district: mydata.district,

                address: mydata.address,

                branch_id: mydata.branch_id,

                aadhar_no: mydata.aadhar_no,

                aadhar_image: mydata.aadhar_image,

                franchise_status : mydata.franchise_status,
            },
            vi_users: {
                username: mydata.username,

                password: context.psGlobal.decrypt(mydata.password),

                active_status: mydata.active_status,
            }
        });
        setCountry(mydata.country)
    }
    const addeditFormFranchiseOnFinish = (values) => {
        setLoader(true);
        isUsernameExist(values.vi_users.username).then(isExist=>{
            if(!isExist){
               
                var processedValues = {};
                Object.entries(values.franchise).forEach(([key, value]) => {
                    if (value) {
                        processedValues[key] = value;
                    }
                });
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
                        table: 'franchise',
                        values: processedValues
        
                    };
                    context.psGlobal.apiRequest(reqDataInsert, context.adminUser(userId).mode).then((res) => {
                        var createdId = res;
                        var empId = 'RF' + createdId.padStart(4, '0');
        
                        processedUserValues['ref_table_column'] = "franchise.id";
                        processedUserValues['ref_id'] = createdId;
                        processedUserValues['ref_id2'] = empId;
                        processedUserValues['role'] = "franchise";
        
                        var reqDataInner = [{
                            query_type: 'update',
                            table: 'franchise',
                            where: { id: createdId },
                            values: { franchise_code: empId }
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
                        table: 'franchise',
                        where: { id: editId },
                        values: processedValues
        
                    },
                    {
                        query_type: 'update',
                        table: 'vi_users',
                        where: { ref_id: editId,ref_table_column:'franchise.id' },
                        values: processedUserValues
        
                    }
                    ];
                    context.psGlobal.apiRequest(reqDataUpdate, context.adminUser(userId).mode).then((res) => {
                        setLoader(false);
                        message.success(heading + 'Update Successfullly');
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
    const onStateChange = (value) => {
        setDistrictLoading(true);
        LoadDistrict(country, value).then(res => {
            setDistricts(res);
            setDistrictLoading(false);
            addeditFormFranchise.setFieldsValue({
                franchise: { district: '' }
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
                    form={addeditFormFranchise}
                    labelAlign="left"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 20 }}
                    initialValues={{ remember: true }}
                    onFinish={addeditFormFranchiseOnFinish}
                    autoComplete="off"
                >
                    <Row gutter={16}>
                        <Col className='gutter-row' xs={24} xl={12}>
                            <FormItem
                                label="Name"
                                name={['franchise', 'name']}
                                rules={[{ required: true, message: 'Please Enter Name' }]}
                            >
                                <Input placeholder="Name" />
                            </FormItem>
                        </Col>
                        <Col className='gutter-row' xs={24} xl={12}>
                         <FormItem
                                label="office name"
                                name={['franchise', 'office_name']}
                                rules={[{ required: true, message: 'Please Office Name' }]}
                            >
                                <Input placeholder="Office Name" />
                            </FormItem>
                        </Col>
                        <Col className='gutter-row' xs={24} xl={12}>
                              <FormItem
                                label="Designation"
                                name={['franchise', 'designation']}
                                rules={[{ required: true, message: 'Please Enter Designation' }]}
                            >
                                <Input placeholder="Designation" />
                            </FormItem>

                        </Col>
                        <Col className='gutter-row' xs={24} xl={12}>
                            <FormItem
                                label="Photo"
                                name={['franchise', 'photo']}
                            //  rules={[{ required: true, message: 'Please Enter Photo' }]}
                            >
                                <ImageUpload
                                    cropRatio="1/1"
                                    defaultImage={editData && editData.photo?editData.photo:null}
                                    storeFileName={editData && editData.photo ? editData.photo : 'public/uploads/' + new Date().valueOf() + '.jpg'}
                                    onFinish={(fileName) => { addeditFormFranchise.setFieldsValue({ franchise: { photo: fileName } }) }}
                                />
                            </FormItem>
                        </Col>
                        <Col className='gutter-row' xs={24} xl={12}>
                            <FormItem
                                label="Aadhar Image"
                                name={['franchise', 'aadhar_image']}
                            // rules={[{ required: true, message: 'Please Enter Aadhar Image' }]}
                            >
                                <ImageUpload
                                    cropRatio="3/2"

                                    defaultImage={editData && editData.aadhar_image?editData.aadhar_image:null}
                                    storeFileName={editData && editData.aadhar_image ? editData.aadhar_image : 'public/uploads/' + new Date().valueOf() + '1.jpg'}
                                    onFinish={(fileName) => { addeditFormFranchise.setFieldsValue({franchise: { aadhar_image: fileName } }) }}
                                />
                            </FormItem>
                        </Col>
                        <Col className='gutter-row' xs={24} xl={12}>

                            <FormItem
                                label="Mobile No"
                                name={['franchise', 'mobile_no']}
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
                                name={['franchise', 'email']}
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
                                label="website"
                                name={['franchise', 'website']}
                                rules={[{ required: true }]}
                            >
                                 <Input placeholder="Website" />
                            </FormItem>
                            </Col>
                         <Col className='gutter-row' xs={24} xl={12}>
                         <FormItem
                                label="Country"
                                name={['franchise', 'country']}
                                rules={[{ required: true, message: 'Please Enter  Country' }]}
                            >
                                <CountryDropdown
                                    className="ant-input"
                                    value={country}
                                    onChange={(val) => setCountry(val)} />
                            </FormItem>
                            </Col>
                            <Col className='gutter-row' xs={24} xl={12}>
                            <FormItem
                                label="District"
                                name={['franchise', 'district']}
                                rules={[{ required: true, message: 'Please Enter Branch District' }]}
                            >
                                <Select
                                    showSearch
                                    placeholder="District"
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
                                    label="state"
                                    name={['franchise', 'state']}
                                    rules={[{ required: true, message: 'Please Enter  State' }]}
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
                                label="Address"
                                name={['franchise', 'address']}
                                rules={[{ required: true, message: 'Please Enter Address' }]}
                            >
                                <Input.TextArea rows={3} />
                            </FormItem>

                        </Col>

                        <Col className='gutter-row' xs={24} xl={12}>

                            <FormItem
                                label="Aadhar No"
                                name={['franchise', 'aadhar_no']}
                            // rules={[{ required: true, message: 'Please Enter Aadhar No' }]}
                            >
                                <InputNumber placeholder="Aadhar No" type="number" style={{ width: '100%' }} />
                            </FormItem>

                        </Col>
                        <Col className='gutter-row' xs={24} xl={12}>

                            <FormItem
                                label="Franchise Status"
                                name={['franchise', 'franchise_status']}
                                rules={[{ required: true, message: 'Please Enter Franchise Status' }]}
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
export default AddEditFranchise;