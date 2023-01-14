import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Col, message, Space, Tag } from 'antd';
import { Button, Card } from 'antd';
import { Form, Input, Select, InputNumber, Radio, Checkbox, DatePicker,Avatar,Image } from 'antd';
import { Breadcrumb, Layout, Spin } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import PsContext from '../../../context';
import { green, blue, red, cyan } from '@ant-design/colors';
import { Editor } from '@tinymce/tinymce-react';
import {  FormItem, MyButton,ImageUpload } from '../../../comp';
import { capitalizeFirst } from '../../../utils';
import PhoneInput from 'react-phone-input-2'
import { CountryDropdown, RegionDropdown } from 'react-country-region-selector';
import TextArea from 'antd/lib/input/TextArea';
import dayjs from 'dayjs'
const AddEditCRM = (props) => {
    const context = useContext(PsContext);
    const navigate = useNavigate();
    const [addeditFormCms] = Form.useForm();
    const [loader, setLoader] = useState(false);
    const [curAction, setCurAction] = useState('add');
    const [addeditFormEmployee] = Form.useForm();
    const [editData, setEditData] = useState(null);
    const [heading] = useState('CRM');
    const { editIdOrObject, onListClick, onSaveFinish, userId, ...other } = props;
    const [editId, setEditId] = useState(null);
    const [country, setCountry] = useState('');
    const [districts, setDistricts] = useState([]);
    const [districtLoading, setDistrictLoading] = useState(false)
    const [selDob, setSelDob] = useState(dayjs().subtract(18, "years"))
    const [selDoj, setSelDoj] = useState(dayjs())
    const [planNames, setPlanNames] = useState(null);
    const [selPlanData, setSelPlanData] = useState({})
    const [selData, setSelData] = useState({})
    const [selCustomerData, setSelCustomerData] = useState([null]);
    useEffect(() => {
        loadPlanNames();
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
                case_tasks: {
                    case_status: 'Active',
                    // active_status: 'Active',

                }

            });
            //addForm.setFieldsValue({ category: 'Plan', package_for: 'Customer(Online)', package_status: 'Active' })
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const loadPlanNames = () => {
        var reqData = {
            query_type: 'query', //query_type=insert | update | delete | query

            query: "select * from employees where status=1 and employee_status='Active'"
        };
        context.psGlobal.apiRequest(reqData, context.adminUser(userId).mode).then((res) => {
            setPlanNames(res);
        }).catch(err => {
            message.error(err);
        })
    }
    const loadEditData = (id) => {
        setLoader(true);
        var reqData = {
            query_type: 'query',
            query: "SELECT * from case_tasks  where status=1 and id=" + id
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
        addeditFormCms.setFieldsValue({

            case_tasks: {
                case_no: mydata.case_no,

                title: mydata.title,

                type: mydata.type,

                priority: mydata.type,

                category: mydata.category,

                source_channel: mydata.source_channel,

                assigned_to: mydata.assigned_to,

                due_date: mydata.due_date,

                customer_id: mydata.customer_id,

                description: mydata.description,

            }
        });
        // setCountry(mydata.branch_country)
    }
    const onMemberIdChange = (e) => {

        var inpMemberId = e.target.value;
        if (inpMemberId.length >= 10) {
            
            var reqData = {
                query_type: "query",
                query: "select * from members where member_id='" + inpMemberId + "'",
            };
            context.psGlobal
                .apiRequest(reqData, context.adminUser(userId).mode)
                .then((res) => {
                    if (res.length > 0) setSelCustomerData(res[0]);
                    else setSelCustomerData(null);
                    console.log(res);
                })
                .catch((err) => {
                    message.error(err);
                    //   setLoader(false);
                });
        }
    };

    const addeditFormCmsOnFinish = (values) => {
       
        setLoader(true);
        var processedValues = {};
        Object.entries(values.case_tasks).forEach(([key, value]) => {
            if (value) {
                processedValues[key] = value;
            }
        });
        processedValues['customer_id'] = selCustomerData.id;
        if (curAction === "add") {
            var reqDataInsert = {
                query_type: 'insert',
                table: 'case_tasks',
                values: processedValues

            };
            context.psGlobal.apiRequest(reqDataInsert, context.adminUser(userId).mode).then((res) => {

                var createdId = res;
                var caseNo = 'CS' + createdId.padStart(4, '0');
                var reqDataInner = {
                    query_type: 'update',
                    table: 'case_tasks',
                    where: { id: createdId },
                    values: { case_no: caseNo }

                };
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
            var reqDataUpdate = {
                query_type: 'update',
                table: 'case_tasks',
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
    // const addeditFormCmsOnFinish = (values) => {
    //     setLoader(true);
    //     isUsernameExist(values.vi_users.username).then(isExist=>{
    //         if(!isExist){

    //             var processedValues = {};
    //             Object.entries(values.employees).forEach(([key, value]) => {
    //                 if (value) {
    //                     processedValues[key] = value;
    //                 }
    //             });
    //             processedValues['dob'] = selDob.format('YYYY-MM-DD');
    //             processedValues['doj'] = selDoj.format('YYYY-MM-DD');
    //             var processedUserValues = {};
    //             Object.entries(values.vi_users).forEach(([key, value]) => {
    //                 if (value) {
    //                     processedUserValues[key] = value;
    //                 }
    //             });
    //             processedUserValues['password'] = context.psGlobal.encrypt(processedUserValues['password']);

    //             if (curAction === "add") {

    //                 var reqDataInsert = {
    //                     query_type: 'insert',
    //                     table: 'case_tasks',
    //                     values: processedValues

    //                 };
    //                 context.psGlobal.apiRequest(reqDataInsert, context.adminUser(userId).mode).then((res) => {
    //                     var createdId = res;
    //                     var empId = 'CM' + createdId.padStart(4, '0');

    //                     processedUserValues['ref_table_column'] = "case_tasks.id";
    //                     processedUserValues['ref_id'] = createdId;
    //                     processedUserValues['ref_id2'] = empId;
    //                     processedUserValues['role'] = "case_tasks";

    //                     var reqDataInner = [{
    //                         query_type: 'update',
    //                         table: 'case_tasks',
    //                         where: { id: createdId },
    //                         values: { case_no: empId }

    //                     }
    //                     ];
    //                     context.psGlobal.apiRequest(reqDataInner, context.adminUser(userId).mode).then((resInner) => {
    //                         setLoader(false);
    //                         message.success(heading + ' Added Successfullly');
    //                         onSaveFinish();
    //                     }).catch(err => {
    //                         message.error(err);
    //                         setLoader(false);
    //                     })



    //                 }).catch(err => {
    //                     message.error(err);
    //                     setLoader(false);
    //                 })
    //             } else if (curAction === "edit") {
    //                 var reqDataUpdate = [{
    //                     query_type: 'update',
    //                     table: 'case_tasks',
    //                     where: { id: editId },
    //                     values: processedValues

    //                 }
    //                 ];
    //                 context.psGlobal.apiRequest(reqDataUpdate, context.adminUser(userId).mode).then((res) => {
    //                     setLoader(false);
    //                     message.success(heading + ' Saved Successfullly');
    //                     onSaveFinish();

    //                 }).catch(err => {
    //                     message.error(err);
    //                     setLoader(false);
    //                 })
    //             }
    //         }
    //         else{
    //             message.error("Username already Exists, provide another username")
    //             setLoader(false);
    //         }
    //     })


    // };
    const addeditFormBranchOnFinish = (values) => {
        setLoader(true);
        var processedValues = {};
        Object.entries(values.case_tasks).forEach(([key, value]) => {
            if (value) {
                processedValues[key] = value;
            }
        });

        processedValues['name'] = selPlanData.employees_name;


        var reqDataInsert = {
            query_type: 'insert',
            table: 'case_tasks',
            values: processedValues

        };
        context.psGlobal.apiRequest(reqDataInsert, context.adminUser(userId).mode).then((res) => {
            setLoader(false);
            message.success('Payment Made Successfullly');

        }).catch(err => {
            message.error(err);
            setLoader(false);
        })

    };
    const dobOnChange = (date) => {
        //  console.log('dchange', date)
        setSelData(date);
        addeditFormCms.setFieldsValue({
            case_tasks: { due_date: dayjs(date).format('YYYY-MM-DD') }
        })

    };
    // const isUsernameExist = async (username) => {
    //     return new Promise((resolve, reject) => {
    //         var reqData = null;
    //         if (curAction === 'add') {
    //             reqData = {
    //                 query_type: 'query',
    //                 query: "select * from case_tasks where username='" + username + "'"
    //             };
    //         } else if (curAction === 'edit') {
    //             reqData = {
    //                 query_type: 'query',
    //                 query: "select * from case_tasks where username='" + username + "' and ref_id<>" + editId
    //             };
    //         }

    //         context.psGlobal.apiRequest(reqData, context.adminUser(userId).mode).then((res) => {

    //             if (res.length > 0)
    //                 resolve(true);
    //             else
    //                 resolve(false);
    //         }).catch(err => {
    //             reject(err);
    //         })
    //     })

    // }
    // const onStateChange = (value) => {
    //     setDistrictLoading(true);
    //     LoadDistrict(country, value).then(res => {
    //         setDistricts(res);
    //         setDistrictLoading(false);
    //         addeditFormBranch.setFieldsValue({
    //             branches: { branch_district: '' }
    //         })
    //     }).catch(err => {
    //         message.error(err);
    //         setDistrictLoading(false);
    //     })
    // }
    // const LoadDistrict = async (country, state) => {

    //     return new Promise((resolve, reject) => {
    //         var reqData = {
    //             query_type: 'query', //query_type=insert | update | delete | query
    //             query: "select district_name from districts where status=1 and country='" + country + "' and state='" + state + "'"
    //         };


    //         context.psGlobal.apiRequest(reqData, context.adminUser(userId).mode).then((res) => {
    //             resolve(res);
    //         }).catch(err => {
    //             reject(err);
    //         })
    //     })
    // }
    const onChangeDate = (dates) => {
        addeditFormEmployee.setFieldsValue({ log_dates: [dayjs(), dayjs()] });
    };
    return (
        <>
            <Spin spinning={loader} >
                <Form
                    name="basic"
                    form={addeditFormCms}
                    labelAlign="left"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 20 }}
                    initialValues={{ remember: true }}
                    onFinish={addeditFormCmsOnFinish}
                    autoComplete="off"
                >
                    <Row gutter={16}>
                        <Col className='gutter-row' xs={24} xl={12}>

                            <FormItem
                                label="Title"
                                name={['case_tasks', 'title']}
                                rules={[{ required: true, message: 'Please Enter Titel' }]}
                            >
                                <TextArea placeholder="Title" />
                            </FormItem>

                        </Col>
                        <Col className='gutter-row' xs={24} xl={12}>

                            <FormItem
                                label="Type"
                                name={['case_tasks', 'type']}
                                rules={[{ required: true, message: 'Please Enter Type' }]}
                            >

                                <Select
                                    showSearch
                                    placeholder="Type"

                                    optionFilterProp="children"
                                    //onChange={genderOnChange}
                                    filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                                >
                                    {context.psGlobal.collectionOptions(context.psGlobal.collectionData, 'case-types')}
                                </Select>
                            </FormItem>


                        </Col>
                        <Col className='gutter-row' xs={24} xl={12}>

                            <FormItem
                                label="Source Channel"
                                // style={{marginLeft:'5px'}}
                                name={['case_tasks', 'source_channel']}
                                rules={[{ required: true, message: 'Please Enter Source Channel' }]}
                            >

                                <Select
                                    showSearch
                                    placeholder="Source Channel"

                                    optionFilterProp="children"
                                    //onChange={genderOnChange}
                                    filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                                >
                                    {context.psGlobal.collectionOptions(context.psGlobal.collectionData, 'case-channels')}
                                </Select>
                            </FormItem>

                        </Col>
                        <Col className='gutter-row' xs={24} xl={12}>

                            {/* <FormItem
                                label="Customer"
                                name={['case_tasks', 'customer_id']}
                                rules={[{ required: true, message: 'Please Enter Customer' }]}
                            >
                                <TextArea placeholder="Customer" />
                            </FormItem> */}
                            <FormItem
                                label="Customer"
                                name="customer_id"
                            // rules={[{ required: true, message: "Please Enter Member Name" }]}
                            >
                                <Input onChange={onMemberIdChange} />
                            </FormItem>
                            {
                         selCustomerData && (<Row>
                        <Col className="gutter-row" xs={24} xl={8}>
                         <Avatar
                          size={120}
                            shape="circle"
                            src={
                            <Image
                                width={100}
                                src={selCustomerData.photo ? context.baseUrl + selCustomerData.photo : selCustomerData.gender === 'Male' ? context.noMale : context.noFemale}
                                fallback={context.noImg}
                            />
                            }
                        />
                                </Col>
                                <Col className="gutter-row" xs={24} xl={9}>
                                <span style={{ fontWeight: "bold", fontSize: "14px" }}>
                                    {" "}
                                    {selCustomerData.name}
                                    </span>
                                <br />
                                <br/>
                                <Tag style={{color: cyan[6], fontWeight: "bold" ,fontSize: "14px"}}> {selCustomerData.marital_status}</Tag>
                                <br />
                                <br/>
                                <span style={{color: cyan[6], fontWeight: "bold", margin: "10px 0px 10px 0px",fontSize: "14px" }}>
                                {selCustomerData.education_detail}
                                </span>
                  <br />
                 
                </Col>
              </Row>)
          }
                        </Col>
                        <Col className='gutter-row' xs={24} xl={12}>

                            <FormItem
                                label="Assigned To"
                                name={['case_tasks', 'assigned_to']}
                                // onFinish={addeditFormBranchOnFinish}
                                rules={[{ required: true, message: 'Please Enter Plan Name' }]}
                            >
                                <Select
                                    showSearch
                                    placeholder="name"
                                    // onChange={onPlanChange}

                                    optionFilterProp="children"
                                    //onChange={businessStatusOnChange}
                                    filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                                >
                                    {
                                        planNames && planNames.map(item => {
                                            return <Select.Option value={item.id} >{item.name}</Select.Option>
                                        })
                                    }
                                </Select>
                            </FormItem>

                        </Col>
                        <Col className='gutter-row' xs={24} xl={12}>

                            <FormItem
                                label="Priority"
                                name={['case_tasks', 'priority']}
                                rules={[{ required: true, message: 'Please Enter priority' }]}
                            >

                                <Select
                                    showSearch
                                    placeholder="priority "

                                    optionFilterProp="children"
                                    //onChange={genderOnChange}
                                    filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                                >
                                    {context.psGlobal.collectionOptions(context.psGlobal.collectionData, 'priorities')}
                                </Select>
                            </FormItem>

                        </Col>
                        <Col className='gutter-row' xs={24} xl={12}>

                            <FormItem
                                label="Due Date"
                                name={['case_tasks', 'due_date']}
                                // name={[selData.due_date]}
                                rules={[{ required: true, message: 'Please Enter Dob' }]}
                            >

                                <Space direction="vertical">
                                    <DatePicker

                                        onChange={dobOnChange}

                                        format='DD/MM/YYYY'

                                        allowClear={false}
                                    />
                                </Space>
                            </FormItem>

                        </Col>
                        <Col className='gutter-row' xs={24} xl={12}>

                            <FormItem
                                label="description"
                                name={['case_tasks', 'description']}
                                rules={[
                                    //{ required: true, message: 'Please Enter Email' },
                                    {
                                        // type: 'email',
                                        message: 'The input is not valid description',
                                    },
                                ]}
                            >
                                <TextArea placeholder="description" />
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

                    {/* <FormItem wrapperCol={{ offset: 10, span: 24 }}>
                        <Space>
                            <Button size="large" type="outlined" onClick={onListClick}>
                                Cancel
                            </Button>
                            <MyButton size="large" type="primary" htmlType="submit">
                                {curAction === "edit" ? "Update" : "Submit"}
                            </MyButton>
                        </Space>

                    </FormItem> */}

                </Form>
            </Spin>
        </>
    )
}
export default AddEditCRM;