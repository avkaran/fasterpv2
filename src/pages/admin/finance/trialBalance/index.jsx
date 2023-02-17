import React, { useState, useEffect, useContext, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Row, Col, message, Space } from 'antd';
import { MyButton } from '../../../../comp'
import { Breadcrumb, Layout, Card, Form, DatePicker, Select, Modal, Button, Tag, } from "antd";
import { HomeOutlined } from '@ant-design/icons';
import PsContext from '../../../../context';
import dayjs from 'dayjs';
import { MyTable, DeleteButton, PaginatedTable, FormItem } from '../../../../comp';
import { green, blue, red, cyan, grey } from '@ant-design/colors';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faTrash, faPrint, faUserTimes, faClose } from '@fortawesome/free-solid-svg-icons'
import { capitalizeFirst } from '../../../../utils';
import PrintTrialBalance from "../printFormats/printTrialBalance";
import { useReactToPrint } from 'react-to-print';


const TrialBalance = (props) => {
    const context = useContext(PsContext);
    const { userId } = useParams();
    const { Content } = Layout;
    const navigate = useNavigate();
    const [loader, setLoader] = useState(false);
    const [data, setData] = useState([]);
    const [incomedata, setIncomeData] = useState([]);
    const [expensedata, setExpenseData] = useState([]);
    const [curAction, setCurAction] = useState('list');
    const [isModal] = useState(true);
    const [searchForm] = Form.useForm();
    const [heading] = useState('Finance');
    const [refreshTable, setRefreshTable] = useState(0);
    const [getids, setIds] = useState(0);
    const [geteids, setEIds] = useState(0);
    const [isTrialPrint,setIsTrialPrint]=useState(false);
    const [incomeids, setIncomeids] = useState([]);    
    const [expenseids, setExpenseids] = useState([]);
    
    useEffect(() => {
        getIncomeCategory();        
    }, []);

    const componentRef = useRef();
    const handleTrialPrint = useReactToPrint({
      content: () => componentRef.current,
    //  onAfterPrint:()=>setIsPrint(false),
    });

    const onChangeDate = (dates) => {
        searchForm.setFieldsValue({ tr_date: dates });
    };
    
    const filterColumns = useRef([
        " date(tr_date)>='" + dayjs().format("YYYY-MM-DD") + "'",
        " date(tr_date)<='" + dayjs().format("YYYY-MM-DD") + "'",
    
    ]);
    const getIncomeCategory = ()=>{        
        var reqData = {
            query_type: 'query', //query_type=insert | update | delete | query
            query: "SELECT * FROM `acc_ledgers` where status =1"
        };
        context.psGlobal.apiRequest(reqData, context.adminUser(userId).mode).then((res) => {   setIncomeData(res);  }) .catch(err => { })
        
        var reqData1 = {
            query_type: 'query', //query_type=insert | update | delete | query
            query: "SELECT GROUP_CONCAT(id) as ids FROM `acc_ledgers` where status =1"
        };
        context.psGlobal.apiRequest(reqData1, context.adminUser(userId).mode).then((res) => {   setIds(res[0].ids);  }) .catch(err => { })
    }
   
    function getIncomes (id){          
        const myArray = id.split(",");
        let pushincome = [];       
        var countval = 0;
        for (let i = 0; i < myArray.length; i++) {
        countval+=1; 
        var filterDate = filterColumns.current[0].replace('date(tr_date)>=','date(tr_date)<');        
        var reqData = {
        query_type: 'get', //query_type=insert | update | delete | query
        query: "SELECT concat("+myArray[i]+") as ids ,debit_account, credit_account, SUM(amount) as amt, (SELECT SUM(amount) from acc_transactions where debit_account = "+myArray[i]+" AND status=1 " + context.psGlobal.getWhereClause(filterColumns.current, false) + ") as debit, (SELECT SUM(amount) from acc_transactions where credit_account = "+myArray[i]+" AND status=1 " + context.psGlobal.getWhereClause(filterColumns.current, false) + ") as credit,(SELECT SUM(amount) from acc_transactions where debit_account = "+myArray[i]+" AND status=1 AND  "+filterDate+") as prev_debit, (SELECT SUM(amount) from acc_transactions where credit_account = "+myArray[i]+" AND status=1 AND "+filterDate+" ) as prev_credit FROM `acc_transactions` where status=1 AND (debit_account = "+myArray[i]+" OR credit_account = "+myArray[i]+") " + context.psGlobal.getWhereClause(filterColumns.current, false)+""
        };
        
        context.psGlobal.apiRequest(reqData, context.adminUser(userId).mode).then((res) => {            
            pushincome.push(res); 
            let incomda = [].concat(pushincome, res);
            setIncomeids(incomda);
                    
        }) .catch(err => { })
        }
    }
    
    const onFinishSearch = (values) => {
        var filter_clauses = [];     
        filter_clauses.push(
          " date(tr_date)>='" + dayjs(values.tr_date[0]).format("YYYY-MM-DD") + "'"
        )
        filter_clauses.push(
          " date(tr_date)<='" + dayjs(values.tr_date[1]).format("YYYY-MM-DD") + "'"
        );             
        filterColumns.current = filter_clauses;   
       
        getIncomes(getids);
        setRefreshTable((prev) => prev + 1);      
  
    };
    const getpdate = (id)=>{ 
        if(incomeids.length>0){
            var legdername = incomeids.find(items => items.ids == id);
           
            if(legdername){
                return Math.abs((legdername.prev_credit ? legdername.prev_credit : 0) - (legdername.prev_debit ? legdername.prev_debit : 0));
            }
        }else{
            return 0;
        }
    }
    const getcdate = (id)=>{  
        if(incomeids.length>0){
            var legdername = incomeids.find(items => items.ids == id);            
            if(legdername){
                return ((legdername.credit ? legdername.credit : 0) - (legdername.debit ? legdername.debit : 0));
            }
        }else{
            return 0;
        }
    }

    const gettdate = (id)=>{                
        if(incomeids.length>0){
            var legdername = incomeids.find(items => items.ids == id);
            if(legdername){
                return Math.abs((parseFloat((legdername.prev_credit ? legdername.prev_credit : 0) - (legdername.prev_debit ? legdername.prev_debit : 0)) + parseFloat((legdername.credit ? legdername.credit : 0) - (legdername.debit ? legdername.debit : 0))));              
            }
        }else{
            return 0;
        }
    }

    const onPrintClick=()=>{
        setIsTrialPrint(true);              
    }
    let vss ='';
  
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
                        <span>{heading + "s"}</span>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>Trial Balance</Breadcrumb.Item>
                </Breadcrumb>  
                <Card title={ "Trial Balance"} style={{ display: (curAction === "list" || isModal) ? 'block' : 'none' }}>
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
                    <FormItem label="Date" name="tr_date">
                        <Space direction="vertical">
                        <DatePicker.RangePicker
                            onChange={onChangeDate}
                            defaultValue={[dayjs(), dayjs()]}
                            format="DD/MM/YYYY"
                            allowClear={false}
                        />
                        </Space>
                    </FormItem>  
                </Col>              
                <Col className="gutter-row" xs={24} xl={4}>              
                    <MyButton type="primary" htmlType="submit">
                        <FontAwesomeIcon icon={faSearch} /> Search
                    </MyButton>
                
                </Col> 
                <Col className="gutter-row" xs={24} xl={6}>
                    <MyButton type="primary" onClick={onPrintClick}>
                    <FontAwesomeIcon icon={faPrint} /> Print
                    </MyButton>
                </Col>
                </Row>
            </Form>              
                
     
                <table id="employees" style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #ccc',float:'left'  }}>
                <thead>
                <tr>
                <th>Ledgers</th>
                <th>Previous</th>
                <th>Current</th>
                <th>Total</th>                
                </tr>
                </thead>
                <tbody>
            
                   {incomedata.map((item, i)=>{
                    return <tr>
                        <td>{item.ledger_name}</td>
                        <td>{getpdate(item.id)}</td>
                        <td>{(item.id==18 ? Math.abs(getcdate(item.id)) : getcdate(item.id)) }</td>
                        <td>{gettdate(item.id)}</td>                      
                        </tr>
                    })}
                   
                </tbody>
                </table>

               
                </Card>
            </Content>

        {isTrialPrint && (<PrintTrialBalance 
            listHeading={"Trial Balance"}     
            incomedata={incomedata}
            incomeids={incomeids}          
            getids={getids}
            userId={userId}
            geteids={geteids} 
            onSuccess={e => {
                setIsTrialPrint(false);
             }} 
        />)}    

        </>
    );
}
export default TrialBalance;