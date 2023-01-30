import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Row, Col, message, Space } from 'antd';
import { Button, Card } from 'antd';
import { Form, Input, Select, InputNumber, Radio, Checkbox, DatePicker, TimePicker } from 'antd';
import { Breadcrumb, Layout, Spin } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import PsContext from '../../../../../context';
import { Editor } from '@tinymce/tinymce-react';

import { ImageUpload, FormItem, MyButton } from '../../../../../comp';
import { capitalizeFirst } from '../../../../../utils';
import PhoneInput from 'react-phone-input-2'
import { CountryDropdown, RegionDropdown } from 'react-country-region-selector';
import dayjs from 'dayjs';

const AddPermission = (props) => {
    const { userId } = useParams();
    const context = useContext(PsContext);
    const [addFormPermission] = Form.useForm();
    const format = 'HH:mm';
    // const {onListClick ,onSaveFinish,editIdOrObject} = props;
    // const [addFormPermission] = Form.useForm();
    const { editIdOrObject, onListClick, onSaveFinish,attDate,employeeId, ...other } = props;
    const [loader, setLoader] = useState(false);
    const [curAction, setCurAction] = useState('add');
    const [editData, setEditData] = useState(null);
    const [editId, setEditId] = useState(null);
    const [heading] = useState('Attendance');
    const [totalHours, settotalHours] = useState(0);
    useEffect(() => {
        if (editIdOrObject) {
            if (typeof editIdOrObject === 'object') {
                setCurAction("edit");
                setEditId(editIdOrObject.id);
                setEditData(editIdOrObject);
                setEditValues(editIdOrObject);

            } else {
                setCurAction("edit");
                setEditId(editIdOrObject)
                loadEditData(editIdOrObject);
            }


        } else {
            setCurAction("add");
            addFormPermission.setFieldsValue()

            //addForm.setFieldsValue({ category: 'Plan', package_for: 'Customer(Online)', package_status: 'Active' })
        }


        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const loadEditData = (id) => {
        setLoader(true);
        var reqData = {
            query_type: 'query',
            query: "SELECT * from attendance_permissions where status=1 and id=" + id
        };
        context.psGlobal.apiRequest(reqData, context.adminUser(userId).mode).then((res) => {
            setEditData(res[0]);
            setEditValues(res[0]);

            setLoader(false);

        }).catch(err => {
            message.error(err);
            setLoader(false);

        })
    }
    const setEditValues = (mydata) => {
        addFormPermission.setFieldsValue({

            attendance_permissions: {
                // employee_id: mydata.employee_id,

                reason: mydata.reason,

                time: mydata.time,

                // to_time: mydata.to_time,

            }
        });

    }
    const addFormPermissionOnFinish = (values) => {
        // console.log(values)

        setLoader(true);
        var processedValues = {};
        Object.entries(values.attendance_permissions).forEach(([key, value]) => {
            if (value) {
                processedValues[key] = value;
            }
        });
        if (values.attendance_permissions && values.attendance_permissions.time) {
            processedValues['from_time'] = dayjs(values.attendance_permissions.time[0]).format("HH:mm:ss");
            processedValues['to_time'] = dayjs(values.attendance_permissions.time[1]).format("HH:mm:ss");
            delete processedValues['time'];
        }
        processedValues['employee_id'] = employeeId;
        processedValues['att_date'] = dayjs(attDate).format('YYYY-MM-DD');
        if (curAction === "add") {
            // console.log('test', processedValues)
            var reqDataInsert = {
                query_type: 'insert',
                table: 'attendance_permissions',
                values: processedValues

            };
            context.psGlobal.apiRequest(reqDataInsert, context.adminUser(userId).mode).then((res) => {
                setLoader(false);
                message.success(' Added Successfullly');
                onSaveFinish();

            }).catch(err => {
                message.error(err);
                setLoader(false);
            })
        }
        else if (curAction === "edit") {
            var reqDataUpdate = {
                query_type: 'update',
                table: 'attendance_permissions',
                where: { id: editId },
                values: processedValues

            };
            context.psGlobal.apiRequest(reqDataUpdate, context.adminUser(userId).mode).then((res) => {
                setLoader(false);
                message.success(heading + ' Saved Successfullly');
                onSaveFinish();

            }).catch(err => {
                message.error(err);
                setLoader(false);
            })
        }
    }
    return (
        <>
            <Spin spinning={loader} >
                <Form
                    //name="basic"
                    form={addFormPermission}
                    labelAlign="left"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 20 }}
                    initialValues={{ remember: true }}
                    onFinish={addFormPermissionOnFinish}
                    autoComplete="off"
                >
                    <Row gutter={16}>
                        <Col className='gutter-row' xs={24} xl={12}>

                            <FormItem
                                label="Time"
                                name={['attendance_permissions', 'time']}
                             rules={[{ required: true, message: 'Please Enter Time' }]}
                            >
                                <Space direction="vertical">
                                    <TimePicker.RangePicker format="hh:mm a" onChange={(time)=>addFormPermission.setFieldsValue({attendance_permissions:{time:time}})}/>
                                </Space>
                            </FormItem>
                            <FormItem
                                label="Reason"
                                name={['attendance_permissions', 'reason']}
                                rules={[{ required: true, message: 'Please Enter Reason' }]}
                                >
                                <Input.TextArea rows={3} />
                            </FormItem>
                            {/* <FormItem
                                label="id"
                                name={['attendance_permissions', 'employee_id']}
                                // defaultvalue='hidden'
                             // rules={[{ required: true, message: 'Please Enter Time' }]}
                             >
                             <Space direction="vertical">
                                    <Input.TextArea rows={1} />
                                </Space>
                            </FormItem> */}
                            <FormItem wrapperCol={{ offset: 10, span: 24 }}>
                                <Space>
                                    <Button size="large" type="outlined" onClick={onListClick} >
                                        Cancel
                                    </Button>
                                    <MyButton size="large" type="primary" htmlType="submit">
                                        {curAction === "" ? "Update" : "Submit"}
                                    </MyButton>
                                </Space>

                            </FormItem>
                        </Col>
                    </Row>
                </Form>
            </Spin>

        </>
    )
}

export default AddPermission;