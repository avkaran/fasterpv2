import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Col, message, Space } from 'antd';
import { Button, Card } from 'antd';
import { Form, Input, Select, InputNumber, Radio, Checkbox } from 'antd';
import { Breadcrumb, Layout, Spin, DatePicker } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import PsContext from '../../../../../../context';
import { Editor } from '@tinymce/tinymce-react';
import { ImageUpload, FormItem, MyButton } from '../../../../../../comp';
import { capitalizeFirst } from '../../../../../../utils';
import PhoneInput from 'react-phone-input-2'
import { CountryDropdown, RegionDropdown } from 'react-country-region-selector';


const AddEditDist = (props) => {
   const context = useContext(PsContext);
    const navigate = useNavigate();
    const [addeditFormBranch] = Form.useForm();
    const [loader, setLoader] = useState(false);
    const [curAction, setCurAction] = useState('add');
    const [editData, setEditData] = useState(null);
    const [heading] = useState('Branch');
    const { editIdOrObject, onListClick, onSaveFinish, userId, ...other } = props;
    const [editId, setEditId] = useState(null);
    const [country, setCountry] = useState('');
    const [districts, setDistricts] = useState([]);
    const [districtLoading, setDistrictLoading] = useState(false)
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
            addeditFormBranch.setFieldsValue({
                districts: {
                    
                    country: 'India',
                    state: 'Tamil Nadu',
                }
            });
            setCountry("India");
            LoadDistrict("India", "Tamil Nadu").then(res => setDistricts(res));
            
        }
       
    }, [editIdOrObject]);
    const loadEditData = (id) => {
        setLoader(true);
        var reqData = {
            query_type: 'query',
            query: "SELECT * from districts  where status=1 and id=" + id
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
            districts: {
              
                country: mydata.country,
               
                district_name: mydata.district_name,

                state: mydata.state,
            }
        });
        setCountry(mydata.country)
    }
    const addeditFormBranchOnFinish = (values) => {
        setLoader(true);
        var processedValues = {};
        Object.entries(values.districts).forEach(([key, value]) => {
            if (value) {
                processedValues[key] = value;
            }
        });
        if (curAction === "add") {
            var reqDataInsert = {
                query_type: 'insert',
                table: 'districts',
                values: processedValues

            };
            context.psGlobal.apiRequest(reqDataInsert, context.adminUser(userId).mode).then((res) => {

                setLoader(false);
                message.success(heading + ' Added Successfullly');
                onSaveFinish();

            }).catch(err => {
                message.error(err);
                setLoader(false);
            })
        } else if (curAction === "edit") {
            var reqDataUpdate = {
                query_type: 'update',
                table: 'districts',
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
    const onStateChange = (value) => {
        setDistrictLoading(true);
        LoadDistrict(country, value).then(res => {
            setDistricts(res);
            setDistrictLoading(false);
            addeditFormBranch.setFieldsValue({
                districts: { district_name: '' }
            })
        }).catch(err => {
            message.error(err);
            setDistrictLoading(false);
        })
    }
    const LoadDistrict = async (country, state) => {

        return new Promise((resolve, reject) => {
            var reqData = {
                query_type: 'query', //query_type=insert | update | delete | query
                query: "select district_name from districts where status=1 and country='" + country + "' and state='" + state + "'"
            };


            context.psGlobal.apiRequest(reqData, context.adminUser(userId).mode).then((res) => {
                resolve(res);
            }).catch(err => {
                reject(err);
            })
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
                        
                       
                    </Row>
                    <Row gutter={16}>
                        <Col className='gutter-row' xs={24} xl={20}>

                            <FormItem
                                label="Country"
                                name={['districts', 'country']}
                                rules={[{ required: true, message: 'Please Enter Branch Country' }]}
                            >

                                <CountryDropdown
                                    className="ant-input"
                                    value={country}
                                    onChange={(val) => setCountry(val)} />
                            </FormItem>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col className='gutter-row' xs={24} xl={20}>

                            <FormItem
                                label="State"
                                name={['districts', 'state']}
                                rules={[{ required: true, message: 'Please Enter  State' }]}
                            >

                                <RegionDropdown
                                    country={country}
                                    className="ant-input"
                                    onChange={onStateChange}
                                />
                            </FormItem>
                        </Col>
                     
                    </Row>
                    <Row gutter={16}>
                        <Col className='gutter-row' xs={24} xl={20}>

                        <FormItem
                                label="District"
                                name={['districts', 'district_name']}
                                rules={[{ required: true, message: 'Please Enter To District Name' }]}
                            >
                                <Input placeholder="District" />
                            </FormItem>
                        </Col>
                    </Row>
                    <Row gutter={16}>
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
export default AddEditDist;
