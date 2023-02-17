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
const PrintTrialBalance = (props) => {
    const context = useContext(PsContext);   
    useEffect(() => {
      
        if(props.incomedata && props.incomedata.length>0)    console.log(props);
            printDocument("transaction-print");

        if(props.onSuccess)
            props.onSuccess();
    }, []); 

    const getpdate = (id)=>{ 
        if(props.incomeids.length>0){
            var legdername = props.incomeids.find(items => items.ids == id);           
            if(legdername){
                return Math.abs((legdername.prev_credit ? legdername.prev_credit : 0) - (legdername.prev_debit ? legdername.prev_debit : 0));
            }
        }else{
            return 0;
        }
    }
    const getcdate = (id)=>{  
        if(props.incomeids.length>0){
            var legdername = props.incomeids.find(items => items.ids == id);            
            if(legdername){
                return ((legdername.credit ? legdername.credit : 0) - (legdername.debit ? legdername.debit : 0));
            }
        }else{
            return 0;
        }
    }

    const gettdate = (id)=>{                
        if(props.incomeids.length>0){
            var legdername = props.incomeids.find(items => items.ids == id);
            if(legdername){
                return Math.abs((parseFloat((legdername.prev_credit ? legdername.prev_credit : 0) - (legdername.prev_debit ? legdername.prev_debit : 0)) + parseFloat((legdername.credit ? legdername.credit : 0) - (legdername.debit ? legdername.debit : 0))));              
            }
        }else{
            return 0;
        }
    }
   
    return (<><div style={{ display: 'none' }} >
                <div id="transaction-print" style={{ fontSize: '9pt !important',padding:'20px 20px 20px 20px' }} >

                    <h5>Raj Matrimony - {props.listHeading}  </h5>
                    <table width="100%" cellpadding="3" style={{ borderCollapse: 'collapse',float:'left',border:'1px solid #ccc',fontFamily:"'Open Sans', sans-serif",fontSize:'14px' }}>
                        <thead style={{ border :'1px solid #ccc',fontWeight :'bold'}}>
                        <tr>
                            <th  style={styles.head} align="left">Ledgers</th>
                            <th  style={styles.head} align="left">Previous</th>
                            <th  style={styles.head} align="left">Current</th>
                            <th  style={styles.head} align="left">Total</th>
                            <th style={{width:'25px'}}></th>               
                            </tr>
                        </thead>
                        <tbody>   
                        {props.incomedata.map((item, i)=>{
                            return <tr>
                            <td>{item.ledger_name}</td>
                            <td>{getpdate(item.id)}</td>
                            <td>{(item.id==18 ? Math.abs(getcdate(item.id)) : getcdate(item.id)) }</td>
                            <td>{gettdate(item.id)}</td>                      
                            </tr>
                        })}
                   
                         </tbody>
                    </table>
                </div>
            </div>
            </>       
    );

};
export default PrintTrialBalance;