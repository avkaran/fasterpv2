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
import { useParams } from 'react-router-dom';
const MembersByOrderStatus = (props) => {
    const context = useContext(PsContext);
    const {userId}=useParams();
    const { Panel } = Collapse;
    const [searchForm] = Form.useForm();
    const { Option } = Select;
    const { Content } = Layout;
    const filterColumns = useRef(null);
    const [refreshMemberList, setRefreshMemberList] = useState(0);
    const [curAction, setCurAction] = useState('list');
    const [viewOrEditData, setViewOrEditData] = useState(null);

    const {orderStatus} =useParams()
    useEffect(() => {
        searchForm.setFieldsValue({ order_status: orderStatus })
        loadStatusMembers(orderStatus)
    }, []);
    const loadStatusMembers = (order_status) => {
        var filter_clauses = [];
     
        filter_clauses.push("m.id in (select member_auto_id from orders where   order_status='" + order_status + "' order by paid_date desc)")
        filterColumns.current = filter_clauses;
        setRefreshMemberList(prev => prev + 1);
    }
    const onFinishSearch = (values) => {

        loadStatusMembers(values.order_status)
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


                            <Col className="gutter-row" xs={24} xl={7}>
                                <FormItem
                                    label="Order Status"
                                    name="order_status"
                                    labelCol={{ span: 7 }}
                                //   rules={[{ required: true, message: "Please Enter Action" }]}
                                >
                                    <Select
                                        showSearch
                                        placeholder="Status"
                                        optionFilterProp="children"
                                        //onChange={designationIdOnChange}
                                        filterOption={(input, option) =>
                                            option.children
                                                .toLowerCase()
                                                .includes(input.toLowerCase())
                                        }
                                        defaultValue={orderStatus}
                                    >
                                        <Select.Option value="Paid">Paid </Select.Option>
                                        <Select.Option value="Payment Tried">Payment Tried </Select.Option>
                                        <Select.Option value="Payment Failed">Payment Failed </Select.Option>
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
export default MembersByOrderStatus;