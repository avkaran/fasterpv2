import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Col, message, Space } from 'antd';
import { Button, Card } from 'antd';
import { Form, Input, Select, InputNumber, Radio, Checkbox } from 'antd';
import { Breadcrumb, Layout, Spin } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import PsContext from '../../../../../context';
import { Editor } from '@tinymce/tinymce-react';
import { ImageUpload, FormItem, MyButton } from '../../../../../comp';
import { capitalizeFirst } from '../../../../../utils';
import { Button as MButton } from 'antd-mobile'
import { green, blue, red, cyan, grey } from '@ant-design/colors';
const AddEditProject = (props) => {
    const context = useContext(PsContext);
    const { Content } = Layout;
    const navigate = useNavigate();
    const [addForm] = Form.useForm();
    const [loader, setLoader] = useState(false);
    const [curAction, setCurAction] = useState('add');
    const [editData, setEditData] = useState(null);
    const [heading] = useState('Project');
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
            // addForm.setFieldsValue({ category: 'Plan', project_for: 'Customer(Online)', project_status: 'Active' })
        }

    }, []);
    const loadEditData = (id) => {
        setLoader(true);
        var reqData = {
            query_type: 'query',
            query: "select * from projects where status=1 and id=" + id
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

        addForm.setFieldsValue({

            projects: {
                project_name: mydata.project_name,

                category: mydata.category,

                api_url: mydata.api_url,

                api_password: mydata.api_password,

                database_name: mydata.database_name,

                database_username: mydata.database_username,

                database_password: mydata.database_password,
            }
        });
    }
    const onFinish = (values) => {
        setLoader(true);
        var processedValues = {};
        Object.entries(values.projects).forEach(([key, value]) => {
            if (value) {
                processedValues[key] = value;
            }
        });


        if (curAction === "add") {
            var reqDataInsert = {
                query_type: 'insert',
                table: 'projects',
                values: processedValues

            };
            context.psGlobal.apiRequest(reqDataInsert, context.adminUser(userId).mode).then((res) => {
                setLoader(false);
                message.success(heading + ' Added Successfullly');
                onSaveFinish();
                //navigate('/' + userId + '/admin/courses');
            }).catch(err => {
                message.error(err);
                setLoader(false);
            })
        } else if (curAction === "edit") {
            var reqDataUpdate = {
                query_type: 'update',
                table: 'projects',
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
                        form={addForm}
                        labelAlign="left"
                        labelCol={context.isMobile ? null : { span: 8 }}
                        wrapperCol={context.isMobile ? null : { span: 20 }}
                        initialValues={{ remember: true }}
                        onFinish={onFinish}
                        autoComplete="off"
                        layout={context.isMobile ? "vertical" : 'horizontal'}
                    >
                        <Row gutter={16}>
                            <Col className='gutter-row' xs={24} xl={12}>

                                <FormItem
                                    label="Project Name"
                                    name={['projects', 'project_name']}
                                    rules={[{ required: true, message: 'Please Enter Project Name' }]}
                                >
                                    <Input placeholder="Project Name" />
                                </FormItem>

                            </Col>
                            <Col className='gutter-row' xs={24} xl={12}>

                                <FormItem
                                    label="Category"
                                    name={['projects', 'category']}
                                    rules={[{ required: true, message: 'Please Enter Category' }]}
                                >

                                    <Select
                                        showSearch
                                        placeholder="Category"

                                        optionFilterProp="children"
                                        //onChange={categoryOnChange}
                                        filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                                    >
                                        {context.psGlobal.collectionOptions(context.psGlobal.collectionData, 'project-categories')}
                                    </Select>
                                </FormItem>

                            </Col>
                            <Col className='gutter-row' xs={24} xl={12}>

                                <FormItem
                                    label="Api Url"
                                    name={['projects', 'api_url']}
                                    rules={[{ required: true, message: 'Please Enter Api Url' }]}
                                >
                                    <Input placeholder="Api Url" />
                                </FormItem>

                            </Col>
                            <Col className='gutter-row' xs={24} xl={12}>

                                <FormItem
                                    label="Api Password"
                                    name={['projects', 'api_password']}
                                    rules={[{ required: true, message: 'Please Enter Api Password' }]}
                                >
                                    <Input placeholder="Api Password" />
                                </FormItem>

                            </Col>
                            <Col className='gutter-row' xs={24} xl={12}>

                                <FormItem
                                    label="Database Name"
                                    name={['projects', 'database_name']}
                                    rules={[{ required: true, message: 'Please Enter Database Name' }]}
                                >
                                    <Input placeholder="Database Name" />
                                </FormItem>

                            </Col>
                            <Col className='gutter-row' xs={24} xl={12}>

                                <FormItem
                                    label="Database Username"
                                    name={['projects', 'database_username']}
                                    rules={[{ required: true, message: 'Please Enter Database Username' }]}
                                >
                                    <Input placeholder="Database Username" />
                                </FormItem>

                            </Col>
                            <Col className='gutter-row' xs={24} xl={12}>

                                <FormItem
                                    label="Database Password"
                                    name={['projects', 'database_password']}
                                    rules={[{ required: true, message: 'Please Enter Database Password' }]}
                                >
                                    <Input.Password placeholder="Database Password" />
                                </FormItem>

                            </Col>

                        </Row>
                        <FormItem wrapperCol={context.isMobile ? null : { offset: 10, span: 24 }}
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
export default AddEditProject;