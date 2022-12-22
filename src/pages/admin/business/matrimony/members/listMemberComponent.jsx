import PsContext from '../../../../../context'
import React, { useState, useEffect, useContext, useRef } from 'react';
import { Row, Col, message, Spin } from 'antd';
import { Avatar, Card, Image, Space, Tag, Checkbox, Collapse, Modal, Input, Select, Form, Button } from 'antd';
import { MyButton } from '../../../../../comp'
import { baseUrl, printDocument } from '../../../../../utils';
import noImg from '../../../../../assets/images/no-img.jpg'
import { green, blue, red, cyan } from '@ant-design/colors';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope, faMessage } from '@fortawesome/free-solid-svg-icons'
import { faIndianRupeeSign, faUser, faMobileAlt, faPrint, faUserTimes } from '@fortawesome/free-solid-svg-icons'
import { AvatarPaginatedList, FormItem, ImageUpload } from '../../../../../comp';
//import { useExcelDownloder } from 'react-xls';
import { memberColumns } from './memberColumns';
import ProfileViewPrint from './printMembers/profileViewprint';
import ShortLinePrint from "./printMembers/shortLinePrint";
import PostalPrint from "./printMembers/postalPrint";
import PhotoPrint from "./printMembers/printPhoto";
import dayjs from 'dayjs';
const ListMemberComponent = (props) => {
    const context = useContext(PsContext);
    const { Panel } = Collapse;
    //const { ExcelDownloder, Type, setData } = useExcelDownloder();
    const { filterColumnsRef, refreshComponent, userId, onEditClick, onViewClick, ...other } = props;
    // const isMobile = useMediaQuery({ query: `(max-width: 760px)` });
    const [menuItems, setMenuItems] = useState([]);
    const [filterLoader, setFilterLoader] = useState(false);
    const filterColumns = useRef(null);
    const [refreshList, setRefreshList] = useState(0);
    const [visiblePrintModal, setVisiblePrintModal] = useState(false);
    const InfiniteListRef = useRef();
    const [selMembers, setSelMembers] = useState([]);
    const [allData, setAllData] = useState(null);
    const [excelData, setExcelData] = useState(null);
    const [businessNames, setBusinessNames] = useState(null);
    const [printData, setPrintData] = useState([]);
    const [selBusiness, setSelBusiness] = useState(null);
    const [printLanguage, setPrintLanguage] = useState("Tamil");
    const [visibleWhatsappModal, setVisibleWhatsappModal] = useState(false);
    const [loadingWhatsappSend, setLoadingWhatsappSend] = useState(false);
    const [addeditFormWhatsapp] = Form.useForm();
    const [printingForMemberData, setPrintingForMemberData] = useState(null);
    const [printForm] = Form.useForm();
    const [isPrintContact, setIsPrintContact] = useState(false);
    const [isPrintPhoto, setIsPrintPhoto] = useState(false);

    useEffect(() => {

        filterColumns.current = filterColumnsRef;
        setRefreshList(prev => prev + 1);
        loadFilterMenu();

    }, [filterColumnsRef, refreshComponent])
    useEffect(() => {
        loadBusinessNames();
    }, [])
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

    const loadFilterMenu = () => {
        setFilterLoader(true);

        var reqData = [{
            filter_column: "gender",
            query_type: 'query', //query_type=insert | update | delete | query
            query: "select gender as label,count(*) as count from members m,member_family_details f,member_habits hb,member_horoscope hr,member_physical_attributes p,member_partner_preference mp  where m.status=1 and m.member_status='Active' and m.id=f.member_auto_id and m.id=hb.member_auto_id and m.id=hr.member_auto_id and m.id=p.member_auto_id and m.id=mp.member_auto_id " + context.psGlobal.getWhereClause(filterColumns.current, false) + " GROUP BY gender"
        },
        {
            filter_column: "marital_status",
            query_type: 'query', //query_type=insert | update | delete | query
            query: "select marital_status as label,count(*) as count from members m,member_family_details f,member_habits hb,member_horoscope hr,member_physical_attributes p,member_partner_preference mp   where m.status=1 and m.member_status='Active' and m.id=f.member_auto_id and m.id=hb.member_auto_id and m.id=hr.member_auto_id and m.id=p.member_auto_id and m.id=mp.member_auto_id " + context.psGlobal.getWhereClause(filterColumns.current, false) + " GROUP BY marital_status"
        },
        {
            filter_column: "country",
            query_type: 'query', //query_type=insert | update | delete | query
            query: "select country as label,count(*) as count from members m,member_family_details f,member_habits hb,member_horoscope hr,member_physical_attributes p,member_partner_preference mp   where m.status=1 and m.member_status='Active'  and m.id=f.member_auto_id and m.id=hb.member_auto_id and m.id=hr.member_auto_id and m.id=p.member_auto_id and m.id=mp.member_auto_id " + context.psGlobal.getWhereClause(filterColumns.current, false) + " GROUP BY country"
        },
        {
            filter_column: "state",
            query_type: 'query', //query_type=insert | update | delete | query
            query: "select state as label,count(*) as count from members m,member_family_details f,member_habits hb,member_horoscope hr,member_physical_attributes p,member_partner_preference mp   where m.status=1 and m.member_status='Active'  and m.id=f.member_auto_id and m.id=hb.member_auto_id and m.id=hr.member_auto_id and m.id=p.member_auto_id  and m.id=mp.member_auto_id " + context.psGlobal.getWhereClause(filterColumns.current, false) + " GROUP BY state"
        },
        {
            filter_column: "district",
            query_type: 'query', //query_type=insert | update | delete | query
            query: "select district as label,count(*) as count from members m,member_family_details f,member_habits hb,member_horoscope hr,member_physical_attributes p,member_partner_preference mp   where m.status=1 and m.member_status='Active'  and m.id=f.member_auto_id and m.id=hb.member_auto_id and m.id=hr.member_auto_id and m.id=p.member_auto_id  and m.id=mp.member_auto_id " + context.psGlobal.getWhereClause(filterColumns.current, false) + " GROUP BY district"
        },
        {
            filter_column: "religion",
            query_type: 'query', //query_type=insert | update | delete | query
            query: "select religion as label,count(*) as count from members m,member_family_details f,member_habits hb,member_horoscope hr,member_physical_attributes p,member_partner_preference mp   where m.status=1 and m.member_status='Active'  and m.id=f.member_auto_id and m.id=hb.member_auto_id and m.id=hr.member_auto_id and m.id=p.member_auto_id  and m.id=mp.member_auto_id " + context.psGlobal.getWhereClause(filterColumns.current, false) + " GROUP BY religion"
        },
        {
            filter_column: "caste",
            query_type: 'query', //query_type=insert | update | delete | query
            query: "select c.caste_name as label,m.caste as value,count(*) as count from castes c,members m,member_family_details f,member_habits hb,member_horoscope hr,member_physical_attributes p,member_partner_preference mp   where m.status=1 and m.member_status='Active'  and m.id=f.member_auto_id and m.id=hb.member_auto_id and m.id=hr.member_auto_id and m.id=p.member_auto_id  and m.id=mp.member_auto_id  and  m.caste=c.id and m.status=1 " + context.psGlobal.getWhereClause(filterColumns.current, false) + " GROUP BY m.caste"
        },
        {
            filter_column: "sub_caste",
            query_type: 'query', //query_type=insert | update | delete | query
            query: "select sub_caste as label,count(*) as count from members m,member_family_details f,member_habits hb,member_horoscope hr,member_physical_attributes p,member_partner_preference mp   where m.status=1 and m.member_status='Active'  and m.id=f.member_auto_id and m.id=hb.member_auto_id and m.id=hr.member_auto_id and m.id=p.member_auto_id   and m.id=mp.member_auto_id " + context.psGlobal.getWhereClause(filterColumns.current, false) + " GROUP BY sub_caste"
        },

        {
            filter_column: "photo",
            query_type: 'query', //query_type=insert | update | delete | query
            query: "select IF(is_photo_updated='1','With Photo', 'Without Photo') as label,m.is_photo_updated as value,count(*) as count from members m,member_family_details f,member_habits hb,member_horoscope hr,member_physical_attributes p,member_partner_preference mp   where m.status=1 and m.member_status='Active'  and m.id=f.member_auto_id and m.id=hb.member_auto_id and m.id=hr.member_auto_id and m.id=p.member_auto_id  and m.id=mp.member_auto_id " + context.psGlobal.getWhereClause(filterColumns.current, false) + " GROUP BY is_photo_updated"
        },
        {
            filter_column: "residence_type",
            query_type: 'query', //query_type=insert | update | delete | query
            query: "select residence_type as label,count(*) as count from members m,member_family_details f,member_habits hb,member_horoscope hr,member_physical_attributes p,member_partner_preference mp   where m.status=1 and m.member_status='Active'  and m.id=f.member_auto_id and m.id=hb.member_auto_id and m.id=hr.member_auto_id and m.id=p.member_auto_id  and m.id=mp.member_auto_id " + context.psGlobal.getWhereClause(filterColumns.current, false) + " GROUP BY residence_type"
        },
        {
            filter_column: "education",
            query_type: 'query', //query_type=insert | update | delete | query
            query: "select e.course_name as label,m.educational_qualification as value,count(*) as count from education_courses e,members m,member_family_details f,member_habits hb,member_horoscope hr,member_physical_attributes p,member_partner_preference mp   where m.status=1 and m.member_status='Active'  and m.id=f.member_auto_id and m.id=hb.member_auto_id and m.id=hr.member_auto_id and m.id=p.member_auto_id  and  m.educational_qualification=e.id and m.status=1  and m.id=mp.member_auto_id " + context.psGlobal.getWhereClause(filterColumns.current, false) + " GROUP BY m.educational_qualification"
        },
        {
            filter_column: "job_type",
            query_type: 'query', //query_type=insert | update | delete | query
            query: "select job_type as label,count(*) as count from members m,member_family_details f,member_habits hb,member_horoscope hr,member_physical_attributes p,member_partner_preference mp   where m.status=1 and m.member_status='Active'  and m.id=f.member_auto_id and m.id=hb.member_auto_id and m.id=hr.member_auto_id and m.id=p.member_auto_id  and m.id=mp.member_auto_id " + context.psGlobal.getWhereClause(filterColumns.current, false) + " GROUP BY job_type"
        },
        {
            filter_column: "job_name",
            query_type: 'query', //query_type=insert | update | delete | query
            query: "select job_name as label,count(*) as count from members m,member_family_details f,member_habits hb,member_horoscope hr,member_physical_attributes p,member_partner_preference mp   where m.status=1 and m.member_status='Active'  and m.id=f.member_auto_id and m.id=hb.member_auto_id and m.id=hr.member_auto_id and m.id=p.member_auto_id  and m.id=mp.member_auto_id " + context.psGlobal.getWhereClause(filterColumns.current, false) + " GROUP BY job_name"
        },
        {
            filter_column: "job_country",
            query_type: 'query', //query_type=insert | update | delete | query
            query: "select job_country as label,count(*) as count from members m,member_family_details f,member_habits hb,member_horoscope hr,member_physical_attributes p,member_partner_preference mp   where m.status=1 and m.member_status='Active'  and m.id=f.member_auto_id and m.id=hb.member_auto_id and m.id=hr.member_auto_id and m.id=p.member_auto_id  and m.id=mp.member_auto_id " + context.psGlobal.getWhereClause(filterColumns.current, false) + " GROUP BY job_country"
        },
        {
            filter_column: "job_state",
            query_type: 'query', //query_type=insert | update | delete | query
            query: "select job_state as label,count(*) as count from members m,member_family_details f,member_habits hb,member_horoscope hr,member_physical_attributes p,member_partner_preference mp   where m.status=1 and m.member_status='Active'  and m.id=f.member_auto_id and m.id=hb.member_auto_id and m.id=hr.member_auto_id and m.id=p.member_auto_id  and m.id=mp.member_auto_id " + context.psGlobal.getWhereClause(filterColumns.current, false) + " GROUP BY job_state"
        },
        {
            filter_column: "job_district",
            query_type: 'query', //query_type=insert | update | delete | query
            query: "select job_district as label,count(*) as count from members m,member_family_details f,member_habits hb,member_horoscope hr,member_physical_attributes p,member_partner_preference mp   where m.status=1 and m.member_status='Active'  and m.id=f.member_auto_id and m.id=hb.member_auto_id and m.id=hr.member_auto_id and m.id=p.member_auto_id  and m.id=mp.member_auto_id " + context.psGlobal.getWhereClause(filterColumns.current, false) + " GROUP BY job_district"
        },
        {
            filter_column: "body_type",
            query_type: 'query', //query_type=insert | update | delete | query
            query: "select p.body_type as label,count(*) as count from members m,member_family_details f,member_habits hb,member_horoscope hr,member_physical_attributes p,member_partner_preference mp   where m.status=1 and m.id=f.member_auto_id and m.id=hb.member_auto_id and m.id=hr.member_auto_id and m.id=p.member_auto_id  and m.id=mp.member_auto_id " + context.psGlobal.getWhereClause(filterColumns.current, false) + " GROUP BY p.body_type"
        },
        {
            filter_column: "complexion",
            query_type: 'query', //query_type=insert | update | delete | query
            query: "select p.complexion as label,count(*) as count from members m,member_family_details f,member_habits hb,member_horoscope hr,member_physical_attributes p,member_partner_preference mp   where m.status=1 and m.member_status='Active'  and m.id=f.member_auto_id and m.id=hb.member_auto_id and m.id=hr.member_auto_id and m.id=p.member_auto_id  and m.id=mp.member_auto_id " + context.psGlobal.getWhereClause(filterColumns.current, false) + " GROUP BY p.complexion"
        },
        {
            filter_column: "star",
            query_type: 'query', //query_type=insert | update | delete | query
            query: "select hr.star as label,count(*) as count from members m,member_family_details f,member_habits hb,member_horoscope hr,member_physical_attributes p,member_partner_preference mp   where m.status=1  and m.member_status='Active'  and m.id=f.member_auto_id and m.id=hb.member_auto_id and m.id=hr.member_auto_id and m.id=p.member_auto_id  and m.id=mp.member_auto_id " + context.psGlobal.getWhereClause(filterColumns.current, false) + " GROUP BY hr.star"
        },
        {
            filter_column: "raasi",
            query_type: 'query', //query_type=insert | update | delete | query
            query: "select hr.raasi as label,count(*) as count from members m,member_family_details f,member_habits hb,member_horoscope hr,member_physical_attributes p,member_partner_preference mp   where m.status=1  and m.member_status='Active'  and m.id=f.member_auto_id and m.id=hb.member_auto_id and m.id=hr.member_auto_id and m.id=p.member_auto_id  and m.id=mp.member_auto_id " + context.psGlobal.getWhereClause(filterColumns.current, false) + " GROUP BY hr.raasi"
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
                childlist.push(<><Checkbox value={child.value} noStyle>{child.label}</Checkbox><br /></>)
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
                        <Checkbox.Group>
                            <Space direction="vertical" style={{ width: '100%' }}>
                                {childlist}
                            </Space>
                        </Checkbox.Group>
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
    const onCheckedChange = (checkedIds, allData) => {
        setSelMembers(checkedIds);
        // changeExcelData(checkedIds,allData);
    }
    const onListPageChange = (page, allData) => {

         /*   var excelMembers = [];
     allData.forEach(item => {
            var curRow = {};
            memberColumns.forEach(column => {
                curRow[column.title] = item[column.fieldName];
            })
            excelMembers.push(curRow);
        })
        setExcelData({ members: excelMembers }); */
        setSelMembers([]);
        setAllData(allData);
    }
    const changeExcelData = (selIds, allData) => {
        var excelMembers = [];
        selIds.forEach(curId => {
            var curMember = allData.find(member => member.id === curId);
            excelMembers.push(curMember);
        })
        setExcelData({ members: excelMembers });

    }
    const loadExcelData = () => {

        var selectedMembers = [{
            "S No": '0',
            "Member Id": 'sample',
            "Member Name": 'sample',
            "Age": 0,
            "Marital Status": 'sample',
        }];

        if (InfiniteListRef.current) {
            var allMembersData = InfiniteListRef.current.getData();

            selMembers.forEach((item, index) => {
                var curItem = allMembersData.find(obj => obj.id === item);
                selectedMembers.push({
                    "S No": index + 1,
                    "Member Id": curItem.member_id,
                    "Member Name": curItem.name,
                    "Age": curItem.age,
                    "Marital Status": curItem.marital_status,
                })
            });
        }
        console.log('exceldata', { members: selectedMembers })
        //  setExcelData({ members: selectedMembers });
        // console.log('when download', selectedMembers)
        return { members: selectedMembers };
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
    useEffect(() => {
        loadFilterMenu();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const onPrintClick = () => {
        setVisiblePrintModal(true);

    }
    const formPrintOnFinish = (values) => {
        var business = businessNames.find(
            (item) => item.id === values.business_name
        );
        setSelBusiness(business);


        if (values.print_contact) setIsPrintContact(true);
        if (values.print_photo) setIsPrintPhoto(true);

        if (values.print_contact) {
            if (!values.member_id) {
                message.error("Provide for Member Id for Printing");
                return;
            }
        }
        printDocument(values.print_type);

        if (values.print_contact) {

            context.psGlobal.addLog({
                log_name: 'print-profile',
                logged_type: context.adminUser(userId).role,
                logged_by: context.adminUser(userId).id,
                ref_table_column: 'members.id',
                ref_id: printingForMemberData ? printingForMemberData.id : '',
                ref_id2: values.member_id,
                description: selMembers.length.toString() + " Profiles printed for " + values.member_id
            })
        }
    };
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
                    if (res.length > 0) setPrintingForMemberData(res[0]);
                    else setPrintingForMemberData(null);

                })
                .catch((err) => {
                    message.error(err);
                    //   setLoader(false);
                });
        }
    };
    const onWhatsappClick = () => {
        setVisibleWhatsappModal(true);
    }
    const addeditFormWhatsappOnFinish = (values) => {
        setLoadingWhatsappSend(true);
        var messages = [];
        selMembers.forEach(curId => {
            var curMember = allData.find(member => member.id === curId);
            var mNumber = '';
            if (curMember.whatsapp_no && (curMember.whatsapp_no.length === 12 || curMember.whatsapp_no.length === 12))
                mNumber = context.psGlobal.decrypt(curMember.whatsapp_no)
            else
                mNumber = context.psGlobal.decrypt(curMember.mobile_no)
            messages.push({ mobile_no: mNumber, message: values.message });
        })
        // console.log('values', values, mobileNumbers);
        var whatsappData = {
            msg_type: 'unique-resource', //unique-resource,separate-resource
            imageUrls: [context.baseUrl + values.image],
            messages: messages
        };
        context.psGlobal.sendWhatsapp(whatsappData).then((res) => {
            var reqData = [];
            var i = 0;
            selMembers.forEach(curId => {
                var curMember = allData.find(member => member.id === curId);
                var sentMobileNumber = res[i].mobile_no;
                var responseVar = JSON.parse(res[i].response);
                reqData.push({
                    query_type: 'insert',
                    table: 'whatsapp_reports',
                    values: {
                        msg_date: dayjs().format("YYYY-MM-DD HH:mm:ss"),
                        mobile_no: sentMobileNumber,
                        msg_type: 'compaign',
                        ref_table_column: "members.id",
                        ref_id: curMember.id,
                        ref_id2: curMember.member_id,
                        msg: values.message ? values.message : null,
                        images: values.image ? values.image : null,
                        pdf: null,
                        msg_status: responseVar.status && responseVar.status === 'success' ? 'Delivered' : 'Failed',
                        sent_ref_id: null,
                        sent_ref_id2: null,
                        status_info: res[i].response
                    }
                })
                i = i + 1;

            })
            context.psGlobal.apiRequest(reqData, context.adminUser(userId).mode).then((resReport) => {
                message.success("Messages sent successfully");
                setLoadingWhatsappSend(false);
                addeditFormWhatsapp.resetFields();
                setVisibleWhatsappModal(false);

            }).catch(err => {
                message.error(err);
                setLoadingWhatsappSend(false);
            })


        }).catch(err => {
            message.error(err);
            setLoadingWhatsappSend(false);
        })
    }
    return (
        <>
            <Row gutter={16}>
                <Col className='gutter-row' xs={24} xl={5}>
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
                </Col>
                <Col className='gutter-row' xs={24} xl={19}>
                    <Row style={{ padding: '10px 10px 10px 10px', background: '#fff', verticalAlign: 'center' }}>
                        <Col span={4}> With Selected({selMembers.length})</Col>
                        <Col span={20}>

                            <Space>

                                {
                                    selMembers.length > 0 && (<><MyButton type="outlined" shape="round" onClick={onWhatsappClick}><FontAwesomeIcon icon={faMessage} /> Whatsapp </MyButton>
                                        <MyButton type="outlined" shape="round" onClick={onPrintClick}><FontAwesomeIcon icon={faPrint} /> Print</MyButton>
                                        {
                                            /*  excelData && excelData.members && (
                                             <ExcelDownloder
                                                 data={excelData}
                                                 filename={`member_list`}
                                                 type={"button"} // or type={'button'}
                                                 className="ant-btn"
                                                 style={{ borderRadius: '25px', borderColor: cyan[7], color: cyan[7] }}
                                             >
 
                                                 <i className="fa-regular fa-file-excel fs-5"></i> Excel
                                             </ExcelDownloder>
                                             ) */
                                        }
                                    </>)
                                }





                            </Space>


                        </Col>
                    </Row>

                    {
                        filterColumns.current && (<AvatarPaginatedList
                            ref={InfiniteListRef}
                            listHeading={"Members"}

                            countQuery={"select count(*) AS count from members m,member_family_details f,member_habits hb,member_horoscope hr,member_physical_attributes p,member_partner_preference mp,education_courses ec,castes cs   where m.status=1 and m.member_status='Active' and m.id=f.member_auto_id and m.id=hb.member_auto_id and m.id=hr.member_auto_id and m.id=p.member_auto_id and m.id=mp.member_auto_id and ec.id=m.educational_qualification and cs.id=m.caste " + context.psGlobal.getWhereClause(filterColumns.current, false)}


                            listQuery={"select m.*,row_number() OVER (ORDER BY created_date desc) as row_number,ROUND(DATE_FORMAT(FROM_DAYS(DATEDIFF(now(),dob)), '%Y')) AS age,COALESCE((SELECT package_price FROM orders where member_auto_id=m.id  and order_status='Paid' and is_current_plan=1 limit 1),0) as paid_amount,ec.course_name,cs.caste_name,f.father_status,f.father_occupation,f.mother_status,f.mother_occupation,f.brothers,f.brothers_married,f.sisters,f.sisters_married,f.family_type,f.dowry_jewels,f.dowry_property,f.dowry_cash,hb.eating_habits,hb.drinking_habits,hb.smoking_habits,hr.star,hr.patham,hr.raasi,hr.laknam,hr.birth_time,hr.birth_place,hr.dhosam_type,hr.jadhagam_type,hr.raasi_chart,hr.amsam_chart,hr.dasa,hr.dasa_year,hr.dasa_month,hr.dasa_days,p.height,p.weight,p.body_type,p.complexion,p.physical_status,p.physical_status_description,mp.prefered_eating_habits,mp.prefered_smoking_habits,mp.prefered_drinking_habits,mp.prefered_martial_status,CONCAT(mp.age_from,',',mp.age_to) as pref_age,CONCAT(mp.height_from,',',mp.height_to) as pref_height,CONCAT(mp.weight_from,',',mp.weight_to) as pref_weight,mp.prefered_physical_status,mp.prefered_mother_tongue,mp.prefered_religion,mp.prefered_caste,mp.prefered_education,mp.prefered_job_type,mp.prefered_job,mp.prefered_country,mp.prefered_state,mp.prefered_district,CONCAT(mp.income_from,',',mp.income_to) as pref_income,mp.expectation_notes from members m,member_family_details f,member_habits hb,member_horoscope hr,member_physical_attributes p,member_partner_preference mp,education_courses ec,castes cs  CROSS JOIN (SELECT @rownum:={rowNumberVar}) crsj  where m.status=1 and m.member_status='Active' and m.id=f.member_auto_id and m.id=hb.member_auto_id and m.id=hr.member_auto_id and m.id=p.member_auto_id  and m.id=mp.member_auto_id and ec.id=m.educational_qualification and cs.id=m.caste " + context.psGlobal.getWhereClause(filterColumns.current, false) + "  order by created_date desc"}
                            recordsPerRequestOrPage={100}
                            encryptFields={['mobile_no', 'mobile_alt_no_1', 'mobile_alt_no_2', 'whatsapp_no']}
                            userId={userId}
                            refresh={refreshList}
                            isCheckboxList={true}
                            onCheckedChange={onCheckedChange}
                            onPageChange={onListPageChange}
                            renderItem={(item, index) => {
                                return <>
                                    <Row key={item.id} style={{ borderBottom: '1px solid', borderColor: cyan[7], background: '#fff', paddingTop: '10px' }}>
                                        <Col span={3}>
                                            <Row>
                                                <Col span={12} style={{ paddingLeft: '10px' }}></Col>
                                                <Col span={12}>{index + 1}</Col>
                                            </Row>
                                            <Row>
                                                <Avatar size={100} shape="circle" src={<Image
                                                    width={100}
                                                    src={item.photo ? baseUrl + item.photo : item.gender === 'Male' ? context.noMale : context.noFemale}
                                                    fallback={noImg}
                                                />} />
                                            </Row>
                                        </Col>
                                        <Col span={21}>
                                            <Row style={{ paddingBottom: '5px' }}>
                                                <Col span={9}> <span style={{ fontSize: '15px', fontWeight: 'bold' }}>{item.name}, {item.age} Yrs</span>

                                                </Col>
                                                <Col span={9}>
                                                    {item.member_status === 'Active' ?
                                                        <Tag color="green" style={{ fontWeight: 'bold', width: '80px' }}><FontAwesomeIcon icon={faUser} style={{ color: green[6] }} /> &nbsp;Active</Tag>
                                                        : <Tag color="red" style={{ fontWeight: 'bold', width: '80px' }}><FontAwesomeIcon icon={faUser} style={{ color: red[6] }} /> &nbsp;Waiting</Tag>}
                                                    <Tag color="cyan" style={{ fontWeight: 'bold' }}>{item.member_id}</Tag>
                                                </Col>
                                                <Col span={6}>
                                                    <Space >


                                                        <MyButton type="outlined" size="small" shape="circle"
                                                            onClick={() => onViewClick(item)}
                                                        ><i class="fa-solid fa-eye"></i></MyButton>
                                                        {
                                                            context.isAdminResourcePermit(userId, 'matrimony-members.edit-member') && (<MyButton type="outlined" size="small" shape="circle" color={blue[7]}
                                                                onClick={() => onEditClick(item)}
                                                            ><i class="fa-solid fa-pencil"></i></MyButton>)
                                                        }

                                                    </Space>
                                                </Col>


                                            </Row>
                                            <Row>
                                                <Col span={9}>
                                                    <div>
                                                        Marital Status : <span style={{ color: cyan[6], fontWeight: 'bold' }}>{item.marital_status}</span><br />
                                                        Qualification &nbsp;&nbsp;: <span style={{ color: cyan[6], fontWeight: 'bold' }}>{item.course_name}</span><br />
                                                        <span style={{ color: cyan[6], fontWeight: 'bold' }}><i class="fa-solid fa-location-dot"></i> {item.district}, {item.state}, {item.country}</span>

                                                    </div>
                                                </Col>
                                                <Col span={9}>
                                                    <div>
                                                        Caste :  <span style={{ color: cyan[6], fontWeight: 'bold' }}>{item.caste_name}</span><br />


                                                        Religion :  <span style={{ color: cyan[6], fontWeight: 'bold' }}>{item.religion}</span><br />
                                                        Job :  <span style={{ color: cyan[6], fontWeight: 'bold' }}>{item.job_type ? item.job_type + "/" : '' + item.job_name}</span>
                                                    </div>

                                                </Col>
                                                <Col span={6}>
                                                    <Space direction='vertical'>

                                                        {parseInt(item.is_otp_verified) === 1 ?
                                                            <Tag color="green" style={{ fontWeight: 'bold', width: '100px' }}><FontAwesomeIcon icon={faMobileAlt} style={{ color: green[6] }} /> &nbsp;Verified</Tag>
                                                            : <Tag color="red" style={{ fontWeight: 'bold', width: '100px' }}><FontAwesomeIcon icon={faMobileAlt} style={{ color: red[6] }} /> &nbsp;Not Verified</Tag>}
                                                        {parseInt(item.is_email_verified) === 1 ?
                                                            <Tag color="green" style={{ fontWeight: 'bold', width: '100px' }}><FontAwesomeIcon icon={faEnvelope} style={{ color: green[6] }} /> &nbsp;Verified</Tag>
                                                            : <Tag color="red" style={{ fontWeight: 'bold', width: '100px' }}><FontAwesomeIcon icon={faEnvelope} style={{ color: red[6] }} /> &nbsp;Not Verified</Tag>}

                                                        {parseFloat(item.paid_amount) !== 0 ?
                                                            <Tag color="green" style={{ fontWeight: 'bold', width: '100px' }}><FontAwesomeIcon icon={faIndianRupeeSign} style={{ color: green[6] }} /> &nbsp;{item.paid_amount}</Tag>
                                                            : <Tag color="red" style={{ fontWeight: 'bold', width: '100px' }}><FontAwesomeIcon icon={faIndianRupeeSign} style={{ color: red[6] }} /> &nbsp;Unpaid</Tag>
                                                        }
                                                    </Space>
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                </>
                            }}
                        />)
                    }
                </Col>
            </Row>
            {

            }
            <ProfileViewPrint
                allData={allData}
                selMembers={selMembers}

                memberData={printData} //to be removed
                business={selBusiness}
                language={printLanguage}
                isContact={isPrintContact}
                isPhoto={isPrintPhoto}
            />
            <PostalPrint
                allData={allData}
                selMembers={selMembers}
                memberData={printData}
                business={selBusiness}
                language={printLanguage}
                isContact={isPrintContact}
            />
            <PhotoPrint
                allData={allData}
                selMembers={selMembers}

                memberData={printData}
                business={selBusiness}
                language={printLanguage}
                isContact={isPrintContact}
            />
            <ShortLinePrint
                allData={allData}
                selMembers={selMembers}
                memberData={printData}
                business={selBusiness}
                language={printLanguage}
                isContact={isPrintContact}
                isPhoto={isPrintPhoto}

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
                    form={printForm}
                    labelAlign="left"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 20 }}
                    initialValues={{ remember: true }}
                    onFinish={formPrintOnFinish}
                    autoComplete="off"
                >

                    <FormItem
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
                            <Select.Option value="profile-view">Profile View</Select.Option>
                            <Select.Option value="postal">Postal</Select.Option>
                            <Select.Option value="short-line">Short Line</Select.Option>
                            <Select.Option value="print-photo">Photo Print</Select.Option>
                        </Select>
                    </FormItem>

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
                    <FormItem
                        label="Print Contact"
                        name="print_contact"
                        onChange={(e) => printForm.setFieldsValue({ print_contact: e.target.checked })}

                    >
                        <Checkbox />

                    </FormItem>
                    <FormItem
                        label="Print Photo"
                        name="print_photo"
                        onChange={(e) => printForm.setFieldsValue({ print_photo: e.target.checked })}

                    >
                        <Checkbox />

                    </FormItem>

                    <FormItem
                        label="For Member"
                        name="member_id"
                    // rules={[{ required: true, message: "Please Enter Member Name" }]}
                    >

                        <Input onChange={onMemberIdChange} />
                    </FormItem>
                    {
                        printingForMemberData && (<Row>
                            <Col className="gutter-row" xs={24} xl={8}>
                                <Avatar
                                    size={120}
                                    shape="circle"
                                    src={
                                        <Image
                                            width={100}
                                            src={printingForMemberData.photo ? context.baseUrl + printingForMemberData.photo : printingForMemberData.gender === 'Male' ? context.noMale : context.noFemale}
                                            fallback={context.noImg}
                                        />
                                    }
                                />
                            </Col>
                            <Col className="gutter-row" xs={24} xl={9}>
                                <span style={{ fontWeight: "bold", fontSize: "14px" }}>
                                    {" "}
                                    {printingForMemberData.name}
                                </span>
                                <br />
                                <br />
                                <Tag style={{ color: cyan[6], fontWeight: "bold", fontSize: "14px" }}> {printingForMemberData.marital_status}</Tag>
                                <br />
                                <br />
                                <span style={{ color: cyan[6], fontWeight: "bold", margin: "10px 0px 10px 0px", fontSize: "14px" }}>
                                    {printingForMemberData.education_detail}
                                </span>
                                <br />

                            </Col>
                        </Row>)
                    }
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


            <Modal
                visible={visibleWhatsappModal}
                zIndex={999}
                footer={null}
                centered={false}
                closable={true}
                style={{ marginTop: '20px' }}
                width={600}
                // footer={null}
                onCancel={() => { setVisibleWhatsappModal(false) }}
                title={<span style={{ color: green[4] }} ><FontAwesomeIcon icon={faMessage} /> Send Whatsapp to Members</span>}
            >
                <Form
                    name="whatsappform"
                    form={addeditFormWhatsapp}
                    labelAlign="left"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 20 }}
                    initialValues={{ remember: true }}
                    onFinish={addeditFormWhatsappOnFinish}
                    autoComplete="off"
                >

                    <FormItem
                        label="Image"
                        name='image'
                    //  rules={[{ required: true, message: 'Please Enter Image' }]}
                    >

                        <ImageUpload
                            // defaultImage={defaultValue}
                            storeFileName={'public/whatsapp_images/' + new Date().valueOf() + '.jpg'}
                            onFinish={(fileName) => addeditFormWhatsapp.setFieldsValue({ image: fileName })}
                        />
                    </FormItem>
                    <FormItem
                        label="Message"
                        name="message"
                        rules={[{ required: true, message: 'Please Enter Message' }]}
                    >
                        <Input.TextArea rows={3} placeholder="Msg" />
                    </FormItem>



                    <FormItem wrapperCol={{ offset: 10, span: 24 }}>
                        <Space>
                            <Button size="large" type="outlined" onClick={() => { addeditFormWhatsapp.resetFields(); setVisibleWhatsappModal(false); }}>
                                Cancel
                            </Button>
                            <MyButton size="large" type="primary" loading={loadingWhatsappSend} htmlType="submit">
                                Send Whatsapp
                            </MyButton>
                        </Space>

                    </FormItem>

                </Form>
            </Modal>
        </>
    );

}
export default ListMemberComponent;