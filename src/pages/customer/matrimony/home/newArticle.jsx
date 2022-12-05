
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Col, message, Collapse, Select } from 'antd';
import { Button, Card } from 'antd';
import { Form, Input } from 'antd';
import { Breadcrumb, Layout, Spin } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import PsContext from '../../../../context';
import { Editor } from '@tinymce/tinymce-react';
import { ImageUpload } from '../../../../comp';
const NewArticle = (props) => {
    const context = useContext(PsContext);
    const { TextArea } = Input;
    const { Option } = Select;
    const { Panel } = Collapse;
    const { Content } = Layout;
    const navigate = useNavigate();
    const [addForm] = Form.useForm();
    const [loader, setLoader] = useState(false);
    const [categories, setCategories] = useState([]);
    useEffect(() => {
        loadCategories();
    }, []);
    const loadCategories = () => {
        var reqData = {
            query_type: 'query', //query_type=insert | update | delete | query
            query: "select * from content_categories where content_type='article'"
        };

        context.psGlobal.apiRequest(reqData, context.adminUser(props.match.params.userId).mode).then((res, error) => {
            setCategories(res);
        }).catch(err => {
            message.error(err);
            //setLoader(false);
        })
    }
    const onFinish = (values) => {
        setLoader(true);
        var processedValues = {};
        Object.entries(values).forEach(([key, value]) => {
            if (value) processedValues[key] = value;
        });
        processedValues['type']='article';
        var reqData = {
            query_type: 'insert',
            table: 'contents',
            values: processedValues

        };
        context.psGlobal.apiRequest(reqData, context.adminUser(props.match.params.userId).mode).then((res) => {

            message.success("your content posted and waiting for approval");
            setLoader(false);
            navigate('/0/customer');

        }).catch(err => {
            message.error(err);
            setLoader(false);
        })
    };
    const handleEditorChange = (e) => {
        addForm.setFieldsValue({
            content_html: e.target.getContent(),
        })


    }
    return (
        <>

            <div class="main-content right-chat-active">
                <Card title="New Article">

                    <Spin spinning={loader} >
                        <Form
                            name="basic"
                            form={addForm}
                            labelAlign="left"
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 20 }}
                            initialValues={{ remember: true }}
                            onFinish={onFinish}
                            autoComplete="off"
                        >

                            <Row gutter={16}>
                                <Col className='gutter-row' span={12}>
                                    <Form.Item
                                        label="category"
                                        name='category'


                                        rules={[{ required: true, message: 'Category is required' }]}
                                    >
                                        <Select showSearch
                                            placeholder="Category"

                                            optionFilterProp="children"
                                            //onChange={genderOnChange}
                                            filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}>
                                            {
                                                categories.map(item => {
                                                    return <Option key={item.id} value={item.id}>{item.category_name}</Option>
                                                })}
                                        </Select>
                                    </Form.Item>
                                    <Form.Item
                                        label="Title"
                                        name="title"
                                        rules={[{ required: true }]}
                                    >
                                        <Input />
                                    </Form.Item>

                                </Col>
                                <Col className='gutter-row' span={12}>
                                    <Form.Item
                                        label="Feature Image"
                                        name='feature_image'


                                    // rules={[{ required: true, message: 'Feature Image is required' }]}
                                    >
                                        <ImageUpload
                                            name="photo"
                                            storeFileName={'public/uploads/' + new Date().valueOf() + '.jpg'}
                                            onFinish={(fileName) => {addForm.setFieldsValue({ feature_image: fileName }) }}
                                        ></ImageUpload>
                                    </Form.Item>
                                </Col>
                            </Row>


                            <Form.Item
                                wrapperCol={{ offset: 0, span: 24 }}
                                label="Content"
                                name='content_html'
                                labelCol={{ span: 24, offset: 0 }}
                                style={{ marginTop: '0px' }}


                                rules={[{
                                   
                                    required: true,
                                    message: 'Content is required'
                                }]}
                            ><div className="editor-wrapper">
                                    <Editor

                                        init={{
                                            height: '500',
                                            auto_focus: false,
                                            menubar: false,
                                            statusbar: false,
                                            plugins: 'hr lists table textcolor code link image',
                                            toolbar: 'bold italic forecolor link image| alignleft aligncenter alignright | hr bullist numlist table | subscript superscript | removeformat code',

                                            // allow custom url in link? nah just disabled useless dropdown..
                                            anchor_top: false,
                                            anchor_bottom: false,
                                            draggable_modal: true,
                                            table_default_attributes: {
                                                border: '0',
                                            },
                                        }}



                                        onChange={handleEditorChange}
                                    />
                                </div> </Form.Item>



                            <Collapse accordion ghost>
                                <Panel header="SEO Info" key="1">
                                    <Form.Item
                                        wrapperCol={{ offset: 0, span: 24 }}

                                        label="Slug/Url"
                                        name='slug'
                                        labelCol={{ span: 4, offset: 0 }}
                                    //  style={{ marginTop: '0px' }}


                                    //rules={[{ required: true, message: 'Name is required' }]}
                                    >
                                        <Input />
                                    </Form.Item>
                                    <Row gutter={16}>
                                        <Col className='gutter-row' span={12}>
                                            <Form.Item
                                                label="Meta Title"
                                                name='meta_title'



                                            >
                                                <TextArea />
                                            </Form.Item>

                                        </Col>
                                        <Col className='gutter-row' span={12}>
                                            <Form.Item
                                                label="Meta Description"
                                                name='meta_description'



                                            >
                                                <TextArea />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row gutter={16}>
                                        <Col className='gutter-row' span={12}>
                                            <Form.Item
                                                label="Meta Keywords"
                                                name='meta_keywords'



                                            >
                                                <Select
                                                    mode="tags"
                                                    style={{
                                                        width: '100%',
                                                    }}
                                                    //onChange={handleChange}
                                                    tokenSeparators={[',']}
                                                >

                                                </Select>
                                            </Form.Item>

                                        </Col>
                                        <Col className='gutter-row' span={12}>
                                            <Form.Item
                                                label="SEO Tags"
                                                name='seo_tags'



                                            >
                                                <Select
                                                    mode="tags"
                                                    style={{
                                                        width: '100%',
                                                    }}
                                                    //onChange={handleChange}
                                                    tokenSeparators={[',']}
                                                >
                                                </Select>
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </Panel>

                            </Collapse>

                            <Form.Item wrapperCol={{ offset: 10, span: 24 }}>
                                <Button type="primary" htmlType="submit">
                                    Submit
                                </Button>
                            </Form.Item>
                        </Form>
                    </Spin>
                </Card>

            </div>

        </>
    );

}
export default NewArticle;