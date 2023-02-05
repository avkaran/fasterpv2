import React, { useState, useEffect, useContext, useRef } from 'react';
import { useNavigate,useParams } from 'react-router-dom';
import { Row, Col, message, Space, Table } from 'antd';

import { MyButton } from '../../../../../comp'
import { Breadcrumb, Layout, Spin, Card, Tag, Modal, Button, Form, DatePicker, Input, Select } from 'antd';


import { HomeOutlined } from '@ant-design/icons';
import PsContext from '../../../../../context';
import { MyTable, DeleteButton, PaginatedTable, FormItem } from '../../../../../comp';
import { green, blue, red, cyan, grey } from '@ant-design/colors';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faUserTimes, faClose, faImage, faFilePdf, faSearch, faCheck, faXmark } from '@fortawesome/free-solid-svg-icons'
import { capitalizeFirst } from '../../../../../utils';
import dayjs from 'dayjs'

const EmployeeAttendanceReports = (props) => {
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
    const [selecedMonth, setSelecedMonth] = useState();
    const [months, setMonth] = useState(dayjs().format('MM'));
    const [years, setYear] = useState(dayjs().format('YYYY'));
    const [searchResult, setSearchResult] = useState();
    const [searchTotal, setSearchTotal] = useState();
    const [searchTotalPermission, setSearchTotalPermission] = useState();
    const [days, setDays] = useState();
    
    let employeeAttendance= [];

    const filterColumns = useRef([" date(msg_date)>='" + dayjs().format("YYYY-MM-DD") + "'", " date(msg_date)>='" + dayjs().format("YYYY-MM-DD") + "'"]);
    useEffect(() => {
        //  loadData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
       // getAttendenceByEmployee(8,'2022/12');
        //searchForm.setFieldsValue({ msg_dates: [dayjs(), dayjs()] })
        setDays(daysInMonth(dayjs().format('MM'),dayjs().format('YYYY')));
        getAttendenceByEmployee('',(years+'/'+months));
        getAttendenceByTotal('',(years+'/'+months));
        getAttendenceByTotalPermission('',(years+'/'+months));
        getEmployeee();
    }, []);
   
    const daysInMonth = (month, year)=> {
        return new Date(year, month, 0).getDate();
    }
    let totalpresent = [];
    const monthFormat = 'YYYY/MM';
    var tableHeading = [];
   
    const totalpermission=(empid)=>{
        if(searchTotalPermission){
            const totalpermission = searchTotalPermission.find(items => items.employee_id == empid);
            if(totalpermission){
                    return <td>{(totalpermission.total_hours+" hours ")}<br></br> {(totalpermission.total_min+" minutes")}</td>;
            }else{
                    return <td></td>;
            }
        }else{
            return '';
        }
    }

    const total=(empid)=>{       
       const totalpresent = searchTotal.find(items => items.employee_id == empid);
       if(totalpresent){
            return totalpresent.total;
       }else{
            return '';
       }
    }
  const getEmployeee=()=>{
    var reqData = {
        query_type: 'query', //query_type=insert | update | delete | query
        query: "SELECT * FROM employees WHERE status =1"
    };
    context.psGlobal.apiRequest(reqData, context.adminUser(userId).mode).then((res) => {            
           setData(res);
     })         
     .catch(err => {
       // message.error(err);
    })
  }
    const getAttendenceByEmployee= (empid,month) => {
        var reqData = {
            query_type: 'query', //query_type=insert | update | delete | query
            query: "select employee_id,DAY(att_date) as day,attendance from attendance where status=1 AND DATE_FORMAT(att_date,'%Y/%m') = '"+month+"'"
        };
        context.psGlobal.apiRequest(reqData, context.adminUser(userId).mode).then((res) => {            
            if(res.length>0){
                setSearchResult(res);
            }         
         })         
         .catch(err => {
           // message.error(err);
        })
    };
    
    const getAttendenceByTotal= (empid,month) => {
        var reqData = {
            query_type: 'query', //query_type=insert | update | delete | query
            query: "select IF(attendance=1, sum(attendance), '') as total, employee_id from attendance where status=1 AND DATE_FORMAT(att_date,'%Y/%m') = '"+month+"' GROUP BY employee_id"
        };
        context.psGlobal.apiRequest(reqData, context.adminUser(userId).mode).then((res) => {
            if(res.length>0){
                setSearchTotal(res);
            }         
         })         
         .catch(err => {
           // message.error(err);
        })
    };
    const getAttendenceByTotalPermission= (empid,month) => {
        var reqData = {
            query_type: 'query', //query_type=insert | update | delete | query
            query: "SELECT HOUR(SEC_TO_TIME(TIME_TO_SEC(sum(TIMEDIFF(to_time,from_time))))) as total_hours,MINUTE(SEC_TO_TIME(TIME_TO_SEC(sum(TIMEDIFF(to_time,from_time))))) as total_min, employee_id FROM attendance_permissions where status=1 AND DATE_FORMAT(att_date,'%Y/%m') = '"+month+"' GROUP BY employee_id"
        };
        context.psGlobal.apiRequest(reqData, context.adminUser(userId).mode).then((res) => {
            if(res.length>0){               
                setSearchTotalPermission(res);
            }else{
                setSearchTotalPermission('');
            }      
         })         
         .catch(err => {
           // message.error(err);
        })
    };
   
    for (let i = 1; i <= days; i++) {  
        tableHeading.push(i);
    }
    const getAttendenceDay= (empid,day) => {  
        if(searchResult){    
                var ii =0;
                let founddd = '';               
                searchResult.map((item)=>{
                    if(item.employee_id == empid && item.day == day){                                           
                        if(item.attendance==1){                                                                      
                            founddd ="Present";
                        }else{
                            founddd = "Absent";
                        } 
                    }
                });              
                return  founddd;         
        }      
    }

    const onViewClick = (item) => {
        setViewOrEditData(item);
        setVisibleModal(true);
    }
   
    const onFinishSearch = (values) => {      
       var days = daysInMonth(dayjs(selecedMonth).format('MM'),dayjs(selecedMonth).format('YYYY'));     
        var filter_clauses = [];
        filter_clauses.push(" date(msg_date)>='" + dayjs(values.msg_dates[0]).format('YYYY-MM-DD') + "'")
        filter_clauses.push(" date(msg_date)<='" + dayjs(values.msg_dates[1]).format('YYYY-MM-DD') + "'")
        if (values.msg_type)
            filter_clauses.push(" msg_type='" + values.msg_type + "'");
        if (values.reference)
            filter_clauses.push(" (mobile_no='" + values.reference + "' OR ref_id2='" + values.reference + "')");

        filterColumns.current = filter_clauses;
        setRefreshTable(prev => prev + 1)
    }
  
    const onChange = (
        value,
        dateString,
      ) => {    
        setSelecedMonth(dateString);
        setDays(daysInMonth(dayjs(dateString).format('MM'),dayjs(dateString).format('YYYY')));        
        setMonth(dayjs(dateString).format('MM'));        
        setYear(dayjs(dateString).format('YYYY')); 
        getAttendenceByEmployee('',(dayjs(dateString).format('YYYY')+'/'+dayjs(dateString).format('MM')));      
        getAttendenceByTotal('',(dayjs(dateString).format('YYYY')+'/'+dayjs(dateString).format('MM')));      
        getAttendenceByTotalPermission('',(dayjs(dateString).format('YYYY')+'/'+dayjs(dateString).format('MM')));      
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
                        <span>Employee</span>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>Employee Reports</Breadcrumb.Item>
                </Breadcrumb>

                <Card title="Employee Reports" style={{
                               display: "block",
                               overflowX: "auto",
                               whiteSpace: "nowrap",

                                //borderRadius: "20px",
                            }}>
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
                                    name="month_day"
                                // rules={[{ required: true, message: 'Please Enter Msg Date' }]}
                                >

                                    <Space direction="vertical">
                                    <DatePicker format={monthFormat} picker="month"  onChange={onChange} />

                                    
                                    </Space>
                                </FormItem>
                            </Col>
                            
                           {/*  <Col className="gutter-row" xs={24} xl={4}>
                                <MyButton type="primary" htmlType="submit">
                                    <FontAwesomeIcon icon={faSearch} /> Search
                                </MyButton>
                            </Col> */}
                        </Row>

                    </Form>

                    <table id="employees" style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid' }}>
                <thead>
                <tr>
                <th style={{width:'100px'}}>Employee Name</th>
                <th>Total <br></br>Days</th>
                <th style={{width:'80px'}}>Total <br></br>Permission</th>
                    {tableHeading.map((item, i)=>{
                    return  <th>{i+1}</th>
                    })}
                </tr>
                </thead>
                <tbody>
                    {data.map((item, i)=>{
                    return <tr>
                        <td>{item.name}</td>
                        <td>{total(item.id)}</td>
                        {totalpermission(item.id)}
                        {tableHeading.map((items, j)=>{
                            return <td> {getAttendenceDay(item.id,(j+1))==='Present' && <FontAwesomeIcon icon={faCheck} style={{color:'green',fontSize:'medium'}}/>}
                                        {getAttendenceDay(item.id,(j+1))==='Absent' && <FontAwesomeIcon icon={faXmark} style={{color:'red',fontSize:'medium'}}/>}</td>
                        })}
                    </tr>
                     })}
                </tbody>
                </table> 
                    
                </Card>

                   

            </Content>            

        </>
    );
}
export default EmployeeAttendanceReports;