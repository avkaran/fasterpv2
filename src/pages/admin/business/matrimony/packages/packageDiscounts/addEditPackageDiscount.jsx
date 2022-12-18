import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Col, message, Space } from 'antd';
import { Button, Card } from 'antd';
import { Form, Input, Select, InputNumber, Radio, Checkbox, DatePicker } from 'antd';
import { Breadcrumb, Layout, Spin } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import PsContext from '../../../../../../context';
import { Editor } from '@tinymce/tinymce-react';
import { ImageUpload, FormItem, MyButton } from '../../../../../../comp';
import { capitalizeFirst } from '../../../../../../utils';
import PhoneInput from 'react-phone-input-2'
import dayjs from 'dayjs'
import { resetServerContext } from 'react-beautiful-dnd';
const AddEditPackageDiscount = (props) => {
    const context = useContext(PsContext);
    const navigate = useNavigate();
    const [addeditFormPackageDiscount] = Form.useForm();
    const [loader, setLoader] = useState(false);
    const [curAction, setCurAction] = useState('add');
    const [editData, setEditData] = useState(null);
    const [heading] = useState('Package');
    const { editIdOrObject, onListClick, onSaveFinish, userId, ...other } = props;
    const [editId, setEditId] = useState(null);
    const [packages,setPackages]=useState([]);
    const [validFromDate,setValidFromDate]=useState(dayjs());
    const [validToDate,setValidToDate]=useState(dayjs())
    useEffect(() => {
        loadPackages();

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
            //addForm.setFieldsValue({ category: 'Plan', package_for: 'Customer(Online)', package_status: 'Active' })
            addeditFormPackageDiscount.setFieldsValue({

                package_discounts: {

                    active_status: 'Active',
                }
            });
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const  loadPackages=()=>{
        var reqData = {
            query_type: 'query',
            query: "SELECT id,plan_name from packages  where status=1 and package_status='Active'"
        };
        context.psGlobal.apiRequest(reqData, context.adminUser(userId).mode).then((res) => {
            setPackages(res)
        }).catch(err => {
            message.error(err);
          

        })
    }
    const loadEditData = (id) => {
        setLoader(true);
        var reqData = {
            query_type: 'query',
            query: "SELECT * from package_discounts  where status=1 and id=" + id
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
                setValidFromDate(dayjs(mydata.valid_from,'YYYY-MM-DD'));
                setValidToDate(dayjs(mydata.valid_to,'YYYY-MM-DD'));
        addeditFormPackageDiscount.setFieldsValue({

            package_discounts: {
                discount_title: mydata.discount_title,

                discount_for: mydata.discount_for,

                percentage: mydata.percentage,

                valid_from: mydata.valid_from,

                valid_to: mydata.valid_to,

                active_status: mydata.active_status,
            }
        });
    }
    const addeditFormPackageDiscountOnFinish = (values) => {
        setLoader(true);
        var processedValues = {};
        Object.entries(values.package_discounts).forEach(([key, value]) => {
            if (value) {
                processedValues[key] = value;
            }
        });
        if (curAction === "add") {
            var reqDataInsert = {
                query_type: 'insert',
                table: 'package_discounts',
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
                table: 'package_discounts',
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
    const validFromDisabled = (current) => {
        // Can not select days before today and today
       // console.log(current,dayjs())
        return current && current < dayjs().subtract(1, "day");
    };
    const validToDisabled = (current) => {

        // Can not select days before today and today
        return current && current < dayjs().subtract(1, "day");
    };
    const validFromOnChange = (date) => {
        setValidFromDate(date);

        addeditFormPackageDiscount.setFieldsValue({
            package_discounts: {
                valid_from: dayjs(date).format('YYYY-MM-DD')
            }
        })

    };
    const validToOnChange = (date) => {
        setValidToDate(date);
        addeditFormPackageDiscount.setFieldsValue({
            package_discounts: {
                valid_to: dayjs(date).format('YYYY-MM-DD')
            }
        })

    };
    return (
        <>
            <Spin spinning={loader} >
                {(curAction === "add" || (curAction === "edit" && editData)) && (<Form
                    name="basic"
                    form={addeditFormPackageDiscount}
                    labelAlign="left"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 20 }}
                    initialValues={{ remember: true }}
                    onFinish={addeditFormPackageDiscountOnFinish}
                    autoComplete="off"
                >

                    <Row gutter={16}>
                        <Col className='gutter-row' xs={24} xl={12}>

                            <FormItem
                                label="Discount Title"
                                name={['package_discounts', 'discount_title']}
                                rules={[{ required: true, message: 'Please Enter Discount Title' }]}
                            >
                                <Input placeholder="Discount Title" />
                            </FormItem>

                        </Col>
                        <Col className='gutter-row' xs={24} xl={12}>

                            <FormItem
                                label="Percentage"
                                name={['package_discounts', 'percentage']}
                                rules={[{ required: true, message: 'Please Enter Percentage' }]}
                            >
                                <InputNumber placeholder="Percentage" type="number" style={{ width: '100%' }} />
                            </FormItem>

                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col className='gutter-row' xs={24} xl={12}>

                            <FormItem
                                label="Valid From"
                                name={['package_discounts', 'valid_from']}
                                rules={[{ required: true, message: 'Please Enter Valid From' }]}
                            >

                                <Space direction="vertical">
                                    <DatePicker
                                        onChange={validFromOnChange}
                                       // defaultValue={editData && !isNaN(dayjs(editData.valid_from, 'YYYY-MM-DD')) ? dayjs(editData.valid_from, 'YYYY-MM-DD').format('DD/MM/YYYY') : dayjs(dayjs(), 'DD/MM/YYYY')}
                                        format='DD/MM/YYYY'
                                        value={validFromDate}
                                        disabledDate={validFromDisabled}
                                        allowClear={false}
                                    />
                                </Space>
                            </FormItem>

                        </Col>
                        <Col className='gutter-row' xs={24} xl={12}>

                            <FormItem
                                label="Discount For"
                                name={['package_discounts', 'discount_for']}
                                rules={[{ required: true, message: 'Please Enter Discount For' }]}
                            >

                                <Select
                                    showSearch
                                    placeholder="Discount For"

                                    optionFilterProp="children"
                                    //onChange={discountForOnChange}
                                    filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                                >
                                    {
                                        packages.map(item=>{
                                            return <Select.Option value={item.id}>{item.plan_name}</Select.Option>
                                        })
                                    }
                                </Select>
                            </FormItem>

                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col className='gutter-row' xs={24} xl={12}>
                                       
                            <FormItem
                                label="Valid To"
                                name={['package_discounts', 'valid_to']}
                                rules={[{ required: true, message: 'Please Enter Valid To' }]}
                            >

                                <Space direction="vertical">
                                    <DatePicker onChange={validToOnChange}
                                        format='DD/MM/YYYY'
                                       // defaultValue={dayjs(editData.valid_to, 'YYYY-MM-DD')}
                                        value={validToDate}
                                        disabledDate={validToDisabled}
                                        allowClear={false}
                                    />
                                </Space>
                            </FormItem>

                        </Col>
                        <Col className='gutter-row' xs={24} xl={12}>

                            <FormItem
                                label="Active Status"
                                name={['package_discounts', 'active_status']}
                                rules={[{ required: true, message: 'Please Enter Active Status' }]}
                            >



                                <Radio.Group defaultValue="Active" optionType="default" >
                                    {context.psGlobal.collectionOptions(context.psGlobal.collectionData, 'active-inactive', 'radio')}
                                </Radio.Group>


                            </FormItem>

                        </Col>
                    </Row>
                    <FormItem wrapperCol={{ offset: 10, span: 24 }}>
                        <Space>
                            <Button size="large" type="outlined" onClick={()=>onListClick()}>
                                Cancel
                            </Button>
                            <MyButton size="large" type="primary" htmlType="submit">
                                Save
                            </MyButton>
                        </Space>

                    </FormItem>

                </Form>)
                }
            </Spin>
        </>
    )
}
export default AddEditPackageDiscount;