import axios from 'axios';
import React, { useState, useEffect, useContext } from 'react';
import PsContext from '../../../../../context'
//import { useNavigate } from 'react-router-dom';
import { Row, Col, message } from 'antd';
import { List, Card, Button, Space, Modal, Menu, Form, Radio, DatePicker, Tag, Input } from 'antd';
import { Breadcrumb, Layout } from 'antd';
import { apiRequest } from '../../../../../models/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { capitalizeFirst, upperCase } from '../../../../../utils';
import { faPlus, faClose, faUserTimes, faEdit, faSearch } from '@fortawesome/free-solid-svg-icons'
import { HomeOutlined, UserOutlined } from '@ant-design/icons';
import { green, blue, red, cyan, grey } from '@ant-design/colors';
import { MyButton, FormItem, DeleteButton, PaginatedTable } from '../../../../../comp'
import { useParams } from 'react-router-dom';
import AddPermission from './addPermission';
import ViewBusinessName from './viewattendance';
import dayjs from 'dayjs';
const EmployeeAttendance = (props) => {
    const context = useContext(PsContext);
    const { userId } = useParams();
    //const navigate = useNavigate();
    const { Content } = Layout;
    const [heading] = useState('Permission');
    const [selPermission, setSelPermission] = useState('')
    const [curAction, setCurAction] = useState('list');
    const [visibleModal, setVisibleModal] = useState(false);
    const [attendanceForm] = Form.useForm();
    const [collectionData, setCollectionData] = useState([])
    const [selEmployee, setSelEmployee] = useState(null)
    const [menuItems, setMenuItems] = useState([]);
    const [viewOrEditData, setViewOrEditData] = useState(null);
    const [menuItemsView, setMenuItemsView] = useState([]);
    const [employeeData, setEmployeeData] = useState([]);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [addEditLoading, setAddEditLoading] = useState(false);
    const [refreshTable, setRefreshTable] = useState(0);
    const [loadingAttendanceData, setLoadingAttendanceData] = useState(false);
    const [attendanceData, setAttendanceData] = useState(null)
    const [selDate, setSelDate] = useState(dayjs());
    const tableColumns = [
        {
            title: 'Time',
            // dataIndex: 'from_time',
            key: 'from_time',
            render: (item) => <strong>{dayjs(dayjs().format("YYYY-MM-DD") + " " + item.from_time).format("hh:mm a")} to {dayjs(dayjs().format("YYYY-MM-DD") + " " + item.to_time).format("hh:mm a")}</strong>,
        },
        {
            title: 'Reason',
            dataIndex: 'reason',
            key: 'reason',
            //render: (item) => <strong>{item}</strong>,
        },
        {
            title: 'Total Hours',
            // dataIndex: 'to_time',
            key: 'from)time',
            render: (item) => <>{getTotalHours(dayjs(dayjs().format("YYYY-MM-DD") + " " + item.from_time), dayjs(dayjs().format("YYYY-MM-DD") + " " + item.to_time))}</>

        },
        {
            title: 'Actions',
            // dataIndex: 'actions',
            key: 'actions',
            render: (item) => <Space>

                <DeleteButton type="outlined" size="small" shape="circle" color={red[7]} onFinish={() => { setCurAction("list"); setRefreshTable(prev => prev + 1) }}
                    title={heading}
                    table="attendance_permissions"
                    //id must,+ give first three colums to display
                    dataItem={{ id: item.id, reason: item.reason, from_time: item.from_time, to_time: item.to_time }}
                // avatar={context.baseUrl + item.course_image}
                />
            </Space>,
        }
    ]
    const getTotalHours = (from_time, to_time) => {
        //  var duration = dayjs.duration(to_time.diff(from_time));
        let hours = to_time.diff(from_time, 'hours');
        let minutes = to_time.diff(from_time, 'minutes');
        console.log(from_time, to_time, hours);
        return <>{parseInt(minutes / 60)} Hours {minutes % 60} Minutes</>;
    }

    useEffect(() => {


        var reqData = {
            query_type: 'query',
            query: "select * from employees where status=1 AND employee_code<>'admin'",
        };
        apiRequest(reqData, context.adminUser(userId).mode).then((res) => {

            let lMenu = [];
            res.forEach((item) => {
                lMenu.push({ label: item.name, key: item.id })
            })
            // setSelPermission(res[0].id);  //?
            setMenuItems(lMenu);
            setMenuItemsView(lMenu);
            setEmployeeData(res);
        }).catch(err => {

        })

    }, []);



    const onAddClick = () => {
        setCurAction("add");


        setVisibleModal(true);

    }

    const handleSearch = (e) => {
        // console.log('test',e.target.value,menuItems)

        let m = menuItems.filter(item => (upperCase(item.label).indexOf(upperCase(e.target.value)) > -1)
        );

        setMenuItemsView(m);

    };
    const onEmployeeNameClick = (e) => {
        if (e.key)
            var curEmp = employeeData.find(item => item.id == e.key);
        setSelEmployee(curEmp);
        //load attendance for current date or selected date
        var reqData = {
            query_type: 'query',
            query: "select * from attendance where status=1 AND employee_id='" + e.key + "' and att_date='" + dayjs(selDate).format("YYYY-MM-DD") + "'",
        };
        apiRequest(reqData, context.adminUser(userId).mode).then((res) => {
            if (res.length > 0)
                setAttendanceData(res[0])
        }).catch(err => {
            message.error(err)
        })

    }
    const onViewClick = () => {
        setViewOrEditData();
        setCurAction("view");


        setVisibleModal(true);
    }
    const onEditClick = () => {
        setViewOrEditData();
        setCurAction("edit");



        setVisibleModal(true);


    }
    const onDateChange = (date) => {
        setSelDate(dayjs(date));
    }
    const attendanceFormOnFinish=(values)=>{
        console.log(values)
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
                        <UserOutlined />
                        <span>Attendance</span>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>Attendance</Breadcrumb.Item>
                </Breadcrumb>

                <Modal
                    visible={visibleModal}
                    zIndex={999}
                    footer={null}
                    closeIcon={<MyButton type="outlined" shape="circle" ><FontAwesomeIcon icon={faClose} /></MyButton>}
                    centered={false}
                    closable={true}
                    width={600}
                    onCancel={() => { setVisibleModal(false) }}
                    title={capitalizeFirst(curAction) + " " + heading}
                >

                    <AddPermission onListClick={() => setCurAction("list")} onSaveFinish={() => { setCurAction("list"); setRefreshTable(prev => prev + 1); setVisibleModal(false); }} userId={userId} />
                </Modal>

                <Row gutter={16}>
                    <Col className="gutter-row" span={6}>

                        <Input addonAfter={<FontAwesomeIcon icon={faSearch} />} onChange={handleSearch} />

                        <Card
                            bodyStyle={{
                                padding: "8px", fontWeight: 'bold', fontSize: '18px', color: cyan[7],
                                border: '1px solid',
                                borderBottom: '0',
                                borderColor: cyan[2]
                            }}
                            style={{
                                margin: "0px",
                                border: '1px solid #d9d9d9',
                                borderRadius: '2px',

                                //borderRadius: "20px",
                            }}
                        >
                            Employees</Card>
                        <Menu
                            mode="inline"
                            theme="light"
                            onClick={onEmployeeNameClick}
                            defaultSelectedKeys={[selPermission]}
                            style={{
                                width: '100%',
                                border: '1px solid',
                                borderColor: cyan[2],
                                borderTop: '0',


                            }}

                            items={menuItemsView}
                        />
                    </Col>
                    {
                        selEmployee && (<Col className="gutter-row" span={18}>
                            <Card>
                                <Row gutter={16} >
                                    <Col className="gutter-row" xs={24} xl={8}>

                                        <FormItem
                                            label="Employee"

                                        ><span style={{ fontWeight: 'bold', color: cyan[7] }}>{selEmployee.name} ({selEmployee.employee_code})</span></FormItem>
                                    </Col>
                                    <Col className="gutter-row" xs={24} xl={8}>


                                        <FormItem
                                            label="Selected Date"
                                            format="DD/MM/YYYY"
                                        >

                                            <DatePicker
                                                value={selDate}
                                                format="DD/MM/YYYY"
                                                onChange={onDateChange}
                                                allowClear={false}
                                            />
                                        </FormItem>
                                    </Col>
                                    <Col className="gutter-row" xs={24} xl={8}>
                                        <Button type="primary" style={{ width: '50%' }} onClick={() => onViewClick()}>View</Button>

                                    </Col>
                                </Row>
                                <Form
                                    //name="basic"
                                    form={attendanceForm}
                                    labelAlign="left"
                                    labelCol={{ span: 8 }}
                                    wrapperCol={{ span: 20 }}
                                    initialValues={{ remember: true }}
                                     onFinish={attendanceFormOnFinish}
                                    autoComplete="off"
                                >
                                    <Row gutter={16}
                                    >
                                        <Col className="gutter-row" xs={24} xl={8}>
                                            <FormItem
                                                label="Attendance"
                                                name="attendance"
                                                rules={[{ required: true, message: 'Select Present/Absent' }]}
                                            >
                                                <Radio.Group name="radiogroup" defaultValue={null}>
                                                    <Radio value={1} style={{ marginTop: '4px' }}>Present</Radio>
                                                    <Radio value={2} style={{ marginTop: '4px' }}>Absent</Radio>
                                                </Radio.Group>
                                            </FormItem>
                                        </Col>

                                        <Col className="gutter-row" xs={24} xl={8}>
                                            <FormItem
                                                label="Remark"
                                                name="notes"
                                            >
                                                <Input.TextArea />
                                            </FormItem>

                                        </Col>
                                        <Col className="gutter-row" xs={24} xl={8}>
                                            <FormItem //wrapperCol={{ offset: 10, span: 24 }}
                                            >
                                                <Button htmlType="submit" style={{ backgroundColor: '#006d75', color: '#fff', width: '50%', height: '100%' }} >Update</Button>
                                            </FormItem>
                                        </Col>
                                    </Row>
                                </Form>

                            </Card>

                            <Row>
                                <Card title={heading} extra={<MyButton onClick={onAddClick} ><i className="fa-solid fa-plus pe-2" ></i>Add {heading}</MyButton>} >

                                    <PaginatedTable
                                        columns={tableColumns}
                                        refresh={refreshTable}
                                        countQuery={
                                            "select count(*) as count from attendance_permissions where status=1 and employee_id='" + selEmployee.id + "'"
                                        }
                                        listQuery={
                                            "select *,@col_num :=@col_num +1 as col_num from attendance_permissions CROSS JOIN (SELECT @rownum:={rowNumberVar}) c where status=1 and employee_id='" + selEmployee.id + "'"
                                        }
                                        itemsPerPage={10}
                                    />

                                </Card>
                            </Row>
                        </Col>)
                    }

                </Row>

            </Content>


        </>
    );

}
export default EmployeeAttendance;