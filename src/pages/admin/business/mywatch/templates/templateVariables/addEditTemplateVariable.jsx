import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Col, message, Space } from 'antd';
import { Button, Card } from 'antd';
import { Form, Input, Select, InputNumber, Radio, Checkbox } from 'antd';
import { Breadcrumb, Layout, Spin } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import PsContext from '../../../../../../context';
import { Editor } from '@tinymce/tinymce-react';
import { ImageUpload, FormItem, MyButton } from '../../../../../../comp';
import { capitalizeFirst } from '../../../../../../utils';
import { Button as MButton } from 'antd-mobile'
import { getTemplateInputTypes } from '../../models/templateFunctions';
const AddEditTemplateVariable = (props) => {
    const context = useContext(PsContext);
    const { Content } = Layout;
    const navigate = useNavigate();
    const [addeditFormTemplates] = Form.useForm();
    const [loader, setLoader] = useState(false);
    const [curAction, setCurAction] = useState('add');
    const [editData, setEditData] = useState(null);
    const [heading] = useState('Template Variable');
    const { editIdOrObject, onListClick, onSaveFinish, userId, formItemLayout, templateId, ...other } = props;
    const [editId, setEditId] = useState(null);
    useEffect(() => {
        
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
            query: "SELECT * from template_variables  where status=1 and id=" + id
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
            template_variables: {
                input_variable_name:mydata.input_variable_name,
            
                object_variables:mydata.object_variables,
                
                input_type:mydata.input_type,
            }
        });
        //setEditorValue(mydata.description);
    }
    const onFinish = (values) => {
        setLoader(true);
        var processedValues = {};
        Object.entries(values.template_variables).forEach(([key, value]) => {
            if (value) {
                processedValues[key] = value;
            }
        });
        var form = new FormData();
        Object.entries(processedValues).forEach(([key, value], index) => {
            form.append(key, value)
        })

        if (curAction === "add") {
            form.append('template_id', templateId);
            context.psGlobal.apiRequest('admin/templates/add-template-variable', context.adminUser(userId).mode, form).then((res) => {
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
            context.psGlobal.apiRequest('admin/templates/update-template-variable', context.adminUser(userId).mode, form).then((res) => {
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
                                    label="Input Variable Name"
                                    name={['template_variables', 'input_variable_name']}
                                    rules={[{ required: true, message: 'Please Enter Input Variable Name' }]}
                                >
                                    <Input />
                                </FormItem>
                            </Col>
                            <Col className='gutter-row' xs={24} xl={formItemLayout === 'one-column' ? 24 : 12}>
                                <FormItem
                                    label="Input Type"
                                    name={['template_variables', 'input_type']}
                                    rules={[{ required: true, message: 'Please Enter Input Type' }]}
                                >
                                    <Select
                                        showSearch
                                        placeholder="Input Type"

                                        optionFilterProp="children"
                                    //onChange={templateCategoryOnChange}
                                    // filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                                    >
                                        {
                                            getTemplateInputTypes.map(item => {
                                                return <Select.Option value={item}>{item}</Select.Option>
                                            })
                                        }
                                    </Select>
                                </FormItem>

                            </Col>
                            <Col className='gutter-row' xs={24} xl={formItemLayout === 'one-column' ? 24 : 12}>

                                <FormItem
                                    label={<>Object Variables <br/>(comma Separated)</>}
                                    placeholder="(comma Separated)"
                                    name={['template_variables', 'object_variables']}
                                   // rules={[{ required: true, message: 'Please Enter Object Variables' }]}
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
export default AddEditTemplateVariable;