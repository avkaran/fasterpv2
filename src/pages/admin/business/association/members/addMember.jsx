import axios from 'axios';
import React, { useState, useEffect ,useContext} from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Col, message } from 'antd';
import { Button, Card, Checkbox, Upload, Space, DatePicker } from 'antd';
import { Form, Input, Select, InputNumber } from 'antd';
import { Breadcrumb, Layout, Spin } from 'antd';
import { baseUrl } from '../../../../../utils';
import { HomeOutlined, LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { CountryDropdown, RegionDropdown } from 'react-country-region-selector';
import { listCollections } from '../../../../../models/core'
import moment from 'moment';
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import bcrypt from 'bcryptjs'
import { Steps } from 'antd';
import PsContext from '../../../../../context';

const AddMember = (props) => {
    const context = useContext(PsContext);
    const { Step } = Steps;
    const { Content } = Layout;
    const navigate = useNavigate();
    const [addForm] = Form.useForm();
    const { Option } = Select;
    const { TextArea } = Input;
    const [loader, setLoader] = useState(false);
    const [imgLoading, setImgLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState();

    const [collectionData, setCollectionData] = useState([]);
    const [country, setCountry] = useState('');
    useEffect(() => {
        listCollections().then(res => {
            if (res) {
                setCollectionData(res)
                /* addForm.setFieldsValue({
                    dob: { dob: moment(moment().subtract(18, "years"), 'DD/MM/YYYY') }
                }) */
            }

        })

    }, []);
    const getBase64 = (img, callback) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    };
    const beforeUpload = (file) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';

        if (!isJpgOrPng) {
            message.error('You can only upload JPG/PNG file!');
        }

        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isLt2M) {
            message.error('Image must smaller than 2MB!');
        }

        return isJpgOrPng && isLt2M;
    };
    const handleFileChange = (info) => {
        if (info.file.status === 'uploading') {
            setImgLoading(true);
            return;
        }
    };
    const UploadFile = (file) => {
        console.log(file)
        getBase64(file, (data64) => {
            var form = new FormData();
            form.append('file_data', data64)
            form.append('file_name', file.name)
            var fileName = 'public/uploads/' + new Date().valueOf() + '.jpg';
            form.append('store_file_name', fileName)
            axios.post('v1/admin/upload-image', form).then(res => {
                if (res['data'].status === '1') {
                    setImgLoading(false);
                    setImageUrl(baseUrl + fileName);
                    addForm.setFieldsValue({
                        photo: fileName
                    })
                }
                else {
                    message.error(res['data'].message || 'Error');
                }

            });

        });


    }
    const onChangeDob = (date) => {

        addForm.setFieldsValue({
            dob: moment(date).format('YYYY-MM-DD')
        })
    };
    const onFinish = (values) => {

        setLoader(true);
        var processedValues = {};
        Object.entries(values).forEach(([key, value]) => {
            if (value) processedValues[key] = value;
        });
        //var salt = bcrypt.genSaltSync(10);
        processedValues['password'] = context.psGlobal.encrypt(processedValues['password'], 8);


        var form = new FormData();
        var reqData = { //if array of queries pass [] outside
            query_type: 'insert',
            // query: "select * from members where id='" + id + "'",
            table: 'members',
            // where:{id:'1'},
            values: processedValues

        };
        form.append('queries', context.psGlobal.encrypt(JSON.stringify(reqData)))
        axios.post('v1/admin/db-query', form).then(res => {
            if (res['data'].status === '1') {

                //if inserted created member id using id  // store log
                var createdId = res['data'].data;
                var form1 = new FormData();
                var reqData1 = { //if array of queries pass [] outside
                    query_type: 'update',
                    // query: "select * from members where id='" + id + "'",
                    table: 'members',
                    where: { id: createdId },
                    values: { member_id: 'MT' + createdId.padStart(5, '0') }

                };
                form1.append('queries', encodeURI(context.psGlobal.encrypt(JSON.stringify(reqData1))))
                axios.post('v1/admin/db-query', form1).then(res => {
                    if (res['data'].status === '1') {

                        setLoader(false);
                        message.success(res['data'].message || 'Success');
                        navigate('/'+props.match.params.userId+'/admin/members/make-payment/' + createdId)
                    }
                });

            }
            else {
                message.error(res['data'].message || 'Error');
                setLoader(false);
            }

        });
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };
    const uploadButton = (
        <div>
            {imgLoading ? <LoadingOutlined /> : <PlusOutlined />}
            <div
                style={{
                    marginTop: 8,
                }}
            >
                Upload
            </div>
        </div>
    );
    const collectionOptions = (collectionName) => {

        if (collectionData && collectionData.length > 0) {
            let m = collectionData.find(item => item.name === collectionName)
            if (m) {
                let cData = m.collections.split(",")

                return cData.map(item => <Option value={item}>{item}</Option>)
            } else return <Option value=''>Not in Database</Option>

        }
    };
    const disabledDate = (current) => {
        // Can not select days before today and today
        return current && current > moment().subtract(18, "years");
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
                        <span>Manage Members</span>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>Add Member</Breadcrumb.Item>
                </Breadcrumb>
                <Row style={{ background: '#fff', padding: '5px 30px 5px 30px' }}>


                    <Steps size="small" current={0} >
                        <Step title="Add Member" />
                        <Step title="Payment" />
                        <Step title="Done" />
                    </Steps>
                </Row>
                <Card title="Add Member" extra={<Button href="#admin/members" ><i className="fa-solid fa-list pe-2" ></i>List Members</Button>}>

                    <Spin spinning={loader} >
                        <Form
                            name="basic"
                            form={addForm}
                            labelAlign="left"
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 20 }}
                            initialValues={{ remember: true }}
                            onFinish={onFinish}
                            onFinishFailed={onFinishFailed}
                            autoComplete="off"
                        >

                            <Row gutter={16}> {/* tow column row start */}
                                <Col className='gutter-row' xs={24} xl={12}>
                                    <Form.Item
                                        label="Name"
                                        name='name'


                                        rules={[{ required: true, message: 'Name is required' }]}
                                    >
                                        <Input placeholder="Name" />
                                    </Form.Item>
                                    <Form.Item
                                        label="Marital Status"
                                        name="marital_status"
                                        rules={[{ required: true, message: 'Select Marital Status' }]}
                                    >
                                        <Select placeholder="Select Marital Status">
                                            {collectionOptions('marital-status')}
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col className='gutter-row' xs={24} xl={12}>
                                    <Form.Item
                                        label="Photo"
                                        name='photo'


                                    // rules={[{ required: true, message: 'Feature Image is required' }]}
                                    >
                                        <Upload
                                            name="avatar"
                                            listType="picture-card"
                                            className="avatar-uploader"
                                            showUploadList={false}
                                            
                                            action={(file) => {
                                                UploadFile(file)

                                            }}
                                            beforeUpload={beforeUpload}
                                            onChange={handleFileChange}
                                        >
                                            {imageUrl ? (
                                                <img
                                                    src={imageUrl}
                                                    alt="avatar"
                                                    style={{
                                                        width: '100%',
                                                    }}
                                                />
                                            ) : (
                                                uploadButton
                                            )}
                                        </Upload>
                                    </Form.Item>
                                </Col>
                            </Row> {/* tow column row end */}
                            <Row gutter={16}> {/* tow column row start */}
                                <Col className='gutter-row' xs={24} xl={7}>
                                    <Form.Item
                                        label="Birth Date"
                                        name="dob"
                                        // labelCol={{ span: 8 }}
                                        wrapperCol={{ offset: 6, span: 12 }}
                                        // value={selDate}
                                        rules={[{
                                            // type: 'object',
                                            required: true,
                                            message: 'Please input Birth date',
                                            whitespace: true,
                                        }]}
                                    >
                                        <Space direction="vertical">

                                            <DatePicker onChange={onChangeDob} format='DD/MM/YYYY'
                                                defaultValue={moment(moment().subtract(18, "years"), 'DD/MM/YYYY')}
                                                disabledDate={disabledDate}
                                                allowClear={false}
                                            //dateRender={(currentDate,today)=>{}}
                                            />

                                        </Space>
                                    </Form.Item>

                                </Col>
                                <Col className='gutter-row' xs={24} xl={5}>
                                    <Form.Item
                                        label="Gender"
                                        name="gender"
                                        //labelCol={{ span: 8 }}
                                        // wrapperCol={{ offset: 6, span: 6 }}
                                        rules={[{ required: true, message: 'Birth Date required' }]}
                                    >
                                        <Select placeholder="Select Gender" >
                                            {collectionOptions('gender')}
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col className='gutter-row' xs={24} xl={12}>
                                    <Form.Item
                                        label="Qualification"
                                        name="qualification"
                                        rules={[{ required: true, message: 'Qualification required' }]}
                                    >
                                        <Select placeholder="Select Qualification">
                                            {collectionOptions('qualification')}
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row> {/* tow column row end */}
                            <Row gutter={16}> {/* tow column row start */}

                                <Col className='gutter-row' xs={24} xl={12}>

                                    <Form.Item
                                        label="Specification"
                                        name="specification"
                                        rules={[{ required: true, message: 'Specification required' }]}
                                    >
                                        <Select placeholder="Select Specification">
                                            {collectionOptions('specification')}
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col className='gutter-row' xs={24} xl={12}>
                                    <Form.Item
                                        label="Higher Studies if any"
                                        name="higher_study"
                                    //rules={[{ required: true }]}
                                    >
                                        <Select placeholder="Select Higher Studies">
                                            {collectionOptions('higher-studies')}
                                        </Select>
                                    </Form.Item>

                                </Col>
                            </Row> {/* tow column row end */}
                            <Row gutter={16}> {/* tow column row start */}
                                <Col className='gutter-row' xs={24} xl={12}>
                                    <Form.Item
                                        label="Manai"
                                        name="manai"
                                        rules={[{ required: true, message: 'Please Select manai' }]}
                                    >
                                        <Select placeholder="Select Manai">
                                            {collectionOptions('manai')}
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col className='gutter-row' xs={24} xl={12}>
                                    <Form.Item
                                        label="Service"
                                        name="service"
                                        rules={[{ required: true, message: 'Please Select Service' }]}
                                    >
                                        <Select placeholder="Select Service">
                                            {collectionOptions('service')}
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row> {/* tow column row end */}
                            <Row gutter={16}> {/* tow column row start */}
                                <Col className='gutter-row' xs={24} xl={12}>
                                    <Form.Item
                                        className={'two-rows-label'}
                                        label="Medical Reg. No."
                                        name="medical_registration_no"
                                        rules={[{ required: true, message: 'Enter Medical Registration No' }]}
                                    >
                                        <InputNumber style={{ width: '100%' }} />
                                    </Form.Item>
                                </Col>
                                <Col className='gutter-row' xs={24} xl={12}>
                                    <Form.Item
                                        label="Prefered Zone"
                                        name="prefered_zone"
                                        rules={[{ required: true, message: 'Please select zone' }]}
                                    >
                                        <Select placeholder="Select Zone">
                                            {collectionOptions('zones')}
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row> {/* tow column row end */}
                            <Row gutter={16}> {/* tow column row start */}
                                <Col className='gutter-row' xs={24} xl={12}>
                                    <Form.Item
                                        label="Working Details"
                                        name="work_details"

                                    >
                                        <TextArea rows={3} />
                                    </Form.Item>
                                </Col>
                                <Col className='gutter-row' xs={24} xl={12}>
                                    <Form.Item
                                        label="Write About yourself"
                                        name="about_member"

                                    >
                                        <TextArea rows={3} />
                                    </Form.Item>

                                </Col>
                            </Row> {/* tow column row end */}
                            <Row gutter={16}> {/* tow column row start */}
                                <Col className='gutter-row' xs={24} xl={12}>


                                    <Form.Item
                                        label="Country"
                                        name="country"
                                        rules={[{ required: true, message: 'Please Select Country' }]}
                                    >
                                        <CountryDropdown
                                            className="ant-input"
                                            value={country}
                                            onChange={(val) => setCountry(val)} />
                                    </Form.Item>
                                </Col>
                                <Col className='gutter-row' xs={24} xl={12}>
                                    <Form.Item
                                        label="State"
                                        name="state"

                                        rules={[{ required: true, message: 'Please select region/state' }]}
                                    >
                                        <RegionDropdown
                                            country={country}
                                            className="ant-input"
                                        //value={region}
                                        //onChange={(val) => this.selectRegion(val)} 
                                        />
                                    </Form.Item>
                                </Col>
                            </Row> {/* tow column row end */}
                            <Row gutter={16}> {/* tow column row start */}
                                <Col className='gutter-row' xs={24} xl={12}>
                                    <Form.Item
                                        label="City"
                                        name="city"
                                        rules={[{ required: true, message: 'Enter City' }]}

                                    >
                                        <Input />
                                    </Form.Item>
                                </Col>
                                <Col className='gutter-row' xs={24} xl={12}>
                                    <Form.Item
                                        label="Mobile No"
                                        name="mobile_no"
                                        rules={[{ required: true, message: 'Please input mobile no' }]}

                                    >
                                        <PhoneInput
                                            country={'in'}
                                        //value={this.state.phone}
                                        // onChange={phone => this.setState({ phone })}
                                        />
                                    </Form.Item>
                                </Col>
                            </Row> {/* tow column row end */}
                            <Row gutter={16} style={{ backgroundColor: 'cyan-1' }}> {/* tow column row start */}
                                <Col className='gutter-row' xs={24} xl={12}>
                                    <Form.Item
                                        label="Email"
                                        name="email"
                                        rules={[{
                                            type: 'email',
                                            message: 'The input is not valid E-mail!',
                                        }]}

                                    >
                                        <Input />
                                    </Form.Item>
                                </Col>
                                <Col className='gutter-row' xs={24} xl={12}>
                                    <Form.Item
                                        label="Password"
                                        name="password"
                                        rules={[{ required: true, message: 'Please input password' }]}

                                    >
                                        <Input.Password placeholder="input password" />
                                    </Form.Item>
                                </Col>
                            </Row> {/* tow column row end */}
                            <Row gutter={16}> {/* tow column row start */}
                                <Col className='gutter-row' xs={24} xl={12}>
                                    <Form.Item
                                        label="Whatsapp No"
                                        name="whatsapp_no"
                                        rules={[{ required: true, message: 'Please input whatsapp No' }]}

                                    >
                                        <PhoneInput
                                            country={'in'}
                                        // value={this.state.phone}
                                        // onChange={phone => this.setState({ phone })}
                                        />

                                    </Form.Item>
                                    <Form.Item
                                        //label="Auto Approve Articles"
                                        name="is_auto_approve_articles"
                                    >

                                        <Checkbox onChange={(e) => {
                                            if (e.target.checked) {
                                                addForm.setFieldsValue({
                                                    is_auto_approve_articles: 1
                                                })
                                            } else {
                                                addForm.setFieldsValue({
                                                    is_auto_approve_articles: 0
                                                })
                                            }
                                        }}> Auto Approve Articles</Checkbox>

                                    </Form.Item>

                                </Col>
                                <Col className='gutter-row' xs={24} xl={12}>
                                    <Form.Item
                                        label="Address"
                                        name="address"
                                        rules={[{ required: true, message: 'Enter Address' }]}
                                    >
                                        <TextArea rows={4} />
                                    </Form.Item>
                                </Col>
                            </Row> {/* tow column row end */}
                            <Row gutter={16} style={{ backgroundColor: 'cyan-1' }}> {/* tow column row start */}
                                <Col className='gutter-row' xs={24} xl={12}>
                                    <Form.Item
                                        //label="Auto Approve Articles"
                                        name="is_matrimony_member"
                                    >

                                        <Checkbox onChange={(e) => {
                                            if (e.target.checked) {
                                                addForm.setFieldsValue({
                                                    is_matrimony_member: 1
                                                })
                                            } else {
                                                addForm.setFieldsValue({
                                                    is_matrimony_member: 0
                                                })
                                            }
                                        }}> Is Matrimony Member</Checkbox>

                                    </Form.Item>
                                </Col>
                                <Col className='gutter-row' xs={24} xl={12}>
                                    <Form.Item
                                        label="Aadhaar No."
                                        name="aadhaar_no"
                                        rules={
                                            [
                                                { required: true, message: 'Please input aadhaar no.' },
                                              //  { min: 12, message: 'Invalid Aadhar Number' },
                                               
                                            ]
                                        }

                                    >
                                        <InputNumber placeholder="Aadhaar Number" style={{width:'100%'}} />
                                    </Form.Item>
                                </Col>
                            </Row> {/* tow column row end */}


                            <Form.Item wrapperCol={{ offset: 12, span: 24 }}>
                                <Button size="large" type="primary" htmlType="submit" style={{}}>
                                    Submit
                                </Button>
                            </Form.Item>

                        </Form>
                    </Spin>
                </Card>

            </Content>

        </>
    );

}
export default AddMember;