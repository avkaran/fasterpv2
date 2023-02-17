import PsContext from '../../../../context'
import React, { useState, useEffect, useContext, useRef } from 'react';
import { Row, Col, message, Spin, Modal } from 'antd';
import dayjs from 'dayjs'
import { heightList } from '../../../..//models/core';
import { faBarsProgress, faL } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { printDocument } from '../../../../utils';
export const PrintLedgerTransactions = React.forwardRef((props, ref) => {
    const context = useContext(PsContext);
    const currentTotalRecords = useRef(0);
    const currentFetchedRecords = useRef(0);
    const [visibleProgressModal, setVisibleProgressModal] = useState(false);
    const [data, setData] = useState([]);
    const [debitAccounts, setDebitAccounts] = useState();
    const [creditAccounts, setCreditAccounts] = useState();
    const [debits, setDebits] = useState(0);
    const [credits, setCredits] = useState(0);
    const { listHeading, recordsPerRequestOrPage, countQuery, listQuery, refresh,filterColumns, userId, ledgername, ledgerid, onDataLoadFinish,onPrintCancel, ...other } = props;
    const [started,setStarted]=useState(false)
    useEffect(() => {
        resetResult();
       /*  getTransactionDebit(values.debit_account);
        getTransactionCredit(values.debit_account); */
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [refresh]);
    useEffect(() => {
        if (data.length === currentTotalRecords.current && started){
            setVisibleProgressModal(false);
            onDataLoadFinish()
        }
        getTransactionDebit(ledgerid);
        getTransactionCredit(ledgerid);
  
           
    }, [data])
    const loadMoreData = () => {
        setStarted(true)
        var reqData = {
            query_type: "query", //query_type=insert | update | delete | query
            query: listQuery + " LIMIT " + currentFetchedRecords.current + "," + recordsPerRequestOrPage,
        };
        context.psGlobal.apiRequest(reqData, context.adminUser(userId).mode).then((res) => {

            setData(prev => [...prev, ...res]);
            currentFetchedRecords.current = currentFetchedRecords.current + res.length;
            if (currentFetchedRecords.current < recordsPerRequestOrPage) {
                //hasMoreData.current = false;                
                // viewPrintPreview()
                // return;
            }
            if (currentTotalRecords.current > currentFetchedRecords.current) {   
                // hasMoreData.current = true;
                loadMoreData();
            }           
            else {              
                setVisibleProgressModal(false);
                onDataLoadFinish()
                //printDocument("transaction-print");  
              //   viewPrintPreview();
            }
            


        }).catch((err) => {
            message.error(err);
        });
    }
    const resetResult = () => {
        setVisibleProgressModal(true);
        var reqData = {
            query_type: "query", //query_type=insert | update | delete | query
            query: countQuery
        };
        context.psGlobal.apiRequest(reqData, context.adminUser(userId).mode).then((res) => {

            currentTotalRecords.current = parseInt(res[0].count);
            currentFetchedRecords.current = 0;
            data.length = null
            loadMoreData()
        }).catch((err) => {
            message.error(err);
        });
    }

    
    const getTransactionDebit= (ledgerid) => {  
        var filterDate = filterColumns.current[0].replace('date(trans.tr_date)>=','date(tr_date)<');    
        var reqData = {
            query_type: 'query', //query_type=insert | update | delete | query
            query: "select amount,debit_account,SUM(amount) as total from acc_transactions where status=1 AND debit_account = "+ledgerid+" AND "+filterDate+""
        };
        context.psGlobal.apiRequest(reqData, context.adminUser(userId).mode).then((res) => {
            if(res.length>0){
                setDebits(res[0].total);
                setDebitAccounts(res);
            }         
         })         
         .catch(err => {
           // message.error(err);
        })
    };
      const getTransactionCredit = (ledgerid) => {
        var filterDate = filterColumns.current[0].replace('date(trans.tr_date)>=','date(tr_date)<');
        var reqData = {
            query_type: 'query', //query_type=insert | update | delete | query
            query: "select amount,credit_account,SUM(amount) as total from acc_transactions where status=1 AND credit_account = "+ledgerid+" AND "+filterDate+""
        };
        context.psGlobal.apiRequest(reqData, context.adminUser(userId).mode).then((res) => {
            if(res.length>0){         
                setCredits(res[0].total); 
                setCreditAccounts(res);
            }         
         })         
         .catch(err => {
           // message.error(err);
        })
    };

    var totals =0;
    var balances = Math.abs(credits - debits);
    const calculateAmounts =(deb, cred,amt)=>{      
      if(cred==ledgerid){
        if(creditAccounts){    
            totals = (parseFloat(balances) + parseFloat(amt));
            balances = totals;           
            return balances; 
        }  
      }
      if(deb==ledgerid){
        if(debitAccounts){
            totals = (parseFloat(balances) - parseFloat(amt));
            balances = totals;  
            return balances;
        }
      }      
    };
    
    return (
        <>{
            (<><div style={{ display: 'none' }} >
                <div ref={ref} id="transaction-print" style={{ fontSize: '9pt !important',padding:'20px 20px 20px 20px' }} >

                    <h5>Raj Matrimony , Transactions Report {listHeading} <span style={{ float: 'right' }}> Count: {currentTotalRecords.current}</span></h5>
                    <table width="100%" border="1" cellpadding="3" style={{ borderCollapse: 'collapse' }}>
                        <thead style={{ border :'2px solid black',fontWeight :'bold'}}>
                          <tr>
                            <td>S.No</td>
                            <td>Date</td>
                            <td>Account</td>
                            <td>Description</td>
                            <td>Debit</td>
                            <td>Credit</td>
                            <td>Balance</td>
                        </tr>
                        </thead>
                        <tbody>   
                        <tr style={{ fontWeight :'bold'}}>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td>Opening</td>
                            <td>{debits ? debits : 0}</td>
                            <td>{credits ? credits : 0}</td>
                            <td>{Math.abs(credits - debits)}</td>
                        </tr>                    
                        {data.map((item, index) => {
                            return <tr key={item.id}>
                                <td>{index + 1}</td>
                                <td>{dayjs(item.tr_date).format("DD/MM/YYYY hh:mm a")}</td>
                                <td>{item.debit_ledname} {item.credit_ledname}</td>
                                <td>{item.narration}</td>
                                <td>{(item.debit_account==ledgerid ? item.amount : '')}</td>
                                <td>{(item.credit_account==ledgerid ? item.amount : '')}</td>
                                <td>{calculateAmounts(item.debit_account,item.credit_account,item.amount)}</td>                             
                            </tr>
                        })
                        }
                         </tbody>
                    </table>

                </div>
            </div>

            </>)
        }
            <Modal
                open={visibleProgressModal}
                zIndex={10000}
                footer={null}
                centered={true}
                closable={true}
                //style={{ marginTop: '20px' }}
                width={600}
                // footer={null}
                onCancel={() => { setVisibleProgressModal(false);onPrintCancel() }}
                title={<span style={{ color: 'green' }} ><FontAwesomeIcon icon={faBarsProgress} /> &nbsp; Printing...</span>}
            >
                <h5>Printing Progress</h5>
                <Spin spinning={visibleProgressModal}>
                    Processing....
                </Spin>

            </Modal>
        </>
    );

});
