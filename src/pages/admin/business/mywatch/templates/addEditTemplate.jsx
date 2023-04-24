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
const AddEditTemplate = (props) => {
    const context = useContext(PsContext);
    const { Content } = Layout;
    const navigate = useNavigate();
    const [addeditFormTemplates] = Form.useForm();
    const [loader, setLoader] = useState(false);
    const [curAction, setCurAction] = useState('add');
    const [editData, setEditData] = useState(null);
    const [heading] = useState('Template');
    const { editIdOrObject, onListClick, onSaveFinish, userId, formItemLayout, ...other } = props;
    const [editId, setEditId] = useState(null);
    const [editorValue, setEditorValue] = useState('');
    const [categories, setCategories] = useState([])
    useEffect(() => {
        loadCategories()
    }, []);
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
            /*  addeditFormTemplates.setFieldsValue(
                 { templates: { active_status: '1' } }
             ) */
        }

    }, [editIdOrObject]);

    const loadEditData = (id) => {
        setLoader(true);
        var reqData = {
            query_type: 'query',
            query: "SELECT * from templates  where status=1 and id=" + id
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
        addeditFormTemplates.setFieldsValue({
            templates: {
                template_title: mydata.template_title,

                string_id: mydata.string_id,

                template_category: mydata.template_category,
                //template_category__display: mydata.category_name,

                descripiton: mydata.descripiton,

                template: mydata.template,

                template_title: mydata.template_title,

                string_id: mydata.string_id,

                descripiton: mydata.descripiton,


            }
        });
        //setEditorValue(mydata.description);
    }
    const onFinish = (values) => {
        setLoader(true);
        var processedValues = {};
        Object.entries(values.templates).forEach(([key, value]) => {
            if (value) {
                processedValues[key] = value;
            }
        });
        var form = new FormData();
        Object.entries(processedValues).forEach(([key, value], index) => {
            form.append(key, value)
        })

        if (curAction === "add") {
            context.psGlobal.apiRequest('admin/templates/add-template', context.adminUser(userId).mode, form).then((res) => {
                setLoader(false);
                message.success(heading + ' Added Successfullly');
                onSaveFinish();
                //navigate('/' + userId + '/admin/courses');
            }).catch(err => {
                message.error(err);
                setLoader(false);
            })
        } else if (curAction === "edit") {
            form.append('id', editData.id);
            context.psGlobal.apiRequest('admin/templates/update-template', context.adminUser(userId).mode, form).then((res) => {
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
    const handleEditorChange = (content) => {
        setEditorValue(content);
        addeditFormTemplates.setFieldsValue({
            templates: { description: content }
        })
        setEditorValue(content);
    }
    const loadCategories = () => {
        setLoader(true)
        var reqData = {
            query_type: 'query',
            query: "SELECT * from template_categories"
        };
        context.psGlobal.apiRequest(reqData, context.adminUser(userId).mode).then((res) => {
            // console.log('test',res)
            setCategories(res);

            setLoader(false)
        }).catch(err => {
            message.error(err);
            setLoader(false)

        })
    }
    return (
        <>

            <Spin spinning={loader} >
                {
                    (curAction === "add" || (curAction === "edit" && editData)) && (<Form
                        name="basic"
                        form={addeditFormTemplates}
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
                                    label="Template Title"
                                    name={['templates', 'template_title']}
                                    rules={[{ required: true, message: 'Please Enter Template Title' }]}
                                >
                                    <Input placeholder="Template Title" />
                                </FormItem>


                            </Col>
                            <Col className='gutter-row' xs={24} xl={formItemLayout === 'one-column' ? 24 : 12}>
                                <FormItem
                                    label="String Id"
                                    name={['templates', 'string_id']}
                                    rules={[{ required: true, message: 'Please Enter String Id' }]}
                                >
                                    <Input placeholder="String Id" />
                                </FormItem>

                            </Col>
                            <Col className='gutter-row' xs={24} xl={formItemLayout === 'one-column' ? 24 : 12}>

                                <FormItem
                                    label="Template Category"
                                    name={['templates', 'template_category']}
                                    rules={[{ required: true, message: 'Please Enter Template Category' }]}
                                >

                                    <Select
                                        showSearch
                                        placeholder="Template Category"

                                        optionFilterProp="children"
                                    //onChange={templateCategoryOnChange}
                                    // filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                                    >
                                        {
                                            categories.map(item => {
                                                return <Select.Option value={item.id}>{item.category_name}</Select.Option>
                                            })
                                        }
                                    </Select>
                                </FormItem>

                            </Col>


                            <Col className='gutter-row' xs={24} xl={formItemLayout === 'one-column' ? 24 : 12}>

                                <FormItem
                                    label="Descripiton"
                                    name={['templates', 'descripiton']}
                                    rules={[{ required: true, message: 'Please Enter Descripiton' }]}
                                >
                                    <Input.TextArea rows={3} />
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
export default AddEditTemplate;