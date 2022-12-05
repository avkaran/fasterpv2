import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Col, message, Space } from 'antd';
import { Button, Card } from 'antd';
import { Form, Input, Select, InputNumber, Radio, Checkbox,Avatar,Image,Tag } from 'antd';
import { Breadcrumb, Layout, Spin } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import PsContext from '../../../../../../context';
import { Editor } from '@tinymce/tinymce-react';
import { ImageUpload, FormItem, MyButton, FormViewItem } from '../../../../../../comp';
import { capitalizeFirst } from '../../../../../../utils';
import { green, red, cyan, blue, magenta } from '@ant-design/colors';
import moment from 'moment'
const ViewBroker = (props) => {
    const context = useContext(PsContext);
    const { Content } = Layout;
    const navigate = useNavigate();
    const [addForm] = Form.useForm();
    const [loader, setLoader] = useState(false);
    const [curAction, setCurAction] = useState('add');
    const [viewData, setviewData] = useState(null);
    const [heading] = useState('Package');
    const { viewIdOrObject, onListClick, userId, ...other } = props;
    const [viewId, setViewId] = useState(null);
    useEffect(() => {
        if (typeof viewIdOrObject === 'object') {
            setViewId(viewIdOrObject.id);
            setviewData(viewIdOrObject);

        } else {
            setViewId(viewIdOrObject)
            loadViewData(viewIdOrObject);
        }

    }, []);
    const loadViewData = (id) => {
        setLoader(true);
        var reqData = {
            query_type: 'query',
            query: "select * from branches where status=1 and id=" + id
        };
        context.psGlobal.apiRequest(reqData, context.adminUser(userId).mode).then((res) => {
            setviewData(res[0]);
            setLoader(false);

        }).catch(err => {
            message.error(err);
            setLoader(false);

        })
    }
    return (
        <>
            <Spin spinning={loader} >
                {
                    viewData && (<Form
                        colon={false}
                        labelAlign="left"
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 20 }}
                        initialValues={{ remember: true }}
                        autoComplete="off"
                    >
                        <Row gutter={16}>
                            <Col className='gutter-row' xs={24} xl={5}>
                                <Avatar size={100} shape="circle" src={<Image
                                    width={100}
                                    src={viewData.photo ? context.baseUrl + viewData.photo : viewData.gender === 'Male' ? context.noMale : context.noFemale}
                                    fallback={context.noImg}
                                />} />
                            </Col>
                            <Col className='gutter-row' xs={24} xl={7}>
                                <span style={{ color: cyan[6], fontWeight: 'bold', fontSize: '20px' }}> {viewData.name}</span><br />
                                <Tag color="cyan" style={{ fontWeight: 'bold' }}>{viewData.broker_code}</Tag><br />
                               Age : <span style={{ color: cyan[6], fontWeight: 'bold', margin: '10px 0px 10px 0px' }}> {viewData.age} Yrs</span><br />
                               Working for : <span style={{ color: cyan[6], fontWeight: 'bold', margin: '10px 0px 10px 0px' }}> {viewData.maturity} Yrs</span><br />
                            </Col>
                            <Col className='gutter-row' xs={24} xl={4}>
                                Aadhaar : {viewData.aadhar_no}
                               <Image
                                    width={100}
                                    src={viewData.aadhar_image ? context.baseUrl + viewData.aadhar_image : context.noImg}
                                    fallback={context.noImg}
                                />
                            </Col>
                        </Row>
                        <Row gutter={16} style={{marginTop:'10px'}}>
                            <Col className='gutter-row' xs={24} xl={12}>
                                <FormViewItem label="Broker Code">{viewData.broker_code}</FormViewItem>
                            </Col>
                            <Col className='gutter-row' xs={24} xl={12}>
                                <FormViewItem label="Name">{viewData.name}</FormViewItem>
                            </Col>
                            <Col className='gutter-row' xs={24} xl={12}>
                                <FormViewItem label="Office Name">{viewData.office_name}</FormViewItem>
                            </Col>
                            <Col className='gutter-row' xs={24} xl={12}>
                                <FormViewItem label="Designation">{viewData.designation}</FormViewItem>
                            </Col>
                            <Col className='gutter-row' xs={24} xl={12}>
                                <FormViewItem label="Email">{viewData.email}</FormViewItem>
                            </Col>
                            <Col className='gutter-row' xs={24} xl={12}>
                                <FormViewItem label="Mobile No">{viewData.mobile_no}</FormViewItem>
                            </Col>
                            <Col className='gutter-row' xs={24} xl={12}>
                                <FormViewItem label="Handling Religion">{viewData.handling_religion}</FormViewItem>
                            </Col>
                            <Col className='gutter-row' xs={24} xl={12}>
                                <FormViewItem label="handling Caste">{viewData.handling_caste}</FormViewItem>
                            </Col>
                            <Col className='gutter-row' xs={24} xl={12}>
                            <FormViewItem label="website">{viewData.website}</FormViewItem>
                                {/* <FormViewItem label="Photo">{viewData.photo}</FormViewItem> */}
                            </Col>
                            <Col className='gutter-row' xs={24} xl={12}>
                                <FormViewItem label="Address">{viewData.address}</FormViewItem>
                            </Col>
                            <Col className='gutter-row' xs={24} xl={12}>
                                {/* <FormViewItem label="Aadhar Image">{viewData.aadhar_image}</FormViewItem> */}
                            </Col>
                            <Col className='gutter-row' xs={24} xl={12}>
                               
                            </Col>
                            <Col className='gutter-row' xs={24} xl={12}>
                                <FormViewItem label="Broker Country">{viewData.broker_country}</FormViewItem>
                            </Col>
                            <Col className='gutter-row' xs={24} xl={12}>
                                <FormViewItem label="Broker District">{viewData.broker_country}</FormViewItem>
                            </Col>
                            <Col className='gutter-row' xs={24} xl={12}>
                                <FormViewItem label="Broker State">{viewData.broker_state}</FormViewItem>
                            </Col>
                            <Col className='gutter-row' xs={24} xl={12}>
                                <FormViewItem label="Broker Status">{viewData.broker_status}</FormViewItem>
                            </Col>
                            <Col className='gutter-row' xs={24} xl={12}>
                                <FormViewItem label="Login Username">{viewData.username}</FormViewItem>
                            </Col>
                            <Col className='gutter-row' xs={24} xl={12}>
                                <FormViewItem label="Login Password">{context.psGlobal.decrypt(viewData.password)}</FormViewItem>
                            </Col>
                            <Col className='gutter-row' xs={24} xl={12}>
                                <FormViewItem label="Login Status">{viewData.active_status}</FormViewItem>
                            </Col>
                        </Row>

                    </Form>)
                }

            </Spin>
        </>
    );

}
export default ViewBroker;