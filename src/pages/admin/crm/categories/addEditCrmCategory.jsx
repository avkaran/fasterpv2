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
const AddEditCrmCategory = (props) => {
    const context = useContext(PsContext);
    const navigate = useNavigate();
    const [addeditFormCaste] = Form.useForm();
    const [loader, setLoader] = useState(false);
    const [curAction, setCurAction] = useState('add');
    const [editData, setEditData] = useState(null);
    const [heading] = useState('Categories');
    const { editIdOrObject, onListClick, onSaveFinish, userId, ...other } = props;
    const [editId, setEditId] = useState(null);
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
            //addForm.setFieldsValue({ category: 'Plan', package_for: 'Customer(Online)', package_status: 'Active' })
            addeditFormCaste.setFieldsValue({

                case_categories: {

                    active_status: 'Active',
                }
            });
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [editIdOrObject]);
    const loadEditData = (id) => {
        setLoader(true);
        var reqData = {
            query_type: 'query',
            query: "SELECT * from case_categories where status=1 and id=" + id
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
        addeditFormCaste.setFieldsValue({

            case_categories: {
                 case_type: mydata.case_type,

                category_name: mydata.category_name,

                active_status: mydata.active_status,
            }
        });
    }
    const addeditFormCasteOnFinish = (values) => {
        setLoader(true);
        var processedValues = {};
        Object.entries(values.case_categories).forEach(([key, value]) => {
            if (value) {
                processedValues[key] = value;
            }
        });
        if (curAction === "add") {
            var reqDataInsert = {
                query_type: 'insert',
                table: 'case_categories',
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
                table: 'case_categories',
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
    return (
        <>
            <Spin spinning={loader} >
                <Form
                    name="basic"
                    form={addeditFormCaste}
                    labelAlign="left"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 20 }}
                    initialValues={{ remember: true }}
                    onFinish={addeditFormCasteOnFinish}
                    autoComplete="off"
                >

                    <FormItem

                        label="Type"
                        name={['case_categories', 'case_type']}
                        rules={[{ required: true, message: 'Please Enter Type' }]}
                    >

                        <Select
                            showSearch
                            placeholder="Type"

                            optionFilterProp="children"
                            //onChange={religionOnChange}
                            filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                        >
                            {context.psGlobal.collectionOptions(context.psGlobal.collectionData, 'case-types')}
                        </Select>
                    </FormItem> 

                    <FormItem
                        label="Category Name"
                        name={['case_categories', 'category_name']}
                        rules={[{ required: true, message: 'Please Enter Category Name' }]}
                    >
                        <Input placeholder="Caste Name" />
                    </FormItem>

                    <FormItem
                        label="Active Status"
                        name={['case_categories', 'active_status']}
                        rules={[{ required: true, message: 'Please Enter Active Status' }]}
                    >

                        <Radio.Group defaultValue="Active" optionType="default" >
                            {context.psGlobal.collectionOptions(context.psGlobal.collectionData, 'active-inactive', 'radio')}
                        </Radio.Group>
                    </FormItem>

                    <FormItem wrapperCol={{ offset: 10, span: 24 }}>
                        <Space>
                            <Button size="large" type="outlined" onClick={onListClick}>
                                Cancel
                            </Button>
                            <MyButton size="large" type="primary" htmlType="submit">
                                update
                            </MyButton>
                        </Space>

                    </FormItem>

                </Form>
            </Spin>
        </>
    )
}
export default AddEditCrmCategory;