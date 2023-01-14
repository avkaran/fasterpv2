import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Col, message, Space } from 'antd';
import { Button, Card } from 'antd';
import { Form, Input, Select, InputNumber, Radio, Checkbox } from 'antd';
import { Breadcrumb, Layout, Spin } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import PsContext from '../../../../context';
import { Editor } from '@tinymce/tinymce-react';
import { ImageUpload, FormItem, MyButton } from '../../../../comp';
import { capitalizeFirst } from '../../../../utils';
import PhoneInput from 'react-phone-input-2'
import { CountryDropdown, RegionDropdown } from 'react-country-region-selector';
import TextArea from 'antd/lib/input/TextArea';
const AddEditLedger = (props) => {
    const context = useContext(PsContext);
    const navigate = useNavigate();
    const [addeditFormBranch] = Form.useForm();
    const [loader, setLoader] = useState(false);
    const [curAction, setCurAction] = useState('add');
    const [editData, setEditData] = useState(null);
    const [heading] = useState('');
    const { editIdOrObject, onListClick, onSaveFinish, userId, ...other } = props;
    const [editId, setEditId] = useState(null);
    const [country, setCountry] = useState('');
    const [districts, setDistricts] = useState([]);
    const [districtLoading, setDistrictLoading] = useState(false)
    const [ledgerCategories, setLedgerCategories] = useState(null);
    useEffect(() => {

        loadLedgerCategories();
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
                acc_ledgers:{active_status:'Active'}
            });
            //addForm.setFieldsValue({ category: 'Plan', package_for: 'Customer(Online)', package_status: 'Active' })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [editIdOrObject]);
    const loadEditData = (id) => {
        setLoader(true);
        var reqData = {
            query_type: 'query',
            query: "SELECT * from acc_ledgers  where status=1 and id=" + id
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

            acc_ledgers: {
                ledger_name: mydata.ledger_name,

                ledger_type: mydata.ledger_type,

                category: mydata.category,

                active_status: parseInt(mydata.active_status)===1?'Active':'Inactive',
              
            }
        });
        
    }
    const addeditFormBranchOnFinish = (values) => {
        setLoader(true);
        var processedValues = {};
        Object.entries(values.acc_ledgers).forEach(([key, value]) => {
            if (value) {
                processedValues[key] = value;
            }
            if (values.acc_ledgers.active_status === 'Active')
                processedValues['active_status'] = 1;
            else
                processedValues['active_status'] = 0;
        });
       
        if (curAction === "add") {
            var reqDataInsert = {
                query_type: 'insert',
                table: 'acc_ledgers',
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
                table: 'acc_ledgers',
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
    const loadLedgerCategories = () => {
        var reqData = {
            query_type: 'query', //query_type=insert | update | delete | query

            query: "select * from acc_ledger_categories where status=1 "
        };
        context.psGlobal.apiRequest(reqData, context.adminUser(userId).mode).then((res) => {
            setLedgerCategories(res);
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
                    onFinish={addeditFormBranchOnFinish}
                    autoComplete="off"
                >
                    <Row gutter={16}>
                        <Col className='gutter-row' xs={24} xl={20}>

                           
                            <FormItem
                                label="ledger Name"
                                name={['acc_ledgers', 'ledger_name']}
                                rules={[{ required: true, message: 'Please Enter Ledger Name' }]}
                            >
                                <Input placeholder="ledger name" />
                            </FormItem>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                    <Col className='gutter-row' xs={24} xl={20}>
                     <FormItem
                                label="Ledger Type"
                                name={['acc_ledgers', 'ledger_type']}
                                // onFinish={addeditFormBranchOnFinish}
                                rules={[{ required: true, message: 'Please Choose Ledger Type' }]}
                            >
                                <Select
                                    showSearch
                                    placeholder="Type"
                                    // onChange={onPlanChange}

                                    optionFilterProp="children"
                                    //onChange={businessStatusOnChange}
                                    filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                                >
                                    {context.psGlobal.collectionOptions(context.psGlobal.collectionData, 'ledger-types')}
                                </Select>
                            </FormItem>
                </Col>
                    <Col className='gutter-row' xs={24} xl={20}>
                                
                     <FormItem
                                label="Category"
                                name={['acc_ledgers', 'category']}
                                // onFinish={addeditFormBranchOnFinish}
                                rules={[{ required: true, message: 'Please Choose category Type' }]}
                            >
                                <Select
                                    showSearch
                                    placeholder="category"
                                    // onChange={onPlanChange}

                                    optionFilterProp="children"
                                    //onChange={businessStatusOnChange}
                                    filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                                >
                                    {
                                        ledgerCategories && ledgerCategories.map(item => {
                                            return <Select.Option value={item.id} >{item.category_name}</Select.Option>
                                        })
                                    }
                                </Select>
                            </FormItem>
                    </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col className='gutter-row' xs={24} xl={20}>
                            <FormItem
                                label="Status"
                                name={['acc_ledgers', 'active_status']}
                                rules={[{ required: true, message: 'Please Select Status' }]}
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
export default AddEditLedger;
