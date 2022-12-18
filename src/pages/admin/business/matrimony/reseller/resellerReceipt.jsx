import PsContext from '../../../../../context'
import React, { useEffect, useContext } from 'react';
import dayjs from 'dayjs'
const ResellerReceipt = (props) => {
    const context = useContext(PsContext);
    const { franchisReceipteData, business, ...other } = props;
    useEffect(() => {
        //load photos of
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

   
    return (
        <> <div style={{ display: 'none' }}>
            <div id="receipt-print" style={{ fontSize: '9pt !important' }}>
                {
                    business && franchisReceipteData &&
                        (<div style={{borderStyle:'solid', borderWidth:'1px' , height:'1035px'}}>
                        <table width="100%" border="1" cellpadding="3" style={{borderCollapse:'collapse'}}>
                          <tr>
                             <td colspan="3" style={{color:'#C00',fontWeight:'bold', textAlign:'center'}}><span style={{fontsize:'20pt'}}>{business.business_name}</span></td>
                             
                          </tr>
                          <tr>
                           <td colspan="3" style={{color:'#063',fontweight:'bold',textAlign:'center'}}>
                            <span style={{fontSize:'14pt'}}>Phone:{franchisReceipteData.mobile_no}<br></br>
                            Email:{franchisReceipteData.email}</span><hr/></td>
                          </tr>
                          <tr>
                            <td>ரசீது  எண் : {franchisReceipteData.bill_voucher_no}</td>
                            <td style={{textAlign:'center'}}><h2>Receipt/ரசீது</h2></td>
                           
                          </tr>
                          <tr>
                            
                            <td>பதிவு எண் :
                            {franchisReceipteData.franchise_code}</td>
                            <td>Amount:{franchisReceipteData.paid_amount}</td>
                          </tr>
                          <tr>
                            <td>Payment Mode : {franchisReceipteData.user_payment_mode }</td>
                            <td>Employee :
                            {franchisReceipteData.paid_by_emp}</td>
                           
                          </tr>
                          <tr>
                            
                            <td>Credit Amount :{franchisReceipteData.credit} </td>
                            <td>தேதி : {dayjs(franchisReceipteData.transaction_date).format("DD/MM/YYYY h:mm a")}</td>
                          </tr>
                          <tr>
                            <td colspan="2">
                            
                                <table width="100%" border="0">
                                  <tr>
                                    <td>பெயர் </td>
                                    <td>: {franchisReceipteData.name}</td>
                                  </tr>
                                  
                                  <tr>
                                    <td>முகவரி </td>
                                    <td><strong>Address :</strong> {franchisReceipteData.address}</td>
                                  </tr>
                                  <tr>
                                    <td>மொபைல் எண்  </td>
                                    <td>: {franchisReceipteData.mobile_no}</td>
                                  </tr>
                                </table>
                            
                            </td>
                          </tr>
                          <tr>
                            <td>Working Hours : 10 AM to 6 PM</td>
                            <td>Signature</td>
                          </tr>
                          <tr>
                            <td>கட்டணம் திரும்பி வழங்கப்படமாட்டாது</td>
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
export default ResellerReceipt;