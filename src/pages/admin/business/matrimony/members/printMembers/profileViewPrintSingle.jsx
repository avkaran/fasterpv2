import PsContext from '../../../../../../context'
import React, { useState, useEffect, useContext, useRef } from 'react';
import { Row, Col, message, Spin } from 'antd';
import dayjs from 'dayjs'
import { heightList } from '../../../../../../models/core';
const ProfileViewPrintSingle = (props) => {
    const context = useContext(PsContext);
    const { item, isContact,business, ...other } = props;
    useEffect(() => {
        //load photos of
        // eslint-disable-next-line react-hooks/exhaustive-deps
       // console.log('test', allData, selMembers)
    }, []);
    const getHeight = (cm) => {
        let d = heightList.find((item) => item.cm == cm);
        return d && d.label;
    }
    const getRaasiChart = (item) => {
        var viewValuesRaasi = Array(12).fill('');
        if (item.raasi_chart)
            viewValuesRaasi = item.raasi_chart.split("##");
        viewValuesRaasi = viewValuesRaasi.map(obj => {
            if (obj) {
                var tmpValues = obj.split(",")
                for (var i = 0; i < tmpValues.length; i++) {
                    tmpValues[i]=tmpValues[i].substring(0, 2);
                   
                }
                obj =tmpValues.join(",")
            }
            return obj;
        })
        return <table border="1" style={{ width: '80%', borderCollapse: 'collapse', marginLeft: '30px' }}>
            <tr>
                <td style={{ width: '25%', height: '50px' }}>{viewValuesRaasi[12 - 1]}</td>
                <td style={{ width: '25%' }}>{viewValuesRaasi[1 - 1]}</td>
                <td style={{ width: '25%' }}>{viewValuesRaasi[2 - 1]}</td>
                <td style={{ width: '25%' }}>{viewValuesRaasi[3 - 1]}</td>
            </tr>
            <tr>
                <td style={{ height: '50px' }}>{viewValuesRaasi[11 - 1]}</td>
                <td colspan="2" rowspan="2" style={{ textAlign: 'center' }}><h4>ராசி</h4></td>
                <td>{viewValuesRaasi[4 - 1]}</td>
            </tr>
            <tr>
                <td style={{ height: '50px' }}>{viewValuesRaasi[10 - 1]}</td>

                <td>{viewValuesRaasi[5 - 1]}</td>
            </tr>
            <tr>
                <td style={{ height: '50px' }}>{viewValuesRaasi[9 - 1]}</td>
                <td>{viewValuesRaasi[8 - 1]}</td>
                <td>{viewValuesRaasi[7 - 1]}</td>
                <td>{viewValuesRaasi[6 - 1]}</td>
            </tr>
        </table>

    }
    const getAmsamChart = (item) => {
        var viewValuesAmsam = Array(12).fill('');
        if (item.amsam_chart)
            viewValuesAmsam = item.amsam_chart.split("##");
        viewValuesAmsam = viewValuesAmsam.map(obj => {
            if (obj) {
                var tmpValues = obj.split(",")
                for (var i = 0; i < tmpValues.length; i++) {
                    tmpValues[i]=tmpValues[i].substring(0, 2);
                   
                }
                obj =tmpValues.join(",")
            }
            return obj;
        })
        return <table border="1" style={{ width: '80%', borderCollapse: 'collapse' }}>
            <tr>
                <td style={{ width: '25%', height: '50px' }}>{viewValuesAmsam[12 - 1]}</td>
                <td style={{ width: '25%' }}>{viewValuesAmsam[1 - 1]}</td>
                <td style={{ width: '25%' }}>{viewValuesAmsam[2 - 1]}</td>
                <td style={{ width: '25%' }}>{viewValuesAmsam[3 - 1]}</td>
            </tr>
            <tr>
                <td style={{ height: '50px' }}>{viewValuesAmsam[11 - 1]}</td>
                <td colspan="2" rowspan="2" style={{ textAlign: 'center' }}><h4>அம்சம்</h4></td>
                <td>{viewValuesAmsam[4 - 1]}</td>
            </tr>
            <tr>
                <td style={{ height: '50px' }}>{viewValuesAmsam[10 - 1]}</td>

                <td>{viewValuesAmsam[5 - 1]}</td>
            </tr>
            <tr>
                <td style={{ height: '50px' }}>{viewValuesAmsam[9 - 1]}</td>
                <td>{viewValuesAmsam[8 - 1]}</td>
                <td>{viewValuesAmsam[7 - 1]}</td>
                <td>{viewValuesAmsam[6 - 1]}</td>
            </tr>
        </table>
    }
    
    const getMobileNo = (encrypted) => {
        var decrypted = '-';
        try {
            if (encrypted)
                decrypted = context.psGlobal.decrypt(encrypted);
        }
        catch (err) {
            // document.getElementById("demo").innerHTML = err.message;
        }
        return decrypted;

    }
    return (
        <> 
                {
                    item && <div style={{ borderStyle: 'solid', borderWdth: '1px', height: '97%', fontSize: '8pt !important' }}>
                    <table width="100%" border="0" cellpadding="0">
                        <tr>
                            <td colspan="3" style={{ color: '#C00', fontWeight: 'bold', textAlign: 'center' }}><span style={{ fontSize: '20pt' }}>{business.business_name}</span></td>
                        </tr>
                        <tr>
                            <td colspan="3" style={{ color: '#063', fontWeight: 'bold', textAlign: 'center' }}><span style={{ fontSize: '14pt' }}>Phone:{business.phone}&nbsp;&nbsp;,&nbsp;{business.alternative_phone_1} &nbsp;&nbsp;&nbsp;Email:{business.email_id}</span></td>
                        </tr>
                        <tr>
                            <td colspan="3" style={{ color: '#000', fontWeight: 'bold', textAlign: 'center' }}><span style={{ fontSize: '10pt' }}>{business.business_address}</span></td>
                        </tr>
                        <tr>
                            <td colspan="3"><strong>பதிவு எண் :  {item.member_id} &nbsp;EMP : {item.member_created_ref_id} &nbsp;Amount : {item.paid_amount} <span style={{ float: 'right' }}>பதிவு தேதி : {dayjs(item.created_date).format("DD/MM/YYYY h:mm a")} </span></strong><hr /></td>

                        </tr>
                        <tr>
                            <td style={{ width: '20%' }}>பெயர்&nbsp;({item.gender === "Male" ? 'ஆண்' : 'பெண்'})</td>
                            <td style={{ width: '40%' }}>: {item.name}   ({item.marital_status === 'Never Married' ? 'முதல்மணம்' : 'மறுமணம்'})</td>
                            <td rowspan="9" style={{ verticalAlign: 'top' }}>
                                Print Date: {dayjs().format("DD/MM/YYYY h:mm:ss a")}<br />
                                <img src={item.photo ? context.baseUrl + item.photo : item.gender === 'Male' ? context.noMale : context.noFemale} alt={item.member_id} style={{ maxHeight: '270px' }} />
                                <br />
                                Last Visit:     </td>
                        </tr>
                        <tr>
                            <td>மதம்</td>
                            <td>: {item.religion}</td>
                        </tr>
                        <tr>
                            <td>இனம்</td>
                            <td>: {item.caste_name}, {item.sub_caste}</td>
                        </tr>
                        <tr>
                            <td>பிறந்த தேதி</td>
                            <td>: {dayjs(item.dob).format("DD/MM/YYYY")} , வயது: {item.age}</td>
                        </tr>

                        <tr>
                            <td>நிறம்</td>
                            <td>: {item.complexion} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;உயரம்: {getHeight(item.height)},{item.height} cms</td>
                        </tr>
                        <tr>
                            <td>கல்வி தகுதி</td>
                            <td>: {item.course_name},{item.education_detail}  </td>
                        </tr>
                        <tr>
                            <td>தொழில்</td>
                            <td>: {item.job_type},{item.job_name} </td>
                        </tr>
                        <tr>
                            <td>பணியிடம்</td>
                            <td>: {item.job_district},{item.job_state}</td>
                        </tr>
                        <tr>
                            <td>வருமானம்</td>
                            <td>:
                                மாதம் : ரூ. {parseFloat(item.job_annual_income) > 0 ? (parseFloat(item.job_annual_income) / 12).toFixed(2) : 'NA'}/-&nbsp;
                            </td>
                        </tr>
                        <tr>
                            <td colspan="3">
                                <table width="100%" border="0">
                                    <tr>
                                        <td>தந்தை ({parseInt(item.father_status) === 1 ? 'உண்டு' : 'இல்லை'})</td>
                                        <td>:  {item.father_name} </td>
                                        <td>தாயார் ({parseInt(item.mother_status) === 1 ? 'உண்டு' : 'இல்லை'})</td>
                                        <td>:  {item.mother_name} </td>
                                    </tr>
                                    <tr>
                                        <td>தந்தை வேலை</td>
                                        <td>: {item.father_occupation}</td>
                                        <td>தாயார் வேலை</td>
                                        <td>: {item.mother_occupation} </td>
                                    </tr>
                                    <tr>
                                        <td>உடன் பிறந்தோர்</td>
                                        <td>
                                            <table border="1" style={{ borderCollapse: 'collapse' }}>
                                                <tr>
                                                    <td>ஆண்</td>
                                                    <td>{item.brothers}</td>
                                                    <td>பெண்</td>
                                                    <td>{item.sisters}</td>
                                                </tr>
                                            </table>


                                        </td>
                                        <td>திருமணமானவர்</td>
                                        <td>
                                            <table border="1" style={{ borderCollapse: 'collapse' }}>
                                                <tr>
                                                    <td>ஆண்</td>
                                                    <td>{item.brothers_married}</td>
                                                    <td>பெண்</td>
                                                    <td>{item.sisters_married}</td>
                                                </tr>
                                            </table>

                                        </td>
                                    </tr>
                                    <tr>
                                        <td>பூர்வீகம்</td>
                                        <td>:{item.poorveegam} </td>
                                        <td>இருப்பிடம் மாவட்டம்</td>
                                        <td>:{item.district},{item.state}</td>
                                    </tr>
                                </table>
                            </td>



                            <tr>
                                <td>சீர்வரிசை</td>
                                <td colspan="2">:{item.dowry_jewels} ,{item.dowry_property} ,{item.dowry_cash}</td>
                            </tr>
                            <tr>
                                <td>குலதெய்வம்</td>
                                <td colspan="2">:{item.kuladeivam ? item.kuladeivam.substring(0, 40) : ''}, &nbsp;&nbsp;&nbsp; உடல்வாகு: {item.physical_status}</td>
                            </tr>
                            <tr>
                                <td colspan="3">
                                    குறிப்பு       : {item.about_profile}
                                </td>
                            </tr>
                            <tr>
                                <td colspan="3">

                                    <table width="100%" border="0" style={{ borderCollapse: 'collapse' }}>
                                        <tr>
                                            <td> நட்சத்திரம்:{item.star} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;பாதம் :{item.patham}</td>
                                            <td>ராசி:{item.raasi} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;லக்னம் :{item.laknam}</td>
                                            <td>பிறந்த நேரம்:{item.birth_time ? dayjs(item.birth_time, 'H:m:s').format("hh:mm a") : ''}</td>
                                        </tr>
                                        <tr>

                                            <td>திசை இருப்பு :{item.dasa}</td>
                                            <td>
                                                Year:{item.dasa_year}, &nbsp; Month :{item.dasa_month}, &nbsp; Day :{item.dasa_days}</td>
                                            <td>தோஷம்:{item.dhosam_type}</td>
                                        </tr>
                                    </table>

                                </td>
                            </tr>
                        </tr>
                        <tr>
                            <td colspan="3">
                                <table width="100%" border="0" style={{ fontSize: '6pt !important' }}>
                                    <tr>
                                        <td style={{ width: '50%', padding: '5px', textAlign: 'center' }}>

                                            {getRaasiChart(item)}

                                        </td>
                                        <td style={{ width: '50%', padding: '5px', textAlign: 'center' }}>
                                            {getAmsamChart(item)}
                                        </td>
                                    </tr>

                                </table>

                            </td>
                        </tr>
                        {
                            isContact && (<> <tr>
                                <td colspan="3"><strong>Address :</strong> {item.door_no}, {item.street} , {item.area}  , {item.taluk} ,{item.district},{item.state},{item.landmark}, Pin-{item.pincode}</td>

                            </tr>
                                <tr>

                                    <td colspan="3"><strong>Phone :</strong>
                                        {getMobileNo(item.mobile_no)},
                                        {item.mobile_alt_no_1 && context.psGlobal.decrypt(item.mobile_alt_no_1)},
                                        {item.mobile_alt_no_2 && context.psGlobal.decrypt(item.mobile_alt_no_2)} <strong>Whatsapp:{item.whatsapp_no && context.psGlobal.decrypt(item.whatsapp_no)}
                                        </strong> </td>


                                </tr></>)
                        }

                    </table>
                </div>
                }
        </>
    );

}
export default ProfileViewPrintSingle;