import React, { useState, useEffect, useContext, useRef } from 'react';
import { Navigate, useParams, Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Row, Col, message } from 'antd';
import { ImageUpload } from '../../../../comp'
import { Spin, Card } from 'antd';
import { Button, Checkbox, Space, DatePicker } from 'antd';
import { Form, Input, Select, InputNumber, Modal, Image, Collapse } from 'antd';
import PsContext from '../../../../context';
import dayjs from 'dayjs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserCheck, faUser, faUserTimes, faUserClock, faEye, faCheck, faClose, faSearch } from '@fortawesome/free-solid-svg-icons'
import { MyButton, MyTable } from '../../../../comp'
import { green, yellow, grey, cyan } from '@ant-design/colors';
import SearchListComponent from './searchListComponent';
import { LoadingOutlined } from '@ant-design/icons';
import { heightList } from '../../../../models/core';
import ViewMember from './viewMember';
const ProfileSearch = (props) => {
    const context = useContext(PsContext);
    const navigate = useNavigate();
    const {isPublicSearch,homeSearchPhrase,...other } = props;
    const { Panel } = Collapse;
    const filterColumns = useRef(null);
    const [refreshMemberList, setRefreshMemberList] = useState(0);
    const [casteList, setCasteList] = useState([]);
    const [casteLoader, setCasteLoader] = useState(false);
    const [searchActiveKeys, setSearchActiveKeys] = useState([]);
    const [basicSearchForm] = Form.useForm();
    const [curAction, setCurAction] = useState('list');
    const [viewOrEditData, setViewOrEditData] = useState(null);
    useEffect(() => {
       
        // eslint-disable-next-line react-hooks/exhaustive-deps
        var filter_clauses = [];
        if(homeSearchPhrase){
        var phraseSplit = homeSearchPhrase.split(",");
        filter_clauses.push(" m.gender ='" + phraseSplit[0] + "'");
        filter_clauses.push(" ROUND(DATE_FORMAT(FROM_DAYS(DATEDIFF(now(),m.dob)), '%Y'))>" + phraseSplit[1]);
        filter_clauses.push(" ROUND(DATE_FORMAT(FROM_DAYS(DATEDIFF(now(),m.dob)), '%Y'))<" + phraseSplit[2]);
        filter_clauses.push(" m.religion ='" + phraseSplit[3] + "'");
        }else{
            filter_clauses.push(" date(m.created_date)>='" + dayjs().subtract(1, 'd').format("YYYY-MM-DD") + "'")
            if(!isPublicSearch)
            filter_clauses.push(" m.gender<>'" +context.customerUser.gender + "'")
        }
        filterColumns.current = filter_clauses;
        setRefreshMemberList(prev => prev + 1)
    }, []);
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
            options.push(<Select.Option key={index} value={index}>{index} Kg</Select.Option>)
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

        context.psGlobal.apiRequest(reqData, "prod").then((res) => {

            setCasteList(res);
            setCasteLoader(false);
        }).catch(err => {
            message.error(err);
            setCasteLoader(false);
        })
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
        if(!isPublicSearch)
        filter_clauses.push(" m.gender<>'" +context.customerUser.gender + "'")

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
    const onViewClick=(item)=>{
        if(isPublicSearch){
            navigate('/public/login')
        }else{
        setViewOrEditData(item); 
        setCurAction("view")
        }
    }
    const onSendInterestClick=(item)=>{
        if(isPublicSearch){
            navigate('/public/login')
        }else{
        setViewOrEditData(item); 
        setCurAction("view")
        }
    }
    return (
        <>
            {
                curAction === "view" && (<>
                    <div className="container">
                        <div className="row">
                            
                                <Card title="View Member" extra={<MyButton onClick={() => setCurAction("list")}>Back</MyButton>}>
                                    <ViewMember viewIdOrObject={viewOrEditData} onListClick={() => setCurAction("list")}  />
                                </Card>
                           
                        </div>
                    </div>
                </>)
            }
            <div style={{ display: (curAction === "list") ? 'block' : 'none' }}>
                <div className="container">
                    <div className="row">
                        <div className="col-md-3" >
                        </div>
                        <div className="col-md-9" >

                            <Collapse accordion
                                activeKey={searchActiveKeys}
                                onChange={() => { searchActiveKeys.length > 0 ? setSearchActiveKeys([]) : setSearchActiveKeys(['1']) }}

                            >
                                <Panel header={<span style={{ color: cyan[7], fontWeight: 'bold' }}><FontAwesomeIcon icon={faSearch} /> Search</span>} key="1">
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
                                       {
                                        isPublicSearch && ( <Form.Item
                                            label="Gender"
                                            name="gender"
                                        //labelCol={{ span: 8 }}
                                        // wrapperCol={{ offset: 6, span: 6 }}

                                        >
                                            <Select placeholder="Select Gender" >
                                                {context.psGlobal.collectionOptions(context.psGlobal.collectionData, 'gender')}
                                            </Select>
                                        </Form.Item>)
                                       }
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
                                                        {heightList.map(item => <Select.Option key={item.cm} value={item.cm}>{item.label}</Select.Option>)}
                                                    </Select>
                                                </Form.Item>
                                                <Form.Item
                                                    //  label="Amount"
                                                    name="height_to"
                                                    // rules={[{ required: true, message: 'Enter Amount' }]}
                                                    noStyle>
                                                    <Select placeholder="To" style={{ width: '140px' }}>
                                                        {heightList.map(item => <Select.Option key={item.cm} value={item.cm}>{item.label}</Select.Option>)}
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
                                </Panel>

                            </Collapse>
                        </div>
                    </div>
                </div>
                {
                    filterColumns.current && ( <SearchListComponent
                        onViewClick={onViewClick}
                        onSendInterestClick={onSendInterestClick}
                        filterColumnsRef={filterColumns.current}
                        refreshComponent={refreshMemberList}
                       
                    />)
                }
               
            </div>
        </>
    );

}
export default ProfileSearch;