import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Col, message, Space } from 'antd';
import { Button, Card } from 'antd';
import { Form, Input, Select, InputNumber, Radio, Checkbox } from 'antd';
import { Breadcrumb, Layout, Spin } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import PsContext from '../../../../../context';
import { Editor } from '@tinymce/tinymce-react';
import { ImageUpload, FormItem, MyButton, FormViewItem } from '../../../../../comp';
import { capitalizeFirst } from '../../../../../utils';
const ViewPackage = (props) => {
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
            query: "select * from packages where status=1 and id=" + id
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
                            name="basic"
                            labelAlign="left"
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 20 }}
                            initialValues={{ remember: true }}
                            autoComplete="off"
                        >
                            <Row gutter={16}>
                                <Col className='gutter-row' xs={24} xl={12}>

                                    <FormViewItem label="Plan Name">{viewData.plan_name}</FormViewItem>
                                </Col>
                                <Col className='gutter-row' xs={24} xl={12}>

                                    <FormViewItem label="Daily Limit">{viewData.daily_limit}</FormViewItem>
                                </Col>
                            </Row>

                            <Row gutter={16}>
                                <Col className='gutter-row' xs={24} xl={12}>

                                    <FormViewItem label="Monthly Limit">{viewData.monthly_limit}</FormViewItem>

                                </Col>
                                <Col className='gutter-row' xs={24} xl={12}>
                                    <FormViewItem label="Validity">{viewData.validity_months +' Months'}</FormViewItem>


                                </Col>
                            </Row>
                            <Row gutter={16}>
                                <Col className='gutter-row' xs={24} xl={12}>
                                    <FormViewItem label="Category">{viewData.category}</FormViewItem>

                                </Col>
                                <Col className='gutter-row' xs={24} xl={12}>
                                    <FormViewItem label="Package Price">{'INR '+ viewData.package_price.toString()}</FormViewItem>
                                </Col>
                            </Row>
                            <Row gutter={16}>
                                <Col className='gutter-row' xs={24} xl={12}>
                                    <FormViewItem label="Consume Credits">{viewData.consume_credits +' Contacts'}</FormViewItem>
                                </Col>
                                <Col className='gutter-row' xs={24} xl={12}>
                                    <FormViewItem label="Package For">{viewData.package_for}</FormViewItem>
                                </Col>
                            </Row>
                            <Row gutter={16}>
                                <Col className='gutter-row' xs={24} xl={12}>
                                    <FormViewItem label="SMS">{parseInt(viewData.is_send_sms) === 1 ? 'Yes' : 'No'}</FormViewItem>
                                </Col>
                                <Col className='gutter-row' xs={24} xl={12}>
                                    <FormViewItem label="Whatsapp">{parseInt(viewData.is_send_whatsapp) === 1 ? 'Yes' : 'No'}</FormViewItem>
                                </Col>

                            </Row>
                            <Row gutter={16}>
                                <Col className='gutter-row' xs={24} xl={12}>
                                    <FormViewItem label="VIP">{parseInt(viewData.is_vip) === 1 ? 'Yes' : 'No'}</FormViewItem>
                                </Col>
                                <Col className='gutter-row' xs={24} xl={12}>
                                    <FormViewItem label="Status">{viewData.package_status}</FormViewItem>
                                </Col>
                            </Row>
                        </Form>)
                    }

                </Spin>
        </>
    );

}
export default ViewPackage;