import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Col, message, Space } from 'antd';
import { Button, Card } from 'antd';
import { Form, Input, Select, InputNumber, Radio, Checkbox,Tag } from 'antd';
import { Breadcrumb, Layout, Spin,Image } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import PsContext from '../../../../../context';
import { Editor } from '@tinymce/tinymce-react';
import { ImageUpload, FormItem, MyButton, FormViewItem } from '../../../../../comp';
import { capitalizeFirst } from '../../../../../utils';
import dayjs from 'dayjs'
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
            query: "select p.*,e.name,e.mobile_no from bills p,employees e where p.status=1 and p.employee_id=e.id and p.id=" + id
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
                                <FormViewItem label="Bill No" colon={formItemLayout!=='two-column-wrap' || context.isMobile}>{viewData.bill_no}</FormViewItem>
                            </Col>
                            <Col className='gutter-row' xs={24} xl={formItemLayout==='one-column'?24:12}>
                                <FormViewItem label="Customer" colon={formItemLayout!=='two-column-wrap' || context.isMobile}>{viewData.name}</FormViewItem>
                            </Col>
                            <Col className='gutter-row' xs={24} xl={formItemLayout==='one-column'?24:12}>
                                <FormViewItem label="Mobile" colon={formItemLayout!=='two-column-wrap' || context.isMobile}>{viewData.mobile_no}</FormViewItem>
                            </Col>
                            <Col className='gutter-row' xs={24} xl={formItemLayout==='one-column'?24:12}>
                                <FormViewItem label="Amount" colon={formItemLayout!=='two-column-wrap' || context.isMobile}>{viewData.total_amount}</FormViewItem>
                            </Col>
                            <Col className='gutter-row' xs={24} xl={formItemLayout==='one-column'?24:12}>
                                <FormViewItem label="Bill Date" colon={formItemLayout!=='two-column-wrap' || context.isMobile}>{dayjs(viewData.bill_date).format("DD/MM/YYYY")}</FormViewItem>
                            </Col>
                            <Col className='gutter-row' xs={24} xl={formItemLayout==='one-column'?24:12}>
                                <FormViewItem label="Due Date" colon={formItemLayout!=='two-column-wrap' || context.isMobile}>{viewData.due_date?dayjs(viewData.due_date).format("DD/MM/YYYY"):''}</FormViewItem>
                            </Col>
                            <Col className='gutter-row' xs={24} xl={formItemLayout==='one-column'?24:12}>
                                <FormViewItem label="Bill Image" colon={formItemLayout!=='two-column-wrap' || context.isMobile}>{viewData.bill_image && (<Image height={100} src={context.baseUrl  +'/cloud-file/'+ encodeURIComponent(encodeURIComponent(viewData.bill_image))} ></Image>)}</FormViewItem>
                            </Col>
                            <Col className='gutter-row' xs={24} xl={formItemLayout==='one-column'?24:12}>
                                <FormViewItem label="Active Status" colon={formItemLayout!=='two-column-wrap' || context.isMobile}><Tag color={parseInt(viewData.active_status) === 1 ? 'green' : 'red'} style={{ fontStock: 'bold' }}>{parseInt(viewData.active_status)===1?'Active':'Inactive'}</Tag></FormViewItem>
                            </Col>
                        </Row>


                    </Form>)
                }

            </Spin>
        </>
    );

}
export default ViewJewelProduct;