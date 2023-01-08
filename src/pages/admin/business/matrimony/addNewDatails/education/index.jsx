import React, { useState, useEffect, useContext } from 'react';
import { useNavigate,useParams } from 'react-router-dom';
import { Row, Col, message, Space,Form,Select,Input} from 'antd';
import { MyButton,FormItem} from '../../../../../../comp'
import { Breadcrumb, Layout, Spin, Card, Tag, Modal, Button } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import PsContext from '../../../../../../context';
import { MyTable, DeleteButton, PaginatedTable } from '../../../../../../comp';
import { green, blue, red, cyan, grey } from '@ant-design/colors';
import AddPackage from './addEditEdu';
import AddEditEdu from './addEditEdu';
import ViewBusinessName from './viewEdu';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faUserTimes, faClose } from '@fortawesome/free-solid-svg-icons'
import { capitalizeFirst } from '../../../../../../utils';
// import AddEditEdu from './addEditEdu';

const Education = (props) => {
    const context = useContext(PsContext);
const {userId}=useParams();
    const { Content } = Layout;
    const navigate = useNavigate();
    const [loader, setLoader] = useState(false);
    const [data, setData] = useState([]);
    const [curAction, setCurAction] = useState('list');
    const [isModal] = useState(true);
    const [viewOrEditData, setViewOrEditData] = useState(null);
    const [visibleModal, setVisibleModal] = useState(false);
    const [heading] = useState('Education');
    const [refreshTable, setRefreshTable] = useState(0);
    const [refreshSubCourseTable,setRefreshSubCourseTable]=useState(0)
    const [subCourse, setSubCourse] = useState([]);
    const [planNames, setPlanNames] = useState(null);
    const [addSubCourseLoader,setAddSubCourseLoader] = useState(false);
    const [subCourseLoading, setSubCourseLoading] = useState(false);
    const [selCourse, setSelCourse] = useState({});
    const [visibleSubCourseAddModal, setVisibleSubCourseAddModal] = useState(false);
    useEffect(() => {
        loadPlanNames();
      
    }, []);
   
    const tableColumns = [
        {
            title: 'S.No',
            dataIndex: 'row_num',
            key: 'row_num',
            //render: (item) => <strong>{item}</strong>,
        },
        {
            title: 'Actions',
            // dataIndex: 'actions',
            key: 'actions',
            render: (item) => <Space>
                <MyButton type="outlined" size="small" shape="circle"
                    onClick={() => onViewClick(item)} ><i class="fa-solid fa-eye"></i></MyButton>
                <MyButton type="outlined" size="small" shape="circle" color={blue[7]}
                    onClick={() => onEditClick(item)}
                ><i class="fa-solid fa-pencil"></i></MyButton>
                <DeleteButton type="outlined" size="small" shape="circle" color={red[7]} onFinish={() =>{ setCurAction("list");setRefreshTable(prev=>prev+1)}}
                title={heading}
                    table="education_courses"
                    //id must,+ give first three colums to display
                    dataItem={{ id: item.id,course_name:item.course_name, master_course_id: item.master_course_id, course_status: item.course_status}}
                   // avatar={context.baseUrl + item.course_image}
                />

            </Space>,
        },
        {
            title: 'Course Name',
            dataIndex: 'course_name',
            key: 'course_name',
            //render: (item) => <strong>{item}</strong>,
        },
        // {
        //     title: 'Status',
        //     dataIndex: 'course_status',
        //     key: 'course_status',
        //     //render: (text) => <a>{text}</a>,
        // },
        // // {
        //     title: 'Template ',
        //     dataIndex: 'template',
        //     key: 'template',
        //     //render: (text) => <a>{text}</a>,
        // },
       
        {
            title: 'Status',
            //dataIndex: 'COLUMN_COMMENT',
            key: 'course_status',
            render: (item) => <Tag color={item.course_status === 'Active' ? 'green' : 'red'} style={{ fontWeight: 'bold' }}>{item.course_status}</Tag>,
        },
        {
            title: 'View Sub Course',
            // dataIndex: 'actions',
            key: 'actions',
            render: (item) =>
                <MyButton type="primary" size="small" shape="round" color={green[4]} borderColor="#000"
                    onClick={() => onViewSubCourseClick(item.id, item.course_name)}
                >View SubCourse</MyButton>
            ,
        },
       
    ]
    const tableColumnsSubCourse = [
        {
            title: 'S.No',
            // dataIndex: 'row_num',
            //  key: 'row_num',
            render: (item, object, index) => <strong>{index + 1}</strong>,
        },

        {
            title: 'Category',
            dataIndex: 'course_name',
            key: 'course_name',
            //render: (text) => <a>{text}</a>,
        },
        {
            title: '',
            render: (item) => <DeleteButton type="outlined" size="small" shape="circle" color={red[7]} onFinish={() =>{onViewSubCourseClick(selCourse.id,selCourse.course_name);}}
                title='Sub Course'
                table="education_courses"
                //id must,+ give first three colums to display
                dataItem={{id:item.id,Category: selCourse.course_name, course_name: item.course_name,status:item.course_status }}
            // avatar={context.baseUrl + item.course_image}
            />
        }

    ]
    const onAddClick = () => {
        setCurAction("add");

        if (isModal)
            setVisibleModal(true);
        
    }
    const onEditClick = (item) => {
        setViewOrEditData(item);
        setCurAction("edit");

        if (isModal)
            setVisibleModal(true);
        
    }
    const onViewClick = (item) => {
        setViewOrEditData(item);
        setCurAction("view");
        if (isModal)
            setVisibleModal(true);
    }
    const onViewSubCourseClick = (course_id, course_name) => {
        setSelCourse({ id: course_id, course_name: course_name })
        setSubCourseLoading(true);
        var reqData = {
            query_type: 'query', //query_type=insert | update | delete | query
            query: "select id,course_name from education_courses where status=1 and master_course_id="+ course_id
        };
        context.psGlobal.apiRequest(reqData, context.adminUser(userId).mode).then((res, error) => {
            setSubCourse(res);
            setSubCourseLoading(false);
        }).catch(err => {
            message.error(err);
            setSubCourseLoading(false);
        })
    }
    const loadPlanNames = () => {
        var reqData = {
            query_type: 'query', //query_type=insert | update | delete | query

            query: "select * from education_courses where status=1"
        };
        context.psGlobal.apiRequest(reqData, context.adminUser(userId).mode).then((res) => {
            setPlanNames(res);
        }).catch(err => {
            message.error(err);
        })
    }
    const addFormSubCourseOnFinish=(values)=>{
        setAddSubCourseLoader(true);
        var processedValues = {};
        
        processedValues['master_course_id']=selCourse.id;
        processedValues['course_name']=values.course_name;
        processedValues['course_status']=values.course_status;
        
        var reqDataInsert = {
            query_type: 'insert',
            table: 'education_courses',
            values: processedValues

        };
        context.psGlobal.apiRequest(reqDataInsert, context.adminUser(userId).mode).then((res) => {
            setAddSubCourseLoader(false);
           // setRefreshSubCourseTable(prev=>prev+1)
           onViewSubCourseClick(selCourse.id,selCourse.course_name)
            message.success('SubCourse Added Successfullly'); 
            setVisibleSubCourseAddModal(false);
        }).catch(err => {
            message.error(err);
            setAddSubCourseLoader(false);
        })
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
                        <span>{heading+"s"}</span>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>List Education</Breadcrumb.Item>
                </Breadcrumb>
                {
                    isModal && (<Modal
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
                        {curAction === "view" && (<ViewBusinessName viewIdOrObject={viewOrEditData} onListClick={() => setCurAction("list")} userId={userId} />)}
                        {curAction === "add" && (<AddEditEdu onListClick={() => setCurAction("list")} onSaveFinish={() => { setCurAction("list"); setRefreshTable(prev => prev + 1); setVisibleModal(false); }} userId={userId} />)}
                        {curAction === "edit" && (<AddEditEdu editIdOrObject={viewOrEditData} onListClick={() => setCurAction("list")} onSaveFinish={() => { setCurAction("list"); setRefreshTable(prev => prev + 1); setVisibleModal(false); }} userId={userId} />)}

                    </Modal>)
                }

                {
                    !isModal && (curAction === "add" || curAction === "edit" || curAction === "view") && (<Card title={capitalizeFirst(curAction) + " " + heading} extra={<Button onClick={() => setCurAction("list")}><i className="fa-solid fa-list pe-2" ></i>List SmsTemplate</Button>}>

                        {curAction === "view" && (<ViewBusinessName viewIdOrObject={viewOrEditData} onListClick={() => setCurAction("list")} userId={userId} />)}
                        {curAction === "add" && (<AddEditEdu onListClick={() => setCurAction("list")} onSaveFinish={() => { setCurAction("list"); setRefreshTable(prev => prev + 1); }} userId={userId} />)}
                        {curAction === "edit" && (<AddEditEdu editIdOrObject={viewOrEditData} onListClick={() => setCurAction("list")} onSaveFinish={() => { setCurAction("list"); setRefreshTable(prev => prev + 1); }} userId={userId} />)}

                    </Card>)
                }
                <Card title={heading+" List"} extra={<MyButton onClick={onAddClick} ><i className="fa-solid fa-plus pe-2" ></i>Add {heading}</MyButton>} style={{display:(curAction === "list" || isModal)?'block':'none'}}>
                <Row gutter={16}>
                        <Col className='gutter-row' xs={24} xl={16}>
                        <PaginatedTable
                         columns={tableColumns} 
                         refresh={refreshTable}
                         countQuery="select count(*) as count from education_courses where status=1 AND master_course_id is NULL"
                         listQuery="select *,@rownum:=@rownum+1 as row_num from education_courses CROSS JOIN (SELECT @rownum:={rowNumberVar}) c where status=1 AND master_course_id is NULL"
                         itemsPerPage={20}
                        />
                          </Col>
                        <Col className='gutter-row' xs={24} xl={8}>
                            <Card
                                bodyStyle={{
                                    padding: "8px", fontWeight: 'bold', fontSize: '12px', color: cyan[7],
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


                            >{selCourse.course_name} {selCourse.course_name && (<MyButton type="primary" size="small" style={{ float: 'right' }}
                                onClick={() => { setVisibleSubCourseAddModal(true) }}><i className="fa-solid fa-plus pe-2" ></i> Add SubCourse</MyButton>)}</Card>

                            <MyTable
                                columns={tableColumnsSubCourse}
                                dataSource={subCourse}
                                loading={subCourseLoading}
                            />

                        </Col>
                    </Row>
                    
                </Card>
                

               
            </Content>
            <Modal
                visible={visibleSubCourseAddModal}
                zIndex={999}
                footer={null}
                closeIcon={<MyButton type="outlined" shape="circle" ><FontAwesomeIcon icon={faClose} /></MyButton>}
                centered={false}
                closable={true}
                width={600}
                onCancel={() => { setVisibleSubCourseAddModal(false) }}
                title={"Add Sub Course"}
            >

                <Form
                    name="basic"
                    //form={addeditFormSubCaste}
                    labelAlign="left"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 20 }}
                    initialValues={{ remember: true }}
                    onFinish={addFormSubCourseOnFinish}
                    autoComplete="off"
                > <Col className='gutter-row' xs={24} xl={20}>
                    <FormItem
                        label="Category"
                        name="course_name"
                        rules={[{ required: true, message: 'Please Enter Course Name' }]}
                    >
                        <Input placeholder="Course Name" />
                    </FormItem>
            </Col>
                    <Form.Item wrapperCol={{ offset: 10, span: 24 }}>
                        <Space>
                            <Button size="large" type="outlined" onClick={() => setVisibleSubCourseAddModal(false)}>
                                Cancel
                            </Button>
                            <MyButton size="large" type="primary" htmlType="submit" loading={addSubCourseLoader}>
                                Save
                            </MyButton>
                        </Space>

                    </Form.Item>

                </Form>
            </Modal>

        </>
    );
}
export default Education;



