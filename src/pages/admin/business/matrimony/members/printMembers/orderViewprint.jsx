import PsContext from '../../../../../../context'
import React, { useState, useEffect, useContext, useRef } from 'react';
import { Row, Col, message, Spin } from 'antd';
import dayjs from 'dayjs'
import { heightList } from '../../../../../../models/core';
const OrderViewPrint = (props) => {
    const context = useContext(PsContext);
    const { receiptData, business, ...other } = props;
    useEffect(() => {
        //load photos of
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
        <> <div style={{ display: 'none' }}>
            <div id="receipt-print" style={{ fontSize: '9pt !important' }}>
                {
                    business && receiptData &&
                        (<div style={{borderStyle:'solid', borderWidth:'1px' , height:'999px'}}>
                        <table width="100%" border="1" cellpadding="3" style={{borderCollapse:'collapse'}}>
                          <tr>
                             <td colspan="3" style={{color:'#C00',fontWeight:'bold', textAlign:'center'}}><span style={{fontsize:'20pt'}}>ஸ்ரீ ராஜேஸ்வரி திருமண தகவல் மையம்</span></td>
                             
                          </tr>
                          <tr>
                           <td colspan="3" style={{color:'#063',fontweight:'bold', textalign:'center'}}><span style={{fontSize:'14pt'}}>Phone:8940150880&nbsp;&nbsp;,&nbsp;9488450460&nbsp;&nbsp;&nbsp;Email:info@rajeshwarimatrimony.com</span><hr/></td>
                          </tr>
                          <tr>
                            <td>ரசீது  எண் : {receiptData.order_id}</td>
                            
                            <td style={{textAlign:'center'}}><h2>Receipt/ரசீது</h2></td>
                            <td>தேதி : {dayjs(receiptData.paid_date).format("DD/MM/YYYY")}</td>
                          </tr>
                          <tr>
                            <td rowspan="6">
                            <img src={receiptData.photo?context.baseUrl + receiptData.photo:receiptData.gender==='Male'?context.noMale:context.noFemale} alt={receiptData.member_id} style={{ maxHeight: '270px' }} />
            
                                </td>
                            <td>பதிவு எண் :
                            {receiptData.member_id}</td>
                            <td>Amount:
                            {receiptData.package_price}</td>
                          </tr>
                          <tr>
                            <td>Payment Mode : {receiptData.payment_mode}</td>
                            <td>Employee : {receiptData.paid_by_ref}</td>
                          </tr>
                          <tr>
                            <td>Plan: {receiptData.plan_name}</td>
                            <td>Validity  : {receiptData.validity_months} Month(s)</td>
                          </tr>
                          <tr>
                            <td colspan="2">
                            
                                <table width="100%" border="0">
                                  <tr>
                                    <td>பெயர் </td>
                                    <td>: {receiptData.name}</td>
                                  </tr>
                                  <tr>
                                    <td>ஜாதி </td>
                                    <td>: {receiptData.caste_name}, {receiptData.sub_caste}</td>
                                  </tr>
                                  <tr>
                                    <td>முகவரி </td>
                                    <td>{receiptData.door_no}, {receiptData.street} , {receiptData.area}  ,{receiptData.district},{receiptData.state}, Pin-{receiptData.pincode}</td>
                                  </tr>
                                  <tr>
                                    <td>மொபைல் எண்  </td>
                                    <td>: {context.psGlobal.decrypt(receiptData.mobile_no)}</td>
                                  </tr>
                                </table>
                            
                            </td>
                          </tr>
                          <tr>
                            <td>Working Hours : 10 AM to 6 PM</td>
                            <td>Signature</td>
                          </tr>
                          <tr>
                            <td>பதிவுக்கட்டணம் (நன்கொடை) திரும்பி வழங்கப்படமாட்டாது</td>
                            <td>&nbsp;</td>
                          </tr>
                        </table>
                      </div>
                            )
                   
                }



            </div>
        </div>

        </>
    );

}
export default OrderViewPrint;