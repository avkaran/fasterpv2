import React, { useState, useEffect, useContext, useRef } from 'react';
import { useNavigate,useParams } from 'react-router-dom';
import { Row, Col, message, Space } from 'antd';
import { MyButton } from '../../../comp'
import { Breadcrumb, Layout, Spin, Card, Tag, Modal, Button, Form, DatePicker, Input, Select } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import PsContext from '../../../context';
import { MyTable, DeleteButton, PaginatedTable, FormItem } from '../../../comp';
import { green, blue, red, cyan, grey } from '@ant-design/colors';
import ViewWhatsapp from './viewWhatsapp';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faUserTimes, faClose, faImage, faFilePdf, faSearch } from '@fortawesome/free-solid-svg-icons'
import { capitalizeFirst } from '../../../utils';
import moment from 'moment'
const WhatsappReports = (props) => {
    const context = useContext(PsContext);
const {userId}=useParams();
    const { Content } = Layout;
    const navigate = useNavigate();
    const [searchForm] = Form.useForm();
    const [loader, setLoader] = useState(false);
    const [data, setData] = useState([]);
    const [curAction, setCurAction] = useState('list');
    const [isModal] = useState(false);
    const [viewOrEditData, setViewOrEditData] = useState(null);
    const [visibleModal, setVisibleModal] = useState(false);
    const [refreshTable, setRefreshTable] = useState(0);
    const filterColumns = useRef([" date(msg_date)>='" + moment().format("YYYY-MM-DD") + "'", " date(msg_date)>='" + moment().format("YYYY-MM-DD") + "'"]);
    useEffect(() => {
        //  loadData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
        searchForm.setFieldsValue({ msg_dates: [moment(), moment()] })
    }, []);

    const tableColumns = [
        {
            title: 'S.No',
            dataIndex: 'row_number',
            key: 'row_number',
            //render: (item) => <strong>{item}</strong>,
        },
        {
            title: 'Mobile No',
            dataIndex: 'mobile_no',
            key: 'mobile_no',
            //render: (item) => <strong>{item}</strong>,
        },
        {
            title: 'Date',
            // dataIndex: 'msg_date',
            key: 'msg_date',
            render: (item) => <>{moment(item.msg_date).format('DD/MM/YYYY h:mm a')}</>,
        },
        {
            title: 'Type',
            // dataIndex: 'msg_type',
            key: 'msg_type',
            render: (item) => <>{item.msg_type}</>,
        },
        {
            title: 'Ref',
            dataIndex: 'ref_id2',
            key: 'ref_id2',
           // render: (item) => <>{item.msg_type}</>,
        },
        {
            title: 'Message',
            // dataIndex: 'msg_type',
            key: 'msg',
            render: (item) => <>{item.msg ? item.msg.substring(0, 100) : ''} {item.images ? <span style={{ color: green[7], fontSize: '20px' }}><FontAwesomeIcon icon={faImage} /></span> : ''}{item.pdf ? <span style={{ color: red[7], fontSize: '20px' }}><FontAwesomeIcon icon={faFilePdf} /></span> : ''}</>,
        },
        {
            title: 'Status',
            //dataIndex: 'COLUMN_COMMENT',
            key: 'msg_status',
            render: (item) => <Tag color={item.msg_status === 'Delivered' ? 'green' : 'red'} style={{ fontWeight: 'bold' }}>{item.msg_status}</Tag>,
        },
        {
            title: 'Actions',
            // dataIndex: 'actions',
            key: 'actions',
            render: (item) => <Space>
                <MyButton type="outlined" size="small" shape="circle"
                    onClick={() => onViewClick(item)} ><i class="fa-solid fa-eye"></i></MyButton>
            </Space>,
        },
    ]
    const onViewClick = (item) => {
        setViewOrEditData(item);
        setVisibleModal(true);
    }
    const onFinishSearch = (values) => {
       
        var filter_clauses = [];
        filter_clauses.push(" date(msg_date)>='" + moment(values.msg_dates[0]).format('YYYY-MM-DD') + "'")
        filter_clauses.push(" date(msg_date)<='" + moment(values.msg_dates[1]).format('YYYY-MM-DD') + "'")
        if (values.msg_type)
            filter_clauses.push(" msg_type='" + values.msg_type + "'");
        if (values.reference)
            filter_clauses.push(" (mobile_no='" + values.reference + "' OR ref_id2='" + values.reference + "')");

        filterColumns.current = filter_clauses;
        setRefreshTable(prev => prev + 1)
    }
    const onChangeDate = (dates) => {
        searchForm.setFieldsValue({ msg_dates: dates })

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
                        <span>Whatsapp</span>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>Whatsapp Report</Breadcrumb.Item>
                </Breadcrumb>

                <Card title="Whatsapp Report">
                    <Form
                        name="basic"
                        form={searchForm}
                        labelAlign="left"
                        labelCol={{ span: 6 }}
                        wrapperCol={{ span: 18 }}
                        initialValues={{ remember: true }}
                        onFinish={onFinishSearch}
                        autoComplete="off"
                    >

                        <Row gutter={16}>
                            <Col className="gutter-row" xs={24} xl={8}>

                                <FormItem
                                    label="Date"
                                    name="msg_dates"
                                // rules={[{ required: true, message: 'Please Enter Msg Date' }]}
                                >

                                    <Space direction="vertical">
                                        <DatePicker.RangePicker onChange={onChangeDate}
                                            defaultValue={[moment(), moment()]}
                                            format='DD/MM/YYYY'
                                            allowClear={false}
                                        />
                                    </Space>
                                </FormItem>
                            </Col>

                            <Col className="gutter-row" xs={24} xl={6}>
                                <FormItem
                                    label="Msg Type"
                                    name="msg_type"
                                //rules={[{ required: true, message: 'Please Enter Branch Name' }]}
                                >
                                    <Select
                                        showSearch
                                        placeholder="Msg Type"

                                        optionFilterProp="children"
                                        //onChange={branchStatusOnChange}
                                        filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                                    >
                                        <Select.Option value="compaign">compaign</Select.Option>
                                        <Select.Option value="daily-profile">daily-profile</Select.Option>
                                    </Select>
                                </FormItem>
                            </Col>
                            <Col className="gutter-row" xs={24} xl={6}>
                                <FormItem
                                    label="Reference"
                                    name="reference"
                                //rules={[{ required: true, message: 'Please Enter Branch Status' }]}
                                >

                                    <Input placeholder='Member Id/Mobile No' />
                                </FormItem>
                            </Col>
                            <Col className="gutter-row" xs={24} xl={4}>
                                <MyButton type="primary" htmlType="submit">
                                    <FontAwesomeIcon icon={faSearch} /> Search
                                </MyButton>
                            </Col>
                        </Row>

                    </Form>
                    <PaginatedTable
                        columns={tableColumns}
                        refresh={refreshTable}
                        countQuery={"select count(*) as count from whatsapp_reports " + context.psGlobal.getWhereClause(filterColumns.current, true)}
                        listQuery={"select *,@rownum:=@rownum+1 as row_number from whatsapp_reports CROSS JOIN (SELECT @rownum:={rowNumberVar}) c " + context.psGlobal.getWhereClause(filterColumns.current, true)}
                        itemsPerPage={20}
                    />

                </Card>



            </Content>
            <Modal
                visible={visibleModal}
                zIndex={999}
                footer={null}
                closeIcon={<MyButton type="outlined" shape="circle" ><FontAwesomeIcon icon={faClose} /></MyButton>}
                centered={false}
                closable={true}
                width={600}
                onCancel={() => { setVisibleModal(false) }}
                title="View Whatsapp Message"
            >
                <ViewWhatsapp viewIdOrObject={viewOrEditData} onListClick={() => setVisibleModal(false)} userId={userId} />


            </Modal>

        </>
    );
}
export default WhatsappReports;