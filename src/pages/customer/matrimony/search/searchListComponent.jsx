import React, { useState, useEffect, useContext,useRef } from 'react';
import { Navigate, useParams, Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Row, Col, message } from 'antd';
import { AvatarPaginatedList, ImageUpload } from '../../../../comp'
import { Spin, Card } from 'antd';
import { Button, Checkbox, Space, DatePicker } from 'antd';
import { Form, Input, Select, InputNumber, Modal, Image,Collapse } from 'antd';
import PsContext from '../../../../context';
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserCheck, faUser, faUserTimes, faUserClock, faEye, faCheck, faClose } from '@fortawesome/free-solid-svg-icons'
import { MyButton, MyTable } from '../../../../comp'
import { green, yellow, grey,cyan } from '@ant-design/colors';
import { heightList } from '../../../../models/core';
const SearchListComponent = (props) => {
    const { Panel } = Collapse;
    const context = useContext(PsContext);
    const [menuItems, setMenuItems] = useState([]);
    const navigate = useNavigate();
    const filterColumns = useRef(null);
    const [refreshList, setRefreshList] = useState(0);
    const InfiniteListRef = useRef();
    const { filterColumnsRef, refreshComponent, userId,onSendInterestClick,onViewClick, ...other } = props;
    const [filterLoader, setFilterLoader] = useState(false);
    useEffect(() => {
        
        filterColumns.current = filterColumnsRef;
       
        loadFilterMenu();
        setRefreshList(prev => prev + 1);
    }, [filterColumnsRef, refreshComponent])
    useEffect(() => {
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const onListPageChange = (page, allData) => {

       
    }
    const onFinishFilterPanel = (values) => {
        var filter_clauses = [];
        if (filterColumns.current && Array.isArray(filterColumns.current))
            filter_clauses = filterColumns.current;
        Object.entries(values).forEach(([key, value], index) => {
            if (value) {
                if (key === "gender")
                    filter_clauses.push(" m.gender in ('" + value.join("','") + "')");
                else if (key === "marital_status")
                    filter_clauses.push(" m.marital_status in ('" + value.join("','") + "')");
                else if (key === "country")
                    filter_clauses.push(" m.country in ('" + value.join("','") + "')");
                else if (key === "state")
                    filter_clauses.push(" m.state in ('" + value.join("','") + "')");
                else if (key === "district")
                    filter_clauses.push(" m.district in ('" + value.join("','") + "')");
                else if (key === "religion")
                    filter_clauses.push(" m.religion in ('" + value.join("','") + "')");
                else if (key === "caste")
                    filter_clauses.push(" m.caste in ('" + value.join("','") + "')");
                else if (key === "sub_caste")
                    filter_clauses.push(" m.sub_caste in ('" + value.join("','") + "')");
                else if (key === "photo")
                    filter_clauses.push(" m.is_photo_updated in ('" + value.join("','") + "')");
                else if (key === "residence_type")
                    filter_clauses.push(" m.residence_type in ('" + value.join("','") + "')");
                else if (key === "education")
                    filter_clauses.push(" m.educational_qualification in ('" + value.join("','") + "')");
                else if (key === "education")
                    filter_clauses.push(" m.educational_qualification in ('" + value.join("','") + "')");


            }
        });
        filterColumns.current = filter_clauses;
        loadFilterMenu();
        setRefreshList(prev => prev + 1);
    }
    const loadFilterMenu = () => {
        setFilterLoader(true);

        var reqData = [{
            filter_column: "gender",
            query_type: 'query', //query_type=insert | update | delete | query
            query: "select gender as label,count(*) as count from members m,member_family_details f,member_habits hb,member_horoscope hr,member_physical_attributes p  where m.status=1 and m.member_status='Active' and m.id=f.member_auto_id and m.id=hb.member_auto_id and m.id=hr.member_auto_id and m.id=p.member_auto_id " + context.psGlobal.getWhereClause(filterColumns.current, false) + " GROUP BY gender"
        },
        {
            filter_column: "marital_status",
            query_type: 'query', //query_type=insert | update | delete | query
            query: "select marital_status as label,count(*) as count from members m,member_family_details f,member_habits hb,member_horoscope hr,member_physical_attributes p  where m.status=1 and m.member_status='Active' and m.id=f.member_auto_id and m.id=hb.member_auto_id and m.id=hr.member_auto_id and m.id=p.member_auto_id " + context.psGlobal.getWhereClause(filterColumns.current, false) + " GROUP BY marital_status"
        },
        {
            filter_column: "country",
            query_type: 'query', //query_type=insert | update | delete | query
            query: "select country as label,count(*) as count from members m,member_family_details f,member_habits hb,member_horoscope hr,member_physical_attributes p  where m.status=1 and m.member_status='Active'  and m.id=f.member_auto_id and m.id=hb.member_auto_id and m.id=hr.member_auto_id and m.id=p.member_auto_id " + context.psGlobal.getWhereClause(filterColumns.current, false) + " GROUP BY country"
        },
        {
            filter_column: "state",
            query_type: 'query', //query_type=insert | update | delete | query
            query: "select state as label,count(*) as count from members m,member_family_details f,member_habits hb,member_horoscope hr,member_physical_attributes p  where m.status=1 and m.member_status='Active'  and m.id=f.member_auto_id and m.id=hb.member_auto_id and m.id=hr.member_auto_id and m.id=p.member_auto_id " + context.psGlobal.getWhereClause(filterColumns.current, false) + " GROUP BY state"
        },
        {
            filter_column: "district",
            query_type: 'query', //query_type=insert | update | delete | query
            query: "select district as label,count(*) as count from members m,member_family_details f,member_habits hb,member_horoscope hr,member_physical_attributes p  where m.status=1 and m.member_status='Active'  and m.id=f.member_auto_id and m.id=hb.member_auto_id and m.id=hr.member_auto_id and m.id=p.member_auto_id " + context.psGlobal.getWhereClause(filterColumns.current, false) + " GROUP BY district"
        },
        {
            filter_column: "religion",
            query_type: 'query', //query_type=insert | update | delete | query
            query: "select religion as label,count(*) as count from members m,member_family_details f,member_habits hb,member_horoscope hr,member_physical_attributes p  where m.status=1 and m.member_status='Active'  and m.id=f.member_auto_id and m.id=hb.member_auto_id and m.id=hr.member_auto_id and m.id=p.member_auto_id " + context.psGlobal.getWhereClause(filterColumns.current, false) + " GROUP BY religion"
        },
        {
            filter_column: "caste",
            query_type: 'query', //query_type=insert | update | delete | query
            query: "select c.caste_name as label,m.caste as value,count(*) as count from castes c,members m,member_family_details f,member_habits hb,member_horoscope hr,member_physical_attributes p  where m.status=1 and m.member_status='Active'  and m.id=f.member_auto_id and m.id=hb.member_auto_id and m.id=hr.member_auto_id and m.id=p.member_auto_id  and  m.caste=c.id and m.status=1 " + context.psGlobal.getWhereClause(filterColumns.current, false) + " GROUP BY m.caste"
        },
        {
            filter_column: "sub_caste",
            query_type: 'query', //query_type=insert | update | delete | query
            query: "select sub_caste as label,count(*) as count from members m,member_family_details f,member_habits hb,member_horoscope hr,member_physical_attributes p  where m.status=1 and m.member_status='Active'  and m.id=f.member_auto_id and m.id=hb.member_auto_id and m.id=hr.member_auto_id and m.id=p.member_auto_id  " + context.psGlobal.getWhereClause(filterColumns.current, false) + " GROUP BY sub_caste"
        },

        {
            filter_column: "photo",
            query_type: 'query', //query_type=insert | update | delete | query
            query: "select IF(is_photo_updated='1','With Photo', 'Without Photo') as label,m.is_photo_updated as value,count(*) as count from members m,member_family_details f,member_habits hb,member_horoscope hr,member_physical_attributes p  where m.status=1 and m.member_status='Active'  and m.id=f.member_auto_id and m.id=hb.member_auto_id and m.id=hr.member_auto_id and m.id=p.member_auto_id " + context.psGlobal.getWhereClause(filterColumns.current, false) + " GROUP BY is_photo_updated"
        },
        {
            filter_column: "residence_type",
            query_type: 'query', //query_type=insert | update | delete | query
            query: "select residence_type as label,count(*) as count from members m,member_family_details f,member_habits hb,member_horoscope hr,member_physical_attributes p  where m.status=1 and m.member_status='Active'  and m.id=f.member_auto_id and m.id=hb.member_auto_id and m.id=hr.member_auto_id and m.id=p.member_auto_id " + context.psGlobal.getWhereClause(filterColumns.current, false) + " GROUP BY residence_type"
        },
        {
            filter_column: "education",
            query_type: 'query', //query_type=insert | update | delete | query
            query: "select e.course_name as label,m.educational_qualification as value,count(*) as count from education_courses e,members m,member_family_details f,member_habits hb,member_horoscope hr,member_physical_attributes p  where m.status=1 and m.member_status='Active'  and m.id=f.member_auto_id and m.id=hb.member_auto_id and m.id=hr.member_auto_id and m.id=p.member_auto_id  and  m.educational_qualification=e.id and m.status=1 " + context.psGlobal.getWhereClause(filterColumns.current, false) + " GROUP BY m.educational_qualification"
        },
        {
            filter_column: "job_type",
            query_type: 'query', //query_type=insert | update | delete | query
            query: "select job_type as label,count(*) as count from members m,member_family_details f,member_habits hb,member_horoscope hr,member_physical_attributes p  where m.status=1 and m.member_status='Active'  and m.id=f.member_auto_id and m.id=hb.member_auto_id and m.id=hr.member_auto_id and m.id=p.member_auto_id " + context.psGlobal.getWhereClause(filterColumns.current, false) + " GROUP BY job_type"
        },
        {
            filter_column: "job_name",
            query_type: 'query', //query_type=insert | update | delete | query
            query: "select job_name as label,count(*) as count from members m,member_family_details f,member_habits hb,member_horoscope hr,member_physical_attributes p  where m.status=1 and m.member_status='Active'  and m.id=f.member_auto_id and m.id=hb.member_auto_id and m.id=hr.member_auto_id and m.id=p.member_auto_id " + context.psGlobal.getWhereClause(filterColumns.current, false) + " GROUP BY job_name"
        },
        {
            filter_column: "job_country",
            query_type: 'query', //query_type=insert | update | delete | query
            query: "select job_country as label,count(*) as count from members m,member_family_details f,member_habits hb,member_horoscope hr,member_physical_attributes p  where m.status=1 and m.member_status='Active'  and m.id=f.member_auto_id and m.id=hb.member_auto_id and m.id=hr.member_auto_id and m.id=p.member_auto_id " + context.psGlobal.getWhereClause(filterColumns.current, false) + " GROUP BY job_country"
        },
        {
            filter_column: "job_state",
            query_type: 'query', //query_type=insert | update | delete | query
            query: "select job_state as label,count(*) as count from members m,member_family_details f,member_habits hb,member_horoscope hr,member_physical_attributes p  where m.status=1 and m.member_status='Active'  and m.id=f.member_auto_id and m.id=hb.member_auto_id and m.id=hr.member_auto_id and m.id=p.member_auto_id " + context.psGlobal.getWhereClause(filterColumns.current, false) + " GROUP BY job_state"
        },
        {
            filter_column: "job_district",
            query_type: 'query', //query_type=insert | update | delete | query
            query: "select job_district as label,count(*) as count from members m,member_family_details f,member_habits hb,member_horoscope hr,member_physical_attributes p  where m.status=1 and m.member_status='Active'  and m.id=f.member_auto_id and m.id=hb.member_auto_id and m.id=hr.member_auto_id and m.id=p.member_auto_id " + context.psGlobal.getWhereClause(filterColumns.current, false) + " GROUP BY job_district"
        },
        {
            filter_column: "body_type",
            query_type: 'query', //query_type=insert | update | delete | query
            query: "select p.body_type as label,count(*) as count from members m,member_family_details f,member_habits hb,member_horoscope hr,member_physical_attributes p  where m.status=1 and m.id=f.member_auto_id and m.id=hb.member_auto_id and m.id=hr.member_auto_id and m.id=p.member_auto_id " + context.psGlobal.getWhereClause(filterColumns.current, false) + " GROUP BY p.body_type"
        },
        {
            filter_column: "complexion",
            query_type: 'query', //query_type=insert | update | delete | query
            query: "select p.complexion as label,count(*) as count from members m,member_family_details f,member_habits hb,member_horoscope hr,member_physical_attributes p  where m.status=1 and m.member_status='Active'  and m.id=f.member_auto_id and m.id=hb.member_auto_id and m.id=hr.member_auto_id and m.id=p.member_auto_id " + context.psGlobal.getWhereClause(filterColumns.current, false) + " GROUP BY p.complexion"
        },
        {
            filter_column: "star",
            query_type: 'query', //query_type=insert | update | delete | query
            query: "select hr.star as label,count(*) as count from members m,member_family_details f,member_habits hb,member_horoscope hr,member_physical_attributes p  where m.status=1  and m.member_status='Active'  and m.id=f.member_auto_id and m.id=hb.member_auto_id and m.id=hr.member_auto_id and m.id=p.member_auto_id " + context.psGlobal.getWhereClause(filterColumns.current, false) + " GROUP BY hr.star"
        },
        {
            filter_column: "raasi",
            query_type: 'query', //query_type=insert | update | delete | query
            query: "select hr.raasi as label,count(*) as count from members m,member_family_details f,member_habits hb,member_horoscope hr,member_physical_attributes p  where m.status=1  and m.member_status='Active'  and m.id=f.member_auto_id and m.id=hb.member_auto_id and m.id=hr.member_auto_id and m.id=p.member_auto_id " + context.psGlobal.getWhereClause(filterColumns.current, false) + " GROUP BY hr.raasi"
        }];



        context.psGlobal.apiRequest(reqData, context.adminUser(userId).mode).then((res) => {
            var menus = [];

            reqData.forEach((item, index) => {
                var curWhereClasuses = filterColumns.current;
                var isClauseFound = false;

                if (curWhereClasuses) {
                    isClauseFound = curWhereClasuses.find((element) => {

                        if (element.includes(item.filter_column)) {

                            return true;

                        }
                    });
                }

                var menu = getMenu(item.filter_column.toUpperCase().replace("_", " "), item.filter_column, res[index]);
                if (menu && !isClauseFound) menus.push(menu);
            })




            setMenuItems(menus);
            setFilterLoader(false);
        }).catch(err => {
            message.error(err);
            setFilterLoader(false);
            //setLoader(false);
        })

    };
    const getMenu = (title, key, records) => {

        var childrens = [];
        records.forEach(item => {
            if (item.label)
                childrens.push({ label: item.label + " (" + item.count + ")", value: item.value ? item.value : item.label, key: key + "-" + item.label.toLowerCase().replace(" ", "_") })
        })
        if (childrens.length > 0)
            return { label: title, key: key, children: childrens }
        else return false;
    }
    const getFilterList = () => {
        var panelList = [];
        menuItems.forEach((item) => {
            var childlist = [];
            item.children.forEach(child => {
                childlist.push(<><Checkbox value={child.value}>{child.label}</Checkbox><br /></>)
            });
            panelList.push(<Panel header={item.label} key={item.key}>
                <Form
                    // name="basic"
                    // form={addForm}
                    labelAlign="left"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 20 }}
                    initialValues={{ remember: true }}
                    onFinish={onFinishFilterPanel}
                    autoComplete="off"
                >
                    <Form.Item
                        //label="Password"
                        name={item.key}
                    //rules={[{ required: true, message: 'Please input password' }]}

                    >
                        <Checkbox.Group>{childlist}</Checkbox.Group>
                    </Form.Item>
                    <Form.Item wrapperCol={{ offset: 8, span: 24 }}>

                        <MyButton size="small" htmlType="submit">
                            Apply
                        </MyButton>


                    </Form.Item>
                </Form>
            </Panel>)
        })

        return panelList;

    }
    const getHeight = (cm) => {
        let d = heightList.find((item) => item.cm == cm);
        return d && d.label;
    }
    return (
        <>
            <div className="container">
                <div className="row">
                    <div className="col-md-3" >
                    <Card
                        bodyStyle={{
                            padding: "8px", fontWeight: 'bold', fontSize: '18px', color: cyan[7],
                            border: '1px solid',
                            borderBottom: '0',
                            borderColor: cyan[2]
                        }}
                        style={{
                            margin: "0px",
                            border: '1px solid #d9d9d9',
                            borderRadius: '2px',

                            //borderRadius: "20px",
                        }}


                    >Filter</Card>
                    <Spin spinning={filterLoader} >
                        <Collapse accordion>
                            {getFilterList()}


                        </Collapse>
                    </Spin>
                    </div>
                    <div className="col-md-9">
                        
                        <div className="ant-spin-nested-loading">
                            <div className="ant-spin-container">
                            {
                        filterColumns.current && (  <AvatarPaginatedList
                            ref={InfiniteListRef}
                            listHeading={"Members"}
    
                            countQuery={"select count(*) AS count from members m,member_family_details f,member_habits hb,member_horoscope hr,member_physical_attributes p,member_partner_preference mp,education_courses ec,castes cs   where m.status=1 and m.member_status='Active' and m.id=f.member_auto_id and m.id=hb.member_auto_id and m.id=hr.member_auto_id and m.id=p.member_auto_id and m.id=mp.member_auto_id and ec.id=m.educational_qualification and cs.id=m.caste " + context.psGlobal.getWhereClause(filterColumns.current, false)}
                            
    
                            listQuery={"select m.*,@rownum:=@rownum+1 as row_number,ROUND(DATE_FORMAT(FROM_DAYS(DATEDIFF(now(),dob)), '%Y')) AS age,COALESCE((SELECT package_price FROM orders where member_auto_id=m.id  and order_status='Paid' and is_current_plan=1 limit 1),0) as paid_amount,ec.course_name,cs.caste_name,f.father_status,f.father_occupation,f.mother_status,f.mother_occupation,f.brothers,f.brothers_married,f.sisters,f.sisters_married,f.family_type,f.dowry_jewels,f.dowry_property,f.dowry_cash,hb.eating_habits,hb.drinking_habits,hb.smoking_habits,hr.star,hr.patham,hr.raasi,hr.laknam,hr.birth_time,hr.birth_place,hr.dhosam_type,hr.jadhagam_type,hr.raasi_chart,hr.amsam_chart,p.height,p.weight,p.body_type,p.complexion,p.physical_status,p.physical_status_description,mp.prefered_eating_habits,mp.prefered_smoking_habits,mp.prefered_drinking_habits,mp.prefered_martial_status,CONCAT(mp.age_from,',',mp.age_to) as pref_age,CONCAT(mp.height_from,',',mp.height_to) as pref_height,CONCAT(mp.weight_from,',',mp.weight_to) as pref_weight,mp.prefered_physical_status,mp.prefered_mother_tongue,mp.prefered_religion,mp.prefered_caste,mp.prefered_education,mp.prefered_job_type,mp.prefered_job,mp.prefered_country,mp.prefered_state,mp.prefered_district,CONCAT(mp.income_from,',',mp.income_to) as pref_income,mp.expectation_notes from members m,member_family_details f,member_habits hb,member_horoscope hr,member_physical_attributes p,member_partner_preference mp,education_courses ec,castes cs  CROSS JOIN (SELECT @rownum:={rowNumberVar}) crsj  where m.status=1 and m.member_status='Active' and m.id=f.member_auto_id and m.id=hb.member_auto_id and m.id=hr.member_auto_id and m.id=p.member_auto_id  and m.id=mp.member_auto_id and ec.id=m.educational_qualification and cs.id=m.caste " + context.psGlobal.getWhereClause(filterColumns.current, false) + "  order by created_date desc"}
                            recordsPerRequestOrPage={10}
                            encryptFields={['mobile_no', 'mobile_alt_no_1', 'mobile_alt_no_2', 'whatsapp_no']}
                            userId={userId}
                            refresh={refreshList}
                            isCheckboxList={false}
                          //  onCheckedChange={onCheckedChange}
                            onPageChange={onListPageChange}
                            renderItem={(item, index) => {
                                return <>
                                    <div className="d-none d-md-block">
                                    <div className="mb-15 card">
                                        <div className="p-0 hover  card-body">
                                            <div className="row">
                                                <div className="col-md-3">
                                                    <img
                                                        src={item.photo ? context.baseUrl + item.photo : item.gender === 'Male' ? context.noMale : context.noFemale}
                                                        className="border"
                                                        style={{ height: 260, width: 220 }}
                                                        alt={item.name}
                                                    />
                                                </div>
                                                <div className="pl-35 col-md-7">
                                                    <div className="pb-10 pt-15 border-bottom mb-15">
                                                        <a
                                                            
                                                            onClick={() => onViewClick(item)}
                                                        >
                                                            <h6 className="font-weight-600 d-flex justify-content-between ">
                                                                <span>{item.name}, {item.age} Yrs</span>
                                                                <span className="text-theme">{item.member_id}</span>
                                                            </h6>
                                                        </a>
                                                    </div>
                                                    <table
                                                        width="100%"
                                                        className="font-12 font-weight-200"
                                                        style={{ fontWeight: 300 }}
                                                    >
                                                        <tbody>
                                                            <tr>
                                                                <td width="50%" />
                                                            </tr>
                                                            <tr>
                                                                <td height={25}>{item.age} Yrs, {getHeight(item.height)}</td>
                                                            </tr>
                                                            <tr>
                                                                <td height={25}>{item.religion} , {item.caste_name}</td>
                                                            </tr>
                                                            <tr>
                                                                <td height={25}>{item.course_name}</td>
                                                            </tr>
                                                            <tr>
                                                                <td height={25}>{item.marital_staus}</td>
                                                            </tr>
                                                            <tr>
                                                                <td width="50%" />
                                                            </tr>
                                                            <tr>
                                                                <td height={25}>{item.district}, {item.state}</td>
                                                            </tr>
                                                            <tr>
                                                                <td height={25}>{item.job_type ? item.job_type + "/" : '' + item.job_name}</td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                                <div className="d-flex justify-content-center align-items-center col-md-2">
                                                    <div className="row">
                                                        <div className="text-center  col-md-12">
                                                            <a className="ant-dropdown-trigger ant-dropdown-link">
                                                                <i className="icofont-rounded-down" />
                                                            </a>
                                                            <br />
                                                            <br />
                                                        </div>
                                                        <div className="text-center col-md-12">
                                                            <a onClick={() => onViewClick(item)}>
                                                                <span className="pro_shortlist">
                                                                    <i className="icofont-eye" />
                                                                </span>
                                                                <br />
                                                                <span className="font-13 font-weight-400">
                                                                   View Profile
                                                                </span>
                                                            </a>
                                                        </div>
                                                        <div className="text-center mt-20 col-md-12">
                                                            <a onClick={()=>onSendInterestClick(item)}>
                                                                <span className="pro_interest">
                                                                    <i className="icofont-heart" />
                                                                </span>
                                                                <br />
                                                                <span className="font-13 font-weight-400">
                                                                    Send Interest
                                                                </span>
                                                            </a>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                </>
                            }}
                        />)
                    }
                                

                            </div>
                        </div>
                      
                    </div>
                </div>
            </div>


        </>
    );

}
export default SearchListComponent;