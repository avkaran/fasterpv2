import PsContext from '../../../../../../context'
import React, { useState, useEffect, useContext, useRef } from 'react';
import { Row, Col, message, Spin } from 'antd';
import dayjs from 'dayjs'
import { heightList } from '../../../../../../models/core';
import { kMaxLength } from 'buffer';
import NavbarCollapse from 'react-bootstrap/esm/NavbarCollapse';
const ProfileViewPrintNew = (props) => {
    const context = useContext(PsContext);
    const { allData, selMembers, memberData, business, language, isContact, ...other } = props;
    useEffect(() => {
        //load photos of
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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
            viewValuesAmsam = item.amsam_chart.replaceAll(",", ", ").split("##");
        viewValuesAmsam = viewValuesAmsam.map(obj => {
            if (obj) obj = obj.substring(0, 2);
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
    const getMemberData = () => {
        var memberDataNew = [];
        selMembers.forEach(curId => {
            var curMember = allData.find(member => member.id === curId);
            if (curMember)
                memberDataNew.push(curMember);
        })
        return memberDataNew;
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
        <> <div style={{ display: 'none' }}>
            <div id="profile-view-new" >
                {
                    business && allData && selMembers.length > 0 && getMemberData().map(item => {
                        return <>
                            {
                                //height: '1020px', 
                            }
                            <div style={{ borderStyle: 'solid', borderWidth: '1px', height: '97%', fontSize: '8pt', paddingLeft: '10px' }}>
                                <table width="100%" border="0" cellpadding="0" >
                                    <tr>
                                        <td colspan="3" style={{ color: '#C00', fontWeight: 'bold', textAlign: 'center' }}><span style={{ fontSize: '23pt' }}>{business.business_name}</span></td>
                                    </tr>

                                    <tr>
                                        <td colspan="3" style={{ color: '#063', fontWeight: 'bold', textAlign: 'center' }}><span style={{ fontSize: '17pt' }}>Phone:{business.phone}&nbsp;&nbsp;,&nbsp;{business.alternative_phone_1} &nbsp;&nbsp;&nbsp;Email:{business.email_id}</span></td>
                                    </tr>

                                    <tr>
                                        <td colspan="3" style={{ color: '#000', fontWeight: 'bold', textAlign: 'center' }}><span style={{ fontSize: '13pt' }}>{business.business_address}</span></td>
                                    </tr>

                                    <tr>
                                        <td colspan="3"><strong>பதிவு எண் :  {item.member_id} &nbsp;EMP : {item.member_created_ref_id} &nbsp;Amount : {item.paid_amount} <span style={{ float: 'right' }}>பதிவு தேதி : {dayjs(item.created_date).format("DD/MM/YYYY h:mm a")} </span></strong><hr /></td>
                                    </tr>
                                    <tr>
                                        <td style={{ width: '24%', fontSize: '18pt' }}>பெயர்&nbsp;({item.gender === "Male" ? 'ஆண்' : 'பெண்'})</td>
                                        <td style={{ width: '44%', fontSize: '18pt' }}>: {item.name}   ({item.marital_status === 'Never Married' ? 'முதல்மணம்' : 'மறுமணம்'})</td>
                                        <td rowspan="10" style={{ verticalAlign: 'top' }}>
                                            Print Date: {dayjs().format("DD/MM/YYYY h:mm:ss a")}<br /><br></br>
                                            <img src={item.photo ? context.baseUrl + item.photo : item.gender === 'Male' ? context.noMale : context.noFemale} alt={item.member_id} style={{ maxHeight: '310px' }} />
                                            <br />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style={{ fontSize: '18pt' }} >இனம்(மதம்)</td>
                                        <td style={{ fontSize: '18pt' }}>:&nbsp;{item.caste_name},<br></br> &nbsp;&nbsp;{item.sub_caste} ({item.religion})</td>
                                    </tr>
                                    <tr>
                                        <td style={{ fontSize: '18pt' }}>உணவு</td>
                                        <td style={{ fontSize: '18pt' }}> :&nbsp;{item.veg} {item.nonveg}</td>
                                    </tr>
                                    <tr>
                                        <td style={{ fontSize: '18pt' }}>மொழி </td>
                                        <td style={{ fontSize: '18pt' }}>:&nbsp;{item.languages_known}</td>
                                    </tr>
                                    <tr>
                                        <td style={{ fontSize: '18pt' }}>பிறந்த தேதி</td>
                                        <td style={{ fontSize: '18pt' }}>:&nbsp;{dayjs(item.dob).format("DD/MM/YYYY")}</td>
                                    </tr>
                                    <tr>
                                        <td style={{ fontSize: '18pt' }}>வயது</td>
                                        <td style={{ fontSize: '18pt' }}>:&nbsp;{item.age}</td>
                                    </tr>
                                    <tr>
                                        <td style={{ fontSize: '18pt' }}>நிறம்</td>
                                        <td style={{ fontSize: '18pt' }}>:&nbsp;{item.complexion}</td>
                                    </tr>
                                    <tr>
                                        <td style={{ fontSize: '18pt' }}>உயரம்</td>
                                        <td style={{ fontSize: '18pt' }}>:&nbsp;{getHeight(item.height)},{item.height}cms</td>
                                    </tr>

                                    <tr>
                                        <td style={{ fontSize: '18pt' }}>எடை</td>
                                        <td style={{ fontSize: '18pt' }}>:&nbsp;{item.weight}</td>
                                    </tr>
                                    <tr>
                                        <td style={{ fontSize: '18pt' }}>கல்வி தகுதி</td>
                                        <td style={{ fontSize: '18pt' }}>:&nbsp;{item.course_name},{item.education_detail}  </td>
                                    </tr>
                                   
                                    <tr>
                                        <td style={{ fontSize: '18pt' }}>தொழில்</td>
                                        <td colspan="2" style={{ fontSize: '18pt' }}>:&nbsp;{item.job_type},{item.job_name} </td>
                                    </tr>
                                    <tr>
                                        <td style={{ fontSize: '18pt' }}>பணியிடம்</td>
                                        <td colspan="2" style={{ fontSize: '18pt' }}>:&nbsp;{item.job_district},{item.job_state}</td>
                                    </tr>
                                    <tr>
                                        <td style={{ fontSize: '18pt' }}>வேலை/வருமானம்</td>
                                        <td colspan="2" style={{ fontSize: '18pt' }}>:&nbsp;
                                            {item.job_type} {parseFloat(item.job_annual_income) > 0 ? (parseFloat(item.job_annual_income) / 12).toFixed(2) : 'NA'}/-&nbsp;
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style={{fontSize: '18pt'}}>தந்தை</td>
                                        <td colspan="2" style={{ fontSize: '18pt' }}>:&nbsp;{item.father_name}  ({item.father_occupation})</td>
                                    </tr>
                                    <tr>
                                         <td style={{ fontSize: '19pt' }}>தாயார்</td>
                                         <td colspan="2" style={{ fontSize: '19pt' }}>:&nbsp;{item.mother_name} ({item.mother_occupation})</td>
                                    </tr>
                                    <tr>
                                         <td style={{ fontSize: '18pt' }}>உடன்பிறந்தோர்</td>
                                         <td  colspan="2"style={{ fontSize: '18pt' }}>:&nbsp;ஆண் {item.brothers} பெண் {item.sisters}</td>
                                                

                                    </tr>
                                    <tr>
                                         <td style={{ fontSize: '18pt' }}>திருமணமானவர்</td>
                                         <td colspan="2" style={{ fontSize: '18pt' }}>:&nbsp;ஆண் {item.brothers_married} பெண் {item.sisters_married}</td>
                                    </tr>
                                    <tr>
                                         <td style={{ fontSize: '18pt' }}>சொந்த வீடு</td>
                                         <td  colspan="2" style={{ fontSize: '18pt' }}>:&nbsp;{item.ResidenceType} </td>
                                                
                                    </tr>
                                    <tr>
                                         <td style={{ fontSize: '18pt' }}>பூர்வீகம்</td>
                                         <td colspan="2" style={{ fontSize: '18pt' }}>:&nbsp;{item.poorveegam} </td>
                                                
                                    </tr>
                                    <tr>
                                        <td colspan="3">
                                            <table width="100%" border="0" style={{ borderCollapse: 'collapse', marginLeft: '55%', marginBottom:'-20%' }}>
                                                <tr>
                                                    <td style={{ fontSize: '18pt' }}>உடல்வாகு&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;{item.physical_status}</td>
                                                </tr>
                                                <tr>
                                                    <td style={{ fontSize: '18pt' }}>இருப்பிடம்&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;{item.district},{item.state} </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>

                                    <tr>
                                        <td style={{ fontSize: '18pt' }} >எதிர்பார்ப்பு </td>
                                        <td  colspan="2" style={{ fontSize: '18pt' }}>:&nbsp;{item.about_profile}</td>

                                    </tr>
                                    <tr>
                                        <td style={{ fontSize: '18pt' }}>சீர்வரிசை</td>
                                        <td  colspan="2" style={{ fontSize: '18pt' }} >:&nbsp;{item.dowry_jewels} ,{item.dowry_property} ,{item.dowry_cash}</td>
                                    </tr>
                                    <tr>
                                        <td style={{ fontSize: '18pt' }}>குலதெய்வம்/கோத்திரம்</td>
                                        <td   colspan="2"style={{ fontSize: '18pt' }} >:&nbsp;{item.kuladeivam ? item.kuladeivam.substring(0, 40) : ''} {item.gothra}</td><br></br>
                                    </tr>
                                    <tr>
                                        <td style={{ fontSize: '18pt'}} >  குறிப்பு</td>
                                        <td style={{ fontSize: '16pt'}}>  : {item.about_profile}
                                        </td>
                                    </tr>
                                    <tr>
                                <div>
                                <div style={{width: '50%'}} >
                                    <table width="60%" height="70%" border="0"  style={{fontSize:'10pt !important'}}>
                                    <tr>
                                        <td style={{ width: '30%', height:'35%',textAlign:'right'  }}>

                                            {getRaasiChart(item)}

                                        </td>
                                        <td style={{ width:'30%',height:'35%',textAlign:'right' }}>
                                            {getAmsamChart(item)}
                                        </td>
                                    </tr>
                                     </table>
                                                 
                                                 
                                </div>
                                <div style={{marginTop:'-50%',marginLeft:'55%'}}>
                                        <table  border="0"  style={{ borderCollapse: 'collapse', }}>
                                        <tr>
                                            <td style={{fontSize: '18pt'}}>நட்சத்திரம்</td>
                                            <td style={{fontSize: '18pt'}}>:&nbsp;{item.star}</td>
                                        </tr>
                                        <tr>
                                            <td style={{fontSize: '18pt'}}>ராசி</td>
                                            <td style={{fontSize: '18pt'}}>:&nbsp;{item.raasi}</td>
                                                    
                                        </tr>
                                        <tr>
                                            <td style={{fontSize: '18pt'}}>லக்னம்</td>
                                            <td style={{fontSize: '18pt'}}>:&nbsp;{item.laknam}</td>
                                        </tr>
                                        <tr>
                                             <td style={{fontSize: '18pt'}}>திசை இருப்பு</td>
                                             <td style={{fontSize: '18pt'}}>:&nbsp;{item.dasa}</td>
                                        </tr>
                                        <tr>
                                              <td style={{fontSize: '18pt'}}>பாதம்</td>
                                              <td style={{fontSize: '18pt'}}>:&nbsp;{item.patham}</td>
                                        </tr>
                                        <tr>
                                              <td style={{fontSize: '18pt'}}>நேரம்</td>
                                              <td style={{fontSize: '18pt'}}>:&nbsp;{item.birth_time ? dayjs(item.birth_time, 'H:m:s').format("hh:mm a") : ''}</td>
                                        </tr>
                                        <tr>
                                                <td style={{fontSize: '18pt'}}>இடம்</td>
                                                <td style={{fontSize: '18pt'}}>:&nbsp;{item.area ? item.area.substring(0, 10)+'...':''}</td>
                                        </tr>
                                        </table>
                                </div>
                                </div>
                                               
                                        </tr>
                                        <table  style={{fontSize:'21pt', paddingLeft: '10px',paddingRight:'10px'}}>
                                        <tr>
                                            <td >தோஷம்</td>
                                            <td colspan="2" >:&nbsp;{item.dhosam_type}</td>
                                        </tr>
                                        <tr>
                                             <td><strong >Address</strong></td>
                                             <td colspan="3" >: {item.door_no} {item.street} {item.area}, {item.taluk} {item.district}, {item.state}, {item.landmark}, Pin-{item.pincode}</td>

                                        </tr>
                                        <tr>
                                             <td colspan="3"  ><strong>Phone:&nbsp; {context.psGlobal.decrypt(item.mobile_no)}, {item.mobile_alt_no_1 && context.psGlobal.decrypt(item.mobile_alt_no_1)} ,{item.mobile_alt_no_2 && context.psGlobal.decrypt(item.mobile_alt_no_2)}</strong></td> 
                                             <td colspan="3" ><strong>Whatsapp:&nbsp;{item.whatsapp_no && context.psGlobal.decrypt(item.whatsapp_no)}</strong> </td>
                                        </tr>
                                        </table>
                                        </table>
                                 </div>
                                <p style={{ pageBreakAfter: 'always' }}></p></>
                    })
                }

            </div>
        </div>

        </>
    );

}
export default ProfileViewPrintNew;