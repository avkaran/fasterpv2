import React, { useState, useEffect, useContext } from 'react';
import { Navigate, useParams, Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Row, Col, message } from 'antd';
import { FormViewItem, ImageUpload } from '../../../../comp'
import { Spin, Card } from 'antd';
import { Button, Checkbox, Space, DatePicker } from 'antd';
import { Form, Input, Select, InputNumber, Modal, Image, Avatar, Tag, Divider } from 'antd';
import PsContext from '../../../../context';
import dayjs from 'dayjs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBookOpen, faBookOpenReader, faClose, faDharmachakra, faEdit, faEnvelope, faEye, faHeart, faIndianRupeeSign, faLocationPin, faMessage, faMinusCircle, faMobile, faMobileAlt, faPeopleRoof, faPersonSnowboarding, faPersonWalking, faPhoneVolume, faPrint, faTrash, faUser } from '@fortawesome/free-solid-svg-icons';
import { MyButton, MyTable } from '../../../../comp'
import { green, yellow, grey, cyan, magenta } from '@ant-design/colors';
import SearchListComponent from './searchListComponent';
import ViewMemberBasic from '../../../admin/business/matrimony/members/viewInfo/viewMemberBasic';
import { heightList } from '../../../../models/core';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import ProfileContactInfo from './view-profile-info/contactInfo';
import ContactNotice from './view-profile-info/contactNotice';
import ContactBuyNotice from './view-profile-info/contactBuyNotice';
import { getUserAction, getPaymentInfo } from '../../../admin/business/matrimony/models/matrimonyCore';
import FormItem from 'antd/lib/form/FormItem';
const ViewMember = (props) => {
    const context = useContext(PsContext);
    const navigate = useNavigate();
    const { editIdOrObject, viewIdOrObject, onListClick, userId, ...other } = props;
    const [viewId, setViewId] = useState(null);
    const [viewData, setviewData] = useState(null);
    const [loader, setLoader] = useState(false);
    const [contactStatus, setContactStatus] = useState('buy');
    const [paymentInfo, setPaymentInfo] = useState(null)
    const [viewContactLoader, setViewContactLoader] = useState(false);
    const [visibleInterestModal,setVisibleInterestModal]=useState(false);
    const [expressInterestLoader,setExpressInterestLoader]=useState(false);
    useEffect(() => {
        if (typeof viewIdOrObject === 'object') {
            setViewId(viewIdOrObject.id);
            setviewData(viewIdOrObject);
        } else {
            setViewId(viewIdOrObject)
            loadViewData(viewIdOrObject);
        }
        ResetContactStatus();
    }, [viewIdOrObject]);
    const ResetContactStatus = () => {
        getPaymentInfo(context.customerUser.id).then(resPay => {
            setPaymentInfo(resPay);
            if (resPay.status === "Paid") {
                getUserAction(context.customerUser.id, viewIdOrObject.id, 'contact-view').then(resAction => {

                    if (resAction.isActionDone) {
                        setContactStatus('contact-viewed')
                        setViewContactLoader(false);
                    }
                    else {
                        if (resPay.availableCredits > 0)
                            setContactStatus('paid')
                        else
                            setContactStatus('buy')
                    }

                }).catch(err => {
                    setContactStatus("buy");
                })

            }
            else if (resPay.status === "Expired")
                setContactStatus("buy")

        }).catch(err => {
            setContactStatus("buy");
        })
    }
    const loadViewData = (id) => {
        setLoader(true);
        var reqData = {
            query_type: 'query',
            query: "select m.*,ROUND(DATE_FORMAT(FROM_DAYS(DATEDIFF(now(),dob)), '%Y')) AS age,COALESCE((SELECT package_price FROM orders where member_auto_id=m.id  and order_status='Paid' and is_current_plan=1 limit 1),0) as paid_amount,ec.course_name,cs.caste_name,f.father_status,f.father_occupation,f.mother_status,f.mother_occupation,f.brothers,f.brothers_married,f.sisters,f.sisters_married,f.family_type,f.dowry_jewels,f.dowry_property,f.dowry_cash,hb.eating_habits,hb.drinking_habits,hb.smoking_habits,hr.star,hr.patham,hr.raasi,hr.laknam,hr.birth_time,hr.birth_place,hr.dhosam_type,hr.jadhagam_type,hr.raasi_chart,hr.amsam_chart,p.height,p.weight,p.body_type,p.complexion,p.physical_status,p.physical_status_description,mp.prefered_eating_habits,mp.prefered_smoking_habits,mp.prefered_drinking_habits,mp.prefered_martial_status,CONCAT(mp.age_from,',',mp.age_to) as pref_age,CONCAT(mp.height_from,',',mp.height_to) as pref_height,CONCAT(mp.weight_from,',',mp.weight_to) as pref_weight,mp.prefered_physical_status,mp.prefered_mother_tongue,mp.prefered_religion,mp.prefered_caste,mp.prefered_education,mp.prefered_job_type,mp.prefered_job,mp.prefered_country,mp.prefered_state,mp.prefered_district,CONCAT(mp.income_from,',',mp.income_to) as pref_income,mp.expectation_notes from members m,member_family_details f,member_habits hb,member_horoscope hr,member_physical_attributes p,member_partner_preference mp,education_courses ec,castes cs  where m.status=1 and m.member_status='Active' and m.id=f.member_auto_id and m.id=hb.member_auto_id and m.id=hr.member_auto_id and m.id=p.member_auto_id and m.id=mp.member_auto_id and ec.id=m.educational_qualification and cs.id=m.caste and m.id=" + id,
            encrypt: ['mobile_no', 'mobile_alt_no_1', 'mobile_alt_no_2', 'whatsapp_no']
        };
        context.psGlobal.apiRequest(reqData, context.adminUser(userId).mode).then((res) => {
            setviewData(res[0]);
            setLoader(false);

        }).catch(err => {
            message.error(err);
            setLoader(false);

        })
    }
    const getHeight = (cm) => {
        let d = heightList.find((item) => item.cm == cm);
        return d && d.label;
    }
    const getRaasiChart = (item) => {
        var viewValuesRaasi = Array(12).fill('');
        if (item.raasi_chart)
            viewValuesRaasi = item.raasi_chart.replaceAll(",", ", ").split("##");
        viewValuesRaasi = viewValuesRaasi.map(obj => {
            if (obj) obj = obj.substring(0, 2);
            return obj;
        })
        return <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid' }}>
            <tr>
                <td style={{ width: '25%', height: '70px', border: '1px solid', textAlign: 'center' }}>{viewValuesRaasi[12 - 1]}</td>
                <td style={{ width: '25%', border: '1px solid', textAlign: 'center' }}>{viewValuesRaasi[1 - 1]}</td>
                <td style={{ width: '25%', border: '1px solid', textAlign: 'center' }}>{viewValuesRaasi[2 - 1]}</td>
                <td style={{ width: '25%', border: '1px solid', textAlign: 'center' }}>{viewValuesRaasi[3 - 1]}</td>
            </tr>
            <tr>
                <td style={{ height: '70px', border: '1px solid', textAlign: 'center' }}>{viewValuesRaasi[11 - 1]}</td>
                <td colspan="2" rowspan="2" style={{ textAlign: 'center', border: '1px solid' }}><h2>ராசி</h2></td>
                <td style={{ border: '1px solid', textAlign: 'center' }}>{viewValuesRaasi[4 - 1]}</td>
            </tr>
            <tr>
                <td style={{ height: '70px', border: '1px solid', textAlign: 'center' }}>{viewValuesRaasi[10 - 1]}</td>

                <td style={{ border: '1px solid', textAlign: 'center' }}>{viewValuesRaasi[5 - 1]}</td>
            </tr>
            <tr>
                <td style={{ height: '70px', border: '1px solid', textAlign: 'center' }}>{viewValuesRaasi[9 - 1]}</td>
                <td style={{ border: '1px solid', textAlign: 'center' }}>{viewValuesRaasi[8 - 1]}</td>
                <td style={{ border: '1px solid', textAlign: 'center' }}>{viewValuesRaasi[7 - 1]}</td>
                <td style={{ border: '1px solid', textAlign: 'center' }}>{viewValuesRaasi[6 - 1]}</td>
            </tr>
        </table>

    }
    const onContactViewClick = (memberData) => {
        setViewContactLoader(true);
        var reqData = [{
            query_type: 'insert',
            table: 'member_actions',
            values: { action: 'contact-view', member_auto_id: context.customerUser.id, to_member_auto_id: viewData.id, action_info: 'Viewed ' + viewData.name }
        },
        {
            query_type: 'update',
            table: 'orders',
            where: { id: paymentInfo.id },
            values: { used_credits: parseInt(paymentInfo.totalCredits) - parseInt(paymentInfo.availableCredits) + 1 }

        }];

        context.psGlobal.apiRequest(reqData, context.adminUser(userId).mode).then((res) => {
            ResetContactStatus();
        }).catch(err => {
            message.error(err);
            setLoader(false);
        })
    }
    const onExpressInterestClick = () => {
        if (contactStatus === "paid" || contactStatus==='contact-viewed') {
            setVisibleInterestModal(true)
        } else
        navigate("/0/customer/membership")
    }
    const expressInterestOnFinish=(values)=>{
        setExpressInterestLoader(true);
        var reqData = [{
            query_type: 'insert',
            table: 'member_actions',
            values: { action: 'express-interest', member_auto_id: context.customerUser.id, to_member_auto_id: viewData.id, action_info:context.customerUser.name + 'Interested with ' + viewData.name }
        }];

        context.psGlobal.apiRequest(reqData, context.adminUser(userId).mode).then((res) => {
            setExpressInterestLoader(false);
            setVisibleInterestModal(false);
            message.success("Interest Sent to "+ viewData.name )
        }).catch(err => {
            message.error(err);
            setLoader(false);
        })

    }
    const getAmsamChart = (item) => {
        var viewValuesAmsam = Array(12).fill('');
        if (item.amsam_chart)
            viewValuesAmsam = item.amsam_chart.replaceAll(",", ", ").split("##");
        viewValuesAmsam = viewValuesAmsam.map(obj => {
            if (obj) obj = obj.substring(0, 2);
            return obj;
        })
        return <table border="1" style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid' }}>
            <tr>
                <td style={{ width: '25%', height: '70px', border: '1px solid', textAlign: 'center' }}>{viewValuesAmsam[12 - 1]}</td>
                <td style={{ width: '25%', border: '1px solid', textAlign: 'center' }}>{viewValuesAmsam[1 - 1]}</td>
                <td style={{ width: '25%', border: '1px solid', textAlign: 'center' }}>{viewValuesAmsam[2 - 1]}</td>
                <td style={{ width: '25%', border: '1px solid', textAlign: 'center' }}>{viewValuesAmsam[3 - 1]}</td>
            </tr>
            <tr>
                <td style={{ height: '70px', border: '1px solid', textAlign: 'center' }}>{viewValuesAmsam[11 - 1]}</td>
                <td colspan="2" rowspan="2" style={{ textAlign: 'center', border: '1px solid' }}><h2>அம்சம்</h2></td>
                <td style={{ border: '1px solid', textAlign: 'center' }}>{viewValuesAmsam[4 - 1]}</td>
            </tr>
            <tr>
                <td style={{ height: '70px', border: '1px solid', textAlign: 'center' }}>{viewValuesAmsam[10 - 1]}</td>

                <td style={{ border: '1px solid', textAlign: 'center' }}>{viewValuesAmsam[5 - 1]}</td>
            </tr>
            <tr>
                <td style={{ height: '70px', border: '1px solid', textAlign: 'center' }}>{viewValuesAmsam[9 - 1]}</td>
                <td style={{ border: '1px solid', textAlign: 'center' }}>{viewValuesAmsam[8 - 1]}</td>
                <td style={{ border: '1px solid', textAlign: 'center' }}>{viewValuesAmsam[7 - 1]}</td>
                <td style={{ border: '1px solid', textAlign: 'center' }}>{viewValuesAmsam[6 - 1]}</td>
            </tr>
        </table>
    }
    return (
        <>
            {viewData && (<>
                <Row gutter={16}>
                    <Col className='gutter-row' xs={24} xl={4}>
                        <Avatar size={120} shape="circle" src={<Image
                            width={100}
                            src={viewData.photo ? context.baseUrl + viewData.photo : viewData.gender === 'Male' ? context.noMale : context.noFemale}
                            fallback={context.noImg}
                        />} />
                    </Col>
                    <Col className='gutter-row' xs={24} xl={7}>
                        <span style={{ color: cyan[6], fontWeight: 'bold', fontSize: '20px' }}> {viewData.name}</span><br />
                        <Tag color="cyan" style={{ fontWeight: 'bold' }}>{viewData.member_id}</Tag><br />
                        <span style={{ color: cyan[6], fontWeight: 'bold', margin: '10px 0px 10px 0px' }}> {viewData.age} Yrs, {viewData.marital_status}</span><br />
                        <span style={{ color: cyan[6], fontWeight: 'bold' }}><i class="fa-solid fa-location-dot"></i> {viewData.district}, {viewData.state}, {viewData.country}</span>
                    </Col>
                    <Col className='gutter-row' xs={24} xl={3}>

                    </Col>
                    <Col className='gutter-row' xs={24} xl={10}>
                        <MyButton type="outlined" shape="round" style={{ width: '150px' }}  onClick={onExpressInterestClick} ><FontAwesomeIcon icon={faHeart}/> Express Interest</MyButton>


                    </Col>
                </Row>
                <Divider orientation="left" style={{ borderWidth: '3px', borderColor: cyan[7] }}><FontAwesomeIcon icon={faUser} /> Basic Details</Divider>
                <Row gutter={24}>
                    <Col className='gutter-row' span={16}>
                        <Form
                            colon={false}
                            labelAlign="left"
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 20 }}
                            initialValues={{ remember: true }}
                            autoComplete="off"

                        >
                            <Row gutter={16}>
                                <Col className='gutter-row' xs={24} xl={12}>
                                    <FormViewItem label="Member Id">{viewData.member_id}</FormViewItem>
                                </Col>
                                <Col className='gutter-row' xs={24} xl={12}>
                                    <FormViewItem label="Created For">{viewData.member_created_for}</FormViewItem>
                                </Col>
                                <Col className='gutter-row' xs={24} xl={12}>
                                    <FormViewItem label="Created By">{viewData.member_created_by}</FormViewItem>
                                </Col>
                                <Col className='gutter-row' xs={24} xl={12}>
                                    <FormViewItem label="Created User">{viewData.member_created_ref_id}</FormViewItem>
                                </Col>
                                <Col className='gutter-row' xs={24} xl={12}>
                                    <FormViewItem label="Name">{viewData.name}</FormViewItem>
                                </Col>
                                <Col className='gutter-row' xs={24} xl={12}>
                                    <FormViewItem label="Father Name">{viewData.father_name}</FormViewItem>
                                </Col>
                                <Col className='gutter-row' xs={24} xl={12}>
                                    <FormViewItem label="Mother Name">{viewData.mother_name}</FormViewItem>
                                </Col>
                                <Col className='gutter-row' xs={24} xl={12}>
                                    <FormViewItem label="Gender">{viewData.gender}</FormViewItem>
                                </Col>
                                <Col className='gutter-row' xs={24} xl={12}>
                                    <FormViewItem label="Dob">{dayjs(viewData.dob).format("DD/MM/YYYY")}</FormViewItem>
                                </Col>
                                <Col className='gutter-row' xs={24} xl={12}>
                                    <FormViewItem label="Marital Status">{viewData.marital_status}</FormViewItem>
                                </Col>
                                {
                                    viewData.marital_status !== "Never Married" && (<><Col className='gutter-row' xs={24} xl={12}>
                                        <FormViewItem label="No Of Children">{viewData.no_of_children}</FormViewItem>
                                    </Col>
                                        <Col className='gutter-row' xs={24} xl={12}>
                                            <FormViewItem label="Children Status">{viewData.children_living_status}</FormViewItem>
                                        </Col></>)
                                }
                                <Col className='gutter-row' xs={24} xl={12}>
                                    <FormViewItem label="Aadhaar No">{viewData.aadhaar_no}</FormViewItem>
                                </Col>
                                <Col className='gutter-row' xs={24} xl={12}>
                                    <FormViewItem label="Caste">{viewData.caste_name}</FormViewItem>
                                </Col>
                                <Col className='gutter-row' xs={24} xl={12}>
                                    <FormViewItem label="Sub Caste">{viewData.sub_caste}</FormViewItem>
                                </Col>
                                <Col className='gutter-row' xs={24} xl={12}>
                                    <FormViewItem label="Caste Detail">{viewData.caste_detail}</FormViewItem>
                                </Col>
                                <Col className='gutter-row' xs={24} xl={12}>
                                    <FormViewItem label="Religion">{viewData.religion}</FormViewItem>
                                </Col>
                                <Col className='gutter-row' xs={24} xl={12}>
                                    <FormViewItem label="Mother Tongue">{viewData.mother_tongue}</FormViewItem>
                                </Col>
                                <Col className='gutter-row' xs={24} xl={12}>
                                    <FormViewItem label="Languages Known">{viewData.languages_known}</FormViewItem>
                                </Col>
                                <Col className='gutter-row' xs={24} xl={12}>
                                    <FormViewItem label="Gothra">{viewData.gothra}</FormViewItem>
                                </Col>
                                <Col className='gutter-row' xs={24} xl={12}>
                                    <FormViewItem label="Kuladeivam">{viewData.kuladeivam}</FormViewItem>
                                </Col>
                                <Col className='gutter-row' xs={24} xl={12}>
                                    <FormViewItem label="Poorveegam">{viewData.poorveegam}</FormViewItem>
                                </Col>
                                <Col className='gutter-row' xs={24} xl={12}>
                                    <FormViewItem label="Residence Type">{viewData.residence_type}</FormViewItem>
                                </Col>
                                {
                                    viewData.gender === "Male" && (<Col className='gutter-row' xs={24} xl={12}>
                                        <FormViewItem label="Home Mappilai?">{parseInt(viewData.willing_to_home_mappilai) === 1 ? 'Yes' : 'No'}</FormViewItem>
                                    </Col>)
                                }
                                <Col className='gutter-row' xs={24} xl={12}>
                                    <FormViewItem label="Created Date">{dayjs(viewData.created_date).format("DD/MM/YYYY h:m a")}</FormViewItem>
                                </Col>
                                <Col className='gutter-row' xs={24} xl={12}>
                                    <FormViewItem label="About Profile">{viewData.about_profile}</FormViewItem>
                                </Col>
                            </Row>
                        </Form>
                    </Col>
                    <Col className='gutter-row' span={8}>
                        <Card title={<span style={{ color: magenta[6], fontWeight: 'bold' }}>Contact info</span>}

                            style={{ borderColor: magenta[6] }}>
                            {contactStatus === "buy" && (<ContactBuyNotice />)}
                            {contactStatus === "contact-viewed" && (<ProfileContactInfo viewData={viewData} />)}
                            {contactStatus === "paid" && (<ContactNotice loading={viewContactLoader} onContactViewClick={onContactViewClick} viewData={viewData} />)}



                        </Card>
                    </Col>
                </Row>

                <Divider orientation="left" style={{ borderWidth: '3px', borderColor: cyan[7] }}><FontAwesomeIcon icon={faBookOpenReader} /> Education & Occupation</Divider>

                <Form
                    colon={false}
                    name="basic"
                    labelAlign="left"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 20 }}
                    initialValues={{ remember: true }}
                    autoComplete="off"
                >
                    <Row gutter={16}>
                        <Col className='gutter-row' xs={24} xl={12}>
                            <FormViewItem label="Education">{viewData.course_name}</FormViewItem>
                        </Col>
                        <Col className='gutter-row' xs={24} xl={12}>
                            <FormViewItem label="Education Detail">{viewData.education_detail}</FormViewItem>
                        </Col>
                        <Col className='gutter-row' xs={24} xl={12}>
                            <FormViewItem label="Job Type">{viewData.job_type}</FormViewItem>
                        </Col>
                        <Col className='gutter-row' xs={24} xl={12}>
                            <FormViewItem label="Job Name">{viewData.job_name}</FormViewItem>
                        </Col>
                        <Col className='gutter-row' xs={24} xl={12}>
                            <FormViewItem label="Job Detail">{viewData.job_detail}</FormViewItem>
                        </Col>
                        <Col className='gutter-row' xs={24} xl={12}>
                            <FormViewItem label="Job Country">{viewData.job_country}</FormViewItem>
                        </Col>
                        <Col className='gutter-row' xs={24} xl={12}>
                            <FormViewItem label="Job State">{viewData.job_state}</FormViewItem>
                        </Col>
                        <Col className='gutter-row' xs={24} xl={12}>
                            <FormViewItem label="Job District">{viewData.job_district}</FormViewItem>
                        </Col>
                        <Col className='gutter-row' xs={24} xl={12}>
                            <FormViewItem label="Job Area">{viewData.job_area}</FormViewItem>
                        </Col>
                        <Col className='gutter-row' xs={24} xl={12}>
                            <FormViewItem label="Annual Income">{viewData.job_annual_income}</FormViewItem>
                        </Col>
                    </Row>

                </Form>
                <Divider orientation="left" style={{ borderWidth: '3px', borderColor: cyan[7] }}><FontAwesomeIcon icon={faPeopleRoof} /> Family Details</Divider>


                <Form
                    name="basic"
                    labelAlign="left"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 20 }}
                    initialValues={{ remember: true }}
                    autoComplete="off"
                >
                    <Row gutter={16}>
                        <Col className='gutter-row' xs={24} xl={12}>
                            <FormViewItem label="Father Status">{viewData.father_status}</FormViewItem>
                        </Col>
                        <Col className='gutter-row' xs={24} xl={12}>
                            <FormViewItem label="Father Occupation">{viewData.father_occupation}</FormViewItem>
                        </Col>
                        <Col className='gutter-row' xs={24} xl={12}>
                            <FormViewItem label="Mother Status">{viewData.mother_status}</FormViewItem>
                        </Col>
                        <Col className='gutter-row' xs={24} xl={12}>
                            <FormViewItem label="Mother Occupation">{viewData.mother_occupation}</FormViewItem>
                        </Col>
                        <Col className='gutter-row' xs={24} xl={12}>
                            <FormViewItem label="Brothers">{viewData.brothers}</FormViewItem>
                        </Col>
                        <Col className='gutter-row' xs={24} xl={12}>
                            <FormViewItem label="Brothers Married">{viewData.brothers_married}</FormViewItem>
                        </Col>
                        <Col className='gutter-row' xs={24} xl={12}>
                            <FormViewItem label="Sisters">{viewData.sisters}</FormViewItem>
                        </Col>
                        <Col className='gutter-row' xs={24} xl={12}>
                            <FormViewItem label="Sisters Married">{viewData.sisters_married}</FormViewItem>
                        </Col>
                        <Col className='gutter-row' xs={24} xl={12}>
                            <FormViewItem label="Family Type">{viewData.family_type}</FormViewItem>
                        </Col>
                        <Col className='gutter-row' xs={24} xl={12}>
                            <FormViewItem label="Dowry Jewels">{viewData.dowry_jewels}</FormViewItem>
                        </Col>
                        <Col className='gutter-row' xs={24} xl={12}>
                            <FormViewItem label="Dowry Property">{viewData.dowry_property}</FormViewItem>
                        </Col>
                        <Col className='gutter-row' xs={24} xl={12}>
                            <FormViewItem label="Dowry Cash">{viewData.dowry_cash}</FormViewItem>
                        </Col>
                        <Col className='gutter-row' xs={24} xl={12}>
                            <FormViewItem label="About Family">{viewData.about_family}</FormViewItem>
                        </Col>
                    </Row>

                </Form>
                <Divider orientation="left" style={{ borderWidth: '3px', borderColor: cyan[7] }}><FontAwesomeIcon icon={faPersonSnowboarding} /> Habits & Hobbies</Divider>

                <Form
                    name="basic"
                    labelAlign="left"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 20 }}
                    initialValues={{ remember: true }}
                    autoComplete="off"
                >
                    <Row gutter={16}>
                        <Col className='gutter-row' xs={24} xl={12}>
                            <FormViewItem label="Eating Habits">{viewData.eating_habits}</FormViewItem>
                        </Col>
                        <Col className='gutter-row' xs={24} xl={12}>
                            <FormViewItem label="Drinking Habits">{viewData.drinking_habits}</FormViewItem>
                        </Col>
                        <Col className='gutter-row' xs={24} xl={12}>
                            <FormViewItem label="Smoking Habits">{viewData.smoking_habits}</FormViewItem>
                        </Col>
                        <Col className='gutter-row' xs={24} xl={12}>
                            <FormViewItem label="Hobbies">{viewData.hobbies}</FormViewItem>
                        </Col>
                    </Row>

                </Form>
                <Divider orientation="left" style={{ borderWidth: '3px', borderColor: cyan[7] }}><FontAwesomeIcon icon={faPersonWalking} /> Physical Attributes</Divider>

                <Form
                    name="basic"
                    labelAlign="left"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 20 }}
                    initialValues={{ remember: true }}
                    autoComplete="off"
                >
                    <Row gutter={16}>
                        <Col className='gutter-row' xs={24} xl={12}>
                            <FormViewItem label="Height">{getHeight(viewData.height)}</FormViewItem>
                        </Col>
                        <Col className='gutter-row' xs={24} xl={12}>
                            <FormViewItem label="Weight">{viewData.weight + " Kg"}</FormViewItem>
                        </Col>
                        <Col className='gutter-row' xs={24} xl={12}>
                            <FormViewItem label="Body Type">{viewData.body_type}</FormViewItem>
                        </Col>
                        <Col className='gutter-row' xs={24} xl={12}>
                            <FormViewItem label="Complexion">{viewData.complexion}</FormViewItem>
                        </Col>
                        <Col className='gutter-row' xs={24} xl={12}>
                            <FormViewItem label="Physical Status">{viewData.physical_status}</FormViewItem>
                        </Col>
                        <Col className='gutter-row' xs={24} xl={12}>
                            <FormViewItem label="Physical Status Description">{viewData.physical_status_description}</FormViewItem>
                        </Col>
                    </Row>

                </Form>
                <Divider orientation="left" style={{ borderWidth: '3px', borderColor: cyan[7] }}><FontAwesomeIcon icon={faDharmachakra} /> Horoscope Information</Divider>

                <Form
                    name="basic"
                    labelAlign="left"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 20 }}
                    initialValues={{ remember: true }}
                    autoComplete="off"
                >
                    <Row gutter={16}>
                        <Col className='gutter-row' xs={24} xl={12}>
                            <FormViewItem label="Star">{viewData.star}</FormViewItem>
                        </Col>
                        <Col className='gutter-row' xs={24} xl={12}>
                            <FormViewItem label="Patham">{viewData.patham}</FormViewItem>
                        </Col>
                        <Col className='gutter-row' xs={24} xl={12}>
                            <FormViewItem label="Raasi">{viewData.raasi}</FormViewItem>
                        </Col>
                        <Col className='gutter-row' xs={24} xl={12}>
                            <FormViewItem label="Laknam">{viewData.laknam}</FormViewItem>
                        </Col>
                        <Col className='gutter-row' xs={24} xl={12}>
                            <FormViewItem label="Birth Time">{viewData.birth_time}</FormViewItem>
                        </Col>
                        <Col className='gutter-row' xs={24} xl={12}>
                            <FormViewItem label="Birth Place">{viewData.birth_place}</FormViewItem>
                        </Col>
                        <Col className='gutter-row' xs={24} xl={12}>
                            <FormViewItem label="Dhosam Type">{viewData.dhosam_type}</FormViewItem>
                        </Col>
                        <Col className='gutter-row' xs={24} xl={12}>
                            <FormViewItem label="Jadhagam Type">{viewData.jadhagam_type}</FormViewItem>
                        </Col>
                        <Col className='gutter-row' xs={24} xl={12}>
                            <FormViewItem label="Dasa">{viewData.dasa}</FormViewItem>
                        </Col>
                        <Col className='gutter-row' xs={24} xl={12}>
                            <FormViewItem label="Dasa Year">{viewData.dasa_year}</FormViewItem>
                        </Col>
                        <Col className='gutter-row' xs={24} xl={12}>
                            <FormViewItem label="Dasa Month">{viewData.dasa_month}</FormViewItem>
                        </Col>
                        <Col className='gutter-row' xs={24} xl={12}>
                            <FormViewItem label="Dasa Days">{viewData.dasa_days}</FormViewItem>
                        </Col>
                    </Row>

                </Form>
                <Row>
                    <table width="100%" border="0" >
                        <tr>
                            <td style={{ width: '50%', padding: '10px' }}>

                                {getRaasiChart(viewData)}

                            </td>
                            <td style={{ width: '50%', padding: '10px' }}>
                                {getAmsamChart(viewData)}
                            </td>
                        </tr>

                    </table>

                </Row>
                <Modal
                            visible={visibleInterestModal}
                            zIndex={999}
                            footer={null}
                            centered={false}
                            closable={true}
                            style={{ marginTop: '20px' }}
                            width={400}
                            // footer={null}
                            onCancel={() => { setVisibleInterestModal(false) }}
                            title={<span style={{ color: green[4] }} ><FontAwesomeIcon icon={faHeart} /> Send Interest</span>}
                        >
                            <Spin spinning={expressInterestLoader}>
                                <Form
                                    name="basic"
                                    colon={false}
                                    //form={addeditFormPrint}
                                    labelAlign="left"
                                    //form={expressInterestForm}
                                    labelCol={{ span: 8 }}
                                    wrapperCol={{ span: 24 }}
                                    initialValues={{ remember: true }}
                                    onFinish={expressInterestOnFinish}
                                    autoComplete="off"
                                >
                                   
                                    <Row gutter={16} style={{fontSize:'20px',color:green[7]}}>
                                        <Col className='gutter-row' xs={24} xl={8} style={{fontSize:'30px'}}>
                                        <FontAwesomeIcon icon={faHeart}/>
                                        </Col>
                                        <Col className='gutter-row' xs={24} xl={16}>
                                            Sent Interest
                                        </Col>
                                    </Row>
                                    <FormItem wrapperCol={{ offset: 10, span: 24 }}>
                                        <Space>
                                            <Button size="large" type="outlined" onClick={() => setVisibleInterestModal(false)}>
                                                Cancel
                                            </Button>
                                            <MyButton size="large" type="primary" htmlType="submit">
                                               Send Interest
                                            </MyButton>
                                        </Space>

                                    </FormItem>

                                </Form>
                            </Spin>

                        </Modal>
            </>)}
        </>
    );

}
export default ViewMember;