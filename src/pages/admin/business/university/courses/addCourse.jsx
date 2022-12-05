import React, { useState, useEffect, useContext } from 'react';
import { useNavigate,useParams } from 'react-router-dom';
import { Row, Col, message } from 'antd';
import { Button, Card } from 'antd';
import { Form, Input, Select, InputNumber } from 'antd';
import { Breadcrumb, Layout, Spin } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import PsContext from '../../../../../context';
import { Editor } from '@tinymce/tinymce-react';
import { ImageUpload } from '../../../../../comp';

const AddCourse = (props) => {
    const context = useContext(PsContext);
const {userId}=useParams();
    const { Content } = Layout;
    const navigate = useNavigate();
    const [addForm] = Form.useForm();
    const [loader, setLoader] = useState(false);
    useEffect(() => {

    }, []);
    const onFinish = (values) => {
        setLoader(true);
        var processedValues = {};
        Object.entries(values).forEach(([key, value]) => {
            if (value) processedValues[key] = value;
        });
        var reqData = {
            query_type: 'insert',
            table: 'courses',
            values: processedValues

        };
        context.psGlobal.apiRequest(reqData, context.adminUser(userId).mode).then((res) => {

            setLoader(false);
            message.success('Course Successfully');
            navigate('/'+userId+'/admin/courses');

        }).catch(err => {
            message.error(err);
            setLoader(false);
        })
    };
    const handleEditorChange = (e) => {
        addForm.setFieldsValue({
            description: e.target.getContent()
        })
    }
    return (
        <>

            <Content
                className="site-layout-background"
                style={{
                    padding: '5px 24px 0px 24px',
                    margin: 0

                }}
            >
                <Breadcrumb style={{ margin: '0', padding: '8px 0px 8px 0px' }}>
                    <Breadcrumb.Item href="">
                        <HomeOutlined />
                    </Breadcrumb.Item>
                    <Breadcrumb.Item >
                        <span>Manage Courses</span>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>Add Course</Breadcrumb.Item>
                </Breadcrumb>
                <Card title="Add Course" extra={<Button href={"#/"+userId+"admin/courses"} ><i className="fa-solid fa-list pe-2" ></i>List Courses</Button>}>

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
                                <Col className='gutter-row' xs={24} xl={12}>

                                    <Form.Item
                                        label="Course Code"
                                        name="course_code"
                                        rules={[{ required: true, message: 'Please Enter Course Code' }]}
                                    >
                                        <Input placeholder="Course Code" />
                                    </Form.Item>

                                </Col>
                                <Col className='gutter-row' xs={24} xl={12}>

                                    <Form.Item
                                        label="Course Name"
                                        name="course_name"
                                        rules={[{ required: true, message: 'Please Enter Course Name' }]}
                                    >
                                        <Input placeholder="Course Name" />
                                    </Form.Item>

                                </Col>
                            </Row>
                            <Row gutter={16}>
                                <Col className='gutter-row' xs={24} xl={12}>

                                    <Form.Item
                                        label="Duration"
                                        name="duration"
                                        rules={[{ required: true, message: 'Please Enter Duration' }]}
                                    >
                                        <Input placeholder="Duration" />
                                    </Form.Item>

                                </Col>
                                <Col className='gutter-row' xs={24} xl={12}>

                                    <Form.Item
                                        label="Default Fee"
                                        name="default_fee"
                                        rules={[{ required: true, message: 'Please Enter Default Fee' }]}
                                    >
                                        <InputNumber placeholder="Default Fee" type="number" style={{ width: '100%' }} />
                                    </Form.Item>

                                </Col>
                            </Row>
                            <Row gutter={16}>
                                <Col className='gutter-row' xs={24} xl={12}>

                                    <Form.Item
                                        label="Course Status"
                                        name="course_status"
                                        rules={[{ required: true, message: 'Please Enter Course Status' }]}
                                    >

                                        <Select
                                            showSearch
                                            placeholder="Course Status"

                                            optionFilterProp="children"
                                            //onChange={courseStatusOnChange}
                                            filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                                        >
                                            {context.psGlobal.collectionOptions(context.psGlobal.collectionData, 'course-status')}
                                        </Select>
                                    </Form.Item>

                                </Col>

                                <Col className='gutter-row' xs={24} xl={12}>

                                    <Form.Item
                                        label="Course Image"
                                        name="course_image"
                                        rules={[{ required: true, message: 'Please Choose Course Image' }]}
                                    >

                                        <ImageUpload
                                            name="course_image"
                                           // defaultImage={defaultValue}
                                           cropRatio="5/3"
                                            storeFileName={'public/uploads/' + new Date().valueOf() + '.jpg'}
                                            onFinish={(fileName)=>{addForm.setFieldsValue({
                                                course_image:fileName
                                            })}}
                                        />
                                    </Form.Item>

                                </Col>
                            </Row>
                            <Form.Item
                                wrapperCol={{ offset: 0, span: 24 }}
                                label="Course Description"
                                name='description'
                                labelCol={{ span: 24, offset: 0 }}
                                style={{ marginTop: '0px' }}


                                rules={[{
                                    // type: 'object',
                                    required: true,
                                    message: 'Description is required'
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
                            <Form.Item wrapperCol={{ offset: 12, span: 24 }}>
                                <Button size="large" type="primary" htmlType="submit" style={{}}>
                                    Submit
                                </Button>
                            </Form.Item>

                        </Form>
                    </Spin>
                </Card>

            </Content>

        </>
    );

}
export default AddCourse;