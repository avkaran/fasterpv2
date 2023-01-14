import PsContext from '../../../../context'
import React, { useState, useEffect, useContext, useRef } from 'react';
import { Row, Col, message, Spin, Modal } from 'antd';
import dayjs from 'dayjs'
import { heightList } from '../../../..//models/core';
import { faBarsProgress, faL } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { printDocument } from '../../../../utils';
const PrintFinancialTransactions = (props) => {
    const context = useContext(PsContext);
    const currentTotalRecords = useRef(0);
    const currentFetchedRecords = useRef(0);
    const [visibleProgressModal, setVisibleProgressModal] = useState(false);
    const [data, setData] = useState([]);


    const { listHeading, recordsPerRequestOrPage, countQuery, listQuery, refresh, userId, onPreviewFinish, ...other } = props;
    useEffect(() => {
        resetResult();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [refresh]);
    const loadMoreData = () => {
        var reqData = {
            query_type: "query", //query_type=insert | update | delete | query
            query: listQuery + " LIMIT " + currentFetchedRecords.current + "," + recordsPerRequestOrPage,
        };
        context.psGlobal.apiRequest(reqData, context.adminUser(userId).mode).then((res) => {

            setData(prev => [...prev, ...res]);
            currentFetchedRecords.current = currentFetchedRecords.current + res.length;
            message.success(res.length + " " + currentFetchedRecords.current + " " + currentTotalRecords.current)
            if (currentFetchedRecords.current < recordsPerRequestOrPage) {
                //hasMoreData.current = false;
up
                setVisibleProgressModal(false);
                viewPrintPreview()
                return;
            }

            if (currentTotalRecords.current > currentFetchedRecords.current) {
                // hasMoreData.current = true;

                loadMoreData();
            }
            else {
                setVisibleProgressModal(false);
                
                    viewPrintPreview();

            }



        }).catch((err) => {
            message.error(err);
        });
    }
    const viewPrintPreview = () => {
        printDocument('transaction-print');
        setVisibleProgressModal(false);
        onPreviewFinish();
    }
    const resetResult = () => {
        setVisibleProgressModal(true);
        var reqData = {
            query_type: "query", //query_type=insert | update | delete | query
            query: countQuery
        };
        context.psGlobal.apiRequest(reqData, context.adminUser(userId).mode).then((res) => {
            message.success(" count" + res[0].count)
            currentTotalRecords.current = parseInt(res[0].count);
            currentFetchedRecords.current = 0;
            data.length = null
            loadMoreData()
        }).catch((err) => {
            message.error(err);
        });
    }
    return (
        <>{
            (<><div style={{ display: 'none' }}>
                <div id="transaction-print" style={{ fontSize: '9pt !important' }}>

                    <h5>Raj Matrimony , Transactions Report {listHeading} <span style={{ float: 'right' }}> Count: {currentTotalRecords.current}</span></h5>
                    <table width="100%" border="1" cellpadding="3" style={{ borderCollapse: 'collapse' }}>
                        <tr>
                            <td>S.No</td>
                            <td>Date</td>
                            <td>Particulars</td>
                            <td>Credit</td>
                            <td>Debit</td>
                        </tr>
                        {
                            data.map((item, index) => {
                                return <tr key={item.id}>
                                    <td>{index + 1}</td>
                                    <td>{dayjs(item.tr_date).format("DD/MM/YYYY")}</td>
                                    <td>
                                        <span style={{ fontWeight: 'bold', color: 'green' }}>BY</span> {item.credit_account_name}
                                        <br />
                                        &nbsp; &nbsp; &nbsp; <span style={{ fontWeight: 'bold', color: 'red' }}>TO</span> {item.debit_account_name}
                                        <br />
                                        {item.narration}
                                    </td>
                                    <td style={{ verticalAlign: 'top' }}>{item.amount}</td>
                                    <td style={{ verticalAlign: 'top' }}><br />{item.amount}</td>

                                </tr>
                            })
                        }
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
                onCancel={() => { setVisibleProgressModal(false) }}
                title={<span style={{ color: 'green' }} ><FontAwesomeIcon icon={faBarsProgress} /> &nbsp; Printing...</span>}
            >
                <h5>Printing Progress</h5>
                <Spin spinning={visibleProgressModal}>
                    Processing....
                </Spin>

            </Modal>
        </>
    );

}
export default PrintFinancialTransactions;