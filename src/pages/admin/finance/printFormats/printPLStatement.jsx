import PsContext from '../../../../context'
import React, { useState, useEffect, useContext, useRef } from 'react';
import { Row, Col, message, Spin, Modal } from 'antd';
import dayjs from 'dayjs'
import { heightList } from '../../../..//models/core';
import { faBarsProgress, faL } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { printDocument } from '../../../../utils';

const styles = {
	head: {
		color:'#3a3939'
	},    
}
const PrintPLStatement = (props) => {
    const context = useContext(PsContext);   
    useEffect(() => {
      
        if(props.incomedata && props.incomedata.length>0)      
            printDocument("transaction-print");
            
        if(props.onSuccess)
            props.onSuccess();
    }, []); 
    let previous_total=0;
    const getpdate = (id)=>{        

        if(props.incomeids.length>0){
            var legdername = props.incomeids.find(items => items.debit_account  == id || items.credit_account == id);
            if(legdername){
                previous_total+=(legdername.prev_debit ? legdername.prev_debit : 0) - (legdername.prev_credit ? legdername.prev_credit : 0);
                return (legdername.prev_debit ? legdername.prev_debit : 0) - (legdername.prev_credit ? legdername.prev_credit : 0);
            }
        }else{
            return 0;
        }
    }
    let current_total =0;
    const getcdate = (id)=>{        
        if(props.incomeids.length>0){
            var legdername = props.incomeids.find(items => items.debit_account  == id || items.credit_account == id);
            if(legdername){
                current_total+=(legdername.debit ? legdername.debit : 0) - (legdername.credit ? legdername.credit : 0);
                return (legdername.debit ? legdername.debit : 0) - (legdername.credit ? legdername.credit : 0);
            }
        }else{
            return 0;
        }
    }
    let asset_total =0;
    const gettdate = (id)=>{                
        if(props.incomeids.length>0){
            var legdername = props.incomeids.find(items => items.debit_account  == id || items.credit_account == id);
            if(legdername){
                asset_total+=(parseFloat((legdername.prev_debit ? legdername.prev_debit : 0) - (legdername.prev_credit ? legdername.prev_credit : 0)) + parseFloat((legdername.debit ? legdername.debit : 0) - (legdername.credit ? legdername.credit : 0)));
                return (parseFloat((legdername.prev_debit ? legdername.prev_debit : 0) - (legdername.prev_credit ? legdername.prev_credit : 0)) + parseFloat((legdername.debit ? legdername.debit : 0) - (legdername.credit ? legdername.credit : 0)));              
            }
        }else{
            return 0;
        }
    }
let expense_prev_total =0;
    const getepdate = (id)=>{       
        if(props.expenseids.length>0){
            var legdername = props.expenseids.find(items => items.ids  == id);
            if(legdername){
                expense_prev_total+=Math.abs((legdername.prev_debit ? legdername.prev_debit : 0) - (legdername.prev_credit ? legdername.prev_credit : 0));
                return Math.abs((legdername.prev_debit ? legdername.prev_debit : 0) - (legdername.prev_credit ? legdername.prev_credit : 0));
            }else{
                var legdername1 = props.expenseids.find(items => items.credit_account === null);
                if(legdername1){
                    return Math.abs(legdername1.prev_credit);
                }
                /* if(legdername1.prev_credit){
                    return Math.abs((legdername1.prev_debit ? legdername1.prev_debit : 0) - (legdername1.prev_credit ? legdername1.prev_credit : 0));
                } */
                
            }
        }else{
            return 0;
        }
    }
    let expense_current_total =0;
    const getecdate = (id)=>{        
        //console.log(props.incomeids);
        if(props.expenseids.length>0){
            var legdername = props.expenseids.find(items => items.ids  == id );
            if(legdername){
                expense_current_total+=Math.abs((legdername.debit ? legdername.debit : 0) - (legdername.credit ? legdername.credit : 0));
                return Math.abs((legdername.debit ? legdername.debit : 0) - (legdername.credit ? legdername.credit : 0));
            }
        }else{
            return 0;
        }
    }
    let expense_total =0;
    const getetdate = (id)=>{                
        if(props.expenseids.length>0){
            var legdername = props.expenseids.find(items => items.ids == id );
            if(legdername){
                expense_total+=Math.abs(parseFloat((legdername.prev_debit ? legdername.prev_debit : 0) - (legdername.prev_credit ? legdername.prev_credit : 0)) + parseFloat((legdername.debit ? legdername.debit : 0) - (legdername.credit ? legdername.credit : 0)));
                return Math.abs(parseFloat((legdername.prev_debit ? legdername.prev_debit : 0) - (legdername.prev_credit ? legdername.prev_credit : 0)) + parseFloat((legdername.debit ? legdername.debit : 0) - (legdername.credit ? legdername.credit : 0)));              
            }
        }else{
            return 0;
        }
    }
   

    return (<>
    <div style={{ display: 'none',fontFamily:"'Open Sans', sans-serif" }} >
                <div id="transaction-print" style={{ fontSize: '9pt !important',padding:'20px 20px 20px 20px' }} >

                    <h5>Raj Matrimony - {props.listHeading}  </h5>
                    <table width="50%" cellpadding="3" style={{ borderCollapse: 'collapse',float:'left',border:'1px solid #ccc',fontFamily:"'Open Sans', sans-serif",fontSize:'14px' }}>
                        <thead style={{ border :'1px solid #ccc',fontWeight :'bold'}}>
                        <tr>
                            <th style={styles.head} align="left">Incomes</th>
                            <th style={styles.head} align="left">Previous</th>
                            <th style={styles.head} align="left">Current</th>
                            <th style={styles.head} align="left">Total</th>
                            <th style={{width:'25px'}}></th>               
                            </tr>
                        </thead>
                        <tbody>   
                        {props.incomedata.map((item, i)=>{
                    return <tr>
                        <td>{item.ledger_name}</td>
                        <td>{getpdate(item.id)}</td>
                        <td>{getcdate(item.id)}</td>
                        <td>{gettdate(item.id)}</td>
                        </tr>
                    })}
                    {props.incomedata.length>0 ? 
                     <tr>
                        <td>Total</td>
                        <td>{previous_total}</td>
                        <td>{current_total}</td>
                        <td>{asset_total}</td>
                    </tr> : ''}      
                         </tbody>
                    </table>

                    <table width="50%" cellpadding="3" style={{ borderCollapse: 'collapse',float:'right',border:'1px solid #ccc',fontFamily:"'Open Sans', sans-serif",fontSize:'14px' }}>
                        <thead style={{ border :'1px solid #ccc',fontWeight :'bold'}}>
                        <tr>            
                        <th style={styles.head} align="left">Expenses</th>
                        <th style={styles.head} align="left">Previous</th>
                        <th style={styles.head} align="left">Current</th>
                        <th style={styles.head} align="left">Total</th>
                        </tr>
                        </thead>
                        <tbody>   
                        {props.expensedata.map((item, i)=>{
                        return <tr>
                            <td>{item.ledger_name}</td>
                            <td>{getepdate(item.id)}</td>
                            <td>{getecdate(item.id)}</td>
                            <td>{getetdate(item.id)}</td>
                        </tr> 
                        })}
                         <tr>
                        <td>Trading Profit</td>                   
                        <td>{getpdate(18) ? getpdate(18)-expense_prev_total: 0}</td>
                        <td>{getcdate(18) ? getcdate(18)-expense_current_total:0}</td>
                        <td>{gettdate(18) ? gettdate(18)-expense_total:0}</td>                      
                    </tr>
                        {props.expensedata.length>0 ? 
                        <tr>
                        <td>Total</td>
                        <td>{expense_prev_total ? (getpdate(18)-expense_prev_total)+expense_prev_total : 0}</td>
                        <td>{expense_current_total ? (getcdate(18)-expense_current_total)+expense_current_total: 0}</td>
                        <td>{expense_total ? (gettdate(18)-expense_total)+expense_total: 0}</td>
                    </tr> :'' }
                  
                         </tbody>
                    </table>
                </div>
            </div>

            </>);

};

export default PrintPLStatement;
