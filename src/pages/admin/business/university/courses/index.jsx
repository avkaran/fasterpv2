import React, { useState, useEffect, useContext } from 'react';
import { useNavigate,useParams } from 'react-router-dom';
import { Row, Col, message, Space } from 'antd';
import { MyButton } from '../../../../../comp'
import { Breadcrumb, Layout, Spin, Card, Tag } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import PsContext from '../../../../../context';
import { MyTable, DeleteButton } from '../../../../../comp';
import { green, blue, red, cyan, grey } from '@ant-design/colors';

const Courses = (props) => {
    const context = useContext(PsContext);
const {userId}=useParams();
    const { Content } = Layout;
    const navigate = useNavigate();
    const [loader, setLoader] = useState(false);
    const [data, setData] = useState([]);
    useEffect(() => {
        loadData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const loadData = () => {
        setLoader(true);
        var reqData = {
            query_type: 'query', //query_type=insert | update | delete | query
            query: "select * from courses where status='1'"
        };
        context.psGlobal.apiRequest(reqData, context.adminUser(userId).mode).then((res, error) => {
            setData(res);
            setLoader(false);
        }).catch(err => {
            message.error(err);
            setLoader(false);
        })
    }
    const tableColumns = [
        {
            title: 'Course Code',
            dataIndex: 'course_code',
            key: 'course_code',
            //render: (item) => <strong>{item}</strong>,
        },
        {
            title: 'Course Name',
            dataIndex: 'course_name',
            key: 'course_name',
            //render: (text) => <a>{text}</a>,
        },
        {
            title: 'Duration',
            dataIndex: 'duration',
            key: 'duration',
            // render: (item) => <span>{item.COLUMN_KEY + "," + item.EXTRA} </span>,
        },
        {
            title: 'Course Status',
            //dataIndex: 'COLUMN_COMMENT',
            key: 'course_status',
            render: (item) => <Tag color={item.course_status === 'enroll' ? 'green' : item.course_status === 'view-only' ? 'yellow' : 'red'} style={{ fontWeight: 'bold' }}>{item.course_status}</Tag>,
        },
        {
            title: 'Actions',
            // dataIndex: 'actions',
            key: 'actions',
            render: (item) => <Space>
                <MyButton type="outlined" size="small" shape="circle" href={"#"+userId+"/admin/courses/view/" + item.id} ><i class="fa-solid fa-eye"></i></MyButton>
                <MyButton type="outlined" size="small" shape="circle" color={blue[7]} href={"#"+userId+"/admin/courses/edit/" + item.id}><i class="fa-solid fa-pencil"></i></MyButton>
                <DeleteButton type="outlined" size="small" shape="circle" color={red[7]} onFinish={() => loadData()}
                    title="Course"
                    table="courses"
                    //id must,+ give first three colums to display
                    dataItem={{ id: item.id, course_name: item.course_name, duration: item.duration, default_fee: item.default_fee }}
                    avatar={context.baseUrl + item.course_image}
                />

            </Space>,
        },
    ]
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
                        <span>Courses</span>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>List Courses</Breadcrumb.Item>
                </Breadcrumb>

                <Card title="Courses" extra={<MyButton href={"#/"+userId+"/admin/courses/add-course"} ><i className="fa-solid fa-plus pe-2" ></i>Add New Course</MyButton>}>
                    <Spin spinning={loader}>
                        <MyTable columns={tableColumns} dataSource={data} />
                    </Spin>
                </Card>

            </Content>

        </>
    );

}
export default Courses;