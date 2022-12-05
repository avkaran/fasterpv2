import axios from 'axios';
import React, { useState, useEffect, useContext } from 'react';
import { Row, Col, message } from 'antd';
import { Button, Card } from 'antd';
import { Form, Layout } from 'antd';
import { Breadcrumb, Spin,Image } from 'antd';
import { baseUrl } from '../../../../../utils';
import { HomeOutlined } from '@ant-design/icons';
import 'react-phone-input-2/lib/style.css'
import PsContext from '../../../../../context';

const ViewUser = (props) => {
    const { Content } = Layout;
    const context = useContext(PsContext);
    const [addForm] = Form.useForm();
    const [loader, setLoader] = useState(false);
    const [viewData, setViewData] = useState([]);
    const [userId] = useState(props.match.params.customerUserId)
    useEffect(() => {

        loadData(userId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const loadData = (id) => {
        setLoader(true);
        var form = new FormData();
        var reqData = { //if array of queries pass [] outside
            query_type: 'query',
            query: "select * from users where id='" + id + "'",
            // table:'test',
            // where:{id:'1'},
            //values:{name:'senthil',age:'13'}

        };
        form.append('queries', context.psGlobal.encrypt(JSON.stringify(reqData)))
        axios.post('v1/admin/db-query', form).then(res => {
            if (res['data'].status === '1') {
                let mydata = res['data'].data[0];
                setViewData(mydata)
               
                addForm.setFieldsValue({
                    name: mydata.name,
                    gender: mydata.gender,
                    manai: mydata.manai,
                    marital_status: mydata.marital_status,
                    medical_registration_no: mydata.medical_registration_no,
                    qualification: mydata.qualification,
                    higher_study: mydata.higher_study,
                    specification: mydata.specification,
                    service: mydata.service,
                    prefered_zone: mydata.prefered_zone,
                    work_details: mydata.work_details,
                    about_member: mydata.about_member,
                    country: mydata.country,
                    state: mydata.state,
                    city: mydata.city,
                    mobile_no: mydata.mobile_no,
                    whatsapp_no: mydata.whatsapp_no,
                    email: mydata.email,
                    address: mydata.address,
                    aadhaar_no: mydata.aadhaar_no,
                    is_auto_approve_articles: mydata.is_auto_approve_articles,
                    is_matrimony_member: mydata.is_matrimony_member
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
                        <span>Manage Users</span>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>View User</Breadcrumb.Item>
                </Breadcrumb>

                <Card title="View User" extra={<Button href={"#/"+props.match.params.userId+"/admin/users"}><i className="fa-solid fa-list pe-2" ></i>List Users</Button>}>

                    <Spin spinning={loader} >
                     {
                         viewData && Object.keys(viewData).length>0 && ( <Form
                            name="basic"
                            form={addForm}
                            labelAlign="left"
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 20 }}
                            initialValues={{ remember: true }}
                            //onFinish={onFinish}
                           // onFinishFailed={onFinishFailed}
                            autoComplete="off"
                        >

                            <Row gutter={16}> {/* tow column row start */}
                                <Col className='gutter-row' xs={24} xl={12}>
                                    <Form.Item
                                        label="Name"
                                        name="title"

                                    >
                                        {viewData.title + " " + viewData.first_name + " " + (viewData.last_name ? viewData.last_name : '')}
                                    </Form.Item>
                                    <Form.Item

                                        label="Date of Birth"
                                    >
                                        {viewData.dob}
                                    </Form.Item>

                                </Col>
                                <Col className='gutter-row' xs={24} xl={12}>
                                    {viewData.photo && (<Image height={100} src={baseUrl + viewData.photo} ></Image>)}

                                </Col>
                            </Row> {/* tow column row end */}
                            <Row gutter={16}> {/* tow column row start */}
                                <Col className='gutter-row' xs={24} xl={7}>
                                    <Form.Item
                                        label="Gender"
                                        name="dob"
                                        // labelCol={{ span: 8 }}
                                        wrapperCol={{ offset: 6, span: 12 }}
                                    // value={selDate}

                                    >
                                        {viewData.gender}


                                    </Form.Item>

                                </Col>
                                <Col className='gutter-row' xs={24} xl={5}>

                                </Col>
                                <Col className='gutter-row' xs={24} xl={12}>
                                    <Form.Item
                                        label="Mobile No"
                                        name="mobile_no"


                                    >
                                        {viewData.mobile_no}
                                    </Form.Item>
                                </Col>
                            </Row> {/* tow column row end */}


                            <Row gutter={16} style={{ backgroundColor: 'cyan-1' }}> {/* tow column row start */}
                                <Col className='gutter-row' xs={24} xl={12}>
                                    <Form.Item
                                        label="Email"
                                        name="email"


                                    >
                                        {viewData.email}
                                    </Form.Item>
                                </Col>
                                <Col className='gutter-row' xs={24} xl={12}>
                                    <Form.Item
                                        label="Address"
                                        name="address"
                                      //  rules={[{ required: true, message: 'Enter Address' }]}
                                    >
                                        {viewData.address}
                                    </Form.Item>
                                </Col>
                            </Row> {/* tow column row end */}
                            <Row gutter={16} style={{ backgroundColor: 'cyan-1' }}> {/* tow column row start */}
                                <Col className='gutter-row' xs={24} xl={12}>
                                    <Form.Item
                                        label="Created on"
                                        name="created_date"


                                    >
                                        {viewData.created_date}
                                    </Form.Item>
                                </Col>
                                <Col className='gutter-row' xs={24} xl={12}>
                                <Form.Item
                                        label="Password"
                                        name="password"


                                    >
                                        {context.psGlobal.decrypt(viewData.password)}
                                    </Form.Item>
                                </Col>
                            </Row> {/* tow column row end */}






                        </Form>)
                     }  
                    </Spin>
                </Card>

            </Content>

        </>
    );

}
export default ViewUser;