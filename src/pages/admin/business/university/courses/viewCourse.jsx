import React, { useState, useEffect, useContext } from 'react';
import { useNavigate,useParams } from 'react-router-dom';
import { Row, Col, message } from 'antd';
import { Button, Card } from 'antd';
import { Form, Input } from 'antd';
import { Breadcrumb, Layout, Spin } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import PsContext from '../../../../../context';
import { Select, InputNumber, Image, Space, Modal } from 'antd';
import { Editor } from '@tinymce/tinymce-react';
import { MyTable, MyButton, DeleteButton } from '../../../../../comp';
import { red, yellow, cyan, grey, blue } from '@ant-design/colors';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faUserTimes, faClose } from '@fortawesome/free-solid-svg-icons'
import { CountryDropdown } from 'react-country-region-selector';

const ViewCourse = (props) => {
    const context = useContext(PsContext);
const {userId}=useParams();
    const { Content } = Layout;
    const navigate = useNavigate();
    const [loader, setLoader] = useState(false);
    const [courseId] = useState(props.match.params.courseId)
    const [viewData, setViewData] = useState({});
    const [feesData, setFeesData] = useState([]);
    const [visibleAddModal, setVisibleAddModal] = useState(false);
    const [visibleEditModal, setVisibleEditModal] = useState(false);
    const [addForm] = Form.useForm();
    const [editForm] = Form.useForm();
    const [feeLoader, setFeeLoader] = useState(false);
    const [selFee, setSelFee] = useState(null);

    useEffect(() => {
        loadData(courseId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const loadData = (id) => {
        setLoader(true);
        var reqData = [{ //if array of queries pass [] outside
            query_type: 'query',
            query: "select * from courses where id='" + id + "'",
        },
        { //if array of queries pass [] outside
            query_type: 'query',
            query: "select * from course_fees where course_id='" + id + "' and status='1'",
        }
        ];
        context.psGlobal.apiRequest(reqData, context.adminUser(userId).mode).then((res, error) => {
            let cData = res[0][0];
            let fData = res[1];
            setViewData(cData);
            setFeesData(fData);

            //use only required fields
            setLoader(false);
        }).catch(err => {
            message.error(err);
            setLoader(false);
        })
    };

    const tableColumns = [
        {
            title: 'S.No.',
            //dataIndex: 'course_code',
            key: 'sno',
            render: (item, object, index) => <strong>{index + 1}</strong>,
        },
        {
            title: 'Country',
            dataIndex: 'country',
            key: 'country',
            //render: (text) => <a>{text}</a>,
        },
        {
            title: 'Fee',
            dataIndex: 'fee',
            key: 'fee',
            // render: (item) => <span>{item.COLUMN_KEY + "," + item.EXTRA} </span>,
        },
        {
            title: 'Actions',
            // dataIndex: 'actions',
            key: 'actions',
            render: (item) => <Space>
                <MyButton type="outlined" size="small" shape="circle" color={blue[7]} onClick={() => {
                    setVisibleEditModal(true);
                    setSelFee(item);
                    editForm.setFieldsValue({
                        country: item.country,
                        fee: item.fee,
                        coupon_code: item.coupon_code,
                        discount: item.discount,
                    })
                }}><i class="fa-solid fa-pencil"></i></MyButton>
                <DeleteButton type="outlined" size="small" shape="circle" color={red[7]}
                    onFinish={() => loadData(viewData.id)}
                    title="Fee"
                    table="course_fees"
                    //id must,+ give first three colums to display
                    dataItem={{ id: item.id, course: viewData.course_name, country: item.country, fee: item.fee }}
                    avatar={null}
                />

            </Space>,
        },
    ]
    const onAddFormFinish = (values) => {
        setFeeLoader(true);
        let isAlreadyExists = feesData.find(item => item.country === values.country);
        console.log('f', feesData, 'v', values, isAlreadyExists)
        if (isAlreadyExists) {
            message.error("Fee Already exist for the country, just edit");

        }
        else {
            var processedValues = {};
            Object.entries(values).forEach(([key, value]) => {
                if (value) processedValues[key] = value;
            });
            processedValues['course_id'] = viewData.id;
            var reqData = {
                query_type: 'insert',
                table: 'course_fees',
                values: processedValues

            }
            context.psGlobal.apiRequest(reqData, context.adminUser(userId).mode).then((res) => {

                loadData(viewData.id)
                setVisibleAddModal(false);
                message.success('Added Successfully');

            }).catch(err => {
                message.error(err);

            })

        }
        setFeeLoader(false);
    }
    const onEditFormFinish = (values) => {
        setFeeLoader(true);
        let isAlreadyExists = feesData.find(item => item.country === values.country && item.id !== selFee.id);
        console.log('f', feesData, 'v', values, isAlreadyExists)
        if (isAlreadyExists) {
            message.error("Fee Already exist for the Changed Country");

        }
        else {
            var processedValues = {};
            Object.entries(values).forEach(([key, value]) => {
                if (value) processedValues[key] = value;
            });
            processedValues['course_id'] = viewData.id;
            if(!values.coupon_code)
            processedValues['coupon_code'] = '';
            
            var reqData = {
                query_type: 'update',
                table: 'course_fees',
                where: { id: selFee.id },
                values: processedValues

            }
            context.psGlobal.apiRequest(reqData, context.adminUser(userId).mode).then((res) => {

                loadData(viewData.id)
                setVisibleEditModal(false);
                message.success('Added Successfully');

            }).catch(err => {
                message.error(err);

            })

        }
        setFeeLoader(false);
    }
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
                        <span>Manage Courses</span>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>View Course</Breadcrumb.Item>
                </Breadcrumb>

                <Card title="View Course" extra={<Button href={"#/" + userId + "/admin/courses"} ><i className="fa-solid fa-list pe-2" ></i>List Courses</Button>}>

                    <Spin spinning={loader} >
                        {

                            viewData && Object.keys(viewData).length > 0 && (<>
                                <Row gutter={16}>
                                    <Col class="gutter-row" xs={24} xl={12}>
                                        <Form
                                            name="basic"
                                            form={editForm}
                                            labelAlign="left"
                                            labelCol={{ span: 8 }}
                                            wrapperCol={{ span: 20 }}
                                            initialValues={{ remember: true }}

                                            autoComplete="off"
                                        >


                                            <Form.Item
                                                label="Course Code"
                                                name="course_code"
                                            // rules={[{ required: true, message: 'Please Enter Course Code' }]}
                                            >
                                                <span style={{ color: cyan[6], fontWeight: 'bold' }}> {viewData.course_code}</span>
                                            </Form.Item>


                                            <Form.Item
                                                label="Course Name"
                                                name="course_name"
                                            // rules={[{ required: true, message: 'Please Enter Course Name' }]}
                                            >
                                                <span style={{ color: cyan[6], fontWeight: 'bold' }}>{viewData.course_name}</span>
                                            </Form.Item>




                                            <Form.Item
                                                label="Duration"
                                                name="duration"
                                            //  rules={[{ required: true, message: 'Please Enter Duration' }]}
                                            >
                                                <span style={{ color: cyan[6], fontWeight: 'bold' }}>{viewData.duration}</span>
                                            </Form.Item>


                                            <Form.Item
                                                label="Default Fee"
                                                name="default_fee"
                                            //  rules={[{ required: true, message: 'Please Enter Default Fee' }]}
                                            >
                                                <span style={{ color: cyan[6], fontWeight: 'bold' }}>{viewData.default_fee}</span>
                                            </Form.Item>


                                            <Form.Item
                                                label="Course Status"
                                                name="course_status"
                                            //  rules={[{ required: true, message: 'Please Enter Course Status' }]}
                                            >

                                                <span style={{ color: cyan[6], fontWeight: 'bold' }}>{viewData.course_status}</span>
                                            </Form.Item>


                                            <Form.Item
                                            //label="Course Status"
                                            // name="course_status"
                                            //  rules={[{ required: true, message: 'Please Enter Course Status' }]}
                                            >

                                                <Image src={context.baseUrl + viewData.course_image}
                                                    fallback={context.noImg}
                                                    size={200}
                                                />
                                            </Form.Item>

                                        </Form>
                                    </Col>
                                    <Col class="gutter-row" xs={24} xl={12}>
                                        <Card title="Fee Details" extra={<MyButton type="primary" onClick={() => setVisibleAddModal(true)}>Add</MyButton>}>
                                            <MyTable columns={tableColumns} dataSource={feesData} />
                                        </Card>
                                    </Col>

                                </Row>
                                <Row>
                                    <div dangerouslySetInnerHTML={{ __html: viewData.description }}></div>
                                </Row></>


                            )
                        }

                    </Spin>
                </Card>

            </Content>
            <Modal
                visible={visibleAddModal}
                zIndex={1000}
                footer={null}
                closeIcon={<MyButton type="outlined" shape="circle" ><FontAwesomeIcon icon={faClose} /></MyButton>}
                centered={false}
                closable={true}
                style={{ marginTop: '20px' }}
                width={600}
                // footer={null}
                onCancel={() => { setVisibleAddModal(false) }}
                title={<span style={{ color: cyan[6] }} ><FontAwesomeIcon icon={faPlus} /> &nbsp; Add Fee </span>}
            >
                <Form
                    name="basic"
                    form={addForm}
                    labelAlign="left"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 15 }}
                    initialValues={{ remember: true }}
                    onFinish={onAddFormFinish}
                    autoComplete="off"
                >

                    <Form.Item
                        label="Country"
                        name="country"
                        rules={[{ required: true, message: 'Please Enter Country' }]}
                    >

                        <CountryDropdown
                            className="ant-input"
                        // value={country}
                        //onChange={(val) => setCountry(val)}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Fee"
                        name="fee"
                        rules={[{ required: true, message: 'Please Enter Fee' }]}
                    >
                        <InputNumber placeholder="Fee" type="number" style={{ width: "100%" }} />
                    </Form.Item>
                    <Form.Item
                        label="Coupon Code"
                        name='coupon_code'
                      //  rules={[{ required: true, message: 'Please Enter coupon Code' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Discount(%)"
                        name='discount'
                       // rules={[{ required: true, message: 'Please Enter Discount' }]}
                    >
                        <InputNumber placeholder="Discount" type="number" style={{ width: "100%" }} />
                    </Form.Item>
                    <Form.Item wrapperCol={{ offset: 8, span: 15 }}>
                        <Button size="large" type="primary" htmlType="submit" loading={feeLoader}>
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
            <Modal
                visible={visibleEditModal}
                zIndex={1000}
                footer={null}
                closeIcon={<MyButton type="outlined" shape="circle" ><FontAwesomeIcon icon={faClose} /></MyButton>}
                centered={false}
                closable={true}
                style={{ marginTop: '20px' }}
                width={600}
                // footer={null}
                onCancel={() => { setVisibleEditModal(false) }}
                title={<span style={{ color: cyan[6] }} ><FontAwesomeIcon icon={faPlus} /> &nbsp; Edit Fee </span>}
            >
                <Form
                    name="basic"
                    form={editForm}
                    labelAlign="left"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 15 }}
                    initialValues={{ remember: true }}
                    onFinish={onEditFormFinish}
                    autoComplete="off"
                >

                    <Form.Item
                        label="Country"
                        name="country"
                        rules={[{ required: true, message: 'Please Enter Country' }]}
                    >

                        <CountryDropdown
                            className="ant-input"
                        // value={country}
                        //onChange={(val) => setCountry(val)}

                        />
                    </Form.Item>

                    <Form.Item
                        label="Fee"
                        name="fee"
                        rules={[{ required: true, message: 'Please Enter Fee' }]}
                    >
                        <InputNumber placeholder="Fee" type="number" style={{ width: "100%" }} />
                    </Form.Item>
                    <Form.Item
                        label="Coupon Code"
                        name='coupon_code'
                     //   rules={[{ required: true, message: 'Please Enter coupon Code' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Discount(%)"
                        name='discount'
                       // rules={[{ required: true, message: 'Please Enter Discount' }]}
                    >
                        <InputNumber placeholder="Discount" type="number" style={{ width: "100%" }} />
                    </Form.Item>
                    <Form.Item wrapperCol={{ offset: 8, span: 15 }}>
                        <Button size="large" type="primary" htmlType="submit" loading={feeLoader}>
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );

}
export default ViewCourse;