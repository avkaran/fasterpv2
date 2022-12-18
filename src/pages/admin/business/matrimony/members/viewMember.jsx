import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Col, message, Space } from 'antd';
import { Button, Card } from 'antd';
import { Form, Input, Select, InputNumber, Radio, Checkbox, Avatar, Image, Tag, Tabs, Divider, Modal, DatePicker } from 'antd';
import { Breadcrumb, Layout, Spin } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import { green, red, cyan, blue, magenta } from '@ant-design/colors';
import PsContext from '../../../../../context';
import { Editor } from '@tinymce/tinymce-react';
import { ImageUpload, FormItem, MyButton, FormViewItem, DeleteButton, PaginatedTable } from '../../../../../comp';
import { capitalizeFirst } from '../../../../../utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookOpen, faBookOpenReader, faClose, faDharmachakra, faEdit, faEnvelope, faEye, faIndianRupeeSign, faLocationPin, faMessage, faMinusCircle, faMobile, faMobileAlt, faPeopleRoof, faPersonSnowboarding, faPersonWalking, faPhoneVolume, faPrint, faTrash, faUser } from '@fortawesome/free-solid-svg-icons';
import dayjs from 'dayjs'
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { heightList } from '../../../../../models/core';
import AddEditMember from './AddEditMember';
import 'react-image-gallery/styles/css/image-gallery.css';
import ImageGallery from 'react-image-gallery';
import './galleryStyle.css'
import ViewMemberBasic from './viewInfo/viewMemberBasic';
import OrderViewPrint from './printMembers/orderViewprint';
import { baseUrl, printDocument } from '../../../../../utils';
import { getPaymentInfo } from '../models/matrimonyCore';
const ViewMember = (props) => {
    const context = useContext(PsContext);
    const { Content } = Layout;
    const navigate = useNavigate();
    const [addForm] = Form.useForm();
    const [loader, setLoader] = useState(false);
    const [curAction, setCurAction] = useState('add');
    const [viewData, setviewData] = useState(null);
    const [heading] = useState('Member');
    const { editIdOrObject, viewIdOrObject, onListClick, userId, isForCustomer, ...other } = props;
    const [viewId, setViewId] = useState(null);
    const [visibleEditBasicModal, setVisibleEditBasicModal] = useState(false);
    const [curEditForm, setCurEditForm] = useState('');
    const [photosData, setPhotosData] = useState(null);
    const [galleryImages, setGalleryImages] = useState([])
    const [visiblePhotosPreview, setVisiblePhotosPreview] = useState(false);
    const [casteList, setCasteList] = useState([]);
    const [educationList, setEducationList] = useState([]);
    const [printReceiptData, setPrintReceiptData] = useState([]);
    const [allData, setAllData] = useState(null);
    const [selMembers, setSelMembers] = useState([]);
    const [visiblePrintModal, setVisiblePrintModal] = useState(false);
    const [businessNames, setBusinessNames] = useState(null);
    const [selBusiness, setSelBusiness] = useState(null);
    const [selPlanData, setSelPlanData] = useState({})
    const [selPayamentData, setSelPaymentData] = useState({});
    const [discountData, setDiscountData] = useState(null)
    const [visiblePaymentModal, setVisiblePaymentModal] = useState(false);
    const [paymentLoader, setPaymentLoader] = useState(false);
    const [paymentForm] = Form.useForm();
    const [editId, setEditId] = useState(null);
    const [planNames, setPlanNames] = useState(null);
    const [paymentMode, setPaymentMode] = useState(null);
    const [refreshPaymentHistory, setRefreshPaymentHistory] = useState(false);
    const [paymentInfo, setPaymentInfo] = useState(null);
    useEffect(() => {
        loadBusinessNames();
        loadPlanNames();
        loadCastes()
        loadEducation()
        if (typeof viewIdOrObject === 'object') {
            setViewId(viewIdOrObject.id);
            setviewData(viewIdOrObject);
            loadPhotos(viewIdOrObject.id);
            resetPaymentButton(viewIdOrObject.id)

        } else {
            setViewId(viewIdOrObject)
            resetPaymentButton(viewIdOrObject)
            loadViewData(viewIdOrObject);
        }

    }, []);

    const resetPaymentButton = (id) => {
        getPaymentInfo(id).then(res => {
            setPaymentInfo(res);
        })
    }
    const loadBusinessNames = () => {
        var reqData = {
            query_type: 'query', //query_type=insert | update | delete | query
            query: "select * from business_names where status=1 and business_status='Active'"
        };
        context.psGlobal.apiRequest(reqData, context.adminUser(userId).mode).then((res) => {
            setBusinessNames(res);
        }).catch(err => {
            message.error(err);
        })
    }
    const loadPlanNames = () => {
        var reqData = {
            query_type: 'query', //query_type=insert | update | delete | query
            query: "select * from packages where status=1 and package_status='Active'"
        };
        context.psGlobal.apiRequest(reqData, context.adminUser(userId).mode).then((res) => {
            setPlanNames(res);
        }).catch(err => {
            message.error(err);
        })
    }
    const formPrintOnFinish = (values) => {
        var business = businessNames.find(item => item.id === values.business_name)
        setSelBusiness(business);
        printDocument('receipt-print');
    }

    const loadCastes = () => {
        //setCasteLoader(true);
        var reqData =
        {
            query_type: 'query',
            query: "select id,caste_name from castes where status=1 and master_caste_id is null"
        }

        context.psGlobal.apiRequest(reqData, context.adminUser(userId).mode).then((res) => {

            setCasteList(res);
            // setCasteLoader(false);
        }).catch(err => {
            message.error(err);
            //  setCasteLoader(false);
        })
    }

    const loadEducation = () => {
        var reqData =
        {
            query_type: 'query',
            query: "select * from education_courses where status=1"
        }

        context.psGlobal.apiRequest(reqData, context.adminUser(userId).mode).then((res) => {

            setEducationList(res);
            // setCasteLoader(false);
        }).catch(err => {
            message.error(err);
            //  setCasteLoader(false);
        })
    }
    const onPlanChange = (value) => {
        var reqData = [{
            query_type: 'query',
            query: "select * from packages where status=1 and package_status='Active' and id=" + value.toString(),
        },
        {
            query_type: 'query',
            query: "select * from package_discounts where status=1 and active_status='Active' and discount_for=" + value.toString() + " and valid_from<=curdate() and valid_to>=curdate()",
        }
        ];
        context.psGlobal.apiRequest(reqData, context.adminUser(userId).mode).then((res) => {
            setSelPlanData(res[0][0]);
            setDiscountData(res[1][0])
        }).catch(err => {

            setLoader(false);
        })
    }
    const getDiscountInfo = (type) => {

        var percentage = 0;
        var discountAmount = 0;

        var finalAmount = selPlanData && selPlanData.package_price ? parseFloat(selPlanData.package_price) : 0;

        if (discountData) {
            percentage = parseInt(discountData.percentage);
            discountAmount = (parseFloat(selPlanData.package_price) * percentage) / 100;
            finalAmount = parseFloat(selPlanData.package_price) - discountAmount;

        }

        if (type === 'discount-amount')
            return discountAmount;
        else if (type === 'final-amount')
            return finalAmount;


    }
    const getViewCastes = (caste_ids) => {
        var caste_names = [];
        if (caste_ids) {
            caste_ids.split(",").forEach(item => {
                var cFind = casteList.find(obj => parseInt(obj.id) === parseInt(item));
                if (cFind)
                    caste_names.push(cFind.caste_name)
            })
        }
        return caste_names.join(", ");
    }
    const getViewEducation = (course_ids) => {
        var course_names = [];
        if (course_ids) {
            course_ids.split(",").forEach(item => {
                var cFind = educationList.find(obj => parseInt(obj.id) === parseInt(item));

                if (cFind)
                    course_names.push(cFind.course_name)
            })
        }

        return course_names.join(", ");
    }
    const loadViewData = (id) => {
        setLoader(true);
        var reqData = {
            query_type: 'query',
            query: "select m.*,ROUND(DATE_FORMAT(FROM_DAYS(DATEDIFF(now(),dob)), '%Y')) AS age,COALESCE((SELECT package_price FROM orders where member_auto_id=m.id  and order_status='Paid' and is_current_plan=1 limit 1),0) as paid_amount,ec.course_name,cs.caste_name,f.father_status,f.father_occupation,f.mother_status,f.mother_occupation,f.brothers,f.brothers_married,f.sisters,f.sisters_married,f.family_type,f.dowry_jewels,f.dowry_property,f.dowry_cash,hb.eating_habits,hb.drinking_habits,hb.smoking_habits,hr.star,hr.patham,hr.raasi,hr.laknam,hr.birth_time,hr.birth_place,hr.dhosam_type,hr.jadhagam_type,hr.raasi_chart,hr.amsam_chart,hr.dasa,hr.dasa_year,hr.dasa_month,hr.dasa_days,p.height,p.weight,p.body_type,p.complexion,p.physical_status,p.physical_status_description,mp.prefered_eating_habits,mp.prefered_smoking_habits,mp.prefered_drinking_habits,mp.prefered_martial_status,CONCAT(mp.age_from,',',mp.age_to) as pref_age,CONCAT(mp.height_from,',',mp.height_to) as pref_height,CONCAT(mp.weight_from,',',mp.weight_to) as pref_weight,mp.prefered_physical_status,mp.prefered_mother_tongue,mp.prefered_religion,mp.prefered_caste,mp.prefered_education,mp.prefered_job_type,mp.prefered_job,mp.prefered_country,mp.prefered_state,mp.prefered_district,CONCAT(mp.income_from,',',mp.income_to) as pref_income,mp.expectation_notes from members m,member_family_details f,member_habits hb,member_horoscope hr,member_physical_attributes p,member_partner_preference mp,education_courses ec,castes cs  where m.status=1 and m.member_status='Active' and m.id=f.member_auto_id and m.id=hb.member_auto_id and m.id=hr.member_auto_id and m.id=p.member_auto_id and m.id=mp.member_auto_id and ec.id=m.educational_qualification and cs.id=m.caste and m.id=" + id,
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
    const loadPhotos = (member_auto_id) => {
        var reqData = {
            query_type: 'query',
            query: "select * from member_photos where status=1 and member_auto_id=" + member_auto_id
        };
        context.psGlobal.apiRequest(reqData, context.adminUser(userId).mode).then((res) => {
            setPhotosData(res);
            var gImages = [];
            res.forEach(item => {
                gImages.push({
                    original: context.baseUrl + item.photo,
                    thumbnail: context.baseUrl + item.photo,
                })
            })
            setGalleryImages(gImages);
        }).catch(err => {
            message.error(err);

        })
    }
    const tableColumns = [
        {
            title: 'S.No',
            dataIndex: 'row_num',
            key: 'row_num',
            //render: (item) => <strong>{item}</strong>,
        },
        {
            title: 'Order Date',
            dataIndex: 'order_date',
            //  key: 'order_data',
            render: (text, record) => <strong>{dayjs(record.order_date).format("DD/MM/YYYY h:m a")}</strong>,
        },
        {
            title: 'Order Id',
            dataIndex: 'order_id',
            key: 'order_id',
            //render: (item) => <strong>{item}</strong>,
        },
        {
            title: 'Plan Name',
            dataIndex: 'plan_name',
            key: 'plan_name',
            //render: (item) => <strong>{item}</strong>,
        },
        {
            title: 'Amount',
            dataIndex: 'package_price',
            key: 'package_price',
            //render: (item) => <strong>{item}</strong>,
        },
        {
            title: 'Order Status',
            dataIndex: 'order_status',
            key: 'order_status',
            //render: (item) => <strong>{item}</strong>,
        },
        {
            title: 'Plan Status',
            // dataIndex: 'order_status',
            key: 'is_current_plan',
            render: (item) => <strong>{parseInt(item.is_current_plan) === 2 ? 'Waiting' : parseInt(item.is_current_plan) === 1 ? 'Active' : '-'
            }</strong>,
        },
        {
            title: 'Actions',
            // dataIndex: 'actions',
            key: 'actions',
            render: (item) => <Space>
                <MyButton type="outlined" shape="round" onClick={() => { onPrintClick(item) }} ><FontAwesomeIcon icon={faPrint} /> Print</MyButton>
            </Space>,
        },


    ]
    const onPrintClick = (item) => {

        var receiptData = item;
        receiptData['member_id'] = viewData.member_id;
        receiptData['name'] = viewData.name;
        receiptData['gender'] = viewData.gender;
        receiptData['photo'] = viewData.photo;
        receiptData['caste_name'] = viewData.caste_name;
        receiptData['sub_caste'] = viewData.sub_caste;
        receiptData['mobile_no'] = viewData.mobile_no;
        receiptData['door_no'] = viewData.door_no;
        receiptData['street'] = viewData.street;
        receiptData['area'] = viewData.area;
        receiptData['distric'] = viewData.distric;
        receiptData['state'] = viewData.state;
        receiptData['pincode'] = viewData.pincode;



        setPrintReceiptData(receiptData);
        setVisiblePrintModal(true);

    }
    const onPaymentClick = (item) => {

        setVisiblePaymentModal(true);

    }
    const paymentFormOnFinish = (values) => {
        setPaymentLoader(true);
        var processedValues = {};
        Object.entries(values.orders).forEach(([key, value]) => {
            if (value) {
                processedValues[key] = value;
            }
        });
        processedValues['member_auto_id'] = viewData.id;
        processedValues['member_id'] = viewData.member_id;
        processedValues['plan_name'] = selPlanData.plan_name;
        processedValues['daily_limit'] = selPlanData.daily_limit;
        processedValues['monthly_limit'] = selPlanData.monthly_limit;
        processedValues['validity_months'] = selPlanData.validity_months;
        processedValues['consume_credits'] = selPlanData.consume_credits;
        processedValues['is_send_sms'] = selPlanData.is_send_sms;
        processedValues['is_send_whatsapp'] = selPlanData.is_send_whatsapp;
        processedValues['is_vip'] = selPlanData.is_vip;
        processedValues['category'] = selPlanData.category;
        processedValues['package_for'] = selPlanData.package_for;
        processedValues['is_current_plan'] = 1;
        //check previous plan exist
        if (paymentInfo) {
            if (paymentInfo.status === 'Expired' || paymentInfo.availableCredits <= 0) {
                //update current plan 0 for previous
                var reqDataCurrentPlan = {
                    query_type: 'update',
                    table: 'orders',
                    where: { member_auto_id: viewData.id, id: paymentInfo.id },
                    values: { is_current_plan: 0 }

                }
                context.psGlobal.apiRequest(reqDataCurrentPlan, context.adminUser(userId).mode).then((resCurrentPlan) => {

                });

            }
            if (paymentInfo.status === 'Paid' && paymentInfo.availableCredits > 0) {
                processedValues['is_current_plan'] = 2;
            }
        }


        processedValues['package_price'] = getDiscountInfo('final-amount');
        processedValues['order_date'] = dayjs(values.paid_date).format("YYYY-MM-DD");
        processedValues['paid_date'] = dayjs(values.paid_date).format("YYYY-MM-DD");
        processedValues['expiry_date'] = dayjs(values.paid_date).add(parseInt(selPlanData.validity_months) * 30, "days").format("YYYY-MM-DD");
        processedValues['order_status'] = 'Paid';

        processedValues['paid_by'] = context.adminUser(userId).role;
        processedValues['paid_by_ref'] = context.adminUser(userId).ref_id2;


        var reqDataInsert = [
            {
                query_type: 'insert',
                table: 'orders',
                values: processedValues

            }
        ];
        context.psGlobal.apiRequest(reqDataInsert, context.adminUser(userId).mode).then((res) => {
            var createdId = res[0];
            var padOrderId = 'RMO' + createdId.padStart(5, '0')
            var reqDataInner = {
                query_type: 'update',
                table: 'orders',
                where: { id: createdId },
                values: { order_id: padOrderId }

            };
            context.psGlobal.apiRequest(reqDataInner, context.adminUser(userId).mode).then(resInner => {

                context.psGlobal.addLog({
                    log_name: 'make-payment',
                    logged_type: context.adminUser(userId).role,
                    logged_by: context.adminUser(userId).id,
                    ref_table_column: 'orders.id',
                    ref_id: createdId,
                    ref_id2: padOrderId,
                    description: "New Payment for order " + padOrderId
                }).then(logRes => {
                    setPaymentLoader(false);
                    setVisiblePaymentModal(false);
                    loadViewData(viewData.id)
                    resetPaymentButton(viewData.id)
                    setRefreshPaymentHistory(prev => prev + 1)
                    message.success('Payment Made Successfullly');
                })


            }).catch(err => {
                message.error(err);
                setPaymentLoader(false);
            })



        }).catch(err => {
            message.error(err);
            setPaymentLoader(false);
        })

    };
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
    const onOtherPhotoUploadFinish = (fileName) => {
        var reqData = {
            query_type: 'insert',
            table: 'member_photos',
            values: { member_auto_id: viewId, member_id: viewData.member_id, photo: fileName }

        };
        context.psGlobal.apiRequest(reqData, context.adminUser(userId).mode).then((res) => {
            context.psGlobal.addLog({
                log_name: 'upload-photo',
                logged_type: context.adminUser(userId).role,
                logged_by: context.adminUser(userId).id,
                ref_table_column: 'members.id',
                ref_id: viewId,
                ref_id2: viewData.member_id,
                description: 'Additional Photo updated for ' + viewData.member_id
            }).then(logRes => {
                message.success("New Image Added");
                loadPhotos(viewId);
            })

        }).catch(err => {
            message.error(err);
            setLoader(false);
        })
    }
    const paidDateOnChange = (date) => {
        paymentForm.setFieldsValue({
            orders: { paid_date: dayjs(date).format('YYYY-MM-DD') }
        })

    };
    const onDeleteFinish=()=>{
        context.psGlobal.addLog({
            log_name:'delete-member',
            logged_type:context.adminUser(userId).role,
            logged_by:context.adminUser(userId).id,
            ref_table_column:'members.id',
            ref_id:viewData.id,
            ref_id2:viewData.member_id,
            description:'Member Deleted ' + viewData.member_id
        }).then(logRes=>{
           
            message.success('Member Deleted Successfullly');
            onListClick();
        })
    }
    return (
        <>
            <Spin spinning={loader}>
                {
                    viewData && (<>
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
                                <Space direction='vertical'>
                                    {viewData.member_status === 'Active' ?
                                        <Tag color="green" style={{ fontWeight: 'bold', width: '100px' }}><FontAwesomeIcon icon={faUser} style={{ color: green[6] }} /> &nbsp;Active</Tag>
                                        : <Tag color="red" style={{ fontWeight: 'bold', width: '100px' }}><FontAwesomeIcon icon={faUser} style={{ color: red[6] }} /> &nbsp;Waiting</Tag>}

                                    {parseInt(viewData.is_otp_verified) === 1 ?
                                        <Tag color="green" style={{ fontWeight: 'bold', width: '100px' }}><FontAwesomeIcon icon={faMobileAlt} style={{ color: green[6] }} /> &nbsp;Verified</Tag>
                                        : <Tag color="red" style={{ fontWeight: 'bold', width: '100px' }}><FontAwesomeIcon icon={faMobileAlt} style={{ color: red[6] }} /> &nbsp;Not Verified</Tag>}
                                    {parseInt(viewData.is_email_verified) === 1 ?
                                        <Tag color="green" style={{ fontWeight: 'bold', width: '100px' }}><FontAwesomeIcon icon={faEnvelope} style={{ color: green[6] }} /> &nbsp;Verified</Tag>
                                        : <Tag color="red" style={{ fontWeight: 'bold', width: '100px' }}><FontAwesomeIcon icon={faEnvelope} style={{ color: red[6] }} /> &nbsp;Not Verified</Tag>}

                                    {parseFloat(viewData.paid_amount) !== 0 ?
                                        <Tag color="green" style={{ fontWeight: 'bold', width: '100px' }}><FontAwesomeIcon icon={faIndianRupeeSign} style={{ color: green[6] }} /> &nbsp;{viewData.paid_amount}</Tag>
                                        : <Tag color="red" style={{ fontWeight: 'bold', width: '100px' }}><FontAwesomeIcon icon={faIndianRupeeSign} style={{ color: red[6] }} /> &nbsp;Unpaid</Tag>
                                    }
                                </Space>
                            </Col>
                            {
                                !isForCustomer && (<Col className='gutter-row' xs={24} xl={10}>

                                    <Space>
                                        {/* <MyButton type="outlined" shape="round" style={{ width: '130px' }}><FontAwesomeIcon icon={faEdit} /> Quick Edit</MyButton>
                                         <MyButton type="outlined" shape="round" style={{ width: '130px' }}><FontAwesomeIcon icon={faMinusCircle} /> Delete Profile</MyButton>
                                         */}
                                         {
                                            context.isAdminResourcePermit(userId, 'matrimony-members.delete-member') && ( <DeleteButton type="outlined" size="small" shape="circle" color={red[7]} onFinish={onDeleteFinish}
                                            title="Delete Member"
                                            table="members"
                                            //id must,+ give first three colums to display
                                            dataItem={{ id: viewData.id, member_id: viewData.member_id, name: viewData.name, mobile_no: context.psGlobal.decrypt(viewData.mobile_no) }}
                                            avatar={context.baseUrl + viewData.photo}
                                        />)
                                         }
                                       
                                       
                                        <MyButton type="outlined" shape="round" style={{ width: '130px' }} onClick={() => { onPaymentClick(setVisiblePaymentModal(true)) }}><FontAwesomeIcon icon={faIndianRupeeSign} /> Make Payment</MyButton>
                                    </Space>
                                    {/* <Space style={{ marginTop: '10px' }}>
                                        <MyButton type="outlined" shape="round" style={{ width: '130px' }}><FontAwesomeIcon icon={faMessage} /> Send SMS</MyButton>
                                        <MyButton type="outlined" shape="round" style={{ width: '130px' }}><FontAwesomeIcon icon={faWhatsapp} /> Whatsapp</MyButton>
                                        <MyButton type="outlined" shape="round" style={{ width: '130px' }}><FontAwesomeIcon icon={faPrint} /> Print</MyButton>
                                    </Space> */}


                                </Col>)
                            }

                        </Row>
                        <Divider orientation="left" style={{ borderWidth: '1px', borderColor: cyan[7] }} />
                        <Row gutter={16}>
                            <Col className='gutter-row' xs={24} xl={18}>
                                <Tabs>
                                    <Tabs.TabPane tab="Profile" key="profile">
                                        <Divider orientation="left" style={{ borderWidth: '3px', borderColor: cyan[7] }}><FontAwesomeIcon icon={faUser} /> Basic Details</Divider>
                                        <MyButton shape="round" style={{ float: 'right' }} onClick={() => { setVisibleEditBasicModal(true); setCurEditForm("basic") }}><FontAwesomeIcon icon={faEdit} /> Edit</MyButton>
                                        <ViewMemberBasic isForCustomer={isForCustomer} viewData={viewData} />
                                        <Divider orientation="left" style={{ borderWidth: '3px', borderColor: cyan[7] }}><FontAwesomeIcon icon={faBookOpenReader} /> Education & Occupation</Divider>
                                        <MyButton shape="round" style={{ float: 'right' }} onClick={() => { setVisibleEditBasicModal(true); setCurEditForm("education") }}><FontAwesomeIcon icon={faEdit} /> Edit</MyButton>
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
                                        <MyButton shape="round" style={{ float: 'right' }} onClick={() => { setVisibleEditBasicModal(true); setCurEditForm("family") }}><FontAwesomeIcon icon={faEdit} /> Edit</MyButton>

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
                                        <MyButton shape="round" style={{ float: 'right' }} onClick={() => { setVisibleEditBasicModal(true); setCurEditForm("habits") }}><FontAwesomeIcon icon={faEdit} /> Edit</MyButton>
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
                                        <MyButton shape="round" style={{ float: 'right' }} onClick={() => { setVisibleEditBasicModal(true); setCurEditForm("physical") }}><FontAwesomeIcon icon={faEdit} /> Edit</MyButton>
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
                                        <MyButton shape="round" style={{ float: 'right' }} onClick={() => { setVisibleEditBasicModal(true); setCurEditForm("horoscope") }}><FontAwesomeIcon icon={faEdit} /> Edit</MyButton>
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



                                    </Tabs.TabPane>
                                    <Tabs.TabPane tab="Photos" key="photos">
                                        <Row gutter={16}>
                                            <Col className='gutter-row' xs={24} xl={4}>
                                                <Row gutter={16} style={{ color: cyan[6], fontWeight: 'bold', textAlign: 'center' }}>
                                                    <Col className='gutter-row' xs={24} xl={24}>
                                                        Profile Photo
                                                    </Col>
                                                </Row>
                                                <Row gutter={16} style={{ textAlign: 'center', marginTop: '15px' }}>
                                                    <Col className='gutter-row' xs={24} xl={24}>
                                                        <Image
                                                            width={100}
                                                            src={viewData.photo ? context.baseUrl + viewData.photo : viewData.gender === 'Male' ? context.noMale : context.noFemale}
                                                            fallback={context.noImg}
                                                        />
                                                    </Col>
                                                </Row>
                                                <Row gutter={16} style={{ color: cyan[6], fontWeight: 'bold', textAlign: 'center', marginTop: '15px' }}>
                                                    <Col className='gutter-row' xs={24} xl={24}>
                                                        <MyButton onClick={() => { setVisibleEditBasicModal(true); setCurEditForm("photo") }}>Change</MyButton>
                                                    </Col>
                                                </Row>

                                            </Col>
                                            <Col className='gutter-row' xs={24} xl={20}>
                                                <Row gutter={16} style={{ color: cyan[6], fontWeight: 'bold', textAlign: 'center', marginBottom: '15px' }}>
                                                    <Col className='gutter-row' xs={24} xl={24}>
                                                        Other Photos
                                                    </Col>
                                                </Row>
                                                {
                                                    photosData && photosData.map(item => {
                                                        return <Image
                                                            width={100}
                                                            style={{ border: '1px solid', borderColor: cyan[7] }}
                                                            src={context.baseUrl + item.photo}
                                                            preview={{
                                                                visible: false,
                                                                // onVisibleChange: (visible, previsible) => {setVisiblePhotosPreview(visible)},
                                                                mask: <Space><MyButton type="outlined" size="small" onClick={() => setVisiblePhotosPreview(true)}><FontAwesomeIcon icon={faEye} /></MyButton>
                                                                    <DeleteButton type="outlined" size="small" shape="circle" color={red[7]}
                                                                        onFinish={() => loadPhotos(viewId)}
                                                                        title="Photo"
                                                                        table="member_photos"
                                                                        //id must,+ give first three colums to display
                                                                        dataItem={{ id: item.id, name: viewData.name, member_id: item.member_id, photo_type: "Other Photos" }}
                                                                        avatar={context.baseUrl + item.photo}
                                                                    />
                                                                </Space>
                                                            }}
                                                        />
                                                    })
                                                }
                                                <Row style={{ marginTop: '15px' }}>
                                                    <Col span={8}></Col>
                                                    <Col span={8} style={{ textAlign: 'center' }}>
                                                        <ImageUpload
                                                            name="photo"

                                                            isAddOnly={true}
                                                            cropRatio="3/4"
                                                            storeFileName={'public/uploads/' + new Date().valueOf() + '.jpg'}
                                                            onFinish={onOtherPhotoUploadFinish}
                                                        >

                                                        </ImageUpload>
                                                    </Col>
                                                    <Col span={8}></Col>
                                                </Row>
                                                <Modal
                                                    visible={visiblePhotosPreview}
                                                    zIndex={1005}
                                                    footer={null}
                                                    closeIcon={<MyButton type="outlined" shape="circle" ><FontAwesomeIcon icon={faClose} /></MyButton>}
                                                    centered={true}
                                                    closable={true}
                                                    style={{ marginTop: '20px' }}
                                                    width={600}
                                                    // footer={null}
                                                    onCancel={() => { setVisiblePhotosPreview(false) }}
                                                    title="Photos"
                                                >
                                                    <ImageGallery items={galleryImages} />
                                                </Modal>
                                            </Col>
                                        </Row>




                                    </Tabs.TabPane>
                                    <Tabs.TabPane tab="Partner Preference" key="partner">
                                        <MyButton shape="round" style={{ float: 'right' }} onClick={() => { setVisibleEditBasicModal(true); setCurEditForm("partner") }}><FontAwesomeIcon icon={faEdit} /> Edit</MyButton>
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
                                                    <FormViewItem label="Eating Habits">{viewData.prefered_eating_habits}</FormViewItem>
                                                </Col>
                                                <Col className='gutter-row' xs={24} xl={12}>
                                                    <FormViewItem label="Smoking Habits">{viewData.prefered_smoking_habits}</FormViewItem>
                                                </Col>
                                                <Col className='gutter-row' xs={24} xl={12}>
                                                    <FormViewItem label="Drinking Habits">{viewData.prefered_drinking_habits}</FormViewItem>
                                                </Col>
                                                <Col className='gutter-row' xs={24} xl={12}>
                                                    <FormViewItem label="Martial Status">{viewData.prefered_martial_status}</FormViewItem>
                                                </Col>
                                                <Col className='gutter-row' xs={24} xl={12}>
                                                    <FormViewItem label="Age">{viewData.pref_age && viewData.pref_age.replace(",", " TO ") + " Years"}</FormViewItem>
                                                </Col>

                                                <Col className='gutter-row' xs={24} xl={12}>
                                                    <FormViewItem label="Height">{viewData.pref_height && viewData.pref_height.replace(",", " TO ") + " Cms"}</FormViewItem>
                                                </Col>

                                                <Col className='gutter-row' xs={24} xl={12}>
                                                    <FormViewItem label="Weight">{viewData.pref_weight && viewData.pref_weight.replace(",", " TO ") + " Kg"}</FormViewItem>
                                                </Col>

                                                <Col className='gutter-row' xs={24} xl={12}>
                                                    <FormViewItem label="Physical Status">{viewData.prefered_physical_status}</FormViewItem>
                                                </Col>
                                                <Col className='gutter-row' xs={24} xl={12}>
                                                    <FormViewItem label="Mother Tongue">{viewData.prefered_mother_tongue}</FormViewItem>
                                                </Col>
                                                <Col className='gutter-row' xs={24} xl={12}>
                                                    <FormViewItem label="Prefered Religion">{viewData.prefered_religion}</FormViewItem>
                                                </Col>
                                                <Col className='gutter-row' xs={24} xl={12}>
                                                    <FormViewItem label="Prefered Caste">{getViewCastes(viewData.prefered_caste)}</FormViewItem>
                                                </Col>
                                                <Col className='gutter-row' xs={24} xl={12}>
                                                    <FormViewItem label="Education">{getViewEducation(viewData.prefered_education)}</FormViewItem>
                                                </Col>
                                                <Col className='gutter-row' xs={24} xl={12}>
                                                    <FormViewItem label="Job Type">{viewData.prefered_job_type}</FormViewItem>
                                                </Col>
                                                <Col className='gutter-row' xs={24} xl={12}>
                                                    <FormViewItem label="Prefered Job">{viewData.prefered_job}</FormViewItem>
                                                </Col>
                                                <Col className='gutter-row' xs={24} xl={12}>
                                                    <FormViewItem label="Prefered Country">{viewData.prefered_country}</FormViewItem>
                                                </Col>
                                                <Col className='gutter-row' xs={24} xl={12}>
                                                    <FormViewItem label="Prefered State">{viewData.prefered_state}</FormViewItem>
                                                </Col>
                                                <Col className='gutter-row' xs={24} xl={12}>
                                                    <FormViewItem label="Prefered District">{viewData.prefered_district}</FormViewItem>
                                                </Col>

                                                <Col className='gutter-row' xs={24} xl={12}>
                                                    <FormViewItem label="Income">{viewData.pref_income && viewData.pref_income.replace(",", " TO ")}</FormViewItem>
                                                </Col>
                                                <Col className='gutter-row' xs={24} xl={12}>
                                                    <FormViewItem label="Notes">{viewData.expectation_notes}</FormViewItem>
                                                </Col>

                                            </Row>
                                        </Form>
                                    </Tabs.TabPane>
                                    {
                                        !isForCustomer && (<Tabs.TabPane tab="Payment History" key="payment">

                                            <PaginatedTable
                                                columns={tableColumns}
                                                countQuery={"select count(*) as count from orders where status=1 and member_auto_id =" + viewData.id}
                                                listQuery={"select *,@rownum:=@rownum+1 as row_num from orders CROSS JOIN (SELECT @rownum:={rowNumberVar}) c where status=1 and member_auto_id =" + viewData.id}
                                                itemsPerPage={20}
                                                refresh={refreshPaymentHistory}
                                            />

                                            <Modal
                                                visible={visiblePrintModal}
                                                zIndex={999}
                                                footer={null}
                                                centered={false}
                                                closable={true}
                                                style={{ marginTop: '20px' }}
                                                width={600}
                                                // footer={null}
                                                onCancel={() => { setVisiblePrintModal(false) }}
                                                title={<span style={{ color: green[4] }} ><FontAwesomeIcon icon={faPrint} /> Print Members</span>}
                                            >
                                                <Form
                                                    name="basic"
                                                    //form={addeditFormPrint}
                                                    labelAlign="left"
                                                    labelCol={{ span: 8 }}
                                                    wrapperCol={{ span: 20 }}
                                                    initialValues={{ remember: true }}
                                                    onFinish={formPrintOnFinish}
                                                    autoComplete="off"
                                                >

                                                    {/* <FormItem
                                                label="Print Type"
                                                name="print_type"
                                                rules={[{ required: true, message: 'Please Select Print Type' }]}
                                            >

                                                <Select
                                                    showSearch
                                                    placeholder="Print Type"

                                                    optionFilterProp="children"
                                                    //onChange={businessStatusOnChange}
                                                    filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                                                >
                                                    <Select.Option value="Profile View">Profile View</Select.Option>
                                                    <Select.Option value="Profile View No Address">Profile View No Address</Select.Option>
                                                    <Select.Option value="Postal">Postal</Select.Option>
                                                    <Select.Option value="Short Line">Short Line</Select.Option>
                                                    <Select.Option value="Short Line WO Phone No">Short Line WO Phone No</Select.Option>
                                                    <Select.Option value="Photo Short Line">Photo Short Line</Select.Option>
                                                    <Select.Option value="Photo Short Line WO Address">Photo Short Line WO Address</Select.Option>
                                                    <Select.Option value="Photo Print">Photo Print</Select.Option>
                                                </Select>
                                            </FormItem> */}

                                                    <FormItem
                                                        label="Business Name"
                                                        name='business_name'
                                                        rules={[{ required: true, message: 'Please Enter Business Name' }]}
                                                    >
                                                        <Select
                                                            showSearch
                                                            placeholder="Business Name"

                                                            optionFilterProp="children"
                                                            //onChange={businessStatusOnChange}
                                                            filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                                                        >
                                                            {
                                                                businessNames && businessNames.map(item => {
                                                                    return <Select.Option value={item.id}>{item.business_name}</Select.Option>
                                                                })
                                                            }
                                                        </Select>
                                                    </FormItem>

                                                    <FormItem wrapperCol={{ offset: 10, span: 24 }}>
                                                        <Space>
                                                            <Button size="large" type="outlined" onClick={() => setVisiblePrintModal(false)}>
                                                                Cancel
                                                            </Button>
                                                            <MyButton size="large" type="primary" htmlType="submit">
                                                                Print
                                                            </MyButton>
                                                        </Space>

                                                    </FormItem>

                                                </Form>

                                            </Modal>
                                        </Tabs.TabPane>)
                                    }

                                    {/* <Tabs.TabPane tab="Profile Views" key="views">
                                    under construction
                                </Tabs.TabPane>
                                <Tabs.TabPane tab="Communications" key="communications">
                                    under construction
                                </Tabs.TabPane>
                                <Tabs.TabPane tab="Activity" key="activity">
                                    under construction
                                </Tabs.TabPane> */}
                                </Tabs>
                            </Col>
                            <Col className='gutter-row' xs={24} xl={6}>
                                <Card title={<span style={{ color: magenta[6], fontWeight: 'bold' }}>Contact info</span>} extra={<MyButton type="outlined" color={magenta[6]} shape="round" style={{ float: 'right' }} onClick={() => { setVisibleEditBasicModal(true); setCurEditForm("contact") }}><FontAwesomeIcon icon={faEdit} /> Edit</MyButton>}

                                    style={{ borderColor: magenta[6] }}>
                                    <Row gutter={16}>
                                        <Col className='gutter-row' xs={24} xl={2}>
                                            <span style={{ color: magenta[6], fontWeight: 'bold' }}> <FontAwesomeIcon icon={faPhoneVolume} /></span>
                                        </Col>
                                        <Col className='gutter-row' xs={24} xl={22}>
                                            <a href={"tel:" + context.psGlobal.decrypt(viewData.mobile_no)}>{context.psGlobal.decrypt(viewData.mobile_no)}</a>
                                        </Col>
                                    </Row>

                                    <Row gutter={16}>
                                        <Col className='gutter-row' xs={24} xl={2}>
                                            <span style={{ color: magenta[6], fontWeight: 'bold' }}> <FontAwesomeIcon icon={faWhatsapp} /></span>
                                        </Col>
                                        <Col className='gutter-row' xs={24} xl={22}>
                                            <a href={viewData.whatsapp_no ? "tel:" + context.psGlobal.decrypt(viewData.whatsapp_no) : ''}>{viewData.whatsapp_no ? context.psGlobal.decrypt(viewData.whatsapp_no) : ''}</a>
                                        </Col>
                                    </Row>
                                    <Row gutter={16}>
                                        <Col className='gutter-row' xs={24} xl={2}>
                                            <span style={{ color: magenta[6], fontWeight: 'bold' }}> <FontAwesomeIcon icon={faEnvelope} /></span>
                                        </Col>
                                        <Col className='gutter-row' xs={24} xl={22}>
                                            <span style={{ color: cyan[6], fontWeight: 'bold' }}>
                                                {viewData.email}
                                            </span>
                                        </Col>
                                    </Row>
                                    <Row gutter={16} style={{ fontSize: '15px' }}>
                                        <Col className='gutter-row' xs={24} xl={2}>
                                            <span style={{ color: magenta[6], fontWeight: 'bold' }}> <FontAwesomeIcon icon={faMobileAlt} /></span>
                                        </Col>
                                        <Col className='gutter-row' xs={24} xl={22}>
                                            <a href={viewData.mobile_alt_no_1 ? "tel:" + context.psGlobal.decrypt(viewData.mobile_alt_no_1) : ''}>{viewData.mobile_alt_no_1 ? context.psGlobal.decrypt(viewData.mobile_alt_no_1) : 'N/A'}</a><br />
                                            <a href={viewData.mobile_alt_no_2 ? "tel:" + context.psGlobal.decrypt(viewData.mobile_alt_no_2) : ''}>{viewData.mobile_alt_no_2 ? context.psGlobal.decrypt(viewData.mobile_alt_no_2) : 'N/A'}</a>
                                        </Col>
                                    </Row>
                                    <Row gutter={16}>
                                        <Col className='gutter-row' xs={24} xl={2}>
                                            <span style={{ color: magenta[6], fontWeight: 'bold' }}> <FontAwesomeIcon icon={faLocationPin} /></span>
                                        </Col>
                                        <Col className='gutter-row' xs={24} xl={22}>
                                            <span style={{ color: cyan[6], fontWeight: 'bold' }}>
                                                {viewData.door_no}, {viewData.street}, {viewData.area}, {viewData.taluk}, {viewData.landmark}, {viewData.district}, {viewData.state}, Pin : {viewData.pincode}
                                            </span>
                                        </Col>
                                    </Row>
                                </Card>

                            </Col>
                        </Row>
                        <Modal
                            visible={visibleEditBasicModal}
                            zIndex={999}
                            footer={null}
                            closeIcon={<MyButton type="outlined" shape="circle" ><FontAwesomeIcon icon={faClose} /></MyButton>}
                            centered={false}
                            closable={true}
                            width={1100}
                            onCancel={() => { setVisibleEditBasicModal(false) }}
                            title={"Edit " + curEditForm + " Information"}
                        >
                            {
                                curEditForm === "basic" && (<AddEditMember
                                    editIdOrObject={viewData} onListClick={() => { setVisibleEditBasicModal(false) }}
                                    onSaveFinish={() => { setVisibleEditBasicModal(false); loadViewData(viewId) }}
                                    userId={userId}
                                    inputFields={
                                        [
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
                                        ]
                                    }

                                />)
                            }
                            {
                                curEditForm === "education" && (<AddEditMember
                                    editIdOrObject={viewData} onListClick={() => { setVisibleEditBasicModal(false) }}
                                    onSaveFinish={() => { setVisibleEditBasicModal(false); loadViewData(viewId) }}
                                    userId={userId}
                                    inputFields={
                                        [
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
                                        ]
                                    }

                                />)
                            }
                            {
                                curEditForm === "family" && (<AddEditMember
                                    editIdOrObject={viewData} onListClick={() => { setVisibleEditBasicModal(false) }}
                                    onSaveFinish={() => { setVisibleEditBasicModal(false); loadViewData(viewId) }}
                                    userId={userId}
                                    inputFields={
                                        [
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
                                        ]
                                    }

                                />)
                            }
                            {
                                curEditForm === "habits" && (<AddEditMember
                                    editIdOrObject={viewData} onListClick={() => { setVisibleEditBasicModal(false) }}
                                    onSaveFinish={() => { setVisibleEditBasicModal(false); loadViewData(viewId) }}
                                    userId={userId}
                                    inputFields={
                                        [
                                            'member_habits.eating_habits',
                                            'member_habits.drinking_habits',
                                            'member_habits.smoking_habits',
                                            'member_habits.hobbies',

                                        ]
                                    }

                                />)
                            }
                            {
                                curEditForm === "physical" && (<AddEditMember
                                    editIdOrObject={viewData} onListClick={() => { setVisibleEditBasicModal(false) }}
                                    onSaveFinish={() => { setVisibleEditBasicModal(false); loadViewData(viewId) }}
                                    userId={userId}
                                    inputFields={
                                        [
                                            'member_physical_attributes.height',
                                            'member_physical_attributes.weight',
                                            'member_physical_attributes.body_type',
                                            'member_physical_attributes.complexion',
                                            'member_physical_attributes.physical_status',
                                            'member_physical_attributes.physical_status_description',
                                        ]
                                    }

                                />)
                            }
                            {
                                curEditForm === "horoscope" && (<AddEditMember
                                    editIdOrObject={viewData} onListClick={() => { setVisibleEditBasicModal(false) }}
                                    onSaveFinish={() => { setVisibleEditBasicModal(false); loadViewData(viewId) }}
                                    userId={userId}
                                    inputFields={
                                        [
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

                                />)
                            }
                            {
                                curEditForm === "contact" && (<AddEditMember
                                    editIdOrObject={viewData} onListClick={() => { setVisibleEditBasicModal(false) }}
                                    onSaveFinish={() => { setVisibleEditBasicModal(false); loadViewData(viewId) }}
                                    userId={userId}
                                    inputFields={
                                        [
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
                                        ]
                                    }

                                />)
                            }
                            {
                                curEditForm === "photo" && (<AddEditMember
                                    editIdOrObject={viewData} onListClick={() => { setVisibleEditBasicModal(false) }}
                                    onSaveFinish={() => { setVisibleEditBasicModal(false); loadViewData(viewId) }}
                                    userId={userId}
                                    inputFields={
                                        [
                                            'members.photo',
                                            'members.is_protect_photo',
                                        ]
                                    }

                                />)
                            }
                            {
                                curEditForm === "partner" && (<AddEditMember
                                    editIdOrObject={viewData} onListClick={() => { setVisibleEditBasicModal(false) }}
                                    onSaveFinish={() => { setVisibleEditBasicModal(false); loadViewData(viewId) }}
                                    userId={userId}
                                    inputFields={
                                        [
                                            'member_partner_preference.prefered_eating_habits',
                                            'member_partner_preference.prefered_smoking_habits',
                                            'member_partner_preference.prefered_drinking_habits',
                                            'member_partner_preference.prefered_martial_status',
                                            'member_partner_preference.age',
                                            'member_partner_preference.height',
                                            'member_partner_preference.weight',
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
                                    }

                                />)
                            }
                        </Modal>
                        <Modal
                            visible={visiblePaymentModal}
                            zIndex={999}
                            footer={null}
                            centered={false}
                            closable={true}
                            style={{ marginTop: '20px' }}
                            width={800}
                            // footer={null}
                            onCancel={() => { setVisiblePaymentModal(false) }}
                            title={<span style={{ color: green[4] }} ><FontAwesomeIcon icon={faIndianRupeeSign} /> Make Payment</span>}
                        >
                            <Spin spinning={paymentLoader}>
                                <Form
                                    name="basic"
                                    colon={false}
                                    //form={addeditFormPrint}
                                    labelAlign="left"
                                    form={paymentForm}
                                    labelCol={{ span: 8 }}
                                    wrapperCol={{ span: 24 }}
                                    initialValues={{ remember: true }}
                                    onFinish={paymentFormOnFinish}
                                    autoComplete="off"
                                >
                                    <FormItem
                                        label="Plan Name"

                                        rules={[{ required: true, message: 'Please Enter Plan Name' }]}
                                    >
                                        <Select
                                            showSearch
                                            placeholder="Plan Name"
                                            onChange={onPlanChange}
                                            optionFilterProp="children"
                                            //onChange={businessStatusOnChange}
                                            filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                                        >
                                            {
                                                planNames && planNames.map(item => {
                                                    return <Select.Option value={item.id} >{item.plan_name}</Select.Option>
                                                })
                                            }
                                        </Select>
                                    </FormItem>
                                    <Row gutter={16}>
                                        <Col className='gutter-row' xs={24} xl={12}>
                                            <FormViewItem label="Daily Limit">{selPlanData.daily_limit}</FormViewItem>
                                            <FormViewItem label="Montly Limit">{selPlanData.monthly_limit}</FormViewItem>
                                            <FormViewItem label="Validity">{selPlanData.validity_months + " Months"}</FormViewItem>
                                            <FormViewItem label="Consume Credits">{selPlanData.consume_credits}</FormViewItem>
                                        </Col>
                                        <Col className='gutter-row' xs={24} xl={12}>
                                            <FormViewItem label="Package Price">{selPlanData.package_price + " INR"}</FormViewItem>
                                            <FormViewItem label="SMS">{parseInt(selPlanData.is_send_sms) === 1 ? 'Yes' : 'No'}</FormViewItem>
                                            <FormViewItem label="whatsapp">{parseInt(selPlanData.is_send_whatsapp) === 1 ? 'Yes' : 'No'}</FormViewItem>
                                            <FormViewItem label="VIP">{parseInt(selPlanData.is_vip) === 1 ? 'Yes' : 'No'}</FormViewItem>
                                        </Col>
                                    </Row>


                                    <Row gutter={16} style={{ color: green[7], fontSize: '24px', marginBottom: '5px' }}>
                                        <Col className='gutter-row' span={8}>
                                            {discountData ? discountData.percentage : 0}% Discount
                                        </Col>
                                        <Col className='gutter-row' span={8}>
                                            Discount :  {getDiscountInfo('discount-amount')}
                                        </Col>
                                        <Col className='gutter-row' span={8}>
                                            Final Price : {getDiscountInfo('final-amount')}
                                        </Col>
                                    </Row>


                                    <FormItem
                                        label="Paid Date"
                                        name={['orders', 'paid_date']}
                                        rules={[{ required: true, message: 'Please Enter Dob' }]}
                                    >

                                        <Space direction="vertical">
                                            <DatePicker
                                                onChange={paidDateOnChange}
                                                format='DD/MM/YYYY'
                                                allowClear={false}
                                            />
                                        </Space>
                                    </FormItem>


                                    <FormItem

                                        label="Payment Mode"
                                        name={['orders', 'payment_mode']}
                                        rules={[{ required: true, message: 'Please Enter Payment Mode' }]}
                                    >
                                        <Select
                                            showSearch
                                            placeholder="Payment"

                                            optionFilterProp="children"
                                            //onChange={genderOnChange}
                                            filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                                        >
                                            {context.psGlobal.collectionOptions(context.psGlobal.collectionData, 'payment-modes', 'option', ['Main Balance'])}

                                        </Select>

                                    </FormItem>
                                    <FormItem

                                        label="Narration"
                                        name={['orders', 'payment_note']}
                                        rules={[{ required: true, message: 'Please Enter Narration' }]}
                                    >
                                        <Input.TextArea />

                                    </FormItem>

                                    <FormItem wrapperCol={{ offset: 10, span: 24 }}>
                                        <Space>
                                            <Button size="large" type="outlined" onClick={() => setVisiblePaymentModal(false)}>
                                                Cancel
                                            </Button>
                                            <MyButton size="large" type="primary" htmlType="submit">
                                                {curAction === "edit" ? "Update" : "Submit"}
                                            </MyButton>
                                        </Space>

                                    </FormItem>

                                </Form>
                            </Spin>

                        </Modal>
                        <OrderViewPrint
                            receiptData={printReceiptData}
                            business={selBusiness}
                        // language={printLanguage}
                        />
                    </>)
                }
            </Spin>
        </>
    );

}
export default ViewMember;