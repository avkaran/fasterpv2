import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Col, message, Space } from 'antd';
import { Button, Card } from 'antd';
import { Form, Input, Select, InputNumber, Radio, Checkbox,Avatar,Image,Tag } from 'antd';
import { Breadcrumb, Layout, Spin } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import PsContext from '../../../context';
import { Editor } from '@tinymce/tinymce-react';
import { ImageUpload, FormItem, MyButton, FormViewItem } from '../../../comp';
import { capitalizeFirst } from '../../../utils';
import { green, red, cyan, blue, magenta } from '@ant-design/colors';
import dayjs from 'dayjs'
const ViewAdvertisement = (props) => {
    const context = useContext(PsContext);
    const { Content } = Layout;
    const navigate = useNavigate();
    const [addForm] = Form.useForm();
    const [loader, setLoader] = useState(false);
    const [curAction, setCurAction] = useState('add');
    const [viewData, setviewData] = useState(null);
    const [heading] = useState('Advertisement');
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
            query: "select * from ads where status=1 and id=" + id
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
                                <Tag color="cyan" style={{ fontWeight: 'bold' }}>{viewData.customer}</Tag><br />
                             
                            </Col>
                            
                        </Row>
                        <Row gutter={16} style={{marginTop:'10px'}}>
                            <Col className='gutter-row' xs={24} xl={12}>
                                <FormViewItem label="Customer Name">{viewData.customer}</FormViewItem>
                            </Col>
                            <Col className='gutter-row' xs={24} xl={12}>
                                <FormViewItem label="Mobile No">{viewData.mobile_no}</FormViewItem>
                            </Col>
                            <Col className='gutter-row' xs={24} xl={12}>
                                <FormViewItem label="Location">{viewData.location_id}</FormViewItem>
                            </Col>
                            <Col className='gutter-row' xs={24} xl={12}>
                                <FormViewItem label="Ad Url">{viewData.ad_url}</FormViewItem>
                            </Col>
                            <Col className='gutter-row' xs={24} xl={12}>
                                <FormViewItem label="CPC Cost">{viewData.cpc_cost}</FormViewItem>
                            </Col>
                            <Col className='gutter-row' xs={24} xl={12}>
                                <FormViewItem label="CPM Cost">{viewData.cpm_cost}</FormViewItem>
                            </Col>
                            <Col className='gutter-row' xs={24} xl={12}>
                                <FormViewItem label="CPA Cost">{viewData.cpa_cost}</FormViewItem>
                            </Col>
                            <Col className='gutter-row' xs={24} xl={12}>
                                <FormViewItem label="Ad Content">{viewData.ad_html}</FormViewItem>
                            </Col>
                            <Col className='gutter-row' xs={24} xl={12}>
                            <FormViewItem label="Description">{viewData.ad_description}</FormViewItem>
                                {/* <FormViewItem label="Photo">{viewData.photo}</FormViewItem> */}
                            </Col>
                            <Col className='gutter-row' xs={24} xl={12}>
                                <FormViewItem label="Budget">{viewData.budget}</FormViewItem>
                            </Col>
                         <Col className='gutter-row' xs={24} xl={12}>
                                <FormViewItem label=" Status">{viewData.active_status}</FormViewItem>
                            </Col>
                           
                        </Row>

                    </Form>)
                }

            </Spin>
        </>
    );

}
export default ViewAdvertisement ;