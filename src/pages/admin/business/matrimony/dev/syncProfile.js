import axios from 'axios';
import { encrypt, decrypt } from '../../../../../models/core'
import moment from 'moment'
export const StoreProfile = async (profileId) => {
    return new Promise((resolve, reject) => {
        var reqData = [{
            query_type: 'query',
            query: "select p.created_date,p.profile_id,p.name,p.mobile_no,p.father_name,p.gender,p.religion,cs.caste,p.sub_caste,p.martial_status,p.profile_status, ps.last_login_date,p.created_date,p.mother_tongue,ps.is_mobile_verified,ps.is_email_verified, ps.is_photo_updated,ps.is_contact_details_updated, ps.is_horroscope_updated from user__cmp1_profiles p,user__cmp1_caste cs,user__cmp1_profile_status ps where p.profile_status='Active' and p.profile_id=ps.profile_id and p.caste=cs.id and p.profile_status<>'Deleted' and p.profile_id='" + profileId + "' order by cast(p.created_date as unsigned) desc limit 0,20"
        },
        {
            query_type: 'query',
            query: "select * from user__cmp1_profiles where profile_id='" + profileId + "'"
        },
        {
            query_type: 'query',
            query: "select * from user__cmp1_family_details where profile_id='" + profileId + "'"
        },
        {
            query_type: 'query',
            query: "select c.door_no,c.street,c.area,c.country,c.state,c.district,c.taluk,c.landmark,c.pin_code,c.alternative_phone_1,c.alternative_phone_2,c.whatsapp_no from user__cmp1_contact_details c where c.contact_id='" + profileId + "'"
        },
        {
            query_type: 'query',
            query: "select co.iso,co.country,a1.admincode,a1.asciiname as state,a2.admin2code,a2.asciiname as district from user__cmp1_contact_details c,user__cmp1_countries co,user__cmp1_admin1codes a1,user__cmp1_admin2codes a2 where c.contact_id='" + profileId + "' and c.country=co.iso and c.state=a1.admincode and c.district=a2.admin2code and a1.country_code=co.iso and a2.country_code=co.iso"
        },
        {
            query_type: 'query',
            query: "select eo.educational_qualification, ed.course_name,eo.education_detail,eo.occupation_type,eo.occupation_name,eo.occupation_detail,co.country,a1.asciiname as state,a2.asciiname as district,eo.occupation_area,eo.monthly_income,eo.annual_income from user__cmp1_education_occupation eo,user__cmp1_education_courses ed,user__cmp1_countries co,user__cmp1_admin1codes a1,user__cmp1_admin2codes a2 where eo.profile_id='" + profileId + "' and eo.educational_qualification=ed.course_id and eo.occupation_country=co.iso and eo.occupation_state=a1.admincode and eo.occupation_district=a2.admin2code and a1.country_code=co.iso and a2.country_code=co.iso"
        },
        {
            query_type: 'query',
            query: "select * from user__cmp1_profile_status where profile_id='" + profileId + "'"
        },
        {
            query_type: 'query',
            query: "select * from user__cmp1_habits_hobbies where profile_id='" + profileId + "'"
        },
        {
            query_type: 'query',
            query: "select * from user__cmp1_physical_attributes where profile_id='" + profileId + "'"
        },
        {
            query_type: 'query',
            query: "select * from user__cmp1_horoscope_details where profile_id='" + profileId + "'"
        },
        {
            query_type: 'query',
            query: "select * from user__cmp1_orders where ordered_id='" + profileId + "'"
        },
        {
            query_type: 'query',
            query: "select * from user__cmp1_education_occupation  where profile_id='" + profileId + "'"
        },
        {
            query_type: 'query',
            query: "select * from user__cmp1_partner_preferences  where profile_id='" + profileId + "'"
        },
        ];
        var form = new FormData();
        form.append('queries', encrypt(JSON.stringify(reqData)))
        form.append('mode', 'dev');
        axios.post('https://rajeshwarimatrimony.com/synch/v1/admin/db-query', form).then(res => {
            if (res['data'].status === '1') {

                var storeProfileData = res['data'].data[1][0];
                var storeFamilyData = res['data'].data[2][0];
                console.log('family', storeProfileData.profile_id, res['data'].data[2].length)
                if (res['data'].data[2].length < 1) {
                    storeFamilyData = {
                        about_family: "",
                        ancestral_orgin: " ",
                        brothers_married: "0",
                        dowry_cash: "",
                        dowry_jewels: "",
                        dowry_property: "",
                        family_type: "",
                        father_occupation: "",
                        father_status: "Yes",
                        mother_name: "-",
                        mother_occupation: "",
                        mother_status: "Yes",
                        no_of_brothers: "0",
                        no_of_sisters: "0",
                        profile_id: storeProfileData.profile_id,
                        sisters_married: "0",
                    }

                    console.log('dummy created', storeProfileData.profileId, storeFamilyData)
                }
                var storeConctactData = res['data'].data[3][0];
                console.log('contact ', storeProfileData.profile_id, res['data'].data[3].length)
                if (res['data'].data[3].length < 1) {
                    storeConctactData = {
                        alternative_phone_1: "",
                        alternative_phone_2: "",
                        area: "",
                        country: "IN",
                        district: "",
                        door_no: "-",
                        landmark: "",
                        pin_code: "0",
                        state: "",
                        street: "",
                        taluk: "",
                        whatsapp_no: ""
                    }
                }

                var storeContactLocData = res['data'].data[4][0];
                console.log('contact loc', storeProfileData.profile_id, res['data'].data[4].length)
                if (res['data'].data[4].length < 1) {
                    storeContactLocData = {
                        admin2code: "",
                        admincode: "",
                        country: "India",
                        district: "",
                        iso: "IN",
                        state: "Tamil Nadu",
                    }
                }
                var storeEduLocData = res['data'].data[5][0];
                console.log('edu loc', storeProfileData.profile_id, res['data'].data[5].length)
                if (res['data'].data[5].length < 1) {
                    storeEduLocData = {
                        annual_income: "0",
                        country: "India",
                        course_name: "",
                        district: "",
                        education_detail: "",
                        educational_qualification: "",
                        monthly_income: "",
                        occupation_area: "",
                        occupation_detail: "",
                        occupation_name: "",
                        occupation_type: "",
                        state: "",
                    }
                }
                var storeStatusData = res['data'].data[6][0];

                if (res['data'].data[6].length < 1) {
                    storeStatusData = {
                        is_contact_details_updated: "No",
                        is_education_occupation_updated: "No",
                        is_email_verified: "No",
                        is_family_details_updated: "No",
                        is_habits_hobbies_updated: "No",
                        is_horroscope_updated: "No",
                        is_mobile_verified: "No",
                        is_partner_preferences_updated: "No",
                        is_photo_updated: "No",
                        is_physical_attributes_updated: "No",
                        is_profiles_updated: "No",
                        last_login_date: "",
                        profile_id: storeProfileData.profile_id,
                    }
                }
                var storeHobbiesData = res['data'].data[7][0];
                if (res['data'].data[7].length < 1) {
                    storeHobbiesData = {
                        drinking_habits: "",
                        eating_habits: "",
                        hobbies: "",
                        profile_id: storeProfileData.profile_id,
                        smoking_habits: "",
                    }
                }
                var storePhysicalData = res['data'].data[8][0];
                console.log('physical', storeProfileData.profile_id, res['data'].data[8].length)
                if (res['data'].data[8].length < 1) {
                    storePhysicalData = {
                        body_type: "",
                        complexion: "",
                        height: "0",

                        physical_status: "Normal",
                        physical_status_description: "",
                        profile_id: storeProfileData.profile_id,
                        weight: "0",
                    }
                }
                var storeHoroData = res['data'].data[9][0];
                console.log('horo', storeProfileData.profile_id, res['data'].data[9].length)
                if (res['data'].data[9].length < 1) {
                    storeHoroData = {
                        amsam_chart: "",
                        birth_place: "",
                        birth_time: null,
                        dosham_type: "",
                        jadhagam_type: "",
                        laknam: "",
                        patham: "",
                        profile_id: storeProfileData.profile_id,
                        raasi: "",
                        raasi_chart: "",
                        star: "",
                        thisaiyiruppu: "",
                        thisaiyiruppu_end_date: ",0,0",
                    }
                }
                var storeOrderData = res['data'].data[10];
                var storeEduData = res['data'].data[11][0];
                if (res['data'].data[11].length < 1) {
                    storeEduData = {
                        annual_income: "0",
                        education_detail: "",
                        educational_qualification: null,
                        monthly_income: "0",
                        occupation_area: "",
                        occupation_country: "IN",
                        occupation_detail: "",
                        occupation_district: "",
                        occupation_name: "",
                        occupation_state: "",
                        occupation_type: "",
                        profile_id: storeProfileData.profile_id,
                    }
                }
                var storePartnerData = res['data'].data[12][0];
                if (res['data'].data[12].length >0) {
                  /*   if(res['data'].data[12][0].prefered_eating_habit)
                        console.log('found change',) */
                }
                var mydata = {
                    members: {
                        //profiles
                        member_id: storeProfileData.profile_id,
                        member_created_for: storeProfileData.profile_created_for,
                        member_created_by: storeProfileData.profile_created_by,
                        member_created_ref_id: storeProfileData.ref_id,
                        name: storeProfileData.name,
                        father_name: storeProfileData.father_name,
                        //family details
                        mother_name: storeFamilyData.mother_name,
                        //profiles
                        gender: storeProfileData.gender,
                        dob: moment.unix(storeProfileData.dob).format("YYYY-MM-DD"),
                        marital_status: storeProfileData.martial_status,
                        no_of_children: storeProfileData.no_of_children,
                        children_living_status: storeProfileData.children_living_status,
                        //contacts

                        country: storeContactLocData && storeContactLocData.country ? storeContactLocData.country : '', //loc
                        state: storeContactLocData && storeContactLocData.state ? storeContactLocData.state : '', //loc
                        district: storeContactLocData && storeContactLocData.district ? storeContactLocData.district : '', //loc
                        door_no: storeConctactData.door_no, //loc
                        street: storeConctactData.street,
                        area: storeConctactData.area,
                        taluk: storeConctactData.taluk,
                        landmark: storeConctactData.landmark,
                        pincode: storeConctactData.pin_code,

                        mobile_no: storeProfileData.mobile_no,
                        mobile_alt_no_1: storeConctactData.alternative_phone_1,
                        mobile_alt_no_2: storeConctactData.alternative_phone_2,
                        whatsapp_no: storeConctactData.whatsapp_no,
                        email: storeProfileData.email,
                        aadhaar_no: storeProfileData.aadhar_number,


                        caste: storeProfileData.caste,
                        sub_caste: storeProfileData.sub_caste,
                        caste_detail: storeProfileData.sub_caste_2,
                        religion: storeProfileData.religion,
                        mother_tongue: storeProfileData.mother_tongue,
                        languages_known: storeProfileData.languages_known,
                        gothra: storeProfileData.gothra,
                        kuladeivam: storeProfileData.kula_theivam,
                        poorveegam: storeFamilyData.ancestral_orgin, //not completed
                        residence_type: storeProfileData.residence_type,
                        willing_to_home_mappilai: storeProfileData.willing_to_home_mappillai,
                        about_profile: storeProfileData.about_profile,
                        password: encrypt(storeProfileData.password),
                        // photo: storeProfileData.photo_1,
                        // is_protect_photo: '',
                        //what about photo 2
                        //education
                        educational_qualification: storeEduData.educational_qualification,
                        education_detail: storeEduData.education_detail,
                        job_type: storeEduData.occupation_type,
                        job_name: storeEduData.occupation_name,
                        job_detail: storeEduData.occupation_detail,
                        job_country: storeEduLocData && storeEduLocData.country ? storeEduLocData.country : '',
                        job_state: storeEduLocData && storeEduLocData.state ? storeEduLocData.state : '',
                        job_district: storeEduLocData && storeEduLocData.district ? storeEduLocData.district : '',
                        job_area: storeEduData.occupation_area,
                        job_annual_income: storeEduData.annual_income,

                        member_status: storeProfileData.profile_status,
                        status_reason: storeProfileData.status_reason,
                        // current_order_status:
                        // current_order_id:'0'
                        mobile_otp: storeProfileData.mobile_otp,
                        email_otp: storeProfileData.email_otp,

                        is_otp_verified: storeStatusData.is_mobile_verified,
                        is_email_otp_verified: storeStatusData.is_email_verified,

                        // is_basic_updated: '',
                        is_photo_updated: storeStatusData.is_photo_updated,
                        is_habits_updated: storeStatusData.is_habits_hobbies_updated,
                        is_family_updated: storeStatusData.is_family_details_updated,
                        is_horroscope_updated: storeStatusData.is_horroscope_updated,
                        is_physical_updated: storeStatusData.is_physical_attributes_updated,
                        created_date: moment.unix(storeProfileData.created_date).format("YYYY-MM-DD")
                        // is_partner_preferences_updated: storeStatusData.is_partner_preferences_updated,

                    },
                    family: {
                        //profiles
                        member_auto_id: '',
                        member_id: storeFamilyData.profile_id,
                        father_status: storeFamilyData.father_status,
                        father_occupation: storeFamilyData.father_occupation,
                        mother_status: storeFamilyData.mother_status,
                        mother_occupation: storeFamilyData.mother_occupation,
                        brothers: storeFamilyData.no_of_brothers,
                        brothers_married: storeFamilyData.brothers_married,
                        sisters: storeFamilyData.no_of_sisters,
                        sisters_married: storeFamilyData.sisters_married,
                        family_type: storeFamilyData.family_type,
                        dowry_jewels: storeFamilyData.dowry_jewels,
                        dowry_property: storeFamilyData.dowry_property,
                        dowry_cash: storeFamilyData.dowry_cash,
                        about_family: storeFamilyData.about_family,
                    },
                    hobbies: {
                        member_auto_id: '',
                        member_id: storeHobbiesData.profile_id,
                        eating_habits: storeHobbiesData.eating_habits,
                        drinking_habits: storeHobbiesData.drinking_habits,
                        smoking_habits: storeHobbiesData.smoking_habits,
                        hobbies: storeHobbiesData.hobbies,

                    },
                    physical: {
                        member_auto_id: '',
                        member_id: storePhysicalData.profile_id,
                        height: storePhysicalData.height,
                        weight: storePhysicalData.weight,
                        body_type: storePhysicalData.body_type,
                        complexion: storePhysicalData.complexion,
                        physical_status: storePhysicalData.physical_status,
                        physical_status_description: storePhysicalData.physical_status_description,
                    },
                    horoscope: {
                        member_auto_id: '',
                        member_id: storeHoroData.profile_id,
                        star: storeHoroData.star,
                        patham: storeHoroData.patham,
                        raasi: storeHoroData.raasi,
                        laknam: storeHoroData.laknam,
                        birth_time: storeHoroData.birth_time && moment.unix(storeHoroData.birth_time).format("h:mma"),
                        birth_place: storeHoroData.birth_place,
                        dhosam_type: storeHoroData.dosham_type,
                        jadhagam_type: storeHoroData.jadhagam_type,
                        raasi_chart: storeHoroData.raasi_chart,
                        amsam_chart: storeHoroData.amsam_chart,
                        dasa: storeHoroData.thisaiyiruppu,
                        dasa_year: storeHoroData.thisaiyiruppu_end_date && storeHoroData.thisaiyiruppu_end_date.split(",")[0],
                        dasa_month: storeHoroData.thisaiyiruppu_end_date && storeHoroData.thisaiyiruppu_end_date.split(",")[1],
                        dasa_days: storeHoroData.thisaiyiruppu_end_date && storeHoroData.thisaiyiruppu_end_date.split(",")[2],

                    },
                    partner: {
                        member_auto_id: '',
                        member_id: storeProfileData.profile_id,
                        prefered_eating_habits: res['data'].data[12].length > 0 && storePartnerData.prefered_eating_habit !== 'Any' && storePartnerData.prefered_eating_habit,
                        prefered_smoking_habits: res['data'].data[12].length > 0 && storePartnerData.prefered_smoking_habit !== 'Any' && storePartnerData.prefered_smoking_habit,
                        prefered_drinking_habits: res['data'].data[12].length > 0 && storePartnerData.prefered_drinking_habit !== 'Any' && storePartnerData.prefered_drinking_habit,
                        prefered_martial_status: res['data'].data[12].length > 0 && storePartnerData.prefered_martial_status,
                        age_from: res['data'].data[12].length > 0 && storePartnerData.age_from,
                        age_to: res['data'].data[12].length > 0 && storePartnerData.age_to,
                        height_from: res['data'].data[12].length > 0 && storePartnerData.height_from,
                        height_to: res['data'].data[12].length > 0 && storePartnerData.height_to,
                        weight_from: res['data'].data[12].length > 0 && storePartnerData.weight_from,
                        weight_to: res['data'].data[12].length > 0 && storePartnerData.weight_to,
                        prefered_physical_status: res['data'].data[12].length > 0 && storePartnerData.prefered_physical_status !== 'Any' && storePartnerData.prefered_physical_status,
                        prefered_mother_tongue: res['data'].data[12].length > 0 && storePartnerData.prefered_mother_tongue,
                        prefered_religion: res['data'].data[12].length > 0 && storePartnerData.prefered_religion,
                        prefered_caste: res['data'].data[12].length > 0 && storePartnerData.prefered_caste,
                        prefered_education: res['data'].data[12].length > 0 && storePartnerData.prefered_education,
                        prefered_job_type: res['data'].data[12].length > 0 && storePartnerData.prefered_occupation,
                        prefered_job: res['data'].data[12].length > 0 && storePartnerData.prefered_occupation_name,
                        prefered_country: null,
                        prefered_state: null,
                        prefered_district: null,
                        income_from: res['data'].data[12].length > 0 && storePartnerData.monthly_income_from && storePartnerData.monthly_income_from * 12,
                        income_to: res['data'].data[12].length > 0 && storePartnerData.monthly_income_to && storePartnerData.monthly_income_to * 12,
                        expectation_notes: null
                    }

                }

                Object.entries(mydata.members).forEach(([key, value]) => {
                    if (value === 'Yes' || value === 'No') {
                        if (value === 'Yes')
                            mydata.members[key] = 1;
                        else
                            mydata.members[key] = 0;
                    }

                });
                Object.entries(mydata.family).forEach(([key, value]) => {
                    if (value === 'Yes' || value === 'No') {
                        if (value === 'Yes')
                            mydata.family[key] = 1;
                        else
                            mydata.family[key] = 0;
                    }

                });
                //remove empty values
                Object.entries(mydata.members).forEach(([key, value]) => {
                    if (value === '') {
                        delete mydata['members'][key];
                    }

                });
                Object.entries(mydata.family).forEach(([key, value]) => {
                    if (value === '') {
                        delete mydata['family'][key];
                    }

                });
                Object.entries(mydata.hobbies).forEach(([key, value]) => {
                    if (value === '') {
                        delete mydata['hobbies'][key];
                    }

                });
                Object.entries(mydata.physical).forEach(([key, value]) => {
                    if (value === '') {
                        delete mydata['physical'][key];
                    }

                });
                Object.entries(mydata.horoscope).forEach(([key, value]) => {
                    if (value === '') {
                        delete mydata['horoscope'][key];
                    }

                });
                //process orders.
                var orders = [];
                storeOrderData.forEach((item) => {
                    var order = {
                        member_auto_id: '',
                        order_id: item.order_id,
                        member_id: item.ordered_id,
                        plan_name: item.ordered_plan,
                        daily_limit: item.profile_daily_limit,
                        monthly_limit: item.profile_monthly_limit,
                        validity_months: Math.round(parseInt(item.validity_days) / 31),
                        category: 'Old Plan',
                        package_price: item.amount,
                        consume_credits: item.profile_credits,
                        used_credits: item.used_profile_credits,
                        package_for: 'Old',
                        is_send_sms: 0,
                        is_send_whatsapp: item.is_whatsapp,
                        is_vip: 0,
                        order_date: item.ordered_date,
                        paid_date: item.paid_date && moment.unix(item.paid_date).format("YYYY-MM-DD"),
                        expiry_date: item.order_expiry_date && moment.unix(item.order_expiry_date).format("YYYY-MM-DD"),
                        cancel_date: item.cancelled_date && moment.unix(item.cancelled_date).format("YYYY-MM-DD"),
                        order_status: item.order_status,
                        is_current_plan: item.is_current_plan === 'Yes' ? 1 : 0,
                        paid_by: item.paid_by,
                        paid_by_ref: item.paid_by_ref,

                    }
                    orders.push(order);
                })
                mydata['orders'] = orders;

                setTimeout(resolve(mydata), 3000);
            }
            else {
                reject("Axios Error")
            }

        });
    });
}