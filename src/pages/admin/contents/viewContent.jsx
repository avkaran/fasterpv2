import axios from 'axios';
import React, { useState, useEffect, useContext } from 'react';
import { Row, Col, message } from 'antd';
import { Button, Card, Image, Collapse } from 'antd';
import { Form } from 'antd';
import { Breadcrumb, Layout, Spin } from 'antd';
import { capitalizeFirst } from '../../../utils'
import { baseUrl } from '../../../utils';
import { HomeOutlined } from '@ant-design/icons';
import { contentTypes } from '../../../utils/data';
import PsContext from '../../../context'
import ResponsiveLayout from '../layout'
const ViewContent = (props) => {
    const context = useContext(PsContext);
    const { Content } = Layout;
    const [addForm] = Form.useForm();
    const { Panel } = Collapse;
    const [contentType] = useState(props.match.params.content_type)
    const [contentId] = useState(props.match.params.id)

    const [loader, setLoader] = useState(false);

    const [viewData, setViewData] = useState([]);
    useEffect(() => {
        loadData(contentId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const loadData = (id) => {
        setLoader(true);
        var form = new FormData();
        var reqData = { //if array of queries pass [] outside
            query_type: 'query',
            query: "select c.*,cc.category_name from contents c, content_categories cc where cc.id=c.category AND c.id='" + id + "'",
            // table:'test',
            // where:{id:'1'},
            //values:{name:'senthil',age:'13'}

        };
        form.append('queries', context.psGlobal.encrypt(JSON.stringify(reqData)))
        axios.post('v1/admin/db-query', form).then(res => {
            if (res['data'].status === '1') {
                let mydata = res['data'].data[0];
                console.log(mydata);
                setViewData(mydata)
                // setSelDate(mydata.dob)
                // if(mydata.feature_image) setImageUrl(baseUrl+mydata.feature_image);

                //message.success(mydata.category);
                addForm.setFieldsValue(mydata);
                addForm.setFieldsValue({

                    content_html: { html: mydata.content_html }

                    /*  
                      title: mydata.title,
                    category: mydata.category,
                    content:mydata.content,
                    member_name:mydata.name,
                     gender: mydata.gender,
                     //dob:mydata.dob,
                     marital_status: mydata.marital_status,
                     medical_registration_no:mydata.medical_registration_no,
                     qualification: mydata.qualification,
                     higher_study:mydata.higher_study,
                     specification: mydata.specification,
                     service: mydata.service,
                     prefered_zone: mydata.prefered_zone,
                     work_details: mydata.work_details,
                     about_member: mydata.about_member,
                     country: mydata.country,
                     state:mydata.state,
                     city:mydata.city,
                     mobile_no:mydata.mobile_no,
                     whatsapp_no:mydata.whatsapp_no,
                     address:mydata.address */
                });

                setLoader(false);
            }
            else {
                message.error(res['data'].message || 'Error');
            }

        });

    };
    return (
        <>

            <ResponsiveLayout

                userId={props.match.params.userId}
                customHeader={null}
                bottomMenues={null}
                breadcrumbs={[
                    { name: capitalizeFirst(props.match.params.content_type) + ' List', link: null },
                    { name: 'View ' + capitalizeFirst(props.match.params.content_type), link: null },
                ]}
            >

                <Card title={"View " + capitalizeFirst(props.match.params.content_type)} extra={<Button href={"#/" + props.match.params.userId + "/admin/contents/" + props.match.params.content_type + "/list"} ><i className="fa-solid fa-list pe-2" ></i>List {capitalizeFirst(props.match.params.content_type)}</Button>}>
                    <Spin spinning={loader} >
                        <Form
                            name="basic"
                            form={addForm}
                            labelAlign="left"
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 20 }}
                            initialValues={{ remember: true }}

                            autoComplete="off"
                        >
                            <Row gutter={16}>
                                <Col className='gutter-row' span={12}>
                                    {(contentType !== contentTypes.ANNOUNCEMENT && contentType !== contentTypes.SLIDER) && (<Form.Item
                                        label="category"
                                        name='category'


                                        rules={[{ required: true, message: 'Category is required' }]}
                                    >
                                        {viewData.category_name}
                                    </Form.Item>)}
                                    <Form.Item
                                        label="Title"
                                        name="title"
                                        rules={[{ required: true }]}
                                    >
                                        {viewData.title}
                                    </Form.Item>
                                </Col>
                                <Col className='gutter-row' span={12}>
                                    {(contentType !== contentTypes.ANNOUNCEMENT) && (


                                        <Form.Item
                                            label="Feature Image"
                                            name='feature_image'


                                        // rules={[{ required: true, message: 'Feature Image is required' }]}
                                        >
                                            {viewData.feature_image && (<Image height={100} src={baseUrl + viewData.feature_image} ></Image>)}


                                        </Form.Item>)}
                                </Col>
                            </Row>
                            {(contentType === contentTypes.SLIDER || contentType === contentTypes.GALLERY) && (<Form.Item
                                wrapperCol={{ offset: 0, span: 24 }}
                                label="Content"
                                name='content'
                                labelCol={{ span: 24, offset: 0 }}
                                style={{ marginTop: '0px' }}


                                rules={[{ required: true, message: 'Content is required' }]}
                            >
                                {viewData.content}
                            </Form.Item>)}


                            {(contentType === contentTypes.ANNOUNCEMENT || contentType === contentTypes.ARTICLE || contentType === contentTypes.PAGE || contentType === contentTypes.EVENT) && (<Form.Item
                                wrapperCol={{ offset: 0, span: 24 }}
                                label="Content"
                                name='content_html'
                                labelCol={{ span: 24, offset: 0 }}
                                style={{ marginTop: '0px' }}


                                rules={[{
                                    type: 'object',
                                    required: true,
                                    message: 'Content is required'
                                }]}
                            ><div dangerouslySetInnerHTML={{ __html: viewData.content_html }}></div>

                            </Form.Item>)}



                            {(contentType === contentTypes.ARTICLE || contentType === contentTypes.PAGE || contentType === contentTypes.EVENT) && (<Collapse accordion ghost>
                                <Panel header="SEO Info" key="1">
                                    <Form.Item
                                        wrapperCol={{ offset: 0, span: 24 }}

                                        label="Slug/Url"
                                        name='slug'
                                        labelCol={{ span: 4, offset: 0 }}
                                    //  style={{ marginTop: '0px' }}


                                    //rules={[{ required: true, message: 'Name is required' }]}
                                    >
                                        {viewData.slug}
                                    </Form.Item>
                                    <Row gutter={16}>
                                        <Col className='gutter-row' span={12}>
                                            <Form.Item
                                                label="Meta Title"
                                                name='meta_title'



                                            >
                                                {viewData.meta_title}
                                            </Form.Item>

                                        </Col>
                                        <Col className='gutter-row' span={12}>
                                            <Form.Item
                                                label="Meta Description"
                                                name='meta_description'



                                            >
                                                {viewData.meta_description}
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row gutter={16}>
                                        <Col className='gutter-row' span={12}>
                                            <Form.Item
                                                label="Meta Keywords"
                                                name='meta_keywords'



                                            >
                                                {viewData.meta_keywords}
                                            </Form.Item>

                                        </Col>
                                        <Col className='gutter-row' span={12}>
                                            <Form.Item
                                                label="SEO Tags"
                                                name='seo_tags'



                                            >
                                                {viewData.seo_tags}
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </Panel>

                            </Collapse>)}



                        </Form>
                    </Spin>
                </Card>

            </ResponsiveLayout>

        </>
    );

}
export default ViewContent;