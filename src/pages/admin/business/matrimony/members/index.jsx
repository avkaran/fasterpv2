import PsContext from '../../../../../context'
import React, { useState, useEffect, useContext, useRef } from 'react';
import { Row, Col, message, Spin } from 'antd';
import { Space, Select, Tabs, Collapse, Input, Button, Card } from 'antd';
import { MyButton } from '../../../../../comp'
import { Breadcrumb, Layout, Form } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import { green, red, cyan, grey } from '@ant-design/colors';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleQuestion } from '@fortawesome/free-solid-svg-icons'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import { heightList } from '../../../../../models/core'
import { LoadingOutlined } from '@ant-design/icons';
import ListMemberComponent from './listMemberComponent';
import AddEditMember from './AddEditMember';
import moment from 'moment'
import ViewMember from './viewMember';
import { useParams } from 'react-router-dom';
const ListMembers = (props) => {
    const context = useContext(PsContext);
const {userId}=useParams();
    const { Panel } = Collapse;
    const [searchByIdForm] = Form.useForm();
    const [basicSearchForm] = Form.useForm();
    const { Option } = Select;
    const { Content } = Layout;

    const [casteList, setCasteList] = useState([]);
    const [casteLoader, setCasteLoader] = useState(false);
    const [searchActiveKeys, setSearchActiveKeys] = useState([]);
    const filterColumns = useRef([" date(m.created_date)>='" + moment().subtract(1, 'd').format("YYYY-MM-DD") + "'"]);
    const [refreshMemberList, setRefreshMemberList] = useState(0);
    const [curAction, setCurAction] = useState('list');
    const [viewOrEditData, setViewOrEditData] = useState(null);

    const getAge = () => {
        var ages = [];
        for (var i = 18; i < 80; i++) {
            ages.push(<Select.Option value={i}>{i} Years</Select.Option>)
        }
        return ages;
    }
    const getWeightList = () => {

        let options = [];
        for (var index = 35; index <= 70; index++) {
            options.push(<Option key={index} value={index}>{index} Kg</Option>)
        }
        return options;
    };

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
    useEffect(() => {

        /*   var filter_clauses = [];
          filter_clauses.push(" date(m.created_date)='"+ moment().format("YYYY-MM-DD")+"'");
          filterColumns.current = filter_clauses;
          setRefreshMemberList(prev => prev + 1); */
        //   loadFilterMenu();

    }, []);
    const onFinishSearchById = (values) => {

        if (!values.member_id && !values.mobile_no) {
            message.error("Enter member id or mobile number any one.");
            return;
        }
        if (values.member_id) {
            var member_id = values.member_id.trim();
            var final_ids = [];
            if (member_id.includes(",")) {
                var commaSeparatedIds = member_id.split(",");
                commaSeparatedIds.forEach(item => {
                    if (item.includes("-")) {
                        var hypenSeparated = item.trim().split("-");
                        var start = parseInt(hypenSeparated[0].replace("RM", ""));
                        var end = parseInt(hypenSeparated[1].replace("RM", ""));
                        if (start && end) {

                            for (var i = start; i <= end; i++) {
                                final_ids.push("RM" + i.toString().padStart(8, '0'))
                            }
                        }
                    }
                    else {
                        var exact_id = parseInt(item.replace("RM", ""));
                        final_ids.push("RM" + exact_id.toString().padStart(8, '0'))
                    }
                })
            } else if (member_id.includes("-")) {
                var hypenSeparated = member_id.split("-");
                var start = parseInt(hypenSeparated[0].replace("RM", ""));
                var end = parseInt(hypenSeparated[1].replace("RM", ""));
                if (start && end) {
                    for (var i = start; i <= end; i++) {
                        final_ids.push("RM" + i.toString().padStart(8, '0'))
                    }
                }
            }
            else {
                var exact_id = parseInt(member_id.replace("RM", ""));
                final_ids.push("RM" + exact_id.toString().padStart(8, '0'))
            }

            var filter_clauses = [];
            filter_clauses.push(" m.member_id in ('" + final_ids.join("','") + "')");
            filterColumns.current = filter_clauses;
            setSearchActiveKeys([]);

            setRefreshMemberList(prev => prev + 1)

        }
        else if (values.mobile_no) {
            var final_nos = [];

            if (values.mobile_no.includes(",")) {
                var commaSeparatedNos = values.mobile_no.split(",");
                commaSeparatedNos.forEach(item => {
                    if (item.trim().length === 10)
                        final_nos.push("91" + item.trim());

                    final_nos.push(item.trim());
                })
            }
            else {
                if (values.mobile_no.trim().length === 10)
                    final_nos.push("91"+values.mobile_no.trim())

                final_nos.push(values.mobile_no.trim())
            }


            var filter_clauses_mobile = [];

            filter_clauses_mobile.push(" (m.mobile_no in ('" + final_nos.join("','") + "') OR  m.mobile_alt_no_1 in ('" + final_nos.join("','") + "') OR m.mobile_alt_no_2 in ('" + final_nos.join("','") + "') OR m.whatsapp_no in ('" + final_nos.join("','") + "') )");
            filterColumns.current = filter_clauses_mobile;
            setSearchActiveKeys([]);

            setRefreshMemberList(prev => prev + 1)


        }
    }
    const onBasicSearchFormFinish = (values) => {
        var filter_clauses = [];
        var processedValues = {};
        Object.entries(values).forEach(([key, value]) => {
            if (value) {
                processedValues[key] = value;
            }
        });
        if (processedValues.age_from) {
            filter_clauses.push(" ROUND(DATE_FORMAT(FROM_DAYS(DATEDIFF(now(),m.dob)), '%Y'))>" + processedValues.age_from);
            delete processedValues.age_from;
            if (processedValues.age_to) {
                filter_clauses.push(" ROUND(DATE_FORMAT(FROM_DAYS(DATEDIFF(now(),m.dob)), '%Y'))<" + processedValues.age_to);
                delete processedValues.age_to;
            }

        }
        if (processedValues.weight_from) {
            filter_clauses.push(" p.weight>" + processedValues.weight_from);
            delete processedValues.weight_from;
            if (processedValues.weight_to) {
                filter_clauses.push(" p.weight<" + processedValues.weight_to);
                delete processedValues.weight_to;
            }
        }
        if (processedValues.height_from) {
            filter_clauses.push(" p.height>" + processedValues.height_from);
            delete processedValues.height_from;
            if (processedValues.height_to) {
                filter_clauses.push(" p.height<" + processedValues.height_to);
                delete processedValues.height_to;
            }
        }
        Object.entries(processedValues).forEach(([key, value]) => {
            if (Array.isArray(value))
                filter_clauses.push(" m." + key + " in ('" + value.join("','") + "')");
            else
                filter_clauses.push(" m." + key + "='" + value + "'");
        });

        filterColumns.current = filter_clauses;
        setSearchActiveKeys([]);
        setRefreshMemberList(prev => prev + 1);
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
                <Breadcrumb style={{ margin: '0', padding: '8px 0px 8px 0px' }}>
                    <Breadcrumb.Item href="">
                        <HomeOutlined />
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        <span>Manage Members</span>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>List Members</Breadcrumb.Item>
                </Breadcrumb>
                {
                    curAction === "view" && (<Card title="View Member" extra={<MyButton onClick={() => setCurAction("list")}>Back</MyButton>}>
                        <ViewMember viewIdOrObject={viewOrEditData} onListClick={() => setCurAction("list")} userId={userId} />
                    </Card>)
                }
                {curAction === "edit" && (<Card title="Edit Member"><AddEditMember
                    editIdOrObject={viewOrEditData} onListClick={() => setCurAction("list")}
                    onSaveFinish={() => { setCurAction("list"); setRefreshMemberList(prev => prev + 1); }}
                    userId={userId}
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

                /></Card>)}
                <div style={{ display: (curAction === "list") ? 'block' : 'none' }}>
                    <Collapse accordion style={{ width: '100%' }}
                        activeKey={searchActiveKeys}
                        onChange={() => { searchActiveKeys.length > 0 ? setSearchActiveKeys([]) : setSearchActiveKeys(['1']) }}

                    >
                        <Panel header={<span style={{ color: cyan[7], fontWeight: 'bold' }}><FontAwesomeIcon icon={faSearch} /> Search</span>} key="1">
                            <Tabs
                                defaultActiveKey="1"
                            >
                                <Tabs.TabPane tab="Search by Id" key="search_by_id">
                                    <Form
                                        name="basic"
                                        form={searchByIdForm}
                                        labelAlign="left"
                                        labelCol={{ span: 8 }}
                                        wrapperCol={{ span: 20 }}
                                        initialValues={{ remember: true }}
                                        onFinish={onFinishSearchById}
                                        autoComplete="off"
                                    >

                                        <Row gutter={16}>

                                            <Col className='gutter-row' xs={24} xl={10}>

                                                <Form.Item
                                                    label="Member Id"
                                                    name="member_id"
                                                    tooltip={{ title: " Use Comma(,) for multiple Ids and use hyphen(-) for from to Ids", color: green[6], icon: <FontAwesomeIcon icon={faCircleQuestion} style={{ color: green[6] }} /> }}

                                                >
                                                    <Input placeholder="Member Id" />

                                                </Form.Item>

                                            </Col>
                                            <Col className='gutter-row' xs={24} xl={2} align="center">
                                                <span style={{ fontSize: '14px', color: red[7] }}>(OR)</span>
                                            </Col>
                                            <Col className='gutter-row' xs={24} xl={10}>

                                                <Form.Item
                                                    label="Mobile No"
                                                    name="mobile_no"
                                                    tooltip={{ title: "Use Comma(,) for multiple Mobile Numbers", color: green[6], icon: <FontAwesomeIcon icon={faCircleQuestion} style={{ color: green[6] }} /> }}
                                                >

                                                    <Input />

                                                </Form.Item>

                                            </Col>
                                        </Row>


                                        <Form.Item wrapperCol={{ offset: 10, span: 24 }}>
                                            <Button size="large" type="primary" htmlType="submit" style={{}}>
                                                <FontAwesomeIcon icon={faSearch} /> &nbsp; Search
                                            </Button>
                                        </Form.Item>

                                    </Form>

                                </Tabs.TabPane>
                                <Tabs.TabPane tab="Basic Search" key="basic_search">
                                    <Form
                                        name="basic"
                                        form={basicSearchForm}
                                        labelAlign="left"
                                        labelCol={{ span: 4 }}
                                        wrapperCol={{ span: 10 }}
                                        initialValues={{ remember: true }}
                                        onFinish={onBasicSearchFormFinish}
                                        // onFinishFailed={onFinishFailed}
                                        autoComplete="off"
                                    >
                                        <Form.Item
                                            label="Age"
                                        // name="membership_plan"
                                        // rules={[{ required: true, message: 'Enter Amount' }]}
                                        >
                                            <Input.Group compact>
                                                <Form.Item
                                                    // label="Amount"
                                                    name="age_from"

                                                    noStyle >
                                                    <Select placeholder="From" style={{ width: '120px' }}>
                                                        {getAge()}
                                                    </Select>
                                                </Form.Item>
                                                <Form.Item
                                                    //  label="Amount"
                                                    name="age_to"
                                                    // rules={[{ required: true, message: 'Enter Amount' }]}
                                                    noStyle>
                                                    <Select placeholder="To" style={{ width: '120px' }}>
                                                        {getAge()}
                                                    </Select>
                                                </Form.Item>

                                            </Input.Group>
                                        </Form.Item>
                                        <Form.Item
                                            label="Gender"
                                            name="gender"
                                        //labelCol={{ span: 8 }}
                                        // wrapperCol={{ offset: 6, span: 6 }}

                                        >
                                            <Select placeholder="Select Gender" >
                                                {context.psGlobal.collectionOptions(context.psGlobal.collectionData, 'gender')}
                                            </Select>
                                        </Form.Item>
                                        <Form.Item
                                            label="Marital Status"
                                            name="marital_status"
                                        >
                                            <Select
                                                showSearch
                                                placeholder="Marital Status"
                                                mode="multiple"

                                                optionFilterProp="children"
                                                //onChange={maritalStatusOnChange}
                                                filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                                            >
                                                {context.psGlobal.collectionOptions(context.psGlobal.collectionData, 'marital-status')}
                                            </Select>
                                        </Form.Item>
                                        <Form.Item
                                            label="Religion"
                                            name="religion"

                                        >

                                            <Select
                                                showSearch
                                                placeholder="Religion"

                                                optionFilterProp="children"
                                                //onChange={religionOnChange}
                                                filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                                                onChange={(value) => loadCastes(value)}
                                            >
                                                {context.psGlobal.collectionOptions(context.psGlobal.collectionData, 'religion')}
                                            </Select>
                                        </Form.Item>
                                        <Spin spinning={casteLoader} indicator={<LoadingOutlined />} tip="Caste Loading">
                                            <Form.Item
                                                label="Caste"
                                                name="caste"

                                            >

                                                <Select
                                                    showSearch
                                                    placeholder="Caste"
                                                    mode="multiple"

                                                    optionFilterProp="children"

                                                    //onChange={casteOnChange}
                                                    filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                                                >
                                                    {casteList.map(item => <Select.Option value={item.id}>{item.caste_name}</Select.Option>)}
                                                </Select>
                                            </Form.Item>
                                        </Spin>
                                        <Form.Item
                                            label="Photo"
                                            name="is_photo_updated"

                                        >

                                            <Select
                                                showSearch
                                                //placeholder="Photo"
                                                // mode="multiple"

                                                optionFilterProp="children"

                                                //onChange={casteOnChange}
                                                filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                                            >
                                                <Select.Option value="1">With Photo</Select.Option>
                                                <Select.Option value="0">Without Photo</Select.Option>
                                            </Select>
                                        </Form.Item>

                                        <Form.Item
                                            label="Height"
                                        // name="membership_plan"
                                        // rules={[{ required: true, message: 'Enter Amount' }]}
                                        >
                                            <Input.Group compact>
                                                <Form.Item
                                                    // label="Amount"
                                                    name="height_from"

                                                    noStyle>
                                                    <Select placeholder="From" style={{ width: '140px' }}>
                                                        {heightList.map(item => <Option key={item.cm} value={item.cm}>{item.label}</Option>)}
                                                    </Select>
                                                </Form.Item>
                                                <Form.Item
                                                    //  label="Amount"
                                                    name="height_to"
                                                    // rules={[{ required: true, message: 'Enter Amount' }]}
                                                    noStyle>
                                                    <Select placeholder="To" style={{ width: '140px' }}>
                                                        {heightList.map(item => <Option key={item.cm} value={item.cm}>{item.label}</Option>)}
                                                    </Select>
                                                </Form.Item>

                                            </Input.Group>
                                        </Form.Item>
                                        <Form.Item
                                            label="Weight"
                                        // name="membership_plan"
                                        // rules={[{ required: true, message: 'Enter Amount' }]}
                                        >
                                            <Input.Group compact>
                                                <Form.Item
                                                    // label="Amount"
                                                    name="weight_from"

                                                    noStyle>
                                                    <Select placeholder="From" style={{ width: '140px' }}>
                                                        {getWeightList()}
                                                    </Select>
                                                </Form.Item>
                                                <Form.Item
                                                    //  label="Amount"
                                                    name="weight_to"
                                                    // rules={[{ required: true, message: 'Enter Amount' }]}
                                                    noStyle>
                                                    <Select placeholder="To" style={{ width: '140px' }}>
                                                        {getWeightList()}
                                                    </Select>
                                                </Form.Item>

                                            </Input.Group>
                                        </Form.Item>
                                        <Form.Item wrapperCol={{ offset: 8, span: 24 }}>
                                            <Space>
                                                <MyButton size="large" htmlType="submit">
                                                    Search
                                                </MyButton>
                                                <MyButton size="large" type="outlined" color={grey[5]} htmlType="button" onClick={() => basicSearchForm.resetFields()}>
                                                    Reset
                                                </MyButton>
                                            </Space>
                                        </Form.Item>
                                    </Form>
                                </Tabs.TabPane>
                            </Tabs>
                        </Panel>

                    </Collapse>

                    <ListMemberComponent
                        onEditClick={(item) => { setViewOrEditData(item); setCurAction("edit") }}
                        onViewClick={(item) => { setViewOrEditData(item); setCurAction("view") }}
                        filterColumnsRef={filterColumns.current}
                        refreshComponent={refreshMemberList}
                        userId={userId}
                    />
                </div>


            </Content>
        </>
    );

}
export default ListMembers;