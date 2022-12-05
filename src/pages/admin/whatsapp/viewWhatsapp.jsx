import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Col, message, Space } from 'antd';
import { Button, Card } from 'antd';
import { Form, Input, Select, InputNumber, Radio, Checkbox, Tag } from 'antd';
import { Breadcrumb, Layout, Spin, Divider, Image } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import PsContext from '../../../context';
import { Editor } from '@tinymce/tinymce-react';
import { ImageUpload, FormItem, MyButton, FormViewItem } from '../../../comp';
import { capitalizeFirst } from '../../../utils';
import { green, blue, red, cyan, grey } from '@ant-design/colors';
import moment from 'moment'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePdf } from '@fortawesome/free-solid-svg-icons';

const ViewWhatsapp = (props) => {
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

    }, [viewIdOrObject]);
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
                        name="basic"
                        labelAlign="left"
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 20 }}
                        initialValues={{ remember: true }}
                        autoComplete="off"
                    >

                        <FormViewItem label="Status">: <Tag color={viewData.msg_status === 'Delivered' ? 'green' : 'red'} style={{ fontWeight: 'bold' }}>{viewData.msg_status}</Tag></FormViewItem>
                        <FormViewItem label="Date">{moment(viewData.msg_date).format('DD/MM/YYYY h:mm a').toString()}</FormViewItem>
                        <FormViewItem label="Mobile No">{viewData.mobile_no}</FormViewItem>
                        <FormViewItem label="Message Type">{viewData.msg_type}</FormViewItem>
                        <Card title="Message">
                            <Row>
                                {viewData.msg}
                            </Row>
                            {
                                viewData.images && (<Row><Image.PreviewGroup>
                                    {
                                        viewData.images.split(",").map(item => <Image width={200} src={context.baseUrl + item} />)
                                    }
                                </Image.PreviewGroup></Row>)
                            }
                            {
                                viewData.pdf && (<Row>

                                    <MyButton type="outlined" size="large" href={context.baseUrl + viewData.pdf} target="blank"><span style={{ color: red[7], fontSize: '20px' }}><FontAwesomeIcon icon={faFilePdf} /></span> Download</MyButton>
                                </Row>)
                            }

                        </Card>
                        
                       {/*  <PDFViewer
                            document={{
                                url: 'https://rajmatrimony.com/api/v2_0/public/whatsapp_images/1666336342.pdf',
                            }}
                        /> */}


                        {/*  <Divider> <span style={{color:cyan[7],fontWeight:'bold'}}>Message</span></Divider> */}




                    </Form>)
                }

            </Spin>
        </>
    );

}
export default ViewWhatsapp;