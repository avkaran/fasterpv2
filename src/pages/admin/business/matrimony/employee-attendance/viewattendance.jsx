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

const ViewAttendance = (props) => {
    const context = useContext(PsContext);
    const { Content } = Layout;
    const navigate = useNavigate();
    const [addForm] = Form.useForm();
    const [loader, setLoader] = useState(false);
    const [curAction, setCurAction] = useState('add');
    const [viewData, setviewData] = useState(null);
    const [heading] = useState('Attendance');
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
            // query: "select a.*,b.id from attendance_permissions a, employees b, where a.status=1 AND b.status=1 AND b.id=a.employee_id"
             query:"select a.*,b.id,name from attendance_permissions a, employees b WHERE a.status=1 AND b.status=1 AND b.id=a.employee_id"
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
                                <FormViewItem label="Id">{viewData.employee_id}</FormViewItem>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col className='gutter-row' xs={24} xl={12}>
                                <FormViewItem label="Name">{viewData.name}</FormViewItem>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col className='gutter-row' xs={24} xl={12}>
                                <FormViewItem label="Reason">{viewData.reason}</FormViewItem>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col className='gutter-row' xs={24} xl={12}>
                                <FormViewItem label="From Time">{viewData.from_time}</FormViewItem>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col className='gutter-row' xs={24} xl={12}>
                                <FormViewItem label="To Time">{viewData.to_time}</FormViewItem>
                            </Col>
                            
                        </Row>

                    </Form>)
                }

            </Spin>
        </>
    );

}
export default ViewAttendance;

