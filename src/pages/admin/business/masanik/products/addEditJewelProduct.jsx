import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Col, message, Space } from 'antd';
import { Button, Card } from 'antd';
import { Form, Input, Select, InputNumber, Radio, Checkbox, DatePicker } from 'antd';
import { Breadcrumb, Layout, Spin } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import PsContext from '../../../../../context';
import { Editor } from '@tinymce/tinymce-react';
import { ImageUpload, FormItem, MyButton } from '../../../../../comp';
import { capitalizeFirst } from '../../../../../utils';
import { Button as MButton } from 'antd-mobile'
import dayjs from 'dayjs'
import esES from 'antd/lib/locale-provider/es_ES';
const AddEditJewelProduct = (props) => {
    const context = useContext(PsContext);
    const { Content } = Layout;
    const navigate = useNavigate();
    const [addeditFormProducts] = Form.useForm();
    const [loader, setLoader] = useState(false);
    const [curAction, setCurAction] = useState('add');
    const [editData, setEditData] = useState(null);
    const [heading] = useState('Bill');
    const { editIdOrObject, onListClick, onSaveFinish, userId, formItemLayout, ...other } = props;
    const [editId, setEditId] = useState(null);
    const [employees, setEmployees] = useState([])
    useEffect(() => {
        loadEmployees()
    }, [])
    useEffect(() => {

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
            addeditFormProducts.setFieldsValue(
                { bills: { active_status: '1' } }
            )
        }

    }, [editIdOrObject]);
    const loadEmployees = () => {
        setLoader(true);
        var reqData = {
            query_type: 'query',
            query: "SELECT id,name from employees where status=1 and employee_status='Active' and designation_id=2"
        };
        context.psGlobal.apiRequest(reqData, context.adminUser(userId).mode).then((res) => {
            setEmployees(res);
            setLoader(false);

        }).catch(err => {
            message.error(err);
            setLoader(false);

        })
    }
    const loadEditData = (id) => {
        setLoader(true);
        var reqData = {
            query_type: 'query',
            query: "SELECT * from bills where status=1 and id=" + id
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
        addeditFormProducts.setFieldsValue({

            bills: {
                bill_no: mydata.bill_no,
                total_amount: mydata.total_amount,
                bill_date: dayjs(mydata.bill_date),
                due_date: dayjs(mydata.due_date),
                employee_id: mydata.employee_id,
                bill_image: mydata.bill_image,
                active_status: mydata.active_status.toString(),
            }
        });
    }
    const onFinish = (values) => {
        setLoader(true);
        var processedValues = {};
        Object.entries(values.bills).forEach(([key, value]) => {
            if (value) {
                processedValues[key] = value;
            }
        });

        if (processedValues['bill_date'])
            processedValues['bill_date'] = dayjs(processedValues['bill_date']).format("YYYY-MM-DD")
        if (processedValues['due_date'])
            processedValues['due_date'] = dayjs(processedValues['due_date']).format("YYYY-MM-DD")



        if (curAction === "add") {
            /*  var reqDataInsert = {
                 query_type: 'insert',
                 table: 'bills',
                 values: processedValues
 
             }; */

            var form = new FormData();
            Object.entries(processedValues).forEach(([key, value], index) => {
                form.append(key, value)
            })

            context.psGlobal.apiRequest('admin/bills/save', context.adminUser(userId).mode, form).then((res) => {
                setLoader(false);
                message.success(heading + ' Added Successfullly');
                onSaveFinish();
                //navigate('/' + userId + '/admin/courses');
            }).catch(err => {
                message.error(err);
                setLoader(false);
            })
        } else if (curAction === "edit") {
            /*  var reqDataUpdate = {
                 query_type: 'update',
                 table: 'bills',
                 where: { id: editId },
                 values: processedValues
             }; */
            var formedit = new FormData();
            formedit.append('id', editData.id);
            Object.entries(processedValues).forEach(([key, value], index) => {
                formedit.append(key, value)
            })

            if (processedValues['bill_image'] !== editData.bill_image) {
                if (editData.bill_image)
                    formedit.append('old_bill_image', editData.bill_image);
            }
            else {
                formedit.delete('bill_image');
            }
            context.psGlobal.apiRequest('admin/bills/update', context.adminUser(userId).mode, formedit).then((res) => {
                setLoader(false);
                message.success(heading + ' Saved Successfullly');
                onSaveFinish();
                //navigate('/' + userId + '/admin/courses');
            }).catch(err => {
                message.error(err);
                setLoader(false);
            })
        }

    };
    return (
        <>

            <Spin spinning={loader} >
                {
                    (curAction === "add" || (curAction === "edit" && editData)) && (<Form
                        name="basic"
                        form={addeditFormProducts}
                        labelAlign="left"
                        labelCol={{ span: formItemLayout === 'two-column' || formItemLayout === 'one-column' ? 8 : 24 }}
                        wrapperCol={{ span: 24 }}
                        initialValues={{ remember: true }}
                        onFinish={onFinish}
                        autoComplete="off"
                    >
                        <Row gutter={16}>
                            <Col className='gutter-row' xs={24} xl={formItemLayout === 'one-column' ? 24 : 12}>

                                <FormItem
                                    label="Bill No"
                                    name={['bills', 'bill_no']}
                                    rules={[{ required: true, message: 'Please Enter Bill No' }]}
                                >
                                    <Input placeholder="Bill No" />
                                </FormItem>

                            </Col>
                            <Col className='gutter-row' xs={24} xl={formItemLayout === 'one-column' ? 24 : 12}>

                                <FormItem
                                    label="Customer"
                                    name={['bills', 'employee_id']}
                                    rules={[{ required: true, message: 'Please Select Customer' }]}
                                >

                                    <Select
                                        showSearch
                                        placeholder="Customer"

                                        optionFilterProp="children"
                                        //onChange={hotelIdOnChange}
                                        filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                                    >
                                        {
                                            employees.map(item => {
                                                return <Select.Option value={item.id}>{item.name}</Select.Option>
                                            })
                                        }
                                    </Select>
                                </FormItem>

                            </Col>
                            <Col className='gutter-row' xs={24} xl={formItemLayout === 'one-column' ? 24 : 12}>

                                <FormItem
                                    label="Bill Date"
                                    name={['bills', 'bill_date']}
                                    rules={[{ required: true, message: 'Please Select Bill Date' }]}
                                >
                                    <DatePicker
                                        // onChange={dateOnChange}
                                        format='DD/MM/YYYY'
                                         locale={esES}

                                        //disabledDate={dateDisabled}
                                        allowClear={false}
                                    />

                                </FormItem>

                            </Col>
                            <Col className='gutter-row' xs={24} xl={formItemLayout === 'one-column' ? 24 : 12}>

                                <FormItem
                                    label="Due Date"
                                    name={['bills', 'due_date']}
                                    rules={[{ required: true, message: 'Please Due Date' }]}
                                >
                                    <DatePicker
                                        //onChange={dateOnChange}
                                        format='DD/MM/YYYY'
                                        locale={esES}

                                        //disabledDate={dateDisabled}
                                        allowClear={false}
                                    />
                                </FormItem>

                            </Col>
                            <Col className='gutter-row' xs={24} xl={formItemLayout === 'one-column' ? 24 : 12}>

                                <FormItem
                                    label="Bill Image"
                                    name={['bills', 'bill_image']}
                                    rules={[{ required: true, message: 'Please Enter Cost' }]}
                                >
                                    <ImageUpload
                                        // cropRatio="4/3"
                                        defaultImage={editData && editData.bill_image ? 'cloud-file/' + encodeURIComponent(encodeURIComponent(editData.bill_image)) : null}
                                        storeFileName={'public/uploads/' + new Date().valueOf() + '.jpg'}
                                        onFinish={(fileName) => { addeditFormProducts.setFieldsValue({ bills: { bill_image: fileName } }) }}
                                    />
                                </FormItem>

                            </Col>
                            <Col className='gutter-row' xs={24} xl={formItemLayout === 'one-column' ? 24 : 12}>

                                <FormItem
                                    label="Bill Amount"
                                    name={['bills', 'total_amount']}
                                    rules={[{ required: true, message: 'Please Enter Amount' }]}
                                >
                                    <InputNumber placeholder="Bill Amount" type="number" style={{ width: '200px' }} />
                                </FormItem>

                            </Col>
                            <Col className='gutter-row' xs={24} xl={formItemLayout === 'one-column' ? 24 : 12}>

                                <FormItem
                                    label="Active Status"
                                    name={['bills', 'active_status']}
                                    rules={[{ required: true, message: 'Please Enter Active Status' }]}
                                >
                                    <Radio.Group defaultValue="1" optionType="default" >
                                        <Radio.Button value="1">Active</Radio.Button>
                                        <Radio.Button value="0">Inactive</Radio.Button>
                                    </Radio.Group>
                                </FormItem>
                            </Col>
                        </Row>


                        <FormItem wrapperCol={context.isMobile ? null : { offset: 8, span: 24 }}
                        >
                            {
                                !context.isMobile && (
                                    <Space>
                                        <MyButton size="large" type="outlined" style={{}} onClick={onListClick}>
                                            Cancel
                                        </MyButton>
                                        <MyButton size="large" type="primary" htmlType="submit" style={{}}>
                                            {curAction === "edit" ? "Update" : "Submit"}
                                        </MyButton>
                                    </Space>

                                )
                            }
                            {
                                context.isMobile && (<Row gutter={2}>
                                    <Col span={12}>
                                        <MButton block color='primary' size='small' fill='outline' onClick={onListClick}>
                                            Cancel
                                        </MButton>
                                    </Col>
                                    <Col span={12}>
                                        <MButton block type='submit' color='primary' size='small'>
                                            {curAction === "edit" ? "Update" : "Submit"}
                                        </MButton>
                                    </Col>
                                </Row>)
                            }

                        </FormItem>


                    </Form>)
                }

            </Spin>



        </>
    );

}
export default AddEditJewelProduct;