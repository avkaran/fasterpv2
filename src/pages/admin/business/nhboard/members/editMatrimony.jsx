import React, { useState, useEffect, useContext } from 'react';
import { Button, Checkbox, Form, Input, Space, Spin, Select, DatePicker, Row, Col, message, Upload } from 'antd';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import PsContext from '../../../../../context';
import { CardFixedTop, momentDate } from '../../../../../utils';
import { listCollections } from '../../../../../models/core'
import toast from 'react-hot-toast';
import axios from 'axios';
import { Steps } from 'antd';
import { heightList } from '../../../../../models/core'
import { HomeOutlined, LoadingOutlined, PlusOutlined } from '@ant-design/icons';
const EditMatrymony = (props) => {
    const context = useContext(PsContext);
    const { Option } = Select;
    const { Step } = Steps;
    const { TextArea } = Input;
    const navigate = useNavigate();
    const [addForm] = Form.useForm();
    const [loader, setLoader] = useState(true);
    const [memberId] = useState(props.match.params.memberId)
    const [collectionData, setCollectionData] = useState([]);
    const [viewData, setViewData] = useState([])
    const [selDate] = useState(new Date())
    const [isActivate, setIsActivate] = useState(false)
    const [membershipPlans, setMembershipPlans] = useState([])
    const [imgLoading, setImgLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState();
    useEffect(() => {
        loadViewData(memberId)
        /*  addForm.setFieldsValue({
             paid_date: moment().format('YYYY-MM-DD')
         }) */

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const loadViewData = ($id) => {

        setViewData([]);
        setLoader(true);

        axios.post('v1/admin/view-member/' + $id).then(res => {
            if (res['data'].status === '1') {
                setViewData(res['data'].data);
            }
            else {
                toast.error(res['data'].message || 'Error');
            }
            setLoader(false);
        });

    };
    const onFinish = (values) => {
        setLoader(true);
        var form = new FormData();
        Object.entries(values).forEach(([key, value], index) => {
            // 👇️ name Tom 0, country Chile 1
            console.log(key, value, index);
            if (key === 'paid_date')
                form.append('paid_date', selDate)
            else if (key === 'activate')
                if (isActivate) form.append('member_status', 'active')
                else form.append('member_status', 'waiting')
            else
                form.append(key, value)
        });
        axios.post('v1/admin/update-payment/' + memberId, form).then(res => {
            if (res['data'].status === '1') {
                toast.success(res['data'].message || 'Success');
                navigate('/' + props.match.params.userId + '/admin/members')
            }
            else {
                toast.error(res['data'].message || 'Error');
            }
            setLoader(false);
        });

    };

    const getWeightList = () => {
        var list = [];
        for (var i = 35; i <= 70; i++) {
            list.push(<Option value={i}>{i}</Option>)
        }
        return list;
    }
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
    const UploadFile = (file) => {
        console.log(file)
        context.psGlobal.getBase64(file, (data64) => {
            var form = new FormData();
            form.append('file_data', data64)
            form.append('file_name', file.name)
            var fileName = 'public/uploads/' + new Date().valueOf() + '.jpg';
            form.append('store_file_name', fileName)
            axios.post('v1/admin/upload-image', form).then(res => {
                if (res['data'].status === '1') {
                    setImgLoading(false);
                    setImageUrl(context.psGlobal.baseUrl + fileName);
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
    return (
        <>
            <CardFixedTop title="Make Payment" >
                <ul className="list-inline mb-0">
                    <li className='list-inline-item' >
                        <Button variant="white" className='border-start ms-2' onClick={() => navigate.goBack()}>
                            <i className='fa fa-arrow-left  pe-3'></i> Back
                        </Button>
                    </li>
                </ul>
            </CardFixedTop>
            <Row style={{ background: '#fff', padding: '5px 30px 5px 30px' }}>


                <Steps size="small" current={1} >
                    <Step title="Add Member" />
                    <Step title="Matrimony Info" />
                    <Step title="Payment" />
                    <Step title="Done" />
                </Steps>
            </Row>
            <div className="fnew-device-page-wrapper" style={{ backgroundColor: '#FFFFFF', padding: '10px 20px 15px 20px' }}>
                <Spin spinning={loader} >
                    <Form
                        name="basic"
                        labelAlign="left"
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 20 }}
                        initialValues={{ remember: true }}
                        onFinish={onFinish}
                        // onFinishFailed={onFinishFailed}
                        autoComplete="off"
                        form={addForm}
                    >
                        <Row> {/* tow column row start */}
                            <Col span={12} style={{ padding: '0px 20px 0px 20px' }}>
                                <Form.Item
                                    label="Name"




                                >
                                    {viewData.name}
                                </Form.Item>
                                <Form.Item
                                    label="Height"
                                    name="height"
                                    rules={[{ required: true, message: 'Select Height' }]}
                                >
                                    <Select placeholder="Height">
                                        {heightList.map((item) => <Option value={item.cm}>{item.label}</Option>)}
                                    </Select>
                                </Form.Item>
                                <Form.Item
                                    label="Weight"
                                    name="weight"
                                    rules={[{ required: true, message: 'Select Weight' }]}
                                >
                                    <Select placeholder="Weight">
                                        {getWeightList()}
                                    </Select>
                                </Form.Item>
                                <Form.Item
                                    label="Horoscope"
                                    name='horoscope'


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
                                <Form.Item wrapperCol={{ offset: 13, span: 24 }}>
                                    <Button size="large" type="primary" htmlType="submit">
                                        Submit
                                    </Button>
                                </Form.Item>
                            </Col>
                            <Col span={12} style={{ padding: '0px 20px 0px 20px' }}>

                            </Col>
                        </Row> {/* tow column row end */}



                    </Form>



                </Spin>


            </div>

        </>
    );
};

export default EditMatrymony;