import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Col, message, Space, Divider, Switch } from 'antd';
import { Button, Card } from 'antd';
import { Form, Input, Select, InputNumber, Radio, Checkbox, Avatar, Image, Tag, Tabs } from 'antd';
import { Breadcrumb, Layout, Spin } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import PsContext from '../../../context';
import { Editor } from '@tinymce/tinymce-react';
import { ImageUpload, FormItem, MyButton, FormViewItem } from '../../../comp';
import { capitalizeFirst } from '../../../utils';
import { green, red, cyan, blue, magenta } from '@ant-design/colors';
import dayjs from 'dayjs'
const ViewEmployee = (props) => {
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

    const [applicationResources, setApplicationResources] = useState([]);
    const [selPermissions, setSelPermissions] = useState([]);
    const [permissionLoader, setPermissionLoader] = useState(false);
    const [selResource, setSelResource] = useState(null);

    useEffect(() => {
        loadApplicationResources();
        if (typeof viewIdOrObject === 'object') {
            setViewId(viewIdOrObject.id);
            setviewData(viewIdOrObject);

        } else {
            setViewId(viewIdOrObject)
            loadViewData(viewIdOrObject);
        }

    }, []);
    useEffect(() => {
        setSelResource(null);
        setSelPermissions([]);
    }, [viewData]);
    const loadApplicationResources = () => {
        var reqData =
        {
            query_type: 'query',
            query: "select * from application_resources"
        }

        context.psGlobal.apiRequest(reqData, context.adminUser(userId).mode).then((res) => {
            var resources = [];
            res.forEach(item => {
                resources.push(
                    {
                        id: item.id,
                        resource_name: item.resource_name,
                        permission_types: item.permission_types.split(",")
                    }
                )
            })
            setApplicationResources(resources);
        }).catch(err => {
            message.error(err);
            setLoader(false);
        })
    }
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
    const onResourceNameChange = ({ target: { value } }) => {
        setPermissionLoader(true);
        var curResource = applicationResources.find(item => item.resource_name === value);
        var curPermissions = [];
        if (curResource) {
            curResource.permission_types.forEach(item => {
                curPermissions.push({
                    resource_name: curResource.resource_name,
                    resource: item,
                    loader: false,
                    status: false
                })
            })
        }
        //load designation permissions and set
        var reqData =
        {
            query_type: 'query',
            query: "select * from designation_permissions where designation_id='" + viewData.designation_id + "' and resource like '" + value + ".%' and permission=1"
        }
        context.psGlobal.apiRequest(reqData, context.adminUser(userId).mode).then((res) => {

            res.forEach(item => {
                var splitPerm = item.resource.split(".");

                var changeIndex = curPermissions.findIndex(obj => obj.resource_name === splitPerm[0] && obj.resource === splitPerm[1]);
                if (changeIndex !== -1) {
                    curPermissions[changeIndex].status = true;
                }
            })
            //update employee specific permissions
            var reqDataEmployee =
            {
                query_type: 'query',
                query: "select * from employee_permissions where employee_auto_id='" + viewId + "' and resource like '" + value + ".%'"
            }

            context.psGlobal.apiRequest(reqDataEmployee, context.adminUser(userId).mode).then((resEmployee) => {
                resEmployee.forEach(item => {
                    var splitPermEmp = item.resource.split(".");

                    var changeIndex = curPermissions.findIndex(obj => obj.resource_name === splitPermEmp[0] && obj.resource === splitPermEmp[1]);
                    if (changeIndex !== -1) {
                        if (parseInt(item.permission) === 1)
                            curPermissions[changeIndex].status = true;
                        else
                            curPermissions[changeIndex].status = false;
                    }
                })

                setSelPermissions(curPermissions);
                setPermissionLoader(false);

            }).catch(err => {
                message.error(err);
            })

           

        }).catch(err => {
            message.error(err);
        })
        setSelResource(value);

    }
    const onSwitchChange = (checked, item) => {
        var curPermissions = selPermissions;
        curPermissions = curPermissions.map(obj => {
            if (obj.resource_name === item.resource_name && obj.resource === item.resource) {
                obj.status = checked;
                obj.loader = true;
                return obj;

            }
            else return obj;
        }
        )
        setSelPermissions(curPermissions);

        var reqData = [{
            query_type: 'delete',
            table: 'employee_permissions',
            where: { employee_auto_id: viewId, resource: item.resource_name + "." + item.resource },


        },
        {
            query_type: 'insert',
            table: 'employee_permissions',
            values: { employee_auto_id: viewId, employee_code: viewData.employee_code, resource: item.resource_name + "." + item.resource, permission: checked ? 1 : 0 }

        }
        ];
        context.psGlobal.apiRequest(reqData, context.adminUser(userId).mode).then((res) => {
            curPermissions = curPermissions.map(obj => {
                if (obj.resource_name === item.resource_name && obj.resource === item.resource) {
                    obj.status = checked;
                    obj.loader = false;
                    return obj;
                }
                else return obj;
            }
            )
            setSelPermissions(curPermissions)
        }).catch(err => {
            message.error(err);
        })


    }
    return (
        <>
            <Spin spinning={loader} >
                {
                    viewData && (<>
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
                                <Tag color="cyan" style={{ fontWeight: 'bold' }}>{viewData.employee_code}</Tag><br />
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
                        <Tabs>
                            <Tabs.TabPane tab="Profile" key="profile">
                                <Form
                                    colon={false}
                                    labelAlign="left"
                                    labelCol={{ span: 8 }}
                                    wrapperCol={{ span: 20 }}
                                    initialValues={{ remember: true }}
                                    autoComplete="off"
                                >
                                    <Row gutter={16} style={{ marginTop: '10px' }}>
                                        <Col className='gutter-row' xs={24} xl={12}>
                                            <FormViewItem label="Employee Code">{viewData.employee_code}</FormViewItem>
                                        </Col>
                                        <Col className='gutter-row' xs={24} xl={12}>
                                            <FormViewItem label="Name">{viewData.name}</FormViewItem>
                                        </Col>
                                        <Col className='gutter-row' xs={24} xl={12}>
                                            <FormViewItem label="Gender">{viewData.gender}</FormViewItem>
                                        </Col>
                                        <Col className='gutter-row' xs={24} xl={12}>
                                            <FormViewItem label="Designation">{viewData.designation}</FormViewItem>
                                        </Col>
                                        <Col className='gutter-row' xs={24} xl={12}>
                                            <FormViewItem label="Branch">{viewData.branch_name}</FormViewItem>
                                        </Col>
                                        <Col className='gutter-row' xs={24} xl={12}>
                                            <FormViewItem label="Mobile No">{viewData.mobile_no}</FormViewItem>
                                        </Col>
                                        <Col className='gutter-row' xs={24} xl={12}>
                                            <FormViewItem label="Whatsapp No">{viewData.whatsapp_no}</FormViewItem>
                                        </Col>
                                        <Col className='gutter-row' xs={24} xl={12}>
                                            <FormViewItem label="Alternative Mobile No">{viewData.alternative_mobile_no}</FormViewItem>
                                        </Col>
                                        <Col className='gutter-row' xs={24} xl={12}>
                                            <FormViewItem label="Email">{viewData.email}</FormViewItem>
                                        </Col>
                                        <Col className='gutter-row' xs={24} xl={12}>
                                            <FormViewItem label="Address">{viewData.address}</FormViewItem>
                                        </Col>
                                        <Col className='gutter-row' xs={24} xl={12}>
                                            <FormViewItem label="Date of Birth">{dayjs(viewData.dob).format("DD/MM/YYYY")}</FormViewItem>
                                        </Col>
                                        <Col className='gutter-row' xs={24} xl={12}>
                                            <FormViewItem label="Date of Join">{dayjs(viewData.doj).format("DD/MM/YYYY")}</FormViewItem>
                                        </Col>
                                        <Col className='gutter-row' xs={24} xl={12}>
                                            <FormViewItem label="Employee Status">{viewData.employee_status}</FormViewItem>
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
                                </Form>
                            </Tabs.TabPane>
                            <Tabs.TabPane tab="Permissions" key="permissions">
                                {
                                    viewData && (<Row style={{ marginBottom: '10px' }}>
                                        <Radio.Group
                                            value={selResource}
                                            optionType="button" buttonStyle="solid"
                                            onChange={onResourceNameChange}
                                        >
                                            {
                                                applicationResources.map(item => {
                                                    return <Radio.Button value={item.resource_name}>{item.resource_name}</Radio.Button>
                                                })
                                            }
                                        </Radio.Group>
                                    </Row>)
                                }

                                <Divider />
                                <Spin spinning={permissionLoader}>
                                    <Row style={{ marginBottom: '10px' }}>
                                        <table style={{ width: '100%' }}>
                                            {
                                                selPermissions.map(item => {
                                                    return <tr><td style={{ padding: "5px 5px 15px 5px" }}>{item.resource}</td><td style={{ padding: "5px 5px 15px 5px" }}><Switch checkedChildren="Yes" unCheckedChildren="No" checked={item.status} style={{ width: "70px" }} onChange={(checked) => onSwitchChange(checked, item)} loading={item.loader} /></td></tr>
                                                })
                                            }
                                        </table>
                                    </Row>
                                </Spin>
                            </Tabs.TabPane>
                        </Tabs>
                    </>)
                }

            </Spin>
        </>
    );

}
export default ViewEmployee;