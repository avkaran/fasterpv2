import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Col, message, Space } from 'antd';
import { Button, Card } from 'antd';
import { Form, Input, Select, InputNumber, Radio, Checkbox } from 'antd';
import { Breadcrumb, Layout, Spin } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import PsContext from '../../../../../../context';
import { Editor } from '@tinymce/tinymce-react';
import { ImageUpload, FormItem, MyButton, FormViewItem } from '../../../../../../comp';
import { capitalizeFirst } from '../../../../../../utils';
import moment from 'moment'
const ViewPackageDiscount = (props) => {
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
            query: "select pd.*,p.plan_name from package_discounts pd,packages p where pd.discount_for=p.id and p.status=1 and p.id=" + id
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
                                <FormViewItem label="Discount Title">{viewData.discount_title}</FormViewItem>
                            </Col>
                            <Col className='gutter-row' xs={24} xl={12}>
                                <FormViewItem label="Discount for">{viewData.plan_name}</FormViewItem>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col className='gutter-row' xs={24} xl={12}>
                                <FormViewItem label="Valid From">{moment(viewData.valid_from).format("DD/MM/YYYY")}</FormViewItem>
                            </Col>
                            <Col className='gutter-row' xs={24} xl={12}>
                                <FormViewItem label="Percentage">{viewData.percentage +"%"}</FormViewItem>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col className='gutter-row' xs={24} xl={12}>
                                <FormViewItem label="Valid To">{moment(viewData.valid_to).format("DD/MM/YYYY")}</FormViewItem>
                            </Col>
                            <Col className='gutter-row' xs={24} xl={12}>
                                <FormViewItem label="Active Status">{viewData.active_status}</FormViewItem>
                            </Col>
                        </Row>
                    </Form>)
                }

            </Spin>
        </>
    );

}
export default ViewPackageDiscount;