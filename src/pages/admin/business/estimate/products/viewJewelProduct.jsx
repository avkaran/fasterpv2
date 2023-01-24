import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Col, message, Space } from 'antd';
import { Button, Card } from 'antd';
import { Form, Input, Select, InputNumber, Radio, Checkbox,Tag } from 'antd';
import { Breadcrumb, Layout, Spin } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import PsContext from '../../../../../context';
import { Editor } from '@tinymce/tinymce-react';
import { ImageUpload, FormItem, MyButton, FormViewItem } from '../../../../../comp';
import { capitalizeFirst } from '../../../../../utils';
const ViewJewelProduct = (props) => {
    const context = useContext(PsContext);
    const { Content } = Layout;
    const navigate = useNavigate();
    const [addForm] = Form.useForm();
    const [loader, setLoader] = useState(false);
    const [curAction, setCurAction] = useState('add');
    const [viewData, setviewData] = useState(null);
    const [heading] = useState('Package');
    const { viewIdOrObject, onListClick, userId,formItemLayout,...other } = props;
    const [viewId, setViewId] = useState(null);
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
                        labelCol={{ span:  formItemLayout==='two-column' || formItemLayout==='one-column' || context.isMobile?8:24 }}
                        wrapperCol={{ span: 20 }}
                        initialValues={{ remember: true }}
                        autoComplete="off"
                    >
                        <Row gutter={3}>
                            <Col className='gutter-row' xs={24} xl={formItemLayout==='one-column'?24:12}>
                                <FormViewItem label="Product Code" colon={formItemLayout!=='two-column-wrap' || context.isMobile}>{viewData.product_code}</FormViewItem>
                            </Col>
                            <Col className='gutter-row' xs={24} xl={formItemLayout==='one-column'?24:12}>
                                <FormViewItem label="Metal Type" colon={formItemLayout!=='two-column-wrap' || context.isMobile}>{viewData.metal_type}</FormViewItem>
                            </Col>
                            <Col className='gutter-row' xs={24} xl={formItemLayout==='one-column'?24:12}>
                                <FormViewItem label="Product Name" colon={formItemLayout!=='two-column-wrap' || context.isMobile}>{viewData.product_name}</FormViewItem>
                            </Col>
                            <Col className='gutter-row' xs={24} xl={formItemLayout==='one-column'?24:12}>
                                <FormViewItem label="Weight" colon={formItemLayout!=='two-column-wrap' || context.isMobile}>{viewData.weight}</FormViewItem>
                            </Col>
                            <Col className='gutter-row' xs={24} xl={formItemLayout==='one-column'?24:12}>
                                <FormViewItem label="Active Status" colon={formItemLayout!=='two-column-wrap' || context.isMobile}><Tag color={parseInt(viewData.active_status) === 1 ? 'green' : 'red'} style={{ fontWeight: 'bold' }}>{parseInt(viewData.active_status)===1?'Active':'Inactive'}</Tag></FormViewItem>
                            </Col>
                        </Row>


                    </Form>)
                }

            </Spin>
        </>
    );

}
export default ViewJewelProduct;