import React, { useState, useEffect, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Col, message, Space } from 'antd';
import { Button, Card } from 'antd';
import { Form, Input, Select, InputNumber, Radio, Checkbox, Tag, Image, Tabs } from 'antd';
import { Breadcrumb, Layout, Spin } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import PsContext from '../../../../../context';
//import { Editor } from '@tinymce/tinymce-react';
import { ImageUpload, FormItem, MyButton, FormViewItem } from '../../../../../comp';
import { capitalizeFirst } from '../../../../../utils';
import Editor from '@monaco-editor/react';
import EditTemplateRenderFunction from './editRenderFunction';

const ViewTemplate = (props) => {
    const context = useContext(PsContext);
    const { Content } = Layout;
    const navigate = useNavigate();
    const [addForm] = Form.useForm();
    const [loader, setLoader] = useState(false);
    const [curAction, setCurAction] = useState('add');
    const [viewData, setviewData] = useState(null);
    const [heading] = useState('template');
    const { viewIdOrObject, onListClick, userId, formItemLayout, ...other } = props;
    const [viewId, setViewId] = useState(null);
    const [editorValue,setEditorValue]=useState(null)
    useEffect(() => {
        if (typeof viewIdOrObject === 'object') {
            setViewId(viewIdOrObject.id);
            setviewData(viewIdOrObject);

        } else {
            setViewId(viewIdOrObject)
            loadViewData(viewIdOrObject);
        }

    }, [viewIdOrObject]);
    const loadViewData = (id) => {
        setLoader(true);
        var reqData = {
            query_type: 'query',
            query: "select t.*,tc.type,tc.category_name,tc.output_type from templates t,template_categories tc where t.status=1 and t.template_category=tc.id and t.id=" + id
        };
        context.psGlobal.apiRequest(reqData, context.adminUser(userId).mode).then((res) => {
            setviewData(res[0]);
            setLoader(false);

        }).catch(err => {
            message.error(err);
            setLoader(false);

        })
    }
    const handleEditorChange = (value, event) => {
        setEditorValue(value);
        //console.log('here is the current model value:', value);
    }
    const onEditorSaveClick=(e)=>{
        var form = new FormData();
        form.append('id', viewData.id);
        form.append('template', editorValue);
        context.psGlobal.apiRequest('admin/templates/update-template', context.adminUser(userId).mode, form).then((res) => {
           // setLoader(false);
           loadViewData(viewData.id);
           setEditorValue(null)
            message.success('Template Updated');

        }).catch(err => {
            message.error(err);
           // setLoader(false);
        })
    }
    return (
        <>
            <Spin spinning={loader} >
                {
                    viewData && (<>
                        <Tabs>
                            <Tabs.TabPane tab="Basic Info" key="basic_info">
                                <Form
                                    name="basic"
                                    labelAlign="left"
                                    labelCol={{ span: formItemLayout === 'two-column' || formItemLayout === 'one-column' || context.isMobile ? 8 : 24 }}
                                    wrapperCol={{ span: 20 }}
                                    initialValues={{ remember: true }}
                                    autoComplete="off"
                                >
                                    <Row gutter={3}>
                                        <Col className='gutter-row' xs={24} xl={12}>
                                            <FormViewItem label="Template Title" colon={true}>{viewData.template_title}</FormViewItem>
                                        </Col>
                                        <Col className='gutter-row' xs={24} xl={12}>
                                            <FormViewItem label="String Id" colon={true}>{viewData.string_id}</FormViewItem>
                                        </Col>
                                        <Col className='gutter-row' xs={24} xl={12}>
                                            <FormViewItem label="Template Type" colon={true}>{viewData.type}</FormViewItem>
                                        </Col>
                                        <Col className='gutter-row' xs={24} xl={12}>
                                            <FormViewItem label="Output Type" colon={true}>{viewData.output_type}</FormViewItem>
                                        </Col>

                                    </Row>
                                </Form>
                            </Tabs.TabPane>
                            <Tabs.TabPane tab="Template" key="template">
                                <Row>
                                    <Col xs={24} xl={24}>
                                        <Row gutter={16} style={{marginBottom:'5px'}}>
                                            <Col xs={24} xl={24}>
                                                {editorValue && ( <MyButton type="primary" style={{ float: 'right' }} onClick={onEditorSaveClick}>Save</MyButton>)}
                                               

                                            </Col>
                                        </Row>
                                        <Editor height="500px" language="javascript" value={viewData.template}
                                            onChange={handleEditorChange} theme="vs-dark" />
                                    </Col>
                                </Row>
                            </Tabs.TabPane>
                            <Tabs.TabPane tab="Render Info" key="Render Info">
                                <EditTemplateRenderFunction editIdOrObject={viewData} />
                            </Tabs.TabPane>
                        </Tabs>

                    </>


                    )
                }

            </Spin>
        </>
    );

}
export default ViewTemplate;