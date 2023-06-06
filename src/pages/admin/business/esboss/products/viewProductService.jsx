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
            query: "select * from products where status=1 and id=" + id
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
                                <FormViewItem label="Category">{viewData.category_name}</FormViewItem>
                            </Col>
                            <Col className='gutter-row' xs={24} xl={12}>
                                <FormViewItem label="Product Name">{viewData.product_name}</FormViewItem>
                            </Col>
                            <Col className='gutter-row' xs={24} xl={12}>
                                <FormViewItem label="Unit Name">{viewData.unit_name}</FormViewItem>
                            </Col>
                            <Col className='gutter-row' xs={24} xl={12}>
                                <FormViewItem label="Cgst">{viewData.cgst}</FormViewItem>
                            </Col>
                            <Col className='gutter-row' xs={24} xl={12}>
                                <FormViewItem label="Sgst">{viewData.sgst}</FormViewItem>
                            </Col>
                            <Col className='gutter-row' xs={24} xl={12}>
                                <FormViewItem label="Company Profit Percentage">{viewData.company_profit_percentage}</FormViewItem>
                            </Col>
                            <Col className='gutter-row' xs={24} xl={12}>
                                <FormViewItem label="Delivery Boy Incentive Percentage">{viewData.delivery_boy_incentive_percentage}</FormViewItem>
                            </Col>
                            <Col className='gutter-row' xs={24} xl={12}>
                                <FormViewItem label="Agency Profit Percentage">{viewData.agency_profit_percentage}</FormViewItem>
                            </Col>
                            <Col className='gutter-row' xs={24} xl={12}>
                                <FormViewItem label="Delivery Charge">{viewData.delivery_charge}</FormViewItem>
                            </Col>
                            <Col className='gutter-row' xs={24} xl={12}>
                                <FormViewItem label="Description">{viewData.description}</FormViewItem>
                            </Col>
                            <Col className='gutter-row' xs={24} xl={12}>
                                <FormViewItem label="Product Status">{viewData.product_status}</FormViewItem>
                            </Col>
                        </Row>


                    </Form>)
                }

            </Spin>
        </>
    );

}
export default ViewPackage;