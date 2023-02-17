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
import PrintPLStatement from "../printFormats/printPLStatement";
import { useReactToPrint } from 'react-to-print';

const PLStatement = (props) => { 
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
    const [isPlPrint,setIsPlPrint]=useState(false);
    const [incomeids, setIncomeids] = useState([]);    
    const [expenseids, setExpenseids] = useState([]);
    
    useEffect(() => {
        //  loadData();
        getIncomeCategory();
        getOutcomeCategory();
       // getIncomes();
     //   getExpenses();
       // // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const componentRef = useRef();
    const handlePLPrint = useReactToPrint({
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
            query: "SELECT * FROM `acc_ledgers` where ledger_type = 'Income' AND status =1"
        };
        context.psGlobal.apiRequest(reqData, context.adminUser(userId).mode).then((res) => {   setIncomeData(res);  }) .catch(err => { })
        
        var reqData1 = {
            query_type: 'query', //query_type=insert | update | delete | query
            query: "SELECT GROUP_CONCAT(id) as ids FROM `acc_ledgers` where ledger_type = 'Income' AND status =1"
        };
        context.psGlobal.apiRequest(reqData1, context.adminUser(userId).mode).then((res) => {   setIds(res[0].ids);  }) .catch(err => { })
    }
    const getOutcomeCategory = ()=>{        
        var reqData = {
            query_type: 'query', //query_type=insert | update | delete | query
            query: "SELECT * FROM `acc_ledgers` WHERE ledger_type in ('Expense') AND status =1 ORDER BY ledger_type DESC"
        };
        context.psGlobal.apiRequest(reqData, context.adminUser(userId).mode).then((res) => {   setExpenseData(res);  }) .catch(err => { })

        var reqData1 = {
            query_type: 'query', //query_type=insert | update | delete | query
            query: "SELECT GROUP_CONCAT(id) as ids FROM `acc_ledgers` WHERE ledger_type in ('Expense') AND status =1 "
        };
        context.psGlobal.apiRequest(reqData1, context.adminUser(userId).mode).then((res) => {   setEIds(res[0].ids);  }) .catch(err => { })
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
        query: "SELECT debit_account, credit_account, SUM(amount) as amt, (SELECT SUM(amount) from acc_transactions where debit_account = "+myArray[i]+" AND status=1 " + context.psGlobal.getWhereClause(filterColumns.current, false) + ") as debit, (SELECT SUM(amount) from acc_transactions where credit_account = "+myArray[i]+" AND status=1 " + context.psGlobal.getWhereClause(filterColumns.current, false) + ") as credit,(SELECT SUM(amount) from acc_transactions where debit_account = "+myArray[i]+" AND status=1 AND  "+filterDate+") as prev_debit, (SELECT SUM(amount) from acc_transactions where credit_account = "+myArray[i]+" AND status=1 AND "+filterDate+" ) as prev_credit FROM `acc_transactions` where status=1 AND (debit_account = "+myArray[i]+" OR credit_account = "+myArray[i]+") " + context.psGlobal.getWhereClause(filterColumns.current, false)+""
        };
        
        context.psGlobal.apiRequest(reqData, context.adminUser(userId).mode).then((res) => {            
            pushincome.push(res); 
            let incomda = [].concat(pushincome, res);
            setIncomeids(incomda);
                    
        }) .catch(err => { })
        }
    }

    const getExpenses =(id)=>{ 
        const myArray1 = id.split(",");
        let pushincome1 = new Array();
        for (let i = 0; i < myArray1.length; i++) {   
        var filterDate = filterColumns.current[0].replace('date(tr_date)>=','date(tr_date)<');   
       
        var reqData = {
            query_type: 'get', //query_type=insert | update | delete | query
            query: "SELECT concat("+myArray1[i]+") as ids ,debit_account, credit_account, SUM(amount) as amt, (SELECT SUM(amount) from acc_transactions where debit_account = "+myArray1[i]+" AND status=1 " + context.psGlobal.getWhereClause(filterColumns.current, false) + ") as debit, (SELECT SUM(amount) from acc_transactions where credit_account = "+myArray1[i]+" AND status=1 " + context.psGlobal.getWhereClause(filterColumns.current, false) + ") as credit,(SELECT SUM(amount) from acc_transactions where debit_account = "+myArray1[i]+" AND status=1 AND  "+filterDate+") as prev_debit, (SELECT SUM(amount) from acc_transactions where credit_account = "+myArray1[i]+" AND status=1 AND "+filterDate+" ) as prev_credit FROM `acc_transactions` where status=1 AND (debit_account = "+myArray1[i]+" OR credit_account = "+myArray1[i]+") " + context.psGlobal.getWhereClause(filterColumns.current, false)+""
        };        
        context.psGlobal.apiRequest(reqData, context.adminUser(userId).mode).then((res) => {   
            pushincome1.push(res); 
            let expensda = [].concat(pushincome1, res);
            setExpenseids(expensda);
        }) .catch(err => { })
        }
        
    }
    const getPreviousTotal= (type)=>{
        if(type=='credit'){
            let total = 0;            
            incomeids.map((item, i)=>{ 
                if(item.credit_account){
                    total+=Math.abs(parseFloat(item.prev_credit ? item.prev_credit : 0) - parseFloat(item.prev_debit ? item.prev_debit: 0));
                }
             })          
            return (total ? parseFloat(total): 0);
        }
        
        if(type=='debit'){
            let total = 0;
            expenseids.map((item, i)=>{ 
                if(item.debit_account){
                    total+=Math.abs(parseFloat(item.prev_credit ? item.prev_credit : 0) - parseFloat(item.prev_debit ? item.prev_debit: 0));
                }
             }) 
             return (total ? Math.abs(parseFloat(total)): 0); 
        }       
    }
    
    const getCurrentTotal= (type)=>{
        if(type=='credit'){
            let total = 0;         
            incomeids.map((item, i)=>{  
                if(item.credit_account){
                    total+= parseFloat(item.debit ? item.debit : 0) - (item.credit ? item.credit : 0);
                }
            });    
            return (total ? Math.abs(parseFloat(total)): 0);
        }
        if(type=='debit'){
            let total = 0;
            expenseids.map((item, i)=>{ 
                if(item.debit_account){
                    total+= parseFloat(item.debit ? item.debit : 0) - (item.credit ? item.credit : 0);
                }

            });  
            return (total ? Math.abs(parseFloat(total)): 0);
        }       
    }

    const getTotal= (type)=>{
        if(type=='credit'){
            let total = 0;           
            incomeids.map((item, i)=>{ 
                if(item.credit_account){
                total+=parseFloat((item.prev_debit ? item.prev_debit : 0) - (item.prev_credit ? item.prev_credit : 0)) + parseFloat((item.debit ? item.debit : 0) - (item.credit ? item.credit : 0));
                }
            });    
            return (total ? Math.abs(parseFloat(total)): 0);
        }
        if(type=='debit'){
            let total = 0;
           expenseids.map((item, i)=>{ 
                if(item.debit_account){
                total+=parseFloat((item.prev_debit ? item.prev_debit : 0) - (item.prev_credit ? item.prev_credit : 0)) + parseFloat((item.debit ? item.debit : 0) - (item.credit ? item.credit : 0));
                }
            }); 
            return (total ? Math.abs(parseFloat(total)): 0);
        }       
    }
    
    const onFinishSearch = (values) => {

        //getIncomeCategory();
       // getOutcomeCategory();
        var filter_clauses = [];     
        filter_clauses.push(
          " date(tr_date)>='" + dayjs(values.tr_date[0]).format("YYYY-MM-DD") + "'"
        )
        filter_clauses.push(
          " date(tr_date)<='" + dayjs(values.tr_date[1]).format("YYYY-MM-DD") + "'"
        );             
        filterColumns.current = filter_clauses;   
       
        getExpenses(geteids);
        getIncomes(getids);
        setRefreshTable((prev) => prev + 1);      
  
    };
    let previous_total=0;
    const getpdate = (id)=>{        

        if(incomeids.length>0){
            var legdername = incomeids.find(items => items.debit_account  == id || items.credit_account == id);
            if(legdername){
                previous_total+=(legdername.prev_debit ? legdername.prev_debit : 0) - (legdername.prev_credit ? legdername.prev_credit : 0);
                return (legdername.prev_debit ? legdername.prev_debit : 0) - (legdername.prev_credit ? legdername.prev_credit : 0);
            }
        }else{
            return 0;
        }
    }
    let current_total =0;
    const getcdate = (id)=>{        
        console.log(incomeids);
        if(incomeids.length>0){
            var legdername = incomeids.find(items => items.debit_account  == id || items.credit_account == id);
            if(legdername){
                current_total+=(legdername.debit ? legdername.debit : 0) - (legdername.credit ? legdername.credit : 0);
                return (legdername.debit ? legdername.debit : 0) - (legdername.credit ? legdername.credit : 0);
            }
        }else{
            return 0;
        }
    }
    let asset_total =0;
    const gettdate = (id)=>{                
        if(incomeids.length>0){
            var legdername = incomeids.find(items => items.debit_account  == id || items.credit_account == id);
            if(legdername){
                asset_total+=(parseFloat((legdername.prev_debit ? legdername.prev_debit : 0) - (legdername.prev_credit ? legdername.prev_credit : 0)) + parseFloat((legdername.debit ? legdername.debit : 0) - (legdername.credit ? legdername.credit : 0)));
                return (parseFloat((legdername.prev_debit ? legdername.prev_debit : 0) - (legdername.prev_credit ? legdername.prev_credit : 0)) + parseFloat((legdername.debit ? legdername.debit : 0) - (legdername.credit ? legdername.credit : 0)));              
            }
        }else{
            return 0;
        }
    }
let expense_prev_total =0;
    const getepdate = (id)=>{       
        if(expenseids.length>0){
            var legdername = expenseids.find(items => items.ids  == id);
            if(legdername){
                expense_prev_total+=Math.abs((legdername.prev_debit ? legdername.prev_debit : 0) - (legdername.prev_credit ? legdername.prev_credit : 0));
                return Math.abs((legdername.prev_debit ? legdername.prev_debit : 0) - (legdername.prev_credit ? legdername.prev_credit : 0));
            }else{
                var legdername1 = expenseids.find(items => items.credit_account === null);
                if(legdername1){
                    return Math.abs(legdername1.prev_credit);
                }
                /* if(legdername1.prev_credit){
                    return Math.abs((legdername1.prev_debit ? legdername1.prev_debit : 0) - (legdername1.prev_credit ? legdername1.prev_credit : 0));
                } */
                
            }
        }else{
            return 0;
        }
    }
    let expense_current_total =0;
    const getecdate = (id)=>{        
        //console.log(incomeids);
        if(expenseids.length>0){
            var legdername = expenseids.find(items => items.ids  == id );
            if(legdername){
                expense_current_total+=Math.abs((legdername.debit ? legdername.debit : 0) - (legdername.credit ? legdername.credit : 0));
                return Math.abs((legdername.debit ? legdername.debit : 0) - (legdername.credit ? legdername.credit : 0));
            }
        }else{
            return 0;
        }
    }
    let expense_total =0;
    const getetdate = (id)=>{                
        if(expenseids.length>0){
            var legdername = expenseids.find(items => items.ids == id );
            if(legdername){
                expense_total+=Math.abs(parseFloat((legdername.prev_debit ? legdername.prev_debit : 0) - (legdername.prev_credit ? legdername.prev_credit : 0)) + parseFloat((legdername.debit ? legdername.debit : 0) - (legdername.credit ? legdername.credit : 0)));
                return Math.abs(parseFloat((legdername.prev_debit ? legdername.prev_debit : 0) - (legdername.prev_credit ? legdername.prev_credit : 0)) + parseFloat((legdername.debit ? legdername.debit : 0) - (legdername.credit ? legdername.credit : 0)));              
            }
        }else{
            return 0;
        }
    }
    var filterDate = filterColumns.current[0].replace('date(tr_date)>=','date(tr_date)<');  
    const onPrintClick=()=>{
        setIsPlPrint(true);              
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
                    <Breadcrumb.Item>PL Statement</Breadcrumb.Item>
                </Breadcrumb>  
                <Card title={ "Profit / Loss Statement"} style={{ display: (curAction === "list" || isModal) ? 'block' : 'none' }}>
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
                
     
                <table id="employees" style={{ width: '50%', borderCollapse: 'collapse', border: '1px solid #ccc',float:'left'  }}>
                <thead>
                <tr>
                <th>Incomes</th>
                <th>Previous</th>
                <th>Current</th>
                <th>Total</th>
                <th style={{width:'75px'}}></th>               
                </tr>
                </thead>
                <tbody>
              
                   {incomedata.map((item, i)=>{
                    return <tr>
                        <td>{item.ledger_name}</td>
                        <td>{getpdate(item.id)}</td>
                        <td>{getcdate(item.id)}</td>
                        <td>{gettdate(item.id)}</td>                      
                        </tr>
                    })}
                    {incomedata.length>0 ? 
                    <tr>
                        <td>Total</td>
                        <td>{previous_total}</td>
                        <td>{current_total}</td>
                        <td>{asset_total}</td>
                    </tr> : ''}                    
                  
                </tbody>
                </table>

                <table id="employees" style={{ width: '50%', borderCollapse: 'collapse', border: '1px solid',float:'right' }}>
                <thead>
                <tr>            
                <th>Expenses</th>
                <th>Previous</th>
                <th>Current</th>
                <th>Total</th>
                </tr>
                </thead>
                <tbody>
                    
                    {expensedata.map((item, i)=>{
                    return <tr>
                        <td>{item.ledger_name}</td>
                        <td>{getepdate(item.id)}</td>
                        <td>{getecdate(item.id)}</td>
                        <td>{getetdate(item.id)}</td>
                       </tr> 
                    })}
                    <tr>
                        <td>Trading Profit</td>                   
                        <td>{getpdate(18)-expense_prev_total}</td>
                        <td>{getcdate(18)-expense_current_total}</td>
                        <td>{gettdate(18)-expense_total}</td>                      
                    </tr>
                    {expensedata.length>0 ? 
                     <tr>
                        <td>Total</td>
                        <td>{(getpdate(18)-expense_prev_total)+expense_prev_total}</td>
                        <td>{(getcdate(18)-expense_current_total)+expense_current_total}</td>
                        <td>{(gettdate(18)-expense_total)+expense_total}</td>
                    </tr> :'' }
                  
                </tbody>
                </table>
                </Card>
            </Content>

           {isPlPrint && (<PrintPLStatement 
            listHeading={"P/L Statement"}     
            incomedata={incomedata}
            incomeids={incomeids}
            expensedata={expensedata}
            expenseids={expenseids}            
            getids={getids}
            userId={userId}
            geteids={geteids}
            onSuccess={e => { alert("aaaa");
            setIsPlPrint(false);
             }} 
        />)}        

        </>
    );
}
export default PLStatement;



