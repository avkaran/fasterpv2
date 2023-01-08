import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Col, message, Space } from 'antd';
import { Button, Card } from 'antd';
import { Form, Input, Select, InputNumber, Radio, Checkbox } from 'antd';
import { Breadcrumb, Layout, Spin, DatePicker } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import PsContext from '../../../context';
import { Editor } from '@tinymce/tinymce-react';
import { ImageUpload, FormItem, MyButton } from '../../../comp';
import { capitalizeFirst } from '../../../utils';
import PhoneInput from 'react-phone-input-2'
import { CountryDropdown, RegionDropdown } from 'react-country-region-selector';
import TextArea from 'antd/lib/input/TextArea';
import dayjs from 'dayjs';

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
    const [country, setCountry] = useState('');
    const [districts, setDistricts] = useState([]);
    const [selType, setSelType] = useState('payment in');
    const [districtLoading, setDistrictLoading] = useState(false)
    const [refreshTable, setRefreshTable] = useState(0);
    const [planNames, setPlanNames] = useState(null);
    const [selData, setSelData] = useState({})
    useEffect(() => {
        loadPlanNames();
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
            });
            //addForm.setFieldsValue({ category: 'Plan', package_for: 'Customer(Online)', package_status: 'Active' })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
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
                tr_date: mydata.tr_date,

                credit_account: mydata.credit_account,

                debit_account: mydata.debit_account,

                narration: mydata.narration,

                amount: mydata.amount,

                tr_status: mydata.tr_status

            }
        });
      
    }
    const addeditFormBranchOnFinish = (values) => {
        setLoader(true);
        var processedValues = {};
        Object.entries(values.acc_transactions).forEach(([key, value]) => {
            if (value) {

                processedValues[key] = value;
            }
            if (values.acc_transactions.tr_status === 'Active')
                processedValues['tr_status'] = 1;
            else
                processedValues['tr_status'] = 0;
            processedValues['tr_date'] = dayjs(values.acc_transactions.tr_status).format("YYYY-MM-DD");
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
        setRefreshTable(prev => prev + 1)
    }
    const loadPlanNames = () => {
        var reqData = {
            query_type: 'query', //query_type=insert | update | delete | query

            query: "select * from acc_ledgers where status=1 "
        };
        context.psGlobal.apiRequest(reqData, context.adminUser(userId).mode).then((res) => {
            setPlanNames(res);
        }).catch(err => {
            message.error(err);
        })
    }
    // const dobOnChange = (date) => {
    //     //  console.log('dchange', date)
    //     setSelData(date);
    //     addeditFormBranch.setFieldsValue({
    //         employees: { dob: dayjs(date).format('YYYY-MM-DD') }
    //     })

    // };
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
                    onFinish={addeditFormBranchOnFinish}
                    autoComplete="off"
                >
                    <Row gutter={16}>
                        <Col className='gutter-row' xs={24} xl={20}>
                            <FormItem
                                label="Transaction Date"
                                name={['acc_transactions', 'tr_date']}
                            // rules={[{ required: true, message: 'Please Enter template' }]}
                            > <DatePicker defaultValue={dayjs()} />
                                {/* <Input placeholder="Transfer Date" /> */}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col className='gutter-row' xs={24} xl={20}>
                            <FormItem
                                label="Voucher Type"
                                name={['acc_ledgers', 'ledger_type']}
                            > <Radio.Group defaultValue="a" buttonStyle="solid">
                                    <Radio.Button value="a">Payment In</Radio.Button>
                                    <Radio.Button value="c">Payment Out</Radio.Button>
                                </Radio.Group>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col className='gutter-row' xs={24} xl={20}>
                            <FormItem
                                label="By Account"
                                name={['acc_transactions', 'credit_account']}
                                // onFinish={addeditFormBranchOnFinish}
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
                                        planNames && planNames.map(item => {
                                            return <Select.Option value={item.id} >{item.ledger_name}</Select.Option>
                                        })
                                    }
                                </Select>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col className='gutter-row' xs={24} xl={20}>
                            <FormItem
                                label="To Account"
                                name={['acc_transactions', 'debit_account']}
                                // onFinish={addeditFormBranchOnFinish}
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
                                        planNames && planNames.map(item => {
                                            return <Select.Option value={item.id} >{item.ledger_name}</Select.Option>
                                        })
                                    }
                                </Select>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col className='gutter-row' xs={24} xl={20}>
                            <FormItem
                                label="Description"
                                name={['acc_transactions', 'narration']}
                                rules={[{ required: true, message: 'Please Enter To narration ' }]}
                            >
                                <TextArea placeholder="narration" />
                            </FormItem>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col className='gutter-row' xs={24} xl={20}>

                            <FormItem
                                label="Amount"
                                name={['acc_transactions', 'amount']}
                                rules={[{ required: true, message: 'Please Enter To amount' }]}
                            >
                                <Input placeholder="amount" />
                            </FormItem>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col className='gutter-row' xs={24} xl={20}>
                            <FormItem
                                label="Status"
                                name={['acc_transactions', 'tr_status']}
                            // rules={[{ required: true, message: 'Please Enter ' }]}
                            >
                                <Radio.Group defaultValue="Active" optionType="default" >
                                    {context.psGlobal.collectionOptions(context.psGlobal.collectionData, 'active-inactive', 'radio')}
                                </Radio.Group>
                            </FormItem>
                        </Col>
                        <Col className='gutter-row' xs={24} xl={12}>
                        </Col>
                    </Row>
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
