import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Col, message, Space } from 'antd';
import { Button } from 'antd';
import { Form, Input, Select, InputNumber, Radio } from 'antd';
import { Spin } from 'antd';
import PsContext from '../../../../../../context';
import { CountryDropdown, RegionDropdown } from 'react-country-region-selector';
import { ImageUpload, FormItem, MyButton } from '../../../../../../comp';
import PhoneInput from 'react-phone-input-2'

import dayjs from 'dayjs'
const AddEditBroker = (props) => {
    const context = useContext(PsContext);
    const navigate = useNavigate();
    const [addeditFormBroker] = Form.useForm();
    const [loader, setLoader] = useState(false);
    const [curAction, setCurAction] = useState('add');
    const [editData, setEditData] = useState(null);
    const [heading] = useState('Broker');

    const [jobCountry, setJobCountry] = useState('India');
    const [jobDistricts, setJobDistricts] = useState([]);
    const [jobDistrictLoading, setJobDistrictLoading] = useState(false);
    const { editIdOrObject, onListClick, onSaveFinish, userId, ...other } = props;
    const [editId, setEditId] = useState(null);
    const [designations, setDesignations] = useState([]);
    const [branches, setBranches] = useState([]);
    const [selDob, setSelDob] = useState(dayjs().subtract(18, "years"))
    const [selDoj, setSelDoj] = useState(dayjs())
    const [country, setCountry] = useState('India');
    const [districts, setDistricts] = useState([]);
    const [districtLoading, setDistrictLoading] = useState(false);
    const [preferedDistrictLoading, setPreferedDistrictLoading] = useState(false)
    const [casteList, setCasteList] = useState([]);
    const [casteLoader, setCasteLoader] = useState(false);
    const [addeditFormMember] = Form.useForm();
    const [subCasteList, setSubCasteList] = useState([]);
    const [subCasteLoader, setSubCasteLoader] = useState(false);
    const [educationList, setEducationList] = useState([]);
    const [preferedCasteLoader, setPreferedCasteLoader] = useState(false);
    const [preferedCasteList, setPreferedCasteList] = useState([]);
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
            addeditFormBroker.setFieldsValue({
                brokers: {
                    broker_status: 'Active',
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
    const loadPreferedCastes = (regliionsArray) => {
        setPreferedCasteLoader(true);
        var reqData =
        {
            query_type: 'query',
            query: "select id,religion,caste_name from castes where religion in('" + regliionsArray.join("','") + "') and master_caste_id is null order by religion"
        }
        context.psGlobal.apiRequest(reqData, context.adminUser(userId).mode).then((res) => {
            setPreferedCasteList(res);
            setPreferedCasteLoader(false);
        }).catch(err => {
            message.error(err);
            setPreferedCasteLoader(false);
        })
    }
    const setEditValues = (mydata) => {
        setSelDob(dayjs(mydata['dob'], "YYYY-MM-DD"));
        setSelDoj(dayjs(mydata['doj'], "YYYY-MM-DD"));
        addeditFormBroker.setFieldsValue({

            brokers: {
                name: mydata.name,

                office_name: mydata.office_name,

                designation: mydata.designation,

                photo: mydata.photo,

                mobile_no: mydata.mobile_no,

                website: mydata.website,

                email: mydata.email,

                broker_country: mydata.broker_country,

                broker_state: mydata.broker_state,

                broker_district: mydata.broker_district,


                address: mydata.address,

                aadhar_no: mydata.aadhar_no,

                aadhar_image: mydata.aadhar_image,


                handling_religion: mydata.handling_religion ? mydata.handling_religion.split(',') : [],

                handling_caste: mydata.handling_caste ? mydata.handling_caste.split(',') : [],


                broker_status: mydata.broker_status,
            },

            vi_users: {
                username: mydata.username,

                password: context.psGlobal.decrypt(mydata.password),

                active_status: mydata.active_status,
            }
        });
    }



    const addeditFormbrokerOnFinish = (values) => {
        setLoader(true);
        isUsernameExist(values.vi_users.username).then(isExist => {
            if (!isExist) {

                var processedValues = {};
                Object.entries(values.brokers).forEach(([key, value]) => {
                    if (value) {
                        processedValues[key] = value;
                    }
                });
                // processedValues['dob'] = selDob.format('YYYY-MM-DD');
                // processedValues['doj'] = selDoj.format('YYYY-MM-DD');
                var processedUserValues = {};
                Object.entries(values.vi_users).forEach(([key, value]) => {
                    if (value) {
                        processedUserValues[key] = value;
                    }
                });
                processedUserValues['password'] = context.psGlobal.encrypt(processedUserValues['password']);
                if (values.brokers['handling_religion'])
                    processedValues['handling_religion'] = values.brokers['handling_religion'].join(',');
                if (values.brokers['handling_caste'])
                    processedValues['handling_caste'] = values.brokers['handling_caste'].join(',');

                if (curAction === "add") {

                    var reqDataInsert = {
                        query_type: 'insert',
                        table: 'brokers',
                        values: processedValues

                    };
                    console.log('insertvalues', processedUserValues)
                    context.psGlobal.apiRequest(reqDataInsert, context.adminUser(userId).mode).then((res) => {
                        var createdId = res;
                        var brokerId = 'RB' + createdId.padStart(4, '0');

                        processedUserValues['ref_table_column'] = "brokers.id";
                        processedUserValues['ref_id'] = createdId;
                        processedUserValues['ref_id2'] = brokerId;
                        processedUserValues['role'] = "broker";

                        var reqDataInner = [{
                            query_type: 'update',
                            table: 'brokers',
                            where: { id: createdId },
                            values: { broker_code: brokerId }

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
                        table: 'brokers',
                        where: { id: editId },
                        values: processedValues

                    },
                    {
                        query_type: 'update',
                        table: 'vi_users',
                        where: { ref_id: editId, ref_table_column: 'brokers.id' },
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
            else {
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
    const onStateChange = (value) => {
        setDistrictLoading(true);
        LoadDistrict(country, value).then(res => {
            setDistricts(res);
            setDistrictLoading(false);
            addeditFormMember.setFieldsValue({
                members: { district: '' }
            })
        }).catch(err => {
            message.error(err);
            setDistrictLoading(false);
        })
    }

    return (
        <>
            <Spin spinning={loader} >
                <Form
                    //name="basic"
                    form={addeditFormBroker}
                    labelAlign="left"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 20 }}
                    initialValues={{ remember: true }}
                    onFinish={addeditFormbrokerOnFinish}
                    autoComplete="off"
                >
                    <Row gutter={16}>
                        <Col className='gutter-row' xs={24} xl={12}>

                            <FormItem
                                label="Name"
                                name={['brokers', 'name']}
                                rules={[{ required: true, message: 'Please Enter Name' }]}
                            >
                                <Input placeholder="Name" />
                            </FormItem>

                        </Col>
                        <Col className='gutter-row' xs={24} xl={12}>

                            <FormItem
                                label="Office Name"
                                name={['brokers', 'office_name']}
                                rules={[{ required: true, message: 'Please Enter Office Name' }]}
                            >
                                <Input placeholder="Office Name" />

                            </FormItem>

                        </Col>
                        <Col className='gutter-row' xs={24} xl={12}>

                            <FormItem
                                label="Designation"
                                name={['brokers', 'designation']}
                                rules={[{ required: true, message: 'Please Enter Designation' }]}
                            >
                                <Input placeholder="Designation" />
                            </FormItem>

                        </Col>
                        <Col className='gutter-row' xs={24} xl={12}>

                            <FormItem
                                label="Email"
                                name={['brokers', 'email']}
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
                                label="Photo"
                                name={['brokers', 'photo']}
                            //  rules={[{ required: true, message: 'Please Enter Photo' }]}
                            >

                                <ImageUpload
                                    cropRatio="1/1"
                                    defaultImage={editData && editData.photo ? editData.photo : null}
                                    storeFileName={editData && editData.photo ? editData.photo : 'public/uploads/' + new Date().valueOf() + '.jpg'}
                                    onFinish={(fileName) => { addeditFormBroker.setFieldsValue({ brokers: { photo: fileName } }) }}
                                />
                            </FormItem>

                        </Col>
                        <Col className='gutter-row' xs={24} xl={12}>

                            <FormItem
                                label="Aadhar Image"
                                name={['brokers', 'aadhar_image']}
                            // rules={[{ required: true, message: 'Please Enter Aadhar Image' }]}
                            >

                                <ImageUpload
                                    cropRatio="3/2"

                                    defaultImage={editData && editData.aadhar_image ? editData.aadhar_image : null}
                                    storeFileName={editData && editData.aadhar_image ? editData.aadhar_image : 'public/uploads/' + new Date().valueOf() + '1.jpg'}
                                    onFinish={(fileName) => { addeditFormBroker.setFieldsValue({ brokers: { aadhar_image: fileName } }) }}
                                />
                            </FormItem>

                        </Col>
                        <Col className='gutter-row' xs={24} xl={12}>

                            <FormItem
                                label="Mobile No"
                                name={['brokers', 'mobile_no']}
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
                                label="Website"
                                name={['brokers', 'website']}
                                rules={[
                                    //{ required: true, message: 'Please Enter Email' },
                                    {
                                        type: 'website',
                                        message: 'The input is not valid E-mail',
                                    },
                                ]}
                            >
                                <Input placeholder="website" />
                            </FormItem>

                        </Col>

                        <Col className='gutter-row' xs={24} xl={12}>

                            <FormItem
                                label="Address"
                                name={['brokers', 'address']}
                                rules={[{ required: true, message: 'Please Enter Address' }]}
                            >
                                <Input.TextArea rows={3} />
                            </FormItem>

                        </Col>

                        <Col className='gutter-row' xs={24} xl={12}>

                            <FormItem
                                label="Aadhar No"
                                name={['brokers', 'aadhar_no']}
                            // rules={[{ required: true, message: 'Please Enter Aadhar No' }]}
                            >
                                <InputNumber placeholder="Aadhar No" type="number" style={{ width: '100%' }} />
                            </FormItem>

                        </Col>

                        <Col className='gutter-row' xs={24} xl={12}>
                            <FormItem
                                label="Handling Religion"
                                name={['brokers', 'handling_religion']}
                            //  rules={[{ required: true, message: 'Please Enter Prefered Religion' }]}
                            >

                                <Select
                                    placeholder="Handling  Religion"

                                    mode="multiple"
                                    style={{
                                        width: '100%',
                                    }}
                                    optionLabelProp="label"
                                    onChange={(value) => loadPreferedCastes(value)}
                                //onChange={preferedReligionOnChange}
                                >
                                    {context.psGlobal.collectionOptions(context.psGlobal.collectionData, 'religion')}
                                </Select>
                            </FormItem>

                        </Col>
                        <Col className='gutter-row' xs={24} xl={12}>

                            <FormItem
                                label="Handling Caste"
                                name={['brokers', 'handling_caste']}
                            // rules={[{ required: true, message: 'Please Enter Prefered Caste' }]}
                            >

                                <Select
                                    placeholder="handling Caste"

                                    mode="multiple"
                                    optionFilterProp="children"
                                //onChange={memberCreated_forOnChange}       
                                // filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                                // optionLabelProp="label"
                                //onChange={preferedCasteOnChange}
                                >
                                    {preferedCasteList.map(item => <Select.Option value={item.id}>{item.caste_name}(<span >{item.religion}</span>)</Select.Option>)}
                                </Select>
                            </FormItem>

                        </Col>
                        <Col className='gutter-row' xs={24} xl={12}>
                            <FormItem
                                label="State"
                                name={['brokers', 'broker_state']}
                                rules={[{ required: true, message: 'Please Enter State' }]}
                            >

                                <RegionDropdown
                                    country={country}
                                    className="ant-input"
                                    // value={viewData.state}
                                    onChange={onStateChange}
                                //onChange={(val) => this.selectRegion(val)} 
                                />
                            </FormItem>


                        </Col>
                        <Col className='gutter-row' xs={24} xl={12}>


                            <FormItem
                                label="Country"
                                name={['brokers', 'broker_country']}
                                rules={[{ required: true, message: 'Please Enter Country' }]}
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
                                name={['brokers', 'broker_district']}
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
                        <Col className='gutter-row' xs={24} xl={12}>

                            <FormItem
                                label="Broker Status"
                                name={['brokers', 'broker_status']}
                                rules={[{ required: true, message: 'Please Enter Active Status' }]}
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
export default AddEditBroker;