import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Col, message, Space } from 'antd';
import { Button, Card } from 'antd';
import { Form, Input, Select, InputNumber, Radio, Checkbox, Spin, DatePicker } from 'antd';

import PsContext from '../../../../context';
import TextArea from 'antd/lib/input/TextArea';
import dayjs from 'dayjs';
import { FormItem, MyButton } from '../../../../comp';
const AddEditTrans = (props) => {
    const context = useContext(PsContext);
    const navigate = useNavigate();
    const [addeditFormBranch] = Form.useForm();
    const [loader, setLoader] = useState(false);
    const [curAction, setCurAction] = useState('add');
    const [editData, setEditData] = useState(null);
    const [heading] = useState('Transaction');
    const { editIdOrObject, onListClick, onSaveFinish, userId, ...other } = props;
    const [editId, setEditId] = useState(null);
    const [selType, setSelType] = useState('payment-in');
    const [byAccounts, setByAccounts] = useState([]);
    const [toAccounts, setToAccounts] = useState([])
    const [ledgers, setLedgers] = useState([]);
    const [selTransactionDate, setSelTransactionDate] = useState(null)
    useEffect(() => {
        loadLedgers();
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
            addeditFormBranch.setFieldsValue({
                acc_transactions: { tr_date: dayjs() }
            });
            setSelTransactionDate(dayjs());
           
            //addForm.setFieldsValue({ category: 'Plan', package_for: 'Customer(Online)', package_status: 'Active' })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [editIdOrObject]);
    useEffect(() => {
        changeByToAccounts(selType)
    }, [ledgers]);
    const loadEditData = (id) => {
        setLoader(true);
        var reqData = {
            query_type: 'query',
            query: "SELECT * from acc_transactions  where status=1 and id=" + id
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
        addeditFormBranch.setFieldsValue({

            acc_transactions: {
                tr_date: dayjs(mydata.tr_date),

                credit_account: mydata.credit_account,

                debit_account: mydata.debit_account,

                narration: mydata.narration,

                amount: mydata.amount,

                // tr_status: mydata.tr_status

            }
        });
        setSelTransactionDate(dayjs(mydata.tr_date));
        //verify type of transaction
        if((mydata.credit_account_category_name==='Cash' || mydata.credit_account_category_name==='Bank' || mydata.credit_account_category_name==='Cheque') && (mydata.debit_account_category_name==='Cash' || mydata.debit_account_category_name==='Bank' || mydata.debit_account_category_name==='Cheque')){
            setSelType('contra')
        }
        else if(mydata.credit_account_category_name==='Cash' || mydata.credit_account_category_name==='Bank' || mydata.credit_account_category_name==='Cheque'){
            setSelType('payment-in')
        }
        else if(mydata.debit_account_category_name==='Cash' || mydata.debit_account_category_name==='Bank' || mydata.debit_account_category_name==='Cheque'){
            setSelType('payment-out')
        }
        else{
            setSelType('journal')
        }
        
    }
    
    const addeditFormAddEditTransactionOnFinish = (values) => {
        setLoader(true);
        var processedValues = {};
        Object.entries(values.acc_transactions).forEach(([key, value]) => {
            if (value) {

                processedValues[key] = value;
            }

            processedValues['tr_date'] = dayjs(selTransactionDate).format("YYYY-MM-DD hh:mm:ss");
        });
        if (curAction === "add") {
            var reqDataInsert = {
                query_type: 'insert',
                table: 'acc_transactions',
                values: processedValues

            };
            context.psGlobal.apiRequest(reqDataInsert, context.adminUser(userId).mode).then((res) => {

                setLoader(false);
                message.success(heading + ' Added Successfullly');
                onSaveFinish();

            }).catch(err => {
                message.error(err);
                setLoader(false);
            })
        } else if (curAction === "edit") {
            var reqDataUpdate = {
                query_type: 'update',
                table: 'acc_transactions',
                where: { id: editId },
                values: processedValues

            };
            context.psGlobal.apiRequest(reqDataUpdate, context.adminUser(userId).mode).then((res) => {
                setLoader(false);
                message.success(heading + ' Saved Successfullly');
                onSaveFinish();

            }).catch(err => {
                message.error(err);
                setLoader(false);
            })
        }
    };
    const onTypeChange = ({ target: { value } }) => {
        setSelType(value);
        changeByToAccounts(value)
    }
    const changeByToAccounts = (value) => {
        var byAcc = [];
        var toAcc = [];

        if (value === 'payment-in') {
            byAcc = ledgers.filter(item => item.category_name === 'Cash' || item.category_name === 'Bank' || item.category_name === 'Cheque')
            toAcc = ledgers.filter(item => item.category_name !== 'Cash' && item.category_name !== 'Bank' && item.category_name !== 'Cheque')
        }
        else if (value === 'payment-out') {
            toAcc = ledgers.filter(item => item.category_name === 'Cash' || item.category_name === 'Bank' || item.category_name === 'Cheque')
            byAcc = ledgers.filter(item => item.category_name !== 'Cash' && item.category_name !== 'Bank'  && item.category_name !== 'Cheque')
        }
        else if (value === 'contra') {
            byAcc = ledgers.filter(item => item.category_name === 'Cash' || item.category_name === 'Bank' || item.category_name === 'Cheque')
            toAcc = ledgers.filter(item => item.category_name === 'Cash' || item.category_name === 'Bank' || item.category_name === 'Cheque')
        }
        else if (value === 'journal') {
            byAcc = ledgers;
            toAcc = ledgers;
        }
        setByAccounts(byAcc);
        setToAccounts(toAcc);
    }
    const loadLedgers = () => {
        var reqData = {
            query_type: 'query', //query_type=insert | update | delete | query
            query: "select l.*,c.category_name from acc_ledgers l,acc_ledger_categories c where l.status=1 and l.category=c.id"
        };
        context.psGlobal.apiRequest(reqData, context.adminUser(userId).mode).then((res) => {
            setLedgers(res);
        }).catch(err => {
            message.error(err);
        })
    }
    return (
        <>
            <Spin spinning={loader} >
                <Form
                    name="basic"
                    form={addeditFormBranch}
                    labelAlign="left"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 20 }}
                    initialValues={{ remember: true }}
                    onFinish={addeditFormAddEditTransactionOnFinish}
                    autoComplete="off"
                >

                    <FormItem
                        label="Transaction Date"
                        name={['acc_transactions', 'tr_date']}
                    // rules={[{ required: true, message: 'Please Enter template' }]}
                    > <DatePicker value={selTransactionDate} format="DD/MM/YYYY" allowClear={false} 
                    onChange={(date)=>{setSelTransactionDate(date)}}
                    />
                        {/* <Input placeholder="Transfer Date" /> */}
                    </FormItem>


                    <FormItem
                        label="Voucher Type"
                    //  name={['acc_ledgers', 'voucher_type']}
                    > <Radio.Group value={selType} buttonStyle="solid" onChange={onTypeChange}>
                            <Radio.Button value="payment-in">Payment In</Radio.Button>
                            <Radio.Button value="payment-out">Payment Out</Radio.Button>
                            <Radio.Button value="contra">Contra</Radio.Button>
                            <Radio.Button value="journal">Journal</Radio.Button>
                        </Radio.Group>
                    </FormItem>

                    <FormItem
                        label="By Account"
                        name={['acc_transactions', 'credit_account']}
                        // onFinish={addeditFormAddEditTransactionOnFinish}
                        rules={[{ required: true, message: 'Please Enter Plan Name' }]}
                    >
                        <Select
                            showSearch
                            placeholder="By Account"
                            // onChange={onPlanChange}
                            optionFilterProp="children"
                            //onChange={businessStatusOnChange}
                            filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                        >
                            {
                                byAccounts.map(item => {
                                    return <Select.Option value={item.id} >{item.ledger_name}</Select.Option>
                                })
                            }
                        </Select>
                    </FormItem>

                    <FormItem
                        label="To Account"
                        name={['acc_transactions', 'debit_account']}
                        // onFinish={addeditFormAddEditTransactionOnFinish}
                        rules={[{ required: true, message: 'Please Enter Plan Name' }]}
                    >
                        <Select
                            showSearch
                            placeholder="To Account"
                            // onChange={onPlanChange}
                            optionFilterProp="children"
                            //onChange={businessStatusOnChange}
                            filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                        >
                            {
                                toAccounts.map(item => {
                                    return <Select.Option value={item.id} >{item.ledger_name}</Select.Option>
                                })
                            }
                        </Select>
                    </FormItem>


                    <FormItem
                        label="Narration"
                        name={['acc_transactions', 'narration']}
                        rules={[{ required: true, message: 'Please Enter To narration ' }]}
                    >
                        <TextArea placeholder="narration" />
                    </FormItem>


                    <FormItem
                        label="Amount"
                        name={['acc_transactions', 'amount']}
                        rules={[{ required: true, message: 'Please Enter To amount' }]}
                    >
                        <Input placeholder="amount" />
                    </FormItem>


                    <FormItem wrapperCol={{ offset: 10, span: 24 }}>
                        <Space>
                            <Button size="large" type="outlined" onClick={onListClick}>
                                Cancel
                            </Button>
                            <MyButton size="large" type="primary" htmlType="submit">
                                {curAction === "edit" ? "Update" : "Submit"}
                            </MyButton>
                        </Space>

                    </FormItem>

                </Form>
            </Spin>
        </>
    )
}
export default AddEditTrans;
