import PsContext from '../../../../../context'
import React, { useState, useEffect, useContext, useRef } from 'react';
import { Row, Col, message, Spin, DatePicker } from 'antd';
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
import dayjs from 'dayjs'
import ViewMember from './viewMember';
import { FormItem } from '../../../../../comp';
const SearchMemberLogsList = (props) => {
    const context = useContext(PsContext);
    const { action, actionBy, userId, ...other } = props;
    const { Panel } = Collapse;
    const [searchForm] = Form.useForm();
    const { Option } = Select;
    const { Content } = Layout;
    const filterColumns = useRef(null);
    const [refreshMemberList, setRefreshMemberList] = useState(0);
    const [curAction, setCurAction] = useState('list');
    const [viewOrEditData, setViewOrEditData] = useState(null);
    const [reference, setreference] = useState([]);

    const [actions] = useState([
        { actionLabel: 'New Entry', action: "add-new-member", ref_table_column: 'members.id' },
        { actionLabel: 'Profile Edit', action: "edit-member", ref_table_column: 'members.id' },
        { actionLabel: 'Profile Delete', action: "delete-member", ref_table_column: 'members.id' },
        { actionLabel: 'Photo Upload', action: "upload-photo", ref_table_column: 'members.id' },
        { actionLabel: 'Profile Print', action: "print-profile", ref_table_column: 'members.id' },
        { actionLabel: 'Paid', action: "make-payment", ref_table_column: 'orders.id' },
        { actionLabel: 'Visit/Login', action: "login", ref_table_column: 'members.id' },
        { actionLabel: 'Payment Tried', action: "payment-tried", ref_table_column: 'orders.id' },
        { actionLabel: 'Payment Failed', action: "payment-failed", ref_table_column: 'orders.id' },
    ])
    useEffect(() => {
        searchForm.setFieldsValue({ log_dates: [dayjs(), dayjs()], action: action, action_by: actionBy })
        onactionChange(actionBy)
        resetLogList([dayjs(), dayjs()], action, actionBy)
    }, []);
    const resetLogList = (log_dates, action, actionBy, refUser = null) => {
        var filter_clauses = [];
        var actionInfo = actions.find(obj => obj.action === action);
        var refUserClause = '';
        var refUserOrderClause = '';
        if (refUser) {
            refUserClause = " and logged_by='" + refUser + "'"
            refUserOrderClause = " and l.logged_by='" + refUser + "'"
        }

        if (actionInfo) {
            if (actionInfo.ref_table_column === "members.id") {
                filter_clauses.push("m.id in (select ref_id from logs where date(log_time)>='" + dayjs(log_dates[0]).format("YYYY-MM-DD") + "' and date(log_time)<='" + dayjs(log_dates[1]).format("YYYY-MM-DD") + "' and ref_table_column='members.id' and log_name='" + action + "' and logged_type='" + actionBy + "' " + refUserClause + ")")
            }
            if (actionInfo.ref_table_column === "orders.id") {
                filter_clauses.push("m.id in (select o.member_auto_id from logs l,orders o where l.ref_id=o.id and date(l.log_time)>='" + dayjs(log_dates[0]).format("YYYY-MM-DD") + "' and date(l.log_time)<='" + dayjs(log_dates[1]).format("YYYY-MM-DD") + "' and l.ref_table_column='orders.id' and l.log_name='" + action + "' and l.logged_type='" + actionBy + "' " + refUserOrderClause + ")")
            }
        }
        filterColumns.current = filter_clauses;
        setRefreshMemberList(prev => prev + 1);
    }
    const onFinishSearch = (values) => {
         resetLogList(values.log_dates,values.action,values.action_by,values.reference)
    }
    const onChangeDate = (dates) => {
        searchForm.setFieldsValue({ log_dates: dates });
    };
    const onactionChange = (value) => {
        if (value.toString() !== "admin") {
            var query = "";
            if (value.toString() === "employee")
                query =
                    "select u.id,e.name from employees e,vi_users u where e.status=1 and e.id=u.ref_id and e.employee_status='Active' and e.employee_code<>'admin'";
            else if (value.toString() === "broker")
                query =
                    "select u.id,b.name from brokers b,vi_users u where b.status=1 and b.id=u.ref_id and b.broker_status='Active'";
            else if (value.toString() === "franchise")
                query =
                    "select u.id,f.name from franchise f,vi_users u where f.status=1 and f.id=u.ref_id and f.franchise_status='Active'";
            var reqData = {
                query_type: "query", //query_type=insert | update | delete | query
                query: query,
            };

            context.psGlobal
                .apiRequest(reqData, context.adminUser(userId).mode)
                .then((res) => {
                    setreference(res);
                })
                .catch((err) => {
                    message.error(err);
                });
        }
    }
    return (
        <>

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
                        'members.religion',
                        'members.caste',
                        'members.sub_caste',
                        'members.caste_detail',
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
                <Card>
                    <Form
                        name="basic"
                        form={searchForm}
                        labelAlign="left"
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 24 }}
                        initialValues={{ remember: true }}
                        onFinish={onFinishSearch}
                        autoComplete="off"
                    >
                    
                        <Row gutter={16}>
                            <Col className="gutter-row" xs={24} xl={12}>
                                <FormItem
                                    label="Date"
                                    name="log_dates"
                                    labelCol={{ span: 4 }}
                                // rules={[{ required: true, message: 'Please Enter Msg Date' }]}
                                >
                                    <Space direction="vertical">
                                        <DatePicker.RangePicker
                                            onChange={onChangeDate}
                                           defaultValue={[dayjs(), dayjs()]}
                                           format="DD/MM/YYYY"
                                            allowClear={false}
                                        />

                                        
                                    </Space>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row gutter={16}>


                            <Col className="gutter-row" xs={24} xl={7}>
                                <FormItem
                                    label="Action"
                                    name="action"
                                    labelCol={{ span: 7 }}
                                //   rules={[{ required: true, message: "Please Enter Action" }]}
                                >
                                    <Select
                                        showSearch
                                        placeholder="Action"
                                        optionFilterProp="children"
                                        //onChange={designationIdOnChange}
                                        filterOption={(input, option) =>
                                            option.children
                                                .toLowerCase()
                                                .includes(input.toLowerCase())
                                        }
                                        defaultValue={action}
                                    >
                                        {actions.map((item) => {
                                            return (
                                                <Select.Option value={item.action}>
                                                    {item.actionLabel}
                                                </Select.Option>
                                            );
                                        })}
                                    </Select>
                                </FormItem>
                            </Col>
                            <Col className="gutter-row" xs={24} xl={7}>
                                <FormItem
                                    label="Action By"
                                    name="action_by"

                                //rules={[{ required: true, message: 'Please Enter Branch Name' }]}
                                >
                                    <Select
                                        showSearch
                                        placeholder="Action By"
                                        onChange={onactionChange}
                                        optionFilterProp="children"
                                        //onChange={genderOnChange}
                                        filterOption={(input, option) =>
                                            option.children
                                                .toLowerCase()
                                                .includes(input.toLowerCase())
                                        }
                                        defaultValue={actionBy}
                                    >
                                        {context.psGlobal.collectionOptions(
                                            context.psGlobal.collectionData,
                                            "user-types", 'option', ['admin']
                                        )}
                                    </Select>
                                </FormItem>
                            </Col>
                            <Col className="gutter-row" xs={24} xl={7}>
                                <FormItem
                                    label="Reference"
                                    name="reference"
                                //rules={[{ required: true, message: 'Please Enter Branch Status' }]}
                                >
                                    <Select
                                        showSearch
                                        allowClear={true}
                                        placeholder="Reference"
                                        optionFilterProp="children"
                                        //onChange={designationIdOnChange}
                                        filterOption={(input, option) =>
                                            option.children
                                                .toLowerCase()
                                                .includes(input.toLowerCase())
                                        }
                                    >
                                        {reference.map((item) => {
                                            return (
                                                <Select.Option value={item.id}>
                                                    {item.name}
                                                </Select.Option>
                                            );
                                        })}
                                    </Select>
                                </FormItem>
                            </Col>
                            <Col className="gutter-row" xs={24} xl={3}>

                                <MyButton
                                    type="primary" htmlType="submit">
                                    <FontAwesomeIcon icon={faSearch} /> Search
                                </MyButton>

                            </Col>
                        </Row>
                    </Form>
                </Card>
                {
                    filterColumns.current && (<ListMemberComponent
                        onEditClick={(item) => { setViewOrEditData(item); setCurAction("edit") }}
                        onViewClick={(item) => { setViewOrEditData(item); setCurAction("view") }}
                        filterColumnsRef={filterColumns.current}
                        refreshComponent={refreshMemberList}
                        userId={userId}
                    />)
                }

            </div>



        </>
    );

}
export default SearchMemberLogsList;