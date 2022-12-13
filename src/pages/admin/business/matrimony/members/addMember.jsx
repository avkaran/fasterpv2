import axios from 'axios';
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams,Link } from 'react-router-dom';
import { Row, Col, message } from 'antd';
import { Button, Card, Checkbox, Upload, Space, DatePicker, Tag } from 'antd';
import { Form, Input, Select, InputNumber, Steps } from 'antd';
import { Breadcrumb, Layout, Spin } from 'antd';
import { baseUrl } from '../../../../../utils';
import { HomeOutlined, LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import moment from 'moment';
import { FormItem, MyButton, MyTable } from '../../../../../comp';
import PsContext from '../../../../../context';
import AddEditMember from './AddEditMember';
import PhoneInput from 'react-phone-input-2'

const AddMember = (props) => {
    const context = useContext(PsContext);
    const { userId } = useParams();
    const { Content } = Layout;
    const navigate = useNavigate();
    const [formSearchDuplicate] = Form.useForm();
    const { Option } = Select;
    const { TextArea } = Input;
    const [casteList, setCasteList] = useState([]);
    const [casteLoader, setCasteLoader] = useState(false);
    const [duplicateMembers, setDuplicateMembers] = useState([]);
    const [duplicateListLoader, setDuplicateListLoader] = useState(false);
    const [allowNewEntry, setAllowNewEntry] = useState(false);
    const [preFilledValues, setPreFilledValues] = useState(null);
    const [curStep, setCurStep] = useState(0)
    useEffect(() => {
    }, []);
    const loadCastes = (religion) => {
        setCasteLoader(true);
        var reqData =
        {
            query_type: 'query',
            query: "select id,caste_name from castes where religion='" + religion + "' and master_caste_id is null"
        }

        context.psGlobal.apiRequest(reqData, context.adminUser(userId).mode).then((res) => {

            setCasteList(res);
            setCasteLoader(false);
        }).catch(err => {
            message.error(err);
            setCasteLoader(false);
        })
    }
    const formSearchDuplicateOnFinish = (values) => {
        setDuplicateListLoader(true);
        var whereClauses = [];

        // whereClauses.push(" m.religion='" + values.religion + "'");
        // whereClauses.push(" m.caste='" + values.caste + "'");
        //mobile_no duplicate in all mobile number
        whereClauses.push(" m.mobile_no in ('" + values.mobile_no + "','" + values.mobile_no.substring(2) + "')");
        whereClauses.push(" m.mobile_alt_no_1 in ('" + values.mobile_no + "','" + values.mobile_no.substring(2) + "')");
        whereClauses.push(" m.mobile_alt_no_2  in ('" + values.mobile_no + "','" + values.mobile_no.substring(2) + "')");
        whereClauses.push(" m.whatsapp_no  in ('" + values.mobile_no + "','" + values.mobile_no.substring(2) + "')");

        //mobile_alt_no_1  duplicate in all mobile number
        if (values.mobile_alt_no_1 && values.mobile_alt_no_1.length > 9) {
            whereClauses.push(" m.mobile_no in ('" + values.mobile_alt_no_1 + "','" + values.mobile_alt_no_1.substring(2) + "')");
            whereClauses.push(" m.mobile_alt_no_1 in ('" + values.mobile_alt_no_1 + "','" + values.mobile_alt_no_1.substring(2) + "')");
            whereClauses.push(" m.mobile_alt_no_2  in ('" + values.mobile_alt_no_1 + "','" + values.mobile_alt_no_1.substring(2) + "')");
            whereClauses.push(" m.whatsapp_no  in ('" + values.mobile_alt_no_1 + "','" + values.mobile_alt_no_1.substring(2) + "')");
        }
        //mobile_alt_no_2  duplicate in all mobile number
        if (values.mobile_alt_no_2 && values.mobile_alt_no_2.length > 9) {
            whereClauses.push(" m.mobile_no in ('" + values.mobile_alt_no_2 + "','" + values.mobile_alt_no_2.substring(2) + "')");
            whereClauses.push(" m.mobile_alt_no_1 in ('" + values.mobile_alt_no_2 + "','" + values.mobile_alt_no_2.substring(2) + "')");
            whereClauses.push(" m.mobile_alt_no_2  in ('" + values.mobile_alt_no_2 + "','" + values.mobile_alt_no_2.substring(2) + "')");
            whereClauses.push(" m.whatsapp_no  in ('" + values.mobile_alt_no_2 + "','" + values.mobile_alt_no_2.substring(2) + "')");
        }

        //whatsapp_no duplicate in all mobile number
        whereClauses.push(" m.mobile_no in ('" + values.whatsapp_no + "','" + values.whatsapp_no.substring(2) + "')");
        whereClauses.push(" m.mobile_alt_no_1 in ('" + values.whatsapp_no + "','" + values.whatsapp_no.substring(2) + "')");
        whereClauses.push(" m.mobile_alt_no_2  in ('" + values.whatsapp_no + "','" + values.whatsapp_no.substring(2) + "')");
        whereClauses.push(" m.whatsapp_no  in ('" + values.whatsapp_no + "','" + values.whatsapp_no.substring(2) + "')");

        var reqData = {
            query_type: 'query', //query_type=insert | update | delete | query
            query: "select m.id,m.member_id,m.name,m.mobile_no,cs.caste_name,member_status from members m,castes cs where m.status=1 and m.member_status='Active' and cs.id=m.caste AND (" + whereClauses.join(" OR ") + ")",
            encrypt: ['mobile_no']
        };

        context.psGlobal.apiRequest(reqData, context.adminUser(userId).mode).then((res, error) => {
            if (res.length === 0) {
                setPreFilledValues([
                    { table: "members", field: "mobile_no", value: values.mobile_no },
                    { table: "members", field: "mobile_alt_no_1", value: values.mobile_alt_no_1 },
                    { table: "members", field: "mobile_alt_no_2", value: values.mobile_alt_no_2 },
                    { table: "members", field: "whatsapp_no", value: values.whatsapp_no },
                ])
                setAllowNewEntry(true);
                setCurStep(1);
                message.success("No Duplicates")
            }
            else
                setAllowNewEntry(false);

            setDuplicateMembers(res);
            setDuplicateListLoader(false);

        }).catch(err => {
            message.error(err);
            setDuplicateListLoader(false);
        })
    }
    const tableColumns = [
        {
            title: 'S.No',
            //  dataIndex: 'row_number',
            //  key: 'row_number',
            render: (item, object, index) => <strong>{index + 1}</strong>,
        },
        {
            title: 'Memer Id',
            dataIndex: 'member_id',
            key: 'member_id',
            //render: (item) => <strong>{item}</strong>,
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            //render: (text) => <a>{text}</a>,
        },
        {
            title: 'Mobile Number',
            // dataIndex: 'mobile_no',
            key: 'mobile_no',
            render: (item) => <span>{context.psGlobal.decrypt(item.mobile_no)} </span>,
        },
        {
            title: 'Caste',
            dataIndex: 'caste_name',
            key: 'caste_name',
            // render: (item) => <span>{item.COLUMN_KEY + "," + item.EXTRA} </span>,
        },
        {
            title: 'Edit',
           // dataIndex: 'caste_name',
           // key: 'caste_name',
            render: (item) => <span><Link to={"/"+userId+"/admin/members/edit/"+ item.id}><MyButton type="primary" shape="circle"><i class="fa-solid fa-pencil"></i></MyButton></Link></span>,
        },
        {
            title: 'Status',
            //dataIndex: 'COLUMN_COMMENT',
            key: 'member_status',
            render: (item) => <Tag color={item.member_status === 'Active' ? 'green' : 'red'} style={{ fontWeight: 'bold' }}>{item.member_status}</Tag>,
        },
        /*  {
             title: 'Actions',
             // dataIndex: 'actions',
             key: 'actions',
             render: (item) => <Space>
                 <MyButton type="outlined" size="small" shape="circle"
                 // onClick={() => onViewClick(item)} 
                 ><i class="fa-solid fa-eye"></i></MyButton>
             </Space>,
         }, */
    ]
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
                        <span>Manage Members</span>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>Add Member</Breadcrumb.Item>
                </Breadcrumb>
                <Row className='bg-white' style={{ padding: '10px' }}>
                    <Steps current={curStep}>
                        <Steps.Step title="Find Duplicates" description="check for duplicate" />
                        <Steps.Step title="Add New Member" description="Fill new member details" />
                        <Steps.Step title="Finished" description="New Profile will Be Saved" />
                    </Steps>
                </Row>

                {
                    !allowNewEntry && (<Card title="Find Duplicates">
                        <Form
                            name="basic"
                            form={formSearchDuplicate}
                            labelAlign="left"
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 20 }}
                            initialValues={{ remember: true }}
                            onFinish={formSearchDuplicateOnFinish}
                            autoComplete="off"
                        >
                            <Row gutter={16}>
                                {/*  <Col className='gutter-row' xs={24} xl={12}>
                                <FormItem
                                    label="Religion"
                                    name='religion'

                                    rules={[{ required: true, message: 'Please Enter Religion' }]}
                                >

                                    <Select
                                        showSearch
                                        placeholder="Religion"
                                        onChange={(value) => loadCastes(value)}
                                        optionFilterProp="children"
                                        //onChange={religionOnChange}
                                        filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                                    >
                                        {context.psGlobal.collectionOptions(context.psGlobal.collectionData, 'religion')}
                                    </Select>
                                </FormItem>
                            </Col>
                            <Col className='gutter-row' xs={24} xl={12}>
                                <Spin spinning={casteLoader} indicator={<LoadingOutlined />} tip="Caste Loading">
                                    <FormItem
                                        label="Caste"
                                        name='caste'
                                        rules={[{ required: true, message: 'Please Enter Caste' }]}
                                    >

                                        <Select
                                            showSearch
                                            placeholder="Caste"

                                            optionFilterProp="children"
                                            //onChange={casteOnChange}
                                            filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                                        >
                                            {casteList.map(item => <Select.Option value={item.id}>{item.caste_name}</Select.Option>)}
                                        </Select>
                                    </FormItem>
                                </Spin>
                            </Col> */}
                                <Col className='gutter-row' xs={24} xl={12}>
                                    <FormItem
                                        label="Mobile No"
                                        name='mobile_no'
                                        rules={[{ required: true, message: 'Please Enter Mobile No' },
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
                                        label="Mobile Alt No 1"
                                        name='mobile_alt_no_1'
                                        rules={[
                                            //{ required: true, message: 'Please Enter Mobile Alt No 1' },
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
                                        label="Mobile Alt No 2"
                                        name='mobile_alt_no_2'
                                        rules={[
                                            //  { required: true, message: 'Please Enter Mobile Alt No 2' },
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
                                        name='whatsapp_no'
                                        rules={[{ required: true, message: 'Please Enter Whatsapp No' },
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

                            <FormItem wrapperCol={{ offset: 10, span: 24 }}>
                                <Space>

                                    <MyButton size="large" type="primary" htmlType="submit">
                                        Find Duplicates
                                    </MyButton>
                                </Space>

                            </FormItem>

                        </Form>

                        {
                            duplicateMembers.length > 0 && (<MyTable columns={tableColumns} loading={duplicateListLoader} dataSource={duplicateMembers} />)
                        }


                    </Card>)
                }

                {
                    allowNewEntry && preFilledValues && (<Card title="Add Member" extra={<Button href={"#/" + userId + "/admin/members"} ><i className="fa-solid fa-list pe-2" ></i>List Members</Button>}>

                        <AddEditMember
                            userId={userId}
                            preFilledValues={preFilledValues}
                            onSaveFinish={() => { setAllowNewEntry(false); setCurStep(0) }}
                            inputFields={
                                [
                                    'members.member_created_for',
                                    'members.name',
                                    'members.gender',
                                    'members.dob',
                                    'members.religion',
                                    'members.caste',
                                    'members.sub_caste',
                                    'members.caste_detail',


                                    'members.password',
                                    'members.marital_status',
                                    'members.childrens',
                                    'members.children_living_status',

                                    'members.mobile_no',
                                    'members.mobile_alt_no_1',
                                    'members.mobile_alt_no_2',
                                    'members.whatsapp_no',

                                    'members.door_no',
                                    'members.street',
                                    'members.area',
                                    'members.taluk',
                                    'members.landmark',
                                    'members.pincode',
                                    'members.country',
                                    'members.state',
                                    'members.district',


                                    'members.email',

                                    'members.mother_tongue',
                                    'members.gothra',
                                    'members.kuladeivam',
                                    'members.poorveegam',
                                    'members.residence_type',
                                    'members.willing_to_home_mappilai',
                                    'members.about_profile',
                                    'members.photo',
                                    'members.is_protect_photo',
                                    'members.educational_qualification',
                                    'members.education_detail',
                                    'members.job_type',
                                    'members.job_name',
                                    'members.job_detail',
                                    'members.job_country',
                                    'members.job_state',
                                    'members.job_district',
                                    'members.job_area',
                                    'members.job_annual_income',

                                    'members.father_name',
                                    'members.mother_name',

                                    'member_family_details.father_status',
                                    'member_family_details.mother_status',
                                    'member_family_details.father_occupation',
                                    'member_family_details.mother_occupation',
                                    'member_family_details.brothers',
                                    'member_family_details.brothers_married',
                                    'member_family_details.sisters',
                                    'member_family_details.sisters_married',
                                    'member_family_details.dowry_jewels',
                                    'member_family_details.dowry_property',
                                    'member_family_details.dowry_cash',
                                    'member_family_details.about_family',

                                    'member_physical_attributes.height',
                                    'member_physical_attributes.weight',
                                    'member_physical_attributes.body_type',
                                    'member_physical_attributes.complexion',
                                    'member_physical_attributes.physical_status',


                                    //horoscope
                                    'member_horoscope.star',
                                    'member_horoscope.patham',
                                    'member_horoscope.raasi',
                                    'member_horoscope.laknam',
                                    'member_horoscope.birth_time',
                                    'member_horoscope.birth_place',
                                    'member_horoscope.dhosam_type',
                                    'member_horoscope.jadhagam_type',
                                    'member_horoscope.raasi_chart',
                                    'member_horoscope.amsam_chart',
                                    'member_horoscope.dasa',
                                    'member_horoscope.dasa_year',
                                    'member_horoscope.dasa_month',
                                    'member_horoscope.dasa_days',


                                ]
                            }
                        />
                    </Card>)
                }


            </Content>
            {/* ALL FIELDS
                                'members.member_created_for',
                                'members.name',
                                'members.father_name',
                                'members.mother_name',
                                'members.gender',
                                'members.dob',
                                'members.password',
                                'members.marital_status',
                                'members.childrens',
                                'members.children_living_status',
                                'members.country',
                                'members.state',
                                'members.district',
                                'members.door_no',
                                'members.street',
                                'members.area',
                                'members.taluk',
                                'members.landmark',
                                'members.pincode',
                                'members.mobile_no',
                                'members.mobile_alt_no_1',
                                'members.mobile_alt_no_2',
                                'members.whatsapp_no',
                                'members.email',
                                'members.aadhaar_no',
                                'members.caste',
                                'members.sub_caste',
                                'members.caste_detail',
                                'members.religion',
                                'members.mother_tongue',
                                'members.languages_known',
                                'members.gothra',
                                'members.kuladeivam',
                                'members.poorveegam',
                                'members.residence_type',
                                'members.willing_to_home_mappilai',
                                'members.about_profile',
                                'members.photo',
                                'members.is_protect_photo',
                                'members.educational_qualification',
                                'members.education_detail',
                                'members.job_type',
                                'members.job_name',
                                'members.job_detail',
                                'members.job_country',
                                'members.job_state',
                                'members.job_district',
                                'members.job_area',
                                'members.job_annual_income',

                                //family details
                                'member_family_details.father_status',
                                'member_family_details.father_occupation',
                                'member_family_details.mother_status',
                                'member_family_details.mother_occupation',
                                'member_family_details.brothers',
                                'member_family_details.brothers_married',
                                'member_family_details.sisters',
                                'member_family_details.sisters_married',
                                'member_family_details.family_type',
                                'member_family_details.dowry_jewels',
                                'member_family_details.dowry_property',
                                'member_family_details.dowry_cash',
                                'member_family_details.about_family',

                                //habits
                                'member_habits.eating_habits',
                                'member_habits.drinking_habits',
                                'member_habits.smoking_habits',
                                'member_habits.hobbies',

                                //physical
                                'member_physical_attributes.height',
                                'member_physical_attributes.weight',
                                'member_physical_attributes.body_type',
                                'member_physical_attributes.complexion',
                                'member_physical_attributes.physical_status',
                                'member_physical_attributes.physical_status_description',

                                //horoscope
                                'member_horoscope.star',
                                'member_horoscope.patham',
                                'member_horoscope.raasi',
                                'member_horoscope.laknam',
                                'member_horoscope.birth_time',
                                'member_horoscope.birth_place',
                                'member_horoscope.dhosam_type',
                                'member_horoscope.jadhagam_type',
                                'member_horoscope.raasi_chart',
                                'member_horoscope.amsam_chart',
                                'member_horoscope.dasa',
                                'member_horoscope.dasa_year',
                                'member_horoscope.dasa_month',
                                'member_horoscope.dasa_days',
                                //partner preference
                                'member_partner_preference.prefered_eating_habits',
                                'member_partner_preference.prefered_smoking_habits',
                                'member_partner_preference.prefered_drinking_habits',
                                'member_partner_preference.prefered_martial_status',
                                'member_partner_preference.age ',
                                'member_partner_preference.height ',
                                'member_partner_preference.weight ',
                                'member_partner_preference.prefered_physical_status',
                                'member_partner_preference.prefered_mother_tongue',
                                'member_partner_preference.prefered_religion',
                                'member_partner_preference.prefered_caste',
                                'member_partner_preference.prefered_education',
                                'member_partner_preference.prefered_job_type',
                                'member_partner_preference.prefered_job',
                                'member_partner_preference.prefered_country',
                                'member_partner_preference.prefered_state',
                                'member_partner_preference.prefered_district',
                                'member_partner_preference.income',
                                'member_partner_preference.expectation_notes',

                            ]
*/}
        </>
    );

}
export default AddMember;