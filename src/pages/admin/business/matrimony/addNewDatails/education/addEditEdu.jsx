import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Col, message, Space } from 'antd';
import { Button, Card } from 'antd';
import { Form, Input, Select, InputNumber, Radio, Checkbox } from 'antd';
import { Breadcrumb, Layout, Spin } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import PsContext from '../../../../../../context';
import { Editor } from '@tinymce/tinymce-react';
import { ImageUpload, FormItem, MyButton } from '../../../../../../comp';
import { capitalizeFirst } from '../../../../../../utils';
import PhoneInput from 'react-phone-input-2'
import { CountryDropdown, RegionDropdown } from 'react-country-region-selector';
import TextArea from 'antd/lib/input/TextArea';
const AddEditEdu = (props) => {
    const context = useContext(PsContext);
    const navigate = useNavigate();
    const [addeditFormBranch] = Form.useForm();
    const [loader, setLoader] = useState(false);
    const [curAction, setCurAction] = useState('add');
    const [editData, setEditData] = useState(null);
    const [heading] = useState('Course');
    const { editIdOrObject, onListClick, onSaveFinish, userId, ...other } = props;
    const [editId, setEditId] = useState(null);
    const [country, setCountry] = useState('');
    const [districts, setDistricts] = useState([]);
    const [districtLoading, setDistrictLoading] = useState(false)
    const [planNames, setPlanNames] = useState(null);
    useEffect(() => {
        loadPlanNames();
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
            addeditFormBranch.setFieldsValue({
                education_courses : {course_status:'Active'}
            });
            //addForm.setFieldsValue({ category: 'Plan', package_for: 'Customer(Online)', package_status: 'Active' })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [editIdOrObject]);
    const loadEditData = (id) => {
        setLoader(true);
        var reqData = {
            query_type: 'query',
            query: "SELECT * from education_courses  where status=1 and id=" + id
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
        addeditFormBranch.setFieldsValue({

            education_courses: {

                course_name: mydata.course_name,

                course_status : mydata.course_status,
              
            }
        });
        
    }
    const addeditFormBranchOnFinish = (values) => {
        setLoader(true);
        var processedValues = {};
        Object.entries(values.education_courses).forEach(([key, value]) => {
            if (value) {
                processedValues[key] = value;
            }
        });
        if (curAction === "add") {
            var reqDataInsert = {
                query_type: 'insert',
                table: 'education_courses',
                values: processedValues
            };
            context.psGlobal.apiRequest(reqDataInsert, context.adminUser(userId).mode).then((res) => {

                setLoader(false);
                message.success(heading + 'Added Successfullly');
                onSaveFinish();

            }).catch(err => {
                message.error(err);
                setLoader(false);
            })
        } else if (curAction === "edit") {
            var reqDataUpdate = {
                query_type: 'update',
                table: 'education_courses',
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
    };
    const loadPlanNames = () => {
        var reqData = {
            query_type: 'query', //query_type=insert | update | delete | query

            query: "select * from education_courses where status=1 "
        };
        context.psGlobal.apiRequest(reqData, context.adminUser(userId).mode).then((res) => {
            setPlanNames(res);
        }).catch(err => {
            message.error(err);
        })
    }
    
    return (
        <>
            <Spin spinning={loader} >
                <Form
                    name="basic"
                    form={addeditFormBranch}
                    labelAlign="left"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 20 }}
                    initialValues={{ remember: true }}
                    onFinish={addeditFormBranchOnFinish}
                    autoComplete="off"
                >
                    
                    <Row gutter={16}>
                    <Col className='gutter-row' xs={24} xl={20}>

                                <FormItem
                                    label="Course Name"
                                    name={['education_courses', 'course_name']}
                                    rules={[{ required: true, message: 'Please Enter Course Name' }]}
                                >
                                    <Input placeholder="Course Name" />
                                </FormItem>

                                </Col>
                    </Row>
                   
                    <Row gutter={16}>
                        <Col className='gutter-row' xs={24} xl={20}>

                            <FormItem
                                label="Status"
                                name={['education_courses', 'course_status']}
                                rules={[{ required: true, message: 'Please Enter Unicode' }]}
                            >


                                <Radio.Group defaultValue="Active" optionType="default" >
                                    {context.psGlobal.collectionOptions(context.psGlobal.collectionData, 'active-inactive', 'radio')}
                                </Radio.Group>
                            </FormItem>
                        </Col>
                        <Col className='gutter-row' xs={24} xl={12}>
                        </Col>
                    </Row>
                    <FormItem wrapperCol={{ offset: 10, span: 24 }}>
                        <Space>
                            <Button size="large" type="outlined" onClick={onListClick}>
                                Cancel
                            </Button>
                            <MyButton size="large" type="primary" htmlType="submit">
                                {curAction === "edit" ? "Update" : "Submit"}
                            </MyButton>
                        </Space>

                    </FormItem>

                </Form>
            </Spin>
        </>
    )
}
export default AddEditEdu;
