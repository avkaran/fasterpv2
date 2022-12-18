import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Col, message, Space } from 'antd';
import { Button, Card } from 'antd';
import { Form, Input, Select, InputNumber, Radio, Checkbox, DatePicker, TimePicker } from 'antd';
import { Breadcrumb, Layout, Spin } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import PsContext from '../../../../../context';
import { Editor } from '@tinymce/tinymce-react';
import { ImageUpload, FormItem, MyButton } from '../../../../../comp';
import { capitalizeFirst } from '../../../../../utils';
import { CountryDropdown, RegionDropdown } from 'react-country-region-selector';
import PhoneInput from 'react-phone-input-2'
import dayjs from 'dayjs';
import { green, red, cyan, grey } from '@ant-design/colors';
import { LoadingOutlined } from '@ant-design/icons';
import { heightList } from '../../../../../models/core'
const AddEditMember = (props) => {
    const context = useContext(PsContext);
    const navigate = useNavigate();
    const [addeditFormMember] = Form.useForm();
    const [loader, setLoader] = useState(false);
    const [curAction, setCurAction] = useState('add');
    const [editData, setEditData] = useState(null);
    const [heading] = useState('Member');
    const { editIdOrObject, onListClick, onSaveFinish, userId, inputFields, preFilledValues, ...other } = props;
    const [editId, setEditId] = useState(null);
    const [country, setCountry] = useState('India');
    const [districts, setDistricts] = useState([]);
    const [districtLoading, setDistrictLoading] = useState(false);

    const [jobCountry, setJobCountry] = useState('India');
    const [jobDistricts, setJobDistricts] = useState([]);
    const [jobDistrictLoading, setJobDistrictLoading] = useState(false);

    const [preferedCountry, setPreferedCountry] = useState('India');
    const [preferedDistricts, setPreferedDistricts] = useState([]);
    const [preferedDistrictLoading, setPreferedDistrictLoading] = useState(false)

    const [casteList, setCasteList] = useState([]);
    const [casteLoader, setCasteLoader] = useState(false);
    const [subCasteList, setSubCasteList] = useState([]);
    const [subCasteLoader, setSubCasteLoader] = useState(false);
    const [educationList, setEducationList] = useState([]);
    const [preferedCasteList, setPreferedCasteList] = useState([]);
    const [preferedCasteLoader, setPreferedCasteLoader] = useState(false);
    const [visibleChildrenOptions, setvisibleChildrenOptions] = useState(false);
    const [visibleHomeMappillai, setVisibleHomeMappillai] = useState(false);
    const [selDob, setSelDob] = useState(dayjs().subtract(18, "years"))
    useEffect(() => {
        loadEducation();
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
            onStateChange("Tamil Nadu");
            addeditFormMember.setFieldsValue({
                members: {
                    country: 'India',
                    state: 'Tamil Nadu',
                    willing_to_home_mappilai: "0",
                    is_protect_photo: '0',

                },
                member_family_details: {
                    father_status: "1",
                    mother_status: "1"
                }
            })

            if (preFilledValues && Array.isArray(preFilledValues)) {
                preFilledValues.forEach(item => {
                    addeditFormMember.setFieldsValue({
                        [item.table]: { [item.field]: item.value }
                    })
                })
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const loadEditData = (id) => {
        setLoader(true);
        var reqData = {
            query_type: 'query',
            query: "SELECT m.member_created_for,m.name,m.father_name,m.mother_name,m.gender,m.dob,m.marital_status,m.no_of_children,m.children_living_status,m.country,m.state,m.district,m.door_no,m.street,m.area,m.taluk,m.landmark,m.pincode,m.mobile_no,m.mobile_alt_no_1,m.mobile_alt_no_2,m.whatsapp_no,m.email,m.aadhaar_no,m.caste,m.sub_caste,m.caste_detail,m.religion,m.mother_tongue,m.languages_known,m.gothra,m.kuladeivam,m.poorveegam,m.residence_type,m.willing_to_home_mappilai,m.about_profile,m.educational_qualification,m.education_detail,m.job_type,m.job_name,m.job_detail,m.job_country,m.job_state,m.job_district,m.job_area,m.job_annual_income,m.member_status,m.status_reason from members m where m.status=1 and m.id=" + id
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

        inputFields.forEach(field => {
            var splitFields = field.split(".");
            var tableName = splitFields[0];
            var fieldName = splitFields[1];
            var fieldValue = mydata[fieldName];
            if (fieldValue) fieldValue = fieldValue.toString()

            if (fieldName === "dob") {
                fieldValue = dayjs(mydata['dob'], "YYYY-MM-DD");
                setSelDob(dayjs(mydata['dob'], "YYYY-MM-DD"));
            }

            if (fieldName === "password")
                fieldValue = context.psGlobal.decrypt(mydata['password']);
            if (fieldName === "country")
                setCountry(mydata['country'])
            if (fieldName === "state") {
                LoadDistrict(mydata['country'], mydata['state']).then(res => {
                    setDistricts(res);
                }).catch(err => {
                    message.error(err);

                })
            }
            if (fieldName === "job_country")
                setJobCountry(mydata['job_country'])
            if (fieldName === "job_state") {
                LoadDistrict(mydata['job_country'], mydata['job_state']).then(res => {
                    setJobDistricts(res);
                }).catch(err => {
                    message.error(err);

                })
            }
            if (fieldName === "religion")
                loadCastes(mydata['religion']);
            if (fieldName === "caste")
                loadSubCastes(mydata['caste'])


            if (fieldName === "mobile_no") {
                fieldValue = context.psGlobal.decrypt(mydata['mobile_no']);
            }
            if (fieldName === "mobile_alt_no_1")
                fieldValue = mydata['mobile_alt_no_1'] ? context.psGlobal.decrypt(mydata['mobile_alt_no_1']) : '';

            if (fieldName === "mobile_alt_no_2")
                fieldValue = mydata['mobile_alt_no_2'] ? context.psGlobal.decrypt(mydata['mobile_alt_no_2']) : '';
            if (fieldName === "whatsapp_no")
                fieldValue = mydata['whatsapp_no'] ? context.psGlobal.decrypt(mydata['whatsapp_no']) : '';

            if (fieldName === "raasi_chart") {
                var raasiValues = new Array(12).fill(false);
                if (mydata['raasi_chart']) {
                    raasiValues = mydata['raasi_chart'].split("##");
                    raasiValues = raasiValues.map(rValue => {
                        if (rValue)
                            return rValue.split(",");
                        else
                            return undefined;
                    })
                }

                fieldValue = raasiValues;

            }

            if (fieldName === "amsam_chart") {
                var amsamValues = new Array(12).fill(false);
                if (mydata['amsam_chart']) {
                    amsamValues = mydata['amsam_chart'].split("##");
                    amsamValues = amsamValues.map(rValue => {
                        if (rValue)
                            return rValue.split(",");
                        else
                            return undefined;
                    })
                }

                fieldValue = amsamValues;

            }
            if (fieldName === "prefered_martial_status" &&  mydata['prefered_martial_status'])
                fieldValue = mydata['prefered_martial_status'].split(",")
            if (fieldName === "prefered_mother_tongue" &&  mydata['prefered_mother_tongue'])
                fieldValue = mydata['prefered_mother_tongue'].split(",")
            if (fieldName === "prefered_religion" && mydata['prefered_religion']) {
                fieldValue = mydata['prefered_religion'].split(",")
                loadPreferedCastes(mydata['prefered_religion'].split(","));
            }
            if (fieldName === "prefered_caste" &&  mydata['prefered_caste'])
                fieldValue = mydata['prefered_caste'].split(",")
            if (fieldName === "prefered_education" && mydata['prefered_education'])
                fieldValue = mydata['prefered_education'].split(",")
            if (fieldName === "prefered_job_type" && mydata['prefered_job_type'])
                fieldValue = mydata['prefered_job_type'].split(",")
            if (fieldName === "prefered_job" && mydata['prefered_job'])
                fieldValue = mydata['prefered_job'].split(",")

            if (fieldName === "prefered_country" && mydata['prefered_country'])
                setPreferedCountry(mydata['prefered_country'])
            if (fieldName === "prefered_state" && mydata['prefered_country']) {
                LoadDistrict(mydata['prefered_country'], mydata['prefered_state']).then(res => {
                    setPreferedDistricts(res);
                }).catch(err => {
                    message.error(err);

                })
            }
            
            if (fieldName === "prefered_district" && mydata['prefered_district'])
            fieldValue = mydata['prefered_district'].split(",")
            //set fieldvalues partner preference for age,height,weight,income
            if (tableName ==='member_partner_preference' && (fieldName === "age" || fieldName === "height" || fieldName === "weight" || fieldName === "income")) {
                if (fieldName === "age" && mydata['pref_age'])
                addeditFormMember.setFieldsValue({[tableName]: { age:  mydata['pref_age'].split(",") } })
                if (fieldName === "height" &&  mydata['pref_height'])
                addeditFormMember.setFieldsValue({[tableName]: { height:  mydata['pref_height'].split(",") } })
                if (fieldName === "weight" && mydata['pref_weight'])
                addeditFormMember.setFieldsValue({[tableName]: { weight:  mydata['pref_weight'].split(",") } })
                if (fieldName === "income" && mydata['pref_income'])
                addeditFormMember.setFieldsValue({[tableName]: { income:  mydata['pref_income'].split(",") } })
              
            }
            else{
                addeditFormMember.setFieldsValue({
                    [tableName]: { [fieldName]: fieldValue }
                })

            }
        })
    }
    const addeditFormMemberOnFinish = (values) => {
        setLoader(true);
        var processedValues = {};
        if (values.members) {
            Object.entries(values.members).forEach(([key, value]) => {
                if (value) {
                    processedValues[key] = value.toString();
                }
            });
        }
        if (values.members) {
            if (values.members.dob)
                processedValues['dob'] = selDob.format('YYYY-MM-DD');
            if (processedValues['password'])
                processedValues['password'] = context.psGlobal.encrypt(processedValues['password']);
            if (values.members.photo)
                processedValues['is_photo_updated'] = '1';
            if (values.members.languages_known)
                processedValues['languages_known'] = values.members.languages_known.join(",");
        }
      
        //family details 
        var FamilyProcessedValues = {};
        if (values.member_family_details) {
            Object.entries(values.member_family_details).forEach(([key, value]) => {
                if (value) {
                    FamilyProcessedValues[key] = value.toString();
                }
            });
        }
        //habits 
        var HabbitsProcessedValues = {};
        if (values.member_habits) {
            Object.entries(values.member_habits).forEach(([key, value]) => {
                if (value) {
                    HabbitsProcessedValues[key] = value.toString();
                }
            });
        }
        //physical 
        var PhysicalProcessedValues = {};
        if (values.member_physical_attributes) {
            Object.entries(values.member_physical_attributes).forEach(([key, value]) => {
                if (value) {
                    PhysicalProcessedValues[key] = value.toString();
                }
            });
        }
        //horoscope 
        var HoroscopeProcessedValues = {};
        if (values.member_horoscope) {
            Object.entries(values.member_horoscope).forEach(([key, value]) => {
                if (value) {
                    HoroscopeProcessedValues[key] = value.toString();
                }
            });
        }
        if (values.member_horoscope && values.member_horoscope.raasi_chart) {
            var commaSeparatedRaasiValues = [];
            values.member_horoscope.raasi_chart.forEach(cInput => {
                if (cInput) {
                    if (Array.isArray(cInput))
                        commaSeparatedRaasiValues.push(cInput.join(","))
                    else
                        commaSeparatedRaasiValues.push(cInput.toString())
                }
                else
                    commaSeparatedRaasiValues.push('')

            })
            HoroscopeProcessedValues['raasi_chart'] = commaSeparatedRaasiValues.join("##");
        }
        if (values.member_horoscope && values.member_horoscope.amsam_chart) {
            var commaSeparatedAmsamValues = [];
            values.member_horoscope.amsam_chart.forEach(cInput => {
                if (cInput) {
                    if (Array.isArray(cInput))
                        commaSeparatedAmsamValues.push(cInput.join(","))
                    else
                        commaSeparatedAmsamValues.push(cInput.toString())
                }
                else
                    commaSeparatedAmsamValues.push('')
            })
            HoroscopeProcessedValues['amsam_chart'] = commaSeparatedAmsamValues.join("##");
        }
        //Partner preference 
        var PartnerProcessedValues = {};
        if (values.member_partner_preference) {
            Object.entries(values.member_partner_preference).forEach(([key, value]) => {
                // console.log("-+"+key+"+-")
                if (value && (key !== "age" && key !== "height" && key !== "weight" && key !== "income")) {
                    // console.log("+"+key+"+")
                    if (Array.isArray(value))
                        PartnerProcessedValues[key] = value.join(",");
                    else
                        PartnerProcessedValues[key] = value.toString();

                }
            });

            if (values.member_partner_preference.age && values.member_partner_preference.age[0])
                PartnerProcessedValues['age_from'] = values.member_partner_preference.age[0]
            if (values.member_partner_preference.age && values.member_partner_preference.age[1])
                PartnerProcessedValues['age_to'] = values.member_partner_preference.age[1]




            if (values.member_partner_preference.height && values.member_partner_preference.height[0])
                PartnerProcessedValues['height_from'] = values.member_partner_preference.height[0]
            if (values.member_partner_preference.height && values.member_partner_preference.height[1])
                PartnerProcessedValues['height_to'] = values.member_partner_preference.height[1]



            if (values.member_partner_preference.weight && values.member_partner_preference.weight[0])
                PartnerProcessedValues['weight_from'] = values.member_partner_preference.weight[0]
            if (values.member_partner_preference.weight && values.member_partner_preference.weight[1])
                PartnerProcessedValues['weight_to'] = values.member_partner_preference.weight[1]

            if (values.member_partner_preference.income && values.member_partner_preference.income[0])
                PartnerProcessedValues['income_from'] = values.member_partner_preference.income[0]
            if (values.member_partner_preference.income && values.member_partner_preference.income[1])
                PartnerProcessedValues['income_to'] = values.member_partner_preference.income[1]
            console.log('partner', PartnerProcessedValues)
        }

        if (curAction === "add") {
            processedValues['member_created_by'] = context.adminUser(userId).role;
            processedValues['member_created_ref_id'] = context.adminUser(userId).ref_id2;
            processedValues['member_status'] = 'Active';
            processedValues['is_basic_updated'] = '1';
            var reqDataInsert = {
                query_type: 'insert',
                table: 'members',
                values: processedValues
            };
            context.psGlobal.apiRequest(reqDataInsert, context.adminUser(userId).mode).then((res) => {
                var createdId = res;
                var padMemberId = 'RM' + createdId.padStart(9, '0');
                var reqDataInner = [{
                    query_type: 'update',
                    table: 'members',
                    where: { id: createdId },
                    values: { member_id: padMemberId }
                }];
                FamilyProcessedValues['member_auto_id'] = createdId;
                FamilyProcessedValues['member_id'] = padMemberId;
                reqDataInner.push({
                    query_type: 'insert',
                    table: 'member_family_details',
                    values: FamilyProcessedValues
                }
                )
                HabbitsProcessedValues['member_auto_id'] = createdId;
                HabbitsProcessedValues['member_id'] = padMemberId;
                reqDataInner.push({
                    query_type: 'insert',
                    table: 'member_habits',
                    values: HabbitsProcessedValues
                }
                )
                PhysicalProcessedValues['member_auto_id'] = createdId;
                PhysicalProcessedValues['member_id'] = padMemberId;
                reqDataInner.push({
                    query_type: 'insert',
                    table: 'member_physical_attributes',
                    values: PhysicalProcessedValues
                }
                )

                HoroscopeProcessedValues['member_auto_id'] = createdId;
                HoroscopeProcessedValues['member_id'] = padMemberId;
                reqDataInner.push({
                    query_type: 'insert',
                    table: 'member_horoscope',
                    values: HoroscopeProcessedValues
                }
                )

                PartnerProcessedValues['member_auto_id'] = createdId;
                PartnerProcessedValues['member_id'] = padMemberId;

                reqDataInner.push({
                    query_type: 'insert',
                    table: 'member_partner_preference',
                    values: PartnerProcessedValues
                }
                )
                context.psGlobal.apiRequest(reqDataInner, context.adminUser(userId).mode).then((resInner) => {
                    context.psGlobal.addLog({
                        log_name:'add-new-member',
                        logged_type:context.adminUser(userId).role,
                        logged_by:context.adminUser(userId).id,
                        ref_table_column:'members.id',
                        ref_id:createdId,
                        ref_id2:padMemberId,
                        description:'New Member Added ' + padMemberId
                    }).then(logRes=>{
                        setLoader(false);
                        addeditFormMember.resetFields();
                        message.success(padMemberId + ' Member Added Successfully ');
                        onSaveFinish();
                    })
                   
                    //reset form after added

                }).catch(errInner => {
                    message.error(errInner);
                    setLoader(false);
                })

            }).catch(err => {
                message.error(err);
                setLoader(false);
            })
        } else if (curAction === "edit") {
            var reqDataUpdate = [];
            if (values.members) {
                reqDataUpdate.push({
                    query_type: 'update',
                    table: 'members',
                    where: { id: editId },
                    values: processedValues

                })
            }
            if (values.member_family_details) {
                reqDataUpdate.push({
                    query_type: 'update',
                    table: 'member_family_details',
                    where: { member_auto_id: editId },
                    values: FamilyProcessedValues

                })
            }
            if (values.member_habits) {
                reqDataUpdate.push({
                    query_type: 'update',
                    table: 'member_habits',
                    where: { member_auto_id: editId },
                    values: HabbitsProcessedValues

                })
            }
            if (values.member_physical_attributes) {
                reqDataUpdate.push({
                    query_type: 'update',
                    table: 'member_physical_attributes',
                    where: { member_auto_id: editId },
                    values: PhysicalProcessedValues

                })
            }
            if (values.member_horoscope) {
                reqDataUpdate.push({
                    query_type: 'update',
                    table: 'member_horoscope',
                    where: { member_auto_id: editId },
                    values: HoroscopeProcessedValues

                })
            }
            if (values.member_partner_preference) {
                reqDataUpdate.push({
                    query_type: 'update',
                    table: 'member_partner_preference',
                    where: { member_auto_id: editId },
                    values: PartnerProcessedValues

                })
            }

            context.psGlobal.apiRequest(reqDataUpdate, context.adminUser(userId).mode).then((res) => {
                context.psGlobal.addLog({
                    log_name:'edit-member',
                    logged_type:context.adminUser(userId).role,
                    logged_by:context.adminUser(userId).id,
                    ref_table_column:'members.id',
                    ref_id:editId,
                    ref_id2:editData.member_id,
                    description:'Member Edited ' + editData.member_id
                }).then(logRes=>{
                    setLoader(false);
                    message.success(heading + ' Saved Successfullly');
                    onSaveFinish();
                })
                if(values.members && values.members.photo){
                    context.psGlobal.addLog({
                        log_name:'upload-photo',
                        logged_type:context.adminUser(userId).role,
                        logged_by:context.adminUser(userId).id,
                        ref_table_column:'members.id',
                        ref_id:editId,
                        ref_id2:editData.member_id,
                        description:'Photo updated for ' + editData.member_id
                    })
                }
              

            }).catch(err => {
                message.error(err);
                setLoader(false);
            })
        }
    };
    const dobDisabled = (current) => {
        // Can not select days before today and today
        return current && current > dayjs().subtract(18, "years");
    };
    const dobOnChange = (date) => {
        //  console.log('dchange', date)
        setSelDob(date);
        addeditFormMember.setFieldsValue({
            members: { dob: dayjs(date).format('YYYY-MM-DD') }
        })

    };
    const LoadDistrict = async (country, state) => {

        return new Promise((resolve, reject) => {
            var reqData = {
                query_type: 'query', //query_type=insert | update | delete | query
                query: "select district_name from districts where status=1 and country='" + country + "' and state='" + state + "'"
            };


            context.psGlobal.apiRequest(reqData, context.adminUser(userId).mode).then((res) => {
                resolve(res);
            }).catch(err => {
                reject(err);
            })
        })
    }
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
    const loadPreferedCastes = (regliionsArray) => {
        setPreferedCasteLoader(true);
        var reqData =
        {
            query_type: 'query',
            query: "select id,religion,caste_name from castes where religion in('" + regliionsArray.join("','") + "') and master_caste_id is null order by religion"
        }
        context.psGlobal.apiRequest(reqData, context.adminUser(userId).mode).then((res) => {
            setPreferedCasteList(res);
            setPreferedCasteLoader(false);
        }).catch(err => {
            message.error(err);
            setPreferedCasteLoader(false);
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
    const loadSubCastes = (master_caste_id) => {
        setSubCasteLoader(true);
        var reqData =
        {
            query_type: 'query',
            query: "select id,caste_name from castes where master_caste_id=" + master_caste_id
        }

        context.psGlobal.apiRequest(reqData, context.adminUser(userId).mode).then((res) => {

            setSubCasteList(res);
            setSubCasteLoader(false);
        }).catch(err => {
            message.error(err);
            setSubCasteLoader(false);
        })
    }
    const getEducationOptions = () => {
        if (educationList) {
            var options = [];
            var eduGroups = educationList.filter(obj => obj.master_course_id === null);
            eduGroups.forEach(obj => {
                var subOptions = [];
                var subCourses = educationList.filter(item => item.master_course_id === obj.id);
                subCourses.forEach(item => {
                    subOptions.push(<Select.Option value={item.id}>{item.course_name}</Select.Option>)
                })
                options.push(<Select.OptGroup label={<span style={{ color: green[7], fontWeight: 'bold' }}>{obj.course_name}</span>}>{subOptions}</Select.OptGroup>)
            })
            return options;
        }
    }
    const getWeightList = () => {

        let options = [];
        for (var index = 35; index <= 70; index++) {
            options.push(<Select.Option key={index.toString()} value={index.toString()}>{index.toString()} Kg</Select.Option>)
        }
        return options;
    };
    const getChildrenOptions = () => {
        let options = [];
        for (var index = 0; index <= 6; index++) {
            options.push(<Select.Option key={index} value={index}>{index} Nos.</Select.Option>)
        }
        return options;
    }
    const onStateChange = (value) => {
        setDistrictLoading(true);
        LoadDistrict(country, value).then(res => {
            setDistricts(res);
            setDistrictLoading(false);
            addeditFormMember.setFieldsValue({
                members: { district: '' }
            })
        }).catch(err => {
            message.error(err);
            setDistrictLoading(false);
        })
    }
    const onJobStateChange = (value) => {
        setJobDistrictLoading(true);
        LoadDistrict(jobCountry, value).then(res => {
            setJobDistricts(res);
            setJobDistrictLoading(false);
            addeditFormMember.setFieldsValue({
                members: { job_district: '' }
            })
        }).catch(err => {
            message.error(err);
            setJobDistrictLoading(false);
        })
    }
    const onPreferedStateChange = (value) => {
        setPreferedDistrictLoading(true);
        LoadDistrict(preferedCountry, value).then(res => {
            setPreferedDistricts(res);
            setPreferedDistrictLoading(false);
            addeditFormMember.setFieldsValue({
                member_partner_preference: { prefered_district: '' }
            })
        }).catch(err => {
            message.error(err);
            setPreferedDistrictLoading(false);
        })
    }
    const getAge = () => {
        var ages = [];
        for (var i = 18; i < 80; i++) {
            ages.push(<Select.Option value={i}>{i} Years</Select.Option>)
        }
        return ages;
    }
    const getChartInputs = (type) => {
        var inputs = [];
        for (var i = 0; i < 12; i++) {
            inputs.push(<FormItem
                // label="Member Created_for"
                name={['member_horoscope', type + "_chart", i]}
            // rules={[{ required: true, message: 'Please Enter Member Created_for' }]}
            >

                <Select
                    placeholder={i + 1}

                    mode="multiple"
                    style={{
                        width: '100%',

                    }}
                    optionLabelProp="label"
                //onChange={languagesKnownOnChange}
                >
                    {context.psGlobal.collectionOptions(context.psGlobal.collectionData, 'planets')}
                </Select>
            </FormItem>)
        }

        return <table border="0" style={{ width: '100%', height: '400px', border: "1px solid", textAlign: 'center', verticalAlign: 'center' }}>
            <tr>
                <td style={{ width: '25%' }}>{inputs[12 - 1]}</td>
                <td style={{ width: '25%' }}>{inputs[1 - 1]}</td>
                <td style={{ width: '25%' }}>{inputs[2 - 1]}</td>
                <td style={{ width: '25%' }}>{inputs[3 - 1]}</td>
            </tr>
            <tr>
                <td >{inputs[11 - 1]}</td>
                <td colspan="2" rowspan="2" style={{ textAlign: 'center', border: "1px solid" }}><h2>{context.psGlobal.capitalizeFirst(type)}</h2></td>
                <td>{inputs[4 - 1]}</td>
            </tr>
            <tr>
                <td>{inputs[10 - 1]}</td>

                <td>{inputs[5 - 1]}</td>
            </tr>
            <tr>
                <td>{inputs[9 - 1]}</td>
                <td>{inputs[8 - 1]}</td>
                <td>{inputs[7 - 1]}</td>
                <td>{inputs[6 - 1]}</td>
            </tr>
        </table>
    }
    const formItems = [
        {
            table: "members",
            field: "member_created_for",

            formItem: <FormItem
                label="Member Created_for"
                name={['members', 'member_created_for']}
                rules={[{ required: true, message: 'Please Enter Member Created_for' }]}
            >

                <Select
                    showSearch
                    placeholder="Member Created_for"

                    optionFilterProp="children"
                    //onChange={memberCreated_forOnChange}
                    filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                >
                    {context.psGlobal.collectionOptions(context.psGlobal.collectionData, 'profile-created-for')}
                </Select>
            </FormItem>
        },

        {
            table: "members",
            field: 'name',

            formItem: <FormItem
                label="Name"
                name={['members', 'name']}
                rules={[{ required: true, message: 'Please Enter Name' }]}
            >
                <Input placeholder="Name" />
            </FormItem>,
        },
        {
            table: "members",
            field: 'father_name',
            formItem: <FormItem
                label="Father Name"
                name={['members', 'father_name']}
                rules={[{ required: true, message: 'Please Enter Father Name' }]}
            >
                <Input placeholder="Father Name" />
            </FormItem>,
        },
        {
            table: "members",
            field: 'mother_name',

            formItem: <FormItem
                label="Mother Name"
                name={['members', 'mother_name']}
                rules={[{ required: true, message: 'Please Enter Mother Name' }]}
            >
                <Input placeholder="Mother Name" />
            </FormItem>,
        },
        {
            table: "members",
            field: 'gender',
            formItem: <FormItem
                label="Gender"
                name={['members', 'gender']}
                rules={[{ required: true, message: 'Please Enter Gender' }]}
            >

                <Select
                    showSearch
                    placeholder="Gender"
                    onChange={(value) => { value === 'Male' ? setVisibleHomeMappillai(true) : setVisibleHomeMappillai(false) }}
                    optionFilterProp="children"
                    //onChange={genderOnChange}
                    filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                >
                    {context.psGlobal.collectionOptions(context.psGlobal.collectionData, 'gender')}
                </Select>
            </FormItem>,
        },

        {
            table: "members",
            field: 'dob',
            formItem: <FormItem
                label="Dob"
                name={['members', 'dob']}
                rules={[{ required: true, message: 'Please Enter Dob' }]}
            >

                <Space>
                    <DatePicker format='DD/MM/YYYY'
                        //defaultValue={editData ? dayjs(editData.dob, 'YYYY-MM-DD') : dayjs(dayjs().subtract(18, "years"), 'DD/MM/YYYY')}
                        onChange={dobOnChange}
                        value={selDob}
                        disabledDate={dobDisabled}
                        allowClear={false}
                    />
                </Space>

            </FormItem>,
        },
        {
            table: "members",
            field: 'photo',
            formItem: <FormItem
                label="Photo"
                name={['members', 'photo']}
            //rules={[{ required: true, message: 'Please Enter Photo' }]}
            >

                <ImageUpload
                    cropRatio="1/1"
                    //  name={name}
                    // defaultImage={defaultValue}
                   // storeFileName={editData && editData.photo ? editData.photo : 'public/uploads/' + new Date().valueOf() + '.jpg'}
                    storeFileName={ 'public/uploads/' + new Date().valueOf() + '.jpg'}
                    onFinish={(fileName) => { addeditFormMember.setFieldsValue({ members: { photo: fileName } }) }}
                />
            </FormItem>
        },
        {
            table: "members",
            field: 'is_protect_photo',
            formItem: <FormItem
                label="Is Protect Photo"
                name={['members', 'is_protect_photo']}
                rules={[{ required: true, message: 'Please Enter Is Protect Photo' }]}
            >
                <Radio.Group defaultValue="0" optionType="default" >
                    <Radio.Button key='1' value='1'>Yes</Radio.Button>
                    <Radio.Button key='0' value='0'>No</Radio.Button>
                </Radio.Group>
            </FormItem>

        },
        {
            table: "members",
            field: 'marital_status',
            formItem: <FormItem
                label="Marital Status"
                name={['members', 'marital_status']}
                rules={[{ required: true, message: 'Please Enter Marital Status' }]}
            >

                <Select
                    showSearch
                    placeholder="Marital Status"
                    onChange={(value) => { value !== 'Never Married' ? setvisibleChildrenOptions(true) : setvisibleChildrenOptions(false) }}

                    optionFilterProp="children"
                    //onChange={maritalStatusOnChange}
                    filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                >
                    {context.psGlobal.collectionOptions(context.psGlobal.collectionData, 'marital-status')}
                </Select>
            </FormItem>,
        },

        {
            table: "members",
            field: 'childrens',
            formItem: <FormItem
                label="Children"
                style={{ display: visibleChildrenOptions ? 'flex' : 'none' }}
            // name={['members', 'no_of_children']}
            //rules={[{ required: true, message: 'Please Enter No Of_children' }]}
            >
                <Input.Group>
                    <Space>
                        <Form.Item
                            // label="Childrens"
                            name={['members', 'no_of_children']}


                        //   noStyle 
                        >
                            <Select placeholder="Childrens" style={{ width: '100px' }}>
                                {getChildrenOptions()}
                            </Select>
                        </Form.Item>
                        <Form.Item
                            label="Status"
                            name={['members', 'children_living_status']}
                        // rules={[{ required: true, message: 'Enter Amount' }]}
                        // noStyle
                        >
                            <Select
                                showSearch
                                style={{ width: '150px' }}
                                placeholder="Status"

                                optionFilterProp="children"
                                //onChange={childrenLiving_statusOnChange}
                                filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                            >
                                {context.psGlobal.collectionOptions(context.psGlobal.collectionData, 'children-living-status')}
                            </Select>
                        </Form.Item>
                    </Space>
                </Input.Group>
            </FormItem>,
        },
        {
            table: "members",
            field: 'country',

            formItem: <FormItem
                label="Country"
                name={['members', 'country']}
                rules={[{ required: true, message: 'Please Enter Country' }]}
            >

                <CountryDropdown
                    className="ant-input"
                    value={country}
                    onChange={(val) => setCountry(val)} />
            </FormItem>,
        },

        {
            table: "members",
            field: 'state',
            formItem: <FormItem
                label="State"
                name={['members', 'state']}
                rules={[{ required: true, message: 'Please Enter State' }]}
            >

                <RegionDropdown
                    country={country}
                    className="ant-input"
                    // value={viewData.state}
                    onChange={onStateChange}
                //onChange={(val) => this.selectRegion(val)} 
                />
            </FormItem>,
        },

        {
            table: "members",
            field: 'district',
            formItem: <FormItem
                label="District"
                name={['members', 'district']}
                rules={[{ required: true, message: 'Please Enter District' }]}
            >
                <Select
                    showSearch
                    placeholder="District"
                    loading={districtLoading}

                    optionFilterProp="children"
                    //onChange={childrenLiving_statusOnChange}
                    filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                >
                    {
                        districts.map(district => {
                            return <Select.Option value={district.district_name}>{district.district_name}</Select.Option>

                        })
                    }
                </Select>
            </FormItem>,
        },
        {
            table: "members",
            field: 'door_no',
            formItem: <FormItem
                label="Door No"
                name={['members', 'door_no']}
                rules={[{ required: true, message: 'Please Enter Door No' }]}
            >
                <Input placeholder="Door No" />
            </FormItem>,
        },

        {
            table: "members",
            field: 'street',
            formItem: <FormItem
                label="Street"
                name={['members', 'street']}
                rules={[{ required: true, message: 'Please Enter Street' }]}
            >
                <Input placeholder="Street" />
            </FormItem>,
        },

        {
            table: "members",
            field: 'area',
            formItem: <FormItem
                label="Area"
                name={['members', 'area']}
                rules={[{ required: true, message: 'Please Enter Area' }]}
            >
                <Input placeholder="Area" />
            </FormItem>,
        },

        {
            table: "members",
            field: 'taluk',
            formItem: <FormItem
                label="Taluk"
                name={['members', 'taluk']}
               // rules={[{ required: true, message: 'Please Enter Taluk' }]}
            >
                <Input placeholder="Taluk" />
            </FormItem>,
        },

        {
            table: "members",
            field: 'landmark',
            formItem: <FormItem
                label="Landmark"
                name={['members', 'landmark']}
            //  rules={[{ required: true, message: 'Please Enter Landmark' }]}
            >
                <Input placeholder="Landmark" />
            </FormItem>,
        },

        {
            table: "members",
            field: 'pincode',
            formItem: <FormItem
                label="Pincode"
                name={['members', 'pincode']}
              //  rules={[{ required: true, message: 'Please Enter Pincode' }]}
            >
                <InputNumber placeholder="Pincode" type="number" style={{ width: '100%' }} />
            </FormItem>,
        },
        {
            table: "members",
            field: "mobile_no",
            formItem: <FormItem
                label="Mobile No"
                name={['members', 'mobile_no']}
                rules={[
                    { required: true, message: 'Please Enter Mobile No' },
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
                // disabled={getPrefilledDisabled}

                //onChange={phone => {}}
                />
            </FormItem>,
        },

        {
            table: "members",
            field: 'mobile_alt_no_1',
            formItem: <FormItem
                label="Mobile Alt_no_1"
                name={['members', 'mobile_alt_no_1']}
                rules={[
                    //  { required: true, message: 'Please Enter Mobile No' },
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
            </FormItem>,
        },

        {
            table: "members",
            field: 'mobile_alt_no_2',
            formItem: <FormItem
                label="Mobile Alt_no_2"
                name={['members', 'mobile_alt_no_2']}
                rules={[
                    //  { required: true, message: 'Please Enter Mobile No' },
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
            </FormItem>,
        },

        {
            table: "members",
            field: 'whatsapp_no',
            formItem: <FormItem
                label="Whatsapp No"
                name={['members', 'whatsapp_no']}
                rules={[
                    { required: true, message: 'Please Enter Whatsapp No' },
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
            </FormItem>,
        },

        {
            table: "members",
            field: 'email',
            formItem: <FormItem
                label="Email"
                name={['members', 'email']}
                rules={[{
                    type: 'email',
                    message: 'The input is not valid E-mail!',
                }]}
            >
                <Input placeholder="Email" />
            </FormItem>,
        },
        {
            table: "members",
            field: 'aadhaar_no',
            formItem: <FormItem
                label="Aadhaar No"
                name={['members', 'aadhaar_no']}
            // rules={[{ required: true, message: 'Please Enter Aadhaar No' }]}
            >
                <InputNumber placeholder="Aadhaar No" type="number" style={{ width: '100%' }} />
            </FormItem>,
        },
        {
            table: "members",
            field: 'religion',
            formItem: <FormItem
                label="Religion"
                name={['members', 'religion']}
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
            </FormItem>,
        },
        {
            table: "members",
            field: 'caste',
            formItem: <Spin spinning={casteLoader} indicator={<LoadingOutlined />} tip="Caste Loading"><FormItem
                label="Caste"
                name={['members', 'caste']}
                rules={[{ required: true, message: 'Please Enter Caste' }]}
            >

                <Select
                    showSearch
                    placeholder="Caste"
                    onChange={(value) => loadSubCastes(value)}
                    optionFilterProp="children"
                    //onChange={casteOnChange}
                    filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                >
                    {casteList.map(item => <Select.Option value={item.id}>{item.caste_name}</Select.Option>)}
                </Select>
            </FormItem></Spin>,
        },

        {
            table: "members",
            field: "sub_caste",
            formItem: <Spin spinning={subCasteLoader} indicator={<LoadingOutlined />} tip="SubCaste Loading"><FormItem
                label="Sub Caste"
                name={['members', 'sub_caste']}
            // rules={[{ required: true, message: 'Please Enter Sub Caste' }]}
            >
                <Select
                    showSearch
                    placeholder="Sub Caste"
                    optionFilterProp="children"
                    //onChange={casteOnChange}
                    filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                >
                    {subCasteList.map(item => <Select.Option value={item.caste_name}>{item.caste_name}</Select.Option>)}
                </Select>
            </FormItem></Spin>,
        },
        {
            table: "members",

            formItem: <FormItem
                label="Caste Detail"
                name={['members', 'caste_detail']}
            // rules={[{ required: true, message: 'Please Enter Caste Detail' }]}
            >
                <Input placeholder="Caste Detail" />
            </FormItem>,
        },
        {
            table: "members",
            field: 'mother_tongue',
            formItem: <FormItem
                label="Mother Tongue"
                name={['members', 'mother_tongue']}
            // rules={[{ required: true, message: 'Please Enter Mother Tongue' }]}
            >

                <Select
                    showSearch
                    placeholder="Mother Tongue"

                    optionFilterProp="children"
                    //onChange={motherTongueOnChange}
                    filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                >
                    {context.psGlobal.collectionOptions(context.psGlobal.collectionData, 'languages')}
                </Select>
            </FormItem>,
        },
        {
            table: "members",
            field: 'languages_known',
            formItem: <FormItem
                label="Languages Known"
                name={['members', 'languages_known']}
            // rules={[{ required: true, message: 'Please Enter Languages Known' }]}
            >

                <Select
                    placeholder="Languages Known"

                    mode="multiple"
                    style={{
                        width: '100%',
                    }}
                    optionLabelProp="label"
                //onChange={languagesKnownOnChange}
                >
                    {context.psGlobal.collectionOptions(context.psGlobal.collectionData, 'languages')}
                </Select>
            </FormItem>,
        },
        {
            table: "members",
            field: 'gothra',
            formItem: <FormItem
                label="Gothra"
                name={['members', 'gothra']}
            //  rules={[{ required: true, message: 'Please Enter Gothra' }]}
            >
                <Input placeholder="Gothra" />
            </FormItem>,
        },
        {
            table: "members",
            field: 'kuladeivam',
            formItem: <FormItem
                label="Kuladeivam"
                name={['members', 'kuladeivam']}
            //rules={[{ required: true, message: 'Please Enter Kuladeivam' }]}
            >
                <Input placeholder="Kuladeivam" />
            </FormItem>,
        },
        {
            table: "members",
            field: 'poorveegam',
            formItem: <FormItem
                label="Poorveegam"
                name={['members', 'poorveegam']}
            // rules={[{ required: true, message: 'Please Enter Poorveegam' }]}
            >
                <Input placeholder="Poorveegam" />
            </FormItem>,
        },
        {
            table: "members",
            field: 'residence_type',
            formItem: <FormItem
                label="Residence Type"
                name={['members', 'residence_type']}
                //rules={[{ required: true, message: 'Please Enter Residence Type' }]}
            >

                <Select
                    showSearch
                    placeholder="Residence Type"

                    optionFilterProp="children"
                    //onChange={residenceTypeOnChange}
                    filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                >
                    {context.psGlobal.collectionOptions(context.psGlobal.collectionData, 'residence-types')}
                </Select>
            </FormItem>,
        },
        {
            table: "members",
            field: 'willing_to_home_mappilai',
            formItem: <FormItem
                label="Willing to Home Mappillai"
                style={{ display: visibleHomeMappillai ? 'flex' : 'none' }}
                name={['members', 'willing_to_home_mappilai']}
            //rules={[{ required: true, message: 'Please Enter Willing To_home_mappilai' }]}
            >
                <Radio.Group defaultValue="0" optionType="default" >
                    <Radio.Button key='1' value='1'>Yes</Radio.Button>
                    <Radio.Button key='0' value='0'>No</Radio.Button>
                </Radio.Group>
            </FormItem>,
        },

        {
            table: "members",
            field: 'about_profile',
            formItem: <FormItem
                label="About Profile"
                name={['members', 'about_profile']}
            // rules={[{ required: true, message: 'Please Enter About Profile' }]}
            >
                <Input.TextArea rows={3} />
            </FormItem>,
        },

        {
            table: "members",
            field: "educational_qualification",
            formItem: <FormItem
                label="Education"
                name={['members', 'educational_qualification']}
                rules={[{ required: true, message: 'Please Enter Educational Qualification' }]}
            >

                <Select
                    showSearch
                    placeholder="Education"

                    optionFilterProp="children"
                    //onChange={educationalQualificationOnChange}
                    filterOption={(input, option) => {
                        if (option.children) {
                            return option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0 ? true : false;
                        } else if (option.label) {
                            // return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0 ? true : false;
                        }
                    }
                    }
                >
                    {getEducationOptions()}
                </Select>
            </FormItem>,
        },

        {
            table: "members",
            field: "education_detail",
            formItem: <FormItem
                label="Education Detail"
                name={['members', 'education_detail']}
            // rules={[{ required: true, message: 'Please Enter Education Detail' }]}
            >
                <Input placeholder="Education Detail" />
            </FormItem>,
        },

        {
            table: "members",
            field: "job_type",
            formItem: <FormItem
                label="Job Type"
                name={['members', 'job_type']}
                rules={[{ required: true, message: 'Please Enter Job Type' }]}
            >

                <Select
                    showSearch
                    placeholder="Job Type"

                    optionFilterProp="children"
                    //onChange={jobTypeOnChange}
                    filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                >
                    {context.psGlobal.collectionOptions(context.psGlobal.collectionData, 'occupation-types')}
                </Select>
            </FormItem>,
        },

        {
            table: "members",
            field: "job_name",
            formItem: <FormItem
                label="Job Name"
                name={['members', 'job_name']}
                rules={[{ required: true, message: 'Please Enter Job Name' }]}
            >

                <Select
                    showSearch
                    placeholder="Job Name"

                    optionFilterProp="children"
                    //onChange={jobNameOnChange}
                    filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                >
                    {context.psGlobal.collectionOptions(context.psGlobal.collectionData, 'occupations')}
                </Select>
            </FormItem>,
        },
        {
            table: "members",
            field: "job_detail",
            formItem: <FormItem
                label="Job Detail"
                name={['members', 'job_detail']}
            // rules={[{ required: true, message: 'Please Enter Job Detail' }]}
            >
                <Input placeholder="Job Detail" />
            </FormItem>,
        },
        {
            table: "members",
            field: "job_country",
            formItem: <FormItem
                label="Job Country"
                name={['members', 'job_country']}
                rules={[{ required: true, message: 'Please Enter Job Country' }]}
            >

                <CountryDropdown
                    className="ant-input"
                    value={jobCountry}
                    onChange={(val) => setJobCountry(val)} />
            </FormItem>,
        },

        {
            table: "members",
            field: "job_state",
            formItem: <FormItem
                label="Job State"
                name={['members', 'job_state']}
                rules={[{ required: true, message: 'Please Enter Job State' }]}
            >

                <RegionDropdown
                    country={jobCountry}
                    className="ant-input"
                    // value={viewData.state}
                    onChange={onJobStateChange}
                //onChange={(val) => this.selectRegion(val)} 
                />
            </FormItem>,
        },

        {
            table: "members",
            field: "job_district",
            formItem: <FormItem
                label="Job District"
                name={['members', 'job_district']}
            //rules={[{ required: true, message: 'Please Enter Job District' }]}
            >

                <Select
                    showSearch
                    placeholder="Job District"
                    loading={jobDistrictLoading}
                    optionFilterProp="children"
                    //onChange={jobDistrictOnChange}
                    filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                >
                    {
                        jobDistricts.map(district => {
                            return <Select.Option value={district.district_name}>{district.district_name}</Select.Option>

                        })
                    }
                </Select>
            </FormItem>,
        },

        {
            table: "members",
            field: "job_area",
            formItem: <FormItem
                label="Job Area"
                name={['members', 'job_area']}
            //rules={[{ required: true, message: 'Please Enter Job Area' }]}
            >
                <Input placeholder="Job Area" />
            </FormItem>,
        },

        {
            table: "members",
            field: "job_annual_income",
            formItem: <FormItem
                label="Job Annual_income"
                name={['members', 'job_annual_income']}
                rules={[{ required: true, message: 'Please Enter Job Annual_income' }]}
            >
                <InputNumber placeholder="Job Annual_income" type="number" style={{ width: '100%' }} />
            </FormItem>,
        },
        {
            table: "members",
            field: "password",
            formItem: <FormItem
                label="Password"
                name={['members', 'password']}
                rules={[{ required: true, message: 'Please Enter Password' }]}
            >
                <Input.Password placeholder="Password" />
            </FormItem>
        },
        {
            table: "member_family_details",
            field: "father_status",
            formItem: <FormItem
                label="Father Status"
                name={['member_family_details', 'father_status']}
                rules={[{ required: true, message: 'Please Enter Father Status' }]}
            >
                <Radio.Group defaultValue="1" optionType="default" >
                    <Radio.Button key='1' value='1'>Yes</Radio.Button>
                    <Radio.Button key='0' value='0'>No</Radio.Button>
                </Radio.Group>
            </FormItem>,
        },
        {
            table: "member_family_details",
            field: "father_occupation",
            formItem: <FormItem
                label="Father Occupation"
                name={['member_family_details', 'father_occupation']}
                rules={[{ required: true, message: 'Please Enter Father Occupation' }]}
            >
                <Input placeholder="Father Occupation" />
            </FormItem>,
        },
        {
            table: "member_family_details",
            field: "mother_status",
            formItem: <FormItem
                label="Mother Status"
                name={['member_family_details', 'mother_status']}
                rules={[{ required: true, message: 'Please Enter Mother Status' }]}
            >
                <Radio.Group defaultValue="1" optionType="default" >
                    <Radio.Button key='1' value='1'>Yes</Radio.Button>
                    <Radio.Button key='0' value='0'>No</Radio.Button>
                </Radio.Group>
            </FormItem>,
        },
        {
            table: "member_family_details",
            field: "mother_occupation",
            formItem: <FormItem
                label="Mother Occupation"
                name={['member_family_details', 'mother_occupation']}
                rules={[{ required: true, message: 'Please Enter Mother Occupation' }]}
            >
                <Input placeholder="Mother Occupation" />
            </FormItem>,
        },
        {
            table: "member_family_details",
            field: "brothers",
            formItem: <FormItem
                label="No. of Brothers"
                name={['member_family_details', 'brothers']}
                rules={[{ required: true, message: 'Please Enter Brothers' }]}
            >
                <InputNumber placeholder="Brothers" type="number" style={{ width: '100%' }} />
            </FormItem>,
        },
        {
            table: "member_family_details",
            field: "brothers_married",
            formItem: <FormItem
                label="Brothers Married"
                name={['member_family_details', 'brothers_married']}
                rules={[{ required: true, message: 'Please Enter Brothers Married' }]}
            >
                <InputNumber placeholder="Brothers Married" type="number" style={{ width: '100%' }} />
            </FormItem>,
        },
        {
            table: "member_family_details",
            field: "sisters",
            formItem: <FormItem
                label="No. of Sisters"
                name={['member_family_details', 'sisters']}
                rules={[{ required: true, message: 'Please Enter Sisters' }]}
            >
                <InputNumber placeholder="Sisters" type="number" style={{ width: '100%' }} />
            </FormItem>,
        },
        {
            table: "member_family_details",
            field: "sisters_married",
            formItem: <FormItem
                label="Sisters Married"
                name={['member_family_details', 'sisters_married']}
                rules={[{ required: true, message: 'Please Enter Sisters Married' }]}
            >
                <InputNumber placeholder="Sisters Married" type="number" style={{ width: '100%' }} />
            </FormItem>,
        },
        {
            table: "member_family_details",
            field: "family_type",
            formItem: <FormItem
                label="Family Type"
                name={['member_family_details', 'family_type']}
                rules={[{ required: true, message: 'Please Enter Family Type' }]}
            >

                <Select
                    showSearch
                    placeholder="Family Type"

                    optionFilterProp="children"
                    //onChange={familyTypeOnChange}
                    filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                >
                    {context.psGlobal.collectionOptions(context.psGlobal.collectionData, 'family-types')}
                </Select>
            </FormItem>,
        },
        {
            table: "member_family_details",
            field: "dowry_jewels",
            formItem: <FormItem
                label="Dowry Jewels"
                name={['member_family_details', 'dowry_jewels']}
            // rules={[{ required: true, message: 'Please Enter Dowry Jewels' }]}
            >
                <Input placeholder="Dowry Jewels" />
            </FormItem>,
        },
        {
            table: "member_family_details",
            field: "dowry_property",
            formItem: <FormItem
                label="Dowry Property"
                name={['member_family_details', 'dowry_property']}
            // rules={[{ required: true, message: 'Please Enter Dowry Property' }]}
            >
                <Input placeholder="Dowry Property" />
            </FormItem>,
        },
        {
            table: "member_family_details",
            field: "dowry_cash",
            formItem: <FormItem
                label="Dowry Cash"
                name={['member_family_details', 'dowry_cash']}
            // rules={[{ required: true, message: 'Please Enter Dowry Cash' }]}
            >
                <Input placeholder="Dowry Cash" />
            </FormItem>,
        },
        {
            table: "member_family_details",
            field: "about_family",
            formItem: <FormItem
                label="About Family"
                name={['member_family_details', 'about_family']}
            // rules={[{ required: true, message: 'Please Enter About Family' }]}
            >
                <Input.TextArea rows={3} />
            </FormItem>,
        },
        {
            table: "member_habits",
            field: "eating_habits",
            formItem: <FormItem
                label="Eating Habits"
                name={['member_habits', 'eating_habits']}
            //  rules={[{ required: true, message: 'Please Enter Eating Habits' }]}
            >

                <Select
                    showSearch
                    placeholder="Eating Habits"

                    optionFilterProp="children"
                    //onChange={eatingHabitsOnChange}
                    filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                >
                    {context.psGlobal.collectionOptions(context.psGlobal.collectionData, 'eating-habits')}
                </Select>
            </FormItem>,
        },
        {
            table: "member_habits",
            field: "drinking_habits",
            formItem: <FormItem
                label="Drinking Habits"
                name={['member_habits', 'drinking_habits']}
            //rules={[{ required: true, message: 'Please Enter Drinking Habits' }]}
            >

                <Select
                    showSearch
                    placeholder="Drinking Habits"

                    optionFilterProp="children"
                    //onChange={drinkingHabitsOnChange}
                    filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                >
                    {context.psGlobal.collectionOptions(context.psGlobal.collectionData, 'drinking-habits')}
                </Select>
            </FormItem>
        },
        {
            table: "member_habits",
            field: "smoking_habits",
            formItem: <FormItem
                label="Smoking Habits"
                name={['member_habits', 'smoking_habits']}
            // rules={[{ required: true, message: 'Please Enter Smoking Habits' }]}
            >

                <Select
                    showSearch
                    placeholder="Smoking Habits"

                    optionFilterProp="children"
                    //onChange={smokingHabitsOnChange}
                    filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                >
                    {context.psGlobal.collectionOptions(context.psGlobal.collectionData, 'smoking-habits')}
                </Select>
            </FormItem>
        },
        {
            table: "member_habits",
            field: "hobbies",
            formItem: <FormItem
                label="Hobbies"
                name={['member_habits', 'hobbies']}
            // rules={[{ required: true, message: 'Please Enter Hobbies' }]}
            >
                <Input.TextArea rows={3} />
            </FormItem>
        }
        ,
        {
            table: "member_physical_attributes",
            field: "height",
            formItem: <FormItem
                label="Height"
                name={['member_physical_attributes', 'height']}
                //rules={[{ required: true, message: 'Please Enter Height' }]}
            >
                <Select
                    showSearch
                    placeholder="Height"

                    optionFilterProp="children"
                    //onChange={heightOnChange}
                    filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                >
                    {heightList.map(item => <Select.Option key={item.cm} value={item.cm.toString()}>{item.label}</Select.Option>)}

                </Select>
            </FormItem>
        }
        ,
        {
            table: "member_physical_attributes",
            field: "weight",
            formItem: <FormItem
                label="Weight"
                name={['member_physical_attributes', 'weight']}
                //rules={[{ required: true, message: 'Please Enter Weight' }]}
            >
                <Select
                    showSearch
                    placeholder="Weight"

                    optionFilterProp="children"
                //onChange={weightOnChange}
                // filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                >
                    {getWeightList()}
                </Select>
            </FormItem>
        }
        ,
        {
            table: "member_physical_attributes",
            field: "body_type",
            formItem: <FormItem
                label="Body Type"
                name={['member_physical_attributes', 'body_type']}
                rules={[{ required: true, message: 'Please Enter Body Type' }]}
            >

                <Select
                    showSearch
                    placeholder="Body Type"

                    optionFilterProp="children"
                    //onChange={bodyTypeOnChange}
                    filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                >
                    {context.psGlobal.collectionOptions(context.psGlobal.collectionData, 'body-types')}
                </Select>
            </FormItem>
        }
        ,
        {
            table: "member_physical_attributes",
            field: "complexion",
            formItem: <FormItem
                label="Complexion"
                name={['member_physical_attributes', 'complexion']}
                rules={[{ required: true, message: 'Please Enter Complexion' }]}
            >

                <Select
                    showSearch
                    placeholder="Complexion"

                    optionFilterProp="children"
                    //onChange={complexionOnChange}
                    filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                >
                    {context.psGlobal.collectionOptions(context.psGlobal.collectionData, 'complexion')}
                </Select>
            </FormItem>
        }
        ,
        {
            table: "member_physical_attributes",
            field: "physical_status",
            formItem: <FormItem
                label="Physical Status"
                name={['member_physical_attributes', 'physical_status']}
                rules={[{ required: true, message: 'Please Enter Physical Status' }]}
            >

                <Select
                    showSearch
                    placeholder="Physical Status"

                    optionFilterProp="children"
                    //onChange={physicalStatusOnChange}
                    filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                >
                    {context.psGlobal.collectionOptions(context.psGlobal.collectionData, 'physical-status')}
                </Select>
            </FormItem>
        },
        {
            table: "member_physical_attributes",
            field: "physical_status_description",
            formItem: <FormItem
                label="Physical Details"
                name={['member_physical_attributes', 'physical_status_description']}
            // rules={[{ required: true, message: 'Please Enter Physical Status_description' }]}
            >
                <Input.TextArea rows={3} />
            </FormItem>
        },
        {
            table: "member_horoscope",
            field: "star",
            formItem: <FormItem
                label="Star"
                name={['member_horoscope', 'star']}
                rules={[{ required: true, message: 'Please Enter Star' }]}
            >

                <Select
                    showSearch
                    placeholder="Star"

                    optionFilterProp="children"
                    //onChange={starOnChange}
                    filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                >
                    {context.psGlobal.collectionOptions(context.psGlobal.collectionData, 'star')}
                </Select>
            </FormItem>
        }
        ,
        {
            table: "member_horoscope",
            field: "patham",
            formItem: <FormItem
                label="Patham"
                name={['member_horoscope', 'patham']}
               // rules={[{ required: true, message: 'Please Enter Patham' }]}
            >

                <Select
                    showSearch
                    placeholder="Patham"

                    optionFilterProp="children"
                    //onChange={pathamOnChange}
                    filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                >
                    {context.psGlobal.collectionOptions(context.psGlobal.collectionData, 'patham')}
                </Select>
            </FormItem>
        }
        ,
        {
            table: "member_horoscope",
            field: "raasi",
            formItem: <FormItem
                label="Raasi"
                name={['member_horoscope', 'raasi']}
              //  rules={[{ required: true, message: 'Please Enter Raasi' }]}
            >

                <Select
                    showSearch
                    placeholder="Raasi"

                    optionFilterProp="children"
                    //onChange={raasiOnChange}
                    filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                >
                    {context.psGlobal.collectionOptions(context.psGlobal.collectionData, 'raasi')}
                </Select>
            </FormItem>
        }
        ,
        {
            table: "member_horoscope",
            field: "laknam",
            formItem: <FormItem
                label="Laknam"
                name={['member_horoscope', 'laknam']}
            // rules={[{ required: true, message: 'Please Enter Laknam' }]}
            >

                <Select
                    showSearch
                    placeholder="Laknam"

                    optionFilterProp="children"
                    //onChange={laknamOnChange}
                    filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                >
                    {context.psGlobal.collectionOptions(context.psGlobal.collectionData, 'raasi')}
                </Select>
            </FormItem>
        }
        ,
        {
            table: "member_horoscope",
            field: "birth_time",
            formItem: <FormItem
                label="Birth Time"
                name={['member_horoscope', 'birth_time']}
            // rules={[{ required: true, message: 'Please Enter Birth Time' }]}
            >

                <Space direction="vertical">
                    <TimePicker
                        format='hh:mm a'
                    //  onChange={onChange}
                    />

                </Space>
            </FormItem>
        }
        ,
        {
            table: "member_horoscope",
            field: "birth_place",
            formItem: <FormItem
                label="Birth Place"
                name={['member_horoscope', 'birth_place']}
            // rules={[{ required: true, message: 'Please Enter Birth Place' }]}
            >
                <Input placeholder="Birth Place" />
            </FormItem>
        }
        ,
        {
            table: "member_horoscope",
            field: "dhosam_type",
            formItem: <FormItem
                label="Dhosam Type"
                name={['member_horoscope', 'dhosam_type']}
            //rules={[{ required: true, message: 'Please Enter Dhosam Type' }]}
            >

                <Select
                    showSearch
                    placeholder="Dhosam Type"

                    optionFilterProp="children"
                    //onChange={dhosamTypeOnChange}
                    filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                >
                    {context.psGlobal.collectionOptions(context.psGlobal.collectionData, 'dosham-types')}
                </Select>
            </FormItem>
        }
        ,
        {
            table: "member_horoscope",
            field: "jadhagam_type",
            formItem: <FormItem
                label="Jadhagam Type"
                name={['member_horoscope', 'jadhagam_type']}
            //rules={[{ required: true, message: 'Please Enter Jadhagam Type' }]}
            >

                <Select
                    showSearch
                    placeholder="Jadhagam Type"

                    optionFilterProp="children"
                    //onChange={jadhagamTypeOnChange}
                    filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                >
                    {context.psGlobal.collectionOptions(context.psGlobal.collectionData, 'jathagam-type')}
                </Select>
            </FormItem>
        }
        ,
        {
            table: "member_horoscope",
            field: "raasi_chart",
            formItem: getChartInputs("raasi")
        }
        ,
        {
            table: "member_horoscope",
            field: "amsam_chart",
            formItem: getChartInputs("amsam")
        }
        ,
        {
            table: "member_horoscope",
            field: "dasa",
            formItem: <FormItem
                label="Dasa"
                name={['member_horoscope', 'dasa']}
            //rules={[{ required: true, message: 'Please Enter Dasa' }]}
            >

                <Select
                    showSearch
                    placeholder="Dasa"

                    optionFilterProp="children"
                    //onChange={dasaOnChange}
                    filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                >
                    {context.psGlobal.collectionOptions(context.psGlobal.collectionData, 'thisai-iruppu')}
                </Select>
            </FormItem>
        }
        ,
        {
            table: "member_horoscope",
            field: "dasa_year",
            formItem: <FormItem
                label="Dasa Year"
                name={['member_horoscope', 'dasa_year']}
            //rules={[{ required: true, message: 'Please Enter Dasa Year' }]}
            >
                <Input placeholder="Dasa Year" />
            </FormItem>
        }
        ,
        {
            table: "member_horoscope",
            field: "dasa_month",
            formItem: <FormItem
                label="Dasa Month"
                name={['member_horoscope', 'dasa_month']}
            // rules={[{ required: true, message: 'Please Enter Dasa Month' }]}
            >
                <Input placeholder="Dasa Month" />
            </FormItem>
        }
        ,
        {
            table: "member_horoscope",
            field: "dasa_days",
            formItem: <FormItem
                label="Dasa Days"
                name={['member_horoscope', 'dasa_days']}
            //  rules={[{ required: true, message: 'Please Enter Dasa Days' }]}
            >
                <Input placeholder="Dasa Days" />
            </FormItem>

        }
        ,
        {
            table: "member_partner_preference",
            field: "prefered_eating_habits",
            formItem: <FormItem
                label="Prefered Eating Habits"
                name={['member_partner_preference', 'prefered_eating_habits']}
            // rules={[{ required: true, message: 'Please Enter Prefered Eating Habits' }]}
            >

                <Select
                    showSearch
                    placeholder="Prefered Eating Habits"

                    optionFilterProp="children"
                    //onChange={preferedEatingHabitsOnChange}
                    filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                >
                    {context.psGlobal.collectionOptions(context.psGlobal.collectionData, 'eating-habits')}
                </Select>
            </FormItem>

        }
        ,
        {
            table: "member_partner_preference",
            field: "prefered_smoking_habits",
            formItem: <FormItem
                label="Prefered Smoking Habits"
                name={['member_partner_preference', 'prefered_smoking_habits']}
            //  rules={[{ required: true, message: 'Please Enter Prefered Smoking Habits' }]}
            >

                <Select
                    showSearch
                    placeholder="Prefered Smoking Habits"

                    optionFilterProp="children"
                    //onChange={preferedSmokingHabitsOnChange}
                    filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                >
                    {context.psGlobal.collectionOptions(context.psGlobal.collectionData, 'smoking-habits')}
                </Select>
            </FormItem>

        }
        ,
        {
            table: "member_partner_preference",
            field: "prefered_drinking_habits",
            formItem: <FormItem
                label="Prefered Drinking Habits"
                name={['member_partner_preference', 'prefered_drinking_habits']}
            //  rules={[{ required: true, message: 'Please Enter Prefered Drinking Habits' }]}
            >

                <Select
                    showSearch
                    placeholder="Prefered Drinking Habits"

                    optionFilterProp="children"
                    //onChange={preferedDrinkingHabitsOnChange}
                    filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                >
                    {context.psGlobal.collectionOptions(context.psGlobal.collectionData, 'drinking-habits')}
                </Select>
            </FormItem>

        }
        ,
        {
            table: "member_partner_preference",
            field: "prefered_martial_status",
            formItem: <FormItem
                label="Prefered Martial Status"
                name={['member_partner_preference', 'prefered_martial_status']}
            //rules={[{ required: true, message: 'Please Enter Prefered Martial Status' }]}
            >

                <Select
                    placeholder="Prefered Martial Status"

                    mode="multiple"
                    style={{
                        width: '100%',
                    }}
                    optionLabelProp="label"
                //onChange={preferedMartialStatusOnChange}
                >
                    {context.psGlobal.collectionOptions(context.psGlobal.collectionData, 'marital-status')}
                </Select>
            </FormItem>

        }
        ,
        {
            table: "member_partner_preference",
            field: "age",
            formItem: <FormItem
                label="Prefered Age"
            //  name={['member_partner_preference', 'age_from']}
            //  rules={[{ required: true, message: 'Please Enter Age From' }]}
            >

                <Input.Group>
                    <Space>
                        <Form.Item
                            label="From"
                            name={['member_partner_preference', 'age', 0]}


                        //   noStyle 
                        >
                            <Select placeholder="From" style={{ width: '120px' }}>
                                {getAge()}
                            </Select>
                        </Form.Item>
                        <Form.Item
                            label="To"
                            name={['member_partner_preference', 'age', 1]}
                        // rules={[{ required: true, message: 'Enter Amount' }]}
                        // noStyle
                        >
                            <Select placeholder="To" style={{ width: '120px' }}>
                                {getAge()}
                            </Select>
                        </Form.Item>
                    </Space>
                </Input.Group>
            </FormItem>

        }
        ,
        {
            table: "member_partner_preference",
            field: "height",
            formItem: <FormItem
                label="Prefered Height"
            // name={['member_partner_preference', 'height_from']}
            // rules={[{ required: true, message: 'Please Enter Height From' }]}
            >
                <Input.Group>
                    <Space>
                        <Form.Item
                            // label="From"
                            name={['member_partner_preference', 'height', 0]}


                        //   noStyle 
                        >
                            <Select
                                style={{ width: '150px' }}
                                showSearch
                                placeholder="From"

                                optionFilterProp="children"
                                //onChange={heightOnChange}
                                filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                            >
                                {heightList.map(item => <Select.Option key={item.cm} value={item.cm}>{item.label}</Select.Option>)}

                            </Select>
                        </Form.Item>
                        <Form.Item
                            label="To"
                            name={['member_partner_preference', 'height', 1]}
                        // rules={[{ required: true, message: 'Enter Amount' }]}
                        // noStyle
                        >
                            <Select
                                style={{ width: '150px' }}
                                showSearch
                                placeholder="To"

                                optionFilterProp="children"
                                //onChange={heightOnChange}
                                filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                            >
                                {heightList.map(item => <Select.Option key={item.cm} value={item.cm}>{item.label}</Select.Option>)}

                            </Select>
                        </Form.Item>
                    </Space>
                </Input.Group>

            </FormItem>

        }

        ,
        {
            table: "member_partner_preference",
            field: "weight",
            formItem: <FormItem
                label="Prefered Weight"
            // name={['member_partner_preference', 'weight_from']}
            // rules={[{ required: true, message: 'Please Enter Weight From' }]}
            >
                <Input.Group>
                    <Space>
                        <Form.Item
                            label="From"
                            name={['member_partner_preference', 'weight', 0]}


                        //   noStyle 
                        >
                            <Select
                                style={{ width: '120px' }}
                                showSearch
                                placeholder="From"

                                optionFilterProp="children"
                                //onChange={weightOnChange}
                                filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                            >
                                {getWeightList()}
                            </Select>
                        </Form.Item>
                        <Form.Item
                            label="To"
                            name={['member_partner_preference', 'weight', 1]}
                        // rules={[{ required: true, message: 'Enter Amount' }]}
                        // noStyle
                        >
                            <Select
                                style={{ width: '120px' }}
                                showSearch
                                placeholder="To"

                                optionFilterProp="children"
                                //onChange={weightOnChange}
                                filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                            >
                                {getWeightList()}
                            </Select>
                        </Form.Item>
                    </Space>
                </Input.Group>

            </FormItem>

        }

        ,
        {
            table: "member_partner_preference",
            field: "prefered_physical_status",
            formItem: <FormItem
                label="Prefered Physical Status"
                name={['member_partner_preference', 'prefered_physical_status']}
            //rules={[{ required: true, message: 'Please Enter Prefered Physical Status' }]}
            >

                <Select
                    showSearch
                    placeholder="Prefered Physical Status"

                    optionFilterProp="children"
                    //onChange={preferedPhysicalStatusOnChange}
                    filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                >
                    {context.psGlobal.collectionOptions(context.psGlobal.collectionData, 'physical-status')}
                </Select>
            </FormItem>

        }
        ,
        {
            table: "member_partner_preference",
            field: "prefered_mother_tongue",
            formItem: <FormItem
                label="Prefered Mother Tongue"
                name={['member_partner_preference', 'prefered_mother_tongue']}
            // rules={[{ required: true, message: 'Please Enter Prefered Mother Tongue' }]}
            >

                <Select
                    placeholder="Prefered Mother Tongue"

                    mode="multiple"
                    style={{
                        width: '100%',
                    }}
                    optionLabelProp="label"
                //onChange={preferedMotherTongueOnChange}
                >
                    {context.psGlobal.collectionOptions(context.psGlobal.collectionData, 'languages')}
                </Select>
            </FormItem>

        }
        ,
        {
            table: "member_partner_preference",
            field: "prefered_religion",
            formItem: <FormItem
                label="Prefered Religion"
                name={['member_partner_preference', 'prefered_religion']}
            //  rules={[{ required: true, message: 'Please Enter Prefered Religion' }]}
            >

                <Select
                    placeholder="Prefered Religion"

                    mode="multiple"
                    style={{
                        width: '100%',
                    }}
                    optionLabelProp="label"
                    onChange={(value) => loadPreferedCastes(value)}
                //onChange={preferedReligionOnChange}
                >
                    {context.psGlobal.collectionOptions(context.psGlobal.collectionData, 'religion')}
                </Select>
            </FormItem>

        }
        ,
        {
            table: "member_partner_preference",
            field: "prefered_caste",
            formItem: <Spin spinning={preferedCasteLoader} indicator={<LoadingOutlined />} tip="Caste Loading"><FormItem
                label="Prefered Caste"
                name={['member_partner_preference', 'prefered_caste']}
            // rules={[{ required: true, message: 'Please Enter Prefered Caste' }]}
            >

                <Select
                    placeholder="Prefered Caste"

                    mode="multiple"
                    optionFilterProp="children"
                //onChange={memberCreated_forOnChange}
                // filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                // optionLabelProp="label"
                //onChange={preferedCasteOnChange}
                >
                    {preferedCasteList.map(item => <Select.Option value={item.id}>{item.caste_name}(<span style={{ color: green[7] }}>{item.religion}</span>)</Select.Option>)}
                </Select>
            </FormItem></Spin>

        }
        ,
        {
            table: "member_partner_preference",
            field: "prefered_education",
            formItem: <FormItem
                label="Prefered Education"
                name={['member_partner_preference', 'prefered_education']}
            // rules={[{ required: true, message: 'Please Enter Prefered Education' }]}
            >
                {/*  <Select
                    showSearch
                    placeholder="Education"

                    optionFilterProp="children"
                    //onChange={educationalQualificationOnChange}
                    filterOption={(input, option) => {
                        if (option.children) {
                            return option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0 ? true : false;
                        } else if (option.label) {
                            // return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0 ? true : false;
                        }
                    }
                    }
                >
                    {getEducationOptions()}
                </Select> */}
                <Select
                    placeholder="Prefered Education"

                    mode="multiple"
                    style={{
                        width: '100%',
                    }}
                    // optionLabelProp="label"
                    optionFilterProp="children"
                    optionLabelProp="children"

                //onChange={preferedEducationOnChange}
                >
                    {getEducationOptions()}
                </Select>
            </FormItem>

        }
        ,
        {
            table: "member_partner_preference",
            field: "prefered_job_type",
            formItem: <FormItem
                label="Prefered Job Type"
                name={['member_partner_preference', 'prefered_job_type']}
            // rules={[{ required: true, message: 'Please Enter Prefered Job Type' }]}
            >

                <Select
                    placeholder="Prefered Job Type"

                    mode="multiple"
                    style={{
                        width: '100%',
                    }}
                    optionLabelProp="label"
                //onChange={preferedJobTypeOnChange}
                >
                    {context.psGlobal.collectionOptions(context.psGlobal.collectionData, 'occupation-types')}
                </Select>
            </FormItem>

        }
        ,
        {
            table: "member_partner_preference",
            field: "prefered_job",
            formItem: <FormItem
                label="Prefered Job"
                name={['member_partner_preference', 'prefered_job']}
            // rules={[{ required: true, message: 'Please Enter Prefered Job' }]}
            >

                <Select
                    placeholder="Prefered Job"

                    mode="multiple"
                    style={{
                        width: '100%',
                    }}
                    optionLabelProp="label"
                //onChange={preferedJobOnChange}
                >
                    {context.psGlobal.collectionOptions(context.psGlobal.collectionData, 'occupations')}
                </Select>
            </FormItem>

        }
        ,
        {
            table: "member_partner_preference",
            field: "prefered_country",
            formItem: <FormItem
                label="Prefered Country"
                name={['member_partner_preference', 'prefered_country']}
            // rules={[{ required: true, message: 'Please Enter Prefered Country' }]}
            >

                <CountryDropdown
                    className="ant-input"
                    value={preferedCountry}
                    onChange={(val) => setPreferedCountry(val)} />
            </FormItem>

        }
        ,
        {
            table: "member_partner_preference",
            field: "prefered_state",
            formItem: <FormItem
                label="Prefered State"
                name={['member_partner_preference', 'prefered_state']}
            // rules={[{ required: true, message: 'Please Enter Prefered State' }]}
            >

                <RegionDropdown
                    country={preferedCountry}
                    className="ant-input"
                    onChange={onPreferedStateChange}
                // value={viewData.state}

                //onChange={(val) => this.selectRegion(val)} 
                />
            </FormItem>

        }
        ,
        {
            table: "member_partner_preference",
            field: "prefered_district",
            formItem: <FormItem
                label="Prefered District"
                name={['member_partner_preference', 'prefered_district']}
            // rules={[{ required: true, message: 'Please Enter Prefered District' }]}
            >

                <Select
                    placeholder="Prefered District"
                    loading={preferedDistrictLoading}
                    mode="multiple"
                    style={{
                        width: '100%',
                    }}
                    optionLabelProp="children"
                    optionFilterProp="children"
                //onChange={preferedDistrictOnChange}
                >
                    {
                        preferedDistricts.map(district => {
                            return <Select.Option value={district.district_name}>{district.district_name}</Select.Option>

                        })
                    }
                </Select>
            </FormItem>

        }
        ,
        {
            table: "member_partner_preference",
            field: "income",
            formItem: <FormItem
                label="Annual Income"
                name={['member_partner_preference', 'income_from']}
            //  rules={[{ required: true, message: 'Please Enter Income From' }]}
            >
                <Input.Group>
                    <Space>
                        <Form.Item
                            //label="From"
                            name={['member_partner_preference', 'income', 0]}


                        //   noStyle 
                        >
                            <InputNumber placeholder="From" type="number" style={{ width: '150px' }} />
                        </Form.Item>
                        <Form.Item
                            label="To"
                            name={['member_partner_preference', 'income', 1]}
                        // rules={[{ required: true, message: 'Enter Amount' }]}
                        // noStyle
                        >
                            <InputNumber placeholder="To" type="number" style={{ width: '150px' }} />
                        </Form.Item>
                    </Space>
                </Input.Group>

            </FormItem>

        }
        ,
        {
            table: "member_partner_preference",
            field: "expectation_notes",
            formItem: <FormItem
                label="Expectation Notes"
                name={['member_partner_preference', 'expectation_notes']}
            // rules={[{ required: true, message: 'Please Enter Expectation Notes' }]}
            >
                <Input.TextArea rows={3} />
            </FormItem>
        }
    ]
    const getFormItems = () => {
        var finalItems = [];
        inputFields.forEach(field => {
            var splitFields = field.split(".");
            var tableName = splitFields[0];
            var fieldName = splitFields[1];
            var selFieldItem = formItems.find(obj => obj.table === tableName && obj.field === fieldName);
            if (selFieldItem) {
                finalItems.push(<Col className='gutter-row' xs={24} xl={12}>
                    {selFieldItem.formItem}
                </Col>)
            }

        })
        return <Row gutter={32}>{finalItems}</Row>
    }
    return (
        <>
            <Spin spinning={loader} >
                <Form
                    name="basic"
                    form={addeditFormMember}
                    labelAlign="left"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 20 }}
                    initialValues={{ remember: true }}
                    onFinish={addeditFormMemberOnFinish}
                    autoComplete="off"
                >
                    {getFormItems()}
                    <FormItem wrapperCol={{ offset: 10, span: 24 }}>
                        <Space>
                            <Button size="large" type="outlined"
                                onClick={() => { curAction === 'add' ? addeditFormMember.resetFields() : onListClick() }}>
                                {curAction === "add" ? 'Reset' : 'Cancel'}
                            </Button>
                            <MyButton size="large" type="primary" htmlType="submit">
                                Save
                            </MyButton>
                        </Space>

                    </FormItem>

                </Form>
            </Spin>
        </>
    )
}
export default AddEditMember;