import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Col, message, Space } from 'antd';
import { Button, Card } from 'antd';
import { Form, Input, Select, InputNumber, Radio, Checkbox, Avatar, Image, Tag } from 'antd';
import { Breadcrumb, Layout, Spin, Modal } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import PsContext from '../../../../context';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Editor } from '@tinymce/tinymce-react';
import { ImageUpload, FormItem, MyButton, FormViewItem } from '../../../../comp';
import { capitalizeFirst } from '../../../../utils';
import { green, red, cyan, blue, magenta } from '@ant-design/colors';
import dayjs from 'dayjs'
import { faPencil } from '@fortawesome/free-solid-svg-icons';
import EditFranchise from './editFranchise';
const FranchiseProfile = (props) => {
    const context = useContext(PsContext);
    const { Content } = Layout;
    const navigate = useNavigate();
    const [addForm] = Form.useForm();
    const [loader, setLoader] = useState(false);
    const [curAction, setCurAction] = useState('view');
    
    const [editId, setEditId] = useState(null);
    const [isModal] = useState(false);
    const [visibleModal, setVisibleModal] = useState(false);
    const [viewData, setviewData] = useState(null);
    const [visiblePasswordModal, setvisiblePasswordModal] = useState(false);
    const [heading] = useState('Package');
    const { viewIdOrObject, onListClick, onSaveFinish, userId, ...other } = props;
    const [viewId, setViewId] = useState(null);
    const [passwordLoader, setPasswordLoader] = useState(false);
    useEffect(() => {
        setViewId(context.adminUser(userId).ref_id);
        loadViewData(context.adminUser(userId).ref_id);
    }, []);
    const loadViewData = (id) => {
        setLoader(true);
        var reqData = {
            query_type: 'query',
            query: "select e.*,u.username,u.password,u.active_status from franchise e,vi_users u where e.status=1 and u.status=1 and u.ref_table_column='franchise.id' and e.id=u.ref_id and u.ref_id=" + id
        };
        context.psGlobal.apiRequest(reqData, context.adminUser(userId).mode).then((res) => {
            setviewData(res[0]);
            setLoader(false);

        }).catch(err => {
            message.error(err);
            setLoader(false);

        })
    }
    const passwordOnFinish = (values) => {
        var processedValues = {};
        processedValues['password'] = context.psGlobal.encrypt(values['password']);
        if (values["old_password"] === context.psGlobal.decrypt(viewData.password)) {
            setPasswordLoader(true);
            var reqDataInsert = {
                query_type: 'update',
                table: 'vi_users',
                where: { ref_id: viewId, ref_table_column: "franchise.id" },
                values: processedValues

            };
            //context.adminUser(userId).mode
            context.psGlobal.apiRequest(reqDataInsert, "dev").then((res) => {
                message.success('Password Changed Successfullly');
                setPasswordLoader(false);
                setvisiblePasswordModal(false);
            }).catch(err => {
                message.error(err);
                setPasswordLoader(false);
            })

        } else {
            message.error('Incorrect Old Password');
        }
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
                        <span>{heading + "s"}</span>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>List Franchise</Breadcrumb.Item>
                </Breadcrumb>
                {
                    viewData && curAction === "edit" && (<Card title="My Account">
                        <EditFranchise
                            editIdOrObject={viewData}
                            onListClick={() => setCurAction("view")}
                            onSaveFinish={() => { setCurAction("view"); loadViewData(viewId) }}
                            userId={userId}

                        />
                    </Card>)
                }
                {
                    curAction === "view" && (<Card title="My Account"
                        extra={
                            <MyButton  onClick={() => setCurAction('edit')}>
                               
                            <FontAwesomeIcon icon={faPencil}/>Edit Profile</MyButton>
                        }>
                        <Spin spinning={loader} >
                            {
                                viewData && (<Form
                                    colon={false}
                                    labelAlign="left"
                                    labelCol={{ span: 6 }}
                                    wrapperCol={{ span: 16 }}
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
                                            <Tag color="cyan" style={{ fontWeight: 'bold' }}>{viewData.franchise_code}</Tag><br />
                                            Distric : <span style={{ color: cyan[6], fontWeight: 'bold', margin: '10px 0px 10px 0px' }}> {viewData.district} </span><br />
                                            State: <span style={{ color: cyan[6], fontWeight: 'bold', margin: '10px 0px 10px 0px' }}> {viewData.state} </span><br />
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
                                    <Row gutter={16} style={{ marginTop: '10px' }}>
                                        <Col className='gutter-row' xs={24} xl={12}>
                                            <FormViewItem label="Franchise Code">{viewData.franchise_code}</FormViewItem>
                                        </Col>
                                        <Col className='gutter-row' xs={24} xl={12}>
                                            <FormViewItem label="Name">{viewData.name}</FormViewItem>
                                        </Col>

                                        <Col className='gutter-row' xs={24} xl={12}>
                                            <FormViewItem label="Designation">{viewData.designation}</FormViewItem>
                                        </Col>

                                        <Col className='gutter-row' xs={24} xl={12}>
                                            <FormViewItem label="Mobile No">{viewData.mobile_no}</FormViewItem>
                                        </Col>

                                        <Col className='gutter-row' xs={24} xl={12}>
                                            <FormViewItem label="Email">{viewData.email}</FormViewItem>
                                        </Col>
                                        <Col className='gutter-row' xs={24} xl={12}>
                                            <FormViewItem label="Address">{viewData.address}</FormViewItem>
                                        </Col>
                                        <Col className='gutter-row' xs={24} xl={12}>
                                            <FormViewItem label="Website">{viewData.website}</FormViewItem>
                                        </Col>
                                        <Col className='gutter-row' xs={24} xl={12}>
                                            <FormViewItem label="Country">{viewData.country}</FormViewItem>
                                        </Col>
                                        <Col className='gutter-row' xs={24} xl={12}>
                                            <FormViewItem label="State">{viewData.state}</FormViewItem>
                                        </Col>
                                        <Col className='gutter-row' xs={24} xl={12}>
                                            <FormViewItem label="District">{viewData.district}</FormViewItem>
                                        </Col>
                                        <Col className='gutter-row' xs={24} xl={12}>
                                            <FormViewItem label="Franchise status">{viewData.franchise_status}</FormViewItem>
                                        </Col>
                                        <Col className='gutter-row' xs={24} xl={12}>
                                            <FormViewItem label="Login Username">{viewData.username}</FormViewItem>
                                        </Col>
                                        <Col className='gutter-row' xs={24} xl={12}>
                                            <FormViewItem label="Login Password">{context.psGlobal.decrypt}  <Button onClick={() => setvisiblePasswordModal(true)}>Reset</Button></FormViewItem>
                                        </Col>
                                        <Col className='gutter-row' xs={24} xl={12}>
                                            <FormViewItem label="Login Status">{viewData.active_status}</FormViewItem>
                                        </Col>
                                    </Row>
                                </Form>)
                            }
                        </Spin>
                    </Card>)
                }
            </Content>
            <Modal
                visible={visiblePasswordModal}
                zIndex={10000}
                footer={null}

                centered={false}
                closable={true}
                style={{ marginTop: '20px' }}
                width={600}
                // footer={null}
                onCancel={() => { setvisiblePasswordModal(false) }}
                title={<span style={{ color: green[4] }} ><FontAwesomeIcon /> &nbsp;Reset Password ?</span>}
            >
                <Spin spinning={passwordLoader}>
                    <Row>
                        <Form
                            name="basic"
                            labelCol={{ span: 10 }}
                            wrapperCol={{ span: 24 }}
                            initialValues={{ remember: true }}
                            onFinish={passwordOnFinish}
                            autoComplete="off"
                        >
                            <FormItem
                                label="Old Password:  "
                                name="old_password"
                                rules={[{ required: true, message: 'Please Enter oldPassword' }]}
                            >
                                <Input.Password placeholder="Old Password" />
                            </FormItem>
                            <Form.Item
                                label="New Password"
                                name="password"
                                rules={[{ required: true, message: 'Please Enter Password' }]}
                            >
                                <Input.Password placeholder="New Password" />
                            </Form.Item>

                            <Form.Item
                                label="Confirm New Password"
                                name="confirm_password"
                                dependencies={['password']}
                                rules={[
                                    { required: true, message: 'Please Confirm your Password' },
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            if (!value || getFieldValue('password') === value) {
                                                return Promise.resolve();
                                            }

                                            return Promise.reject(new Error('The two passwords that you entered do not match!'));
                                        },
                                    }),
                                ]}
                            >
                                <Input.Password placeholder="Confirm Password" />
                            </Form.Item>
                            <FormItem wrapperCol={{ offset: 10, span: 24 }}>
                                <Space>
                                    <MyButton size="large" type="primary" htmlType="submit">
                                        {curAction === "edit" ? "Update" : "Submit"}
                                    </MyButton>
                                </Space>
                            </FormItem>
                        </Form>
                    </Row>
                </Spin>
            </Modal>
        </>
    );
}
export default FranchiseProfile;