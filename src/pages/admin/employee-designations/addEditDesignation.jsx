import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Col, message, Space } from 'antd';
import { Button, Card } from 'antd';
import { Form, Input, Select, InputNumber, Radio, Checkbox } from 'antd';
import { Breadcrumb, Layout, Spin } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import PsContext from '../../../context';
import { Editor } from '@tinymce/tinymce-react';
import { ImageUpload, FormItem, MyButton } from '../../../comp';
import { capitalizeFirst } from '../../../utils';
import PhoneInput from 'react-phone-input-2'
const AddEditDesignation = (props) => {
    const context = useContext(PsContext);
    const { Content } = Layout;
    const navigate = useNavigate();
    const [addeditFormDesignation] = Form.useForm();
    const [loader, setLoader] = useState(false);
    const [curAction, setCurAction] = useState('add');
    const [editData, setEditData] = useState(null);
    const [heading] = useState('Employee Designation');
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
            /*  addeditFormDesignation.setFieldsValue({
                 business_names:{business_status:'Active'},
             }) */
        }

    }, [editIdOrObject]);
    const loadEditData = (id) => {
        setLoader(true);
        var reqData = {
            query_type: 'query',
            query: "select * from designations where status=1 and id=" + id
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
        console.log(mydata);
        addeditFormDesignation.setFieldsValue({
            designations:{
                designation:mydata.designation,
                }
        })
    }
    const addeditFormDesignationOnFinish = (values) => {
        setLoader(true);
        var processedValues = {};
        Object.entries(values.designations).forEach(([key, value]) => {
            if (value) {
                processedValues[key] = value;
            }
        });


        if (curAction === "add") {
            var reqDataInsert = {
                query_type: 'insert',
                table: 'designations',
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
                table: 'designations',
                where: { id: editId },
                values: processedValues

            };
            context.psGlobal.apiRequest(reqDataUpdate, context.adminUser(userId).mode).then((res) => {
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
                        form={addeditFormDesignation}
                        labelAlign="left"
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 20 }}
                        initialValues={{ remember: true }}
                        onFinish={addeditFormDesignationOnFinish}
                        autoComplete="off"
                    >


                        <FormItem
                            label="Designation"
                            name={['designations', 'designation']}
                            rules={[{ required: true, message: 'Please Enter Designation' }]}
                        >
                            <Input placeholder="Designation" />
                        </FormItem>

                        <FormItem wrapperCol={{ offset: 10, span: 24 }}>
                            <Space>
                                <Button size="large" type="outlined" style={{}} onClick={onListClick}>
                                    Cancel
                                </Button>
                                <MyButton size="large" type="primary" htmlType="submit" style={{}}>
                                    {curAction === "edit" ? "Update" : "Submit"}
                                </MyButton>
                            </Space>

                        </FormItem>

                    </Form>)
                }

            </Spin>



        </>
    );

}
export default AddEditDesignation;