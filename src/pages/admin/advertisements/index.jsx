import React, { useState, useEffect, useContext,useRef } from 'react';
import { useNavigate,useParams } from 'react-router-dom';
import { Row, Col, message, Space } from 'antd';
import { MyButton } from '../../../comp'
import { Breadcrumb, Layout, Spin, Card, Tag, Modal, Button } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import PsContext from '../../../context';
import { MyTable, DeleteButton, PaginatedTable, FormItem  } from '../../../comp';
import { green, blue, red, cyan, grey } from '@ant-design/colors';
import AddEditAdvertisement from './addEditAdvertisement';
import ViewAdvertisement from './viewAdvertisement';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import dayjs from "dayjs";
import { capitalizeFirst } from '../../../utils';
import {   Form, DatePicker, Input, Select } from 'antd';
import { faTrash, faUserTimes, faClose, faImage, faFilePdf, faSearch } from '@fortawesome/free-solid-svg-icons'
import ResponsiveLayout from '../layout'
const Advertisement = (props) => {
    const context = useContext(PsContext);
    const { Content } = Layout;
    const navigate = useNavigate();
    const [searchForm] = Form.useForm();
    const { editIdOrObject, onListClick, onSaveFinish, userId, ...other } = props;
    const [location, setlocation] = useState([]);
    const [loader, setLoader] = useState(false);
    const [data, setData] = useState([]);
    const [curAction, setCurAction] = useState('list');
    const [isModal] = useState(false);
    const [viewOrEditData, setViewOrEditData] = useState(null);
    const [visibleModal, setVisibleModal] = useState(false);
    const [heading] = useState('Advertisement');
    const [refreshTable, setRefreshTable] = useState(0);
    const filterColumns = useRef([
       
      ]);
    useEffect(() => {
        LoadLocation();
     
    }, []);
   const tableColumns = [
        {
            title: 'S.No',
            dataIndex: 'row_num',
            key: 'row_num',
            //render: (item) => <strong>{item}</strong>,
        },
        {
            title: 'Customer Name',
            dataIndex: 'customer',
            key: 'customer',
            //render: (item) => <strong>{item}</strong>,
        },
        {
            title: 'Mobile No',
            dataIndex: 'mobile_no',
            key: 'mobile_no',
            //render: (text) => <a>{text}</a>,
        },
        {
            title: 'Ad Location',
            dataIndex: 'location',
            key: 'location',
            // render: (item) => <span>{item.COLUMN_KEY + "," + item.EXTRA} </span>,
        },
       
        {
            title: 'Status',
            //dataIndex: 'COLUMN_COMMENT',
            key: 'active_status',
            render: (item) => <Tag color={item.active_status=== 'Active' ? 'green' : 'red'} style={{ fontWeight: 'bold' }}>{item.active_status}</Tag>,
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
                    table="ads"
                    //id must,+ give first three colums to display
                    dataItem={{ id: item.id,customer:item.customer, mobile_no: item.mobile_no,budget:item.budget }}
                   // avatar={context.baseUrl + item.course_image}
                />
            </Space>,
        },
    ]
    const onFinishSearch = (values) => {
        var filter_clauses = [];
        if (values.customer)
        filter_clauses.push(" customer='" + values.customer + "'");
      if(values.mobile_no)
        filter_clauses.push(" mobile_no='" + values.mobile_no + "'");
  if(values.location_id)
        filter_clauses.push("location_id='" + values.location_id + "'");
        filterColumns.current = filter_clauses;
    setRefreshTable((prev) => prev + 1);
       
      };
    const LoadLocation= () => {
        var reqData = {
            query_type: 'query', //query_type=insert | update | delete | query
            query: "select id,location from ad_locations where status=1"
        };
        console.log(reqData)
        context.psGlobal.apiRequest(reqData, context.adminUser(userId).mode).then((res) => {
          setlocation(res);
         }).catch(err => {
            message.error(err);
        })
    }
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
    return (
        <>
           <ResponsiveLayout
         
         userId={userId}
         customHeader={null}
         bottomMenues={null}
         breadcrumbs={[
            {name:heading+"s",link:null},
            {name:'List Advertisement',link:null},
        ]}
        >
               
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
                        {curAction === "view" && (<ViewAdvertisement viewIdOrObject={viewOrEditData} onListClick={() => setCurAction("list")} userId={userId} />)}
                        {curAction === "add" && (<AddEditAdvertisement onListClick={() => setCurAction("list")} onSaveFinish={() => { setCurAction("list"); setRefreshTable(prev => prev + 1); setVisibleModal(false); }} userId={userId} />)}
                        {curAction === "edit" && (<AddEditAdvertisement editIdOrObject={viewOrEditData} onListClick={() => setCurAction("list")} onSaveFinish={() => { setCurAction("list"); setRefreshTable(prev => prev + 1); setVisibleModal(false); }} userId={userId} />)}

                    </Modal>)
                }

                {
                    !isModal && (curAction === "add" || curAction === "edit" || curAction === "view") && (<Card title={capitalizeFirst(curAction) + " " + heading} extra={<Button onClick={() => setCurAction("list")}><i className="fa-solid fa-list pe-2" ></i>List Advertisment</Button>}>

                        {curAction === "view" && (<ViewAdvertisement viewIdOrObject={viewOrEditData} onListClick={() => setCurAction("list")} userId={userId} />)}
                        {curAction === "add" && (<AddEditAdvertisement onListClick={() => setCurAction("list")} onSaveFinish={() => { setCurAction("list"); setRefreshTable(prev => prev + 1); }} userId={userId} />)}
                        {curAction === "edit" && (<AddEditAdvertisement  editIdOrObject={viewOrEditData} onListClick={() => setCurAction("list")} onSaveFinish={() => { setCurAction("list"); setRefreshTable(prev => prev + 1); }} userId={userId} />)}

                    </Card>)
                }
                <Card title={heading+" List"} extra={<MyButton onClick={onAddClick} ><i className="fa-solid fa-plus pe-2" ></i>Add {heading}</MyButton>} style={{display:(curAction === "list" || isModal)?'block':'none'}}>
                <Form
                       name="basic"
                       form={searchForm}
                       labelAlign="left"
                       labelCol={{ span: 10 }}
                       wrapperCol={{ span: 20 }}
                       initialValues={{ remember: true }}
                       onFinish={onFinishSearch}
                       autoComplete="off"
                    >

                        <Row gutter={16}>
                            <Col className="gutter-row" xs={24} xl={7}>

                                <FormItem
                                    label="Customer Name"
                                    name="customer"
                                // rules={[{ required: true, message: 'Please Enter Msg Date' }]}
                                >

                                   <Input placeholder='Customer Name' />
                                </FormItem>
                            </Col>

                            <Col className="gutter-row" xs={24} xl={7}>
                                <FormItem
                                    label="Mobile No"
                                    name="mobile_no"
                                //rules={[{ required: true, message: 'Please Enter Branch Status' }]}
                                >

                                    <Input placeholder='Mobile No' />
                                </FormItem>
                            </Col>
                            <Col className="gutter-row" xs={24} xl={7}>
              <FormItem label="Ad Location" 
              name={["ads", "location_id"]}>
                <Select
                  showSearch
                  placeholder="Ad Location"
                  optionFilterProp="children"
                  //onChange={designationIdOnChange}
                  filterOption={(input, option) =>
                    option.children.toLowerCase().includes(input.toLowerCase())
                  }
                >
                  {location.map((item) => {
                    return (
                      <Select.Option value={item.id}>
                        {item.location}
                      </Select.Option>
                    );
                  })}
                </Select>
              </FormItem>
            </Col>
                            <Col className="gutter-row" xs={24} xl={3}>
                                <MyButton type="primary" htmlType="submit">
                                    <FontAwesomeIcon icon={faSearch} /> Search
                                </MyButton>
                            </Col>
                        </Row>

                    </Form>
                        <PaginatedTable
                         columns={tableColumns} 
                         refresh={refreshTable}
                         countQuery={
                            "select count(*) as count from ads where status=1" +
                            context.psGlobal.getWhereClause(filterColumns.current, false)
                          }
                         listQuery= {"select a.*,l.location,@rownum:=@rownum+1 as row_num from ads a,ad_locations l CROSS JOIN (SELECT @rownum:={rowNumberVar}) c where a.status=1 and a.location_id=l.id" + 
                         context.psGlobal.getWhereClause(filterColumns.current, false) }
                         itemsPerPage={20}
                        />
                    
                </Card>
                

               
            </ResponsiveLayout>

        </>
    );
}
export default Advertisement ;