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
import PrintBalanceSheet from "../printFormats/printBalanceSheet";
import { useReactToPrint } from 'react-to-print';

const BalanceStatement = (props) => {
    const context = useContext(PsContext);
    const { userId } = useParams();
    const { Content } = Layout;
    const navigate = useNavigate();
    const [loader, setLoader] = useState(false);
    const [data, setData] = useState([]);
    const [incomedata, setIncomeData] = useState([]);
    const [expensedata, setExpenseData] = useState([]);
    const [liabilities, setLiabilities] = useState([]);
    const [curAction, setCurAction] = useState('list');
    const [isModal] = useState(true);
    const [searchForm] = Form.useForm();
    const [heading] = useState('Finance');
    const [refreshTable, setRefreshTable] = useState(0);
    const [getids, setIds] = useState(0);
    const [geteids, setEIds] = useState(0);
    const [liablit, setLiabIds] = useState(0);
    const [isBalancePrint,setIsBalancePrint]=useState(false);
    const [incomeids, setIncomeids] = useState([]);    
    const [expenseids, setExpenseids] = useState([]);
    const [liabilitiesids, setLiabilitiesIds] = useState([]);
    
    useEffect(() => {
        //  loadData();
        getIncomeCategory();
        getOutcomeCategory();
       // getIncomes();
     //   getExpenses();
       // // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const componentRef = useRef();
    const handleBalancePrint = useReactToPrint({
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
            query: "SELECT * FROM `acc_ledgers` where ledger_type in ('Current Assets','Fixed Assets') AND status =1"
        };
        context.psGlobal.apiRequest(reqData, context.adminUser(userId).mode).then((res) => {   setIncomeData(res);  }) .catch(err => { })
        
        var reqData1 = {
            query_type: 'query', //query_type=insert | update | delete | query
            query: "SELECT GROUP_CONCAT(id) as ids FROM `acc_ledgers` where ledger_type in ('Current Assets','Fixed Assets') AND status =1"
        };
        context.psGlobal.apiRequest(reqData1, context.adminUser(userId).mode).then((res) => {   setIds(res[0].ids);  }) .catch(err => { })
    }
    const getOutcomeCategory = ()=>{        
        var reqData = {
            query_type: 'query', //query_type=insert | update | delete | query
            query: "SELECT * FROM `acc_ledgers` WHERE ledger_type in ('Current Liabilities','Equity') AND status =1 ORDER BY ledger_type DESC"
        };
        context.psGlobal.apiRequest(reqData, context.adminUser(userId).mode).then((res) => {   setLiabilities(res);  }) .catch(err => { })

        var reqData1 = {
            query_type: 'query', //query_type=insert | update | delete | query
            query: "SELECT GROUP_CONCAT(id) as ids FROM `acc_ledgers` WHERE ledger_type in ('Expense','Income') AND status =1 "
        };
        context.psGlobal.apiRequest(reqData1, context.adminUser(userId).mode).then((res) => {   setEIds(res[0].ids);  }) .catch(err => { })

        var reqData2 = {
            query_type: 'query', //query_type=insert | update | delete | query
            query: "SELECT GROUP_CONCAT(id) as ids FROM `acc_ledgers` WHERE ledger_type in ('Current Liabilities','Equity') AND status =1 "
        };
        context.psGlobal.apiRequest(reqData2, context.adminUser(userId).mode).then((res) => {   setLiabIds(res[0].ids);  }) .catch(err => { })
    }
    function getIncomes (id){          
        const myArray = id.split(",");
        let pushincome = new Array();
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
        //console.log(incomeids);
    }

    const getExpenses =(id)=>{ 
       // const myArray1 = id.split(",");
        let pushincome1 = new Array();
        /* for (let i = 0; i < myArray1.length; i++) {    */
        var filterDate = filterColumns.current[0].replace('date(tr_date)>=','date(tr_date)<');   
       
        var reqData = {
            query_type: 'query', //query_type=insert | update | delete | query
            query: "SELECT debit_account, credit_account, SUM(amount) as amt, (SELECT SUM(amount) from acc_transactions where debit_account in ("+id+") AND status=1 " + context.psGlobal.getWhereClause(filterColumns.current, false) + ") as debit, (SELECT SUM(amount) from acc_transactions where credit_account in ("+id+") AND status=1 " + context.psGlobal.getWhereClause(filterColumns.current, false) + ") as credit,(SELECT SUM(amount) from acc_transactions where debit_account in ("+id+") AND status=1 AND  "+filterDate+") as prev_debit, (SELECT SUM(amount) from acc_transactions where credit_account in ("+id+") AND status=1 AND "+filterDate+" ) as prev_credit FROM `acc_transactions` where status=1 AND (debit_account in ("+id+") OR credit_account in ("+id+")) " + context.psGlobal.getWhereClause(filterColumns.current, false)+""
        };      
      
        context.psGlobal.apiRequest(reqData, context.adminUser(userId).mode).then((res) => {  
            pushincome1.push(res); 
            let expensda = [].concat(pushincome1, res);
            setExpenseids(expensda);
        }) .catch(err => { })
       /*  } */
        
    }
    const getLiabilities =(id)=>{ 
        const myArray1 = id.split(",");      
        let pushincome2 = new Array();
        for (let i = 0; i < myArray1.length; i++) { 
        var filterDate = filterColumns.current[0].replace('date(tr_date)>=','date(tr_date)<');   
       
        var reqData = {
            query_type: 'get', //query_type=insert | update | delete | query
            query: "SELECT concat("+myArray1[i]+") as ids ,debit_account, credit_account, SUM(amount) as amt, (SELECT SUM(amount) from acc_transactions where debit_account = "+myArray1[i]+" AND status=1 " + context.psGlobal.getWhereClause(filterColumns.current, false) + ") as debit, coalesce((SELECT SUM(amount) from acc_transactions where credit_account in ("+myArray1[i]+") AND status=1 " + context.psGlobal.getWhereClause(filterColumns.current, false) + "),0) as credit,(SELECT SUM(amount) from acc_transactions where debit_account  = "+myArray1[i]+" AND status=1 AND  "+filterDate+") as prev_debit, (SELECT SUM(amount) from acc_transactions where credit_account  = "+myArray1[i]+" AND status=1 AND "+filterDate+" ) as prev_credit FROM `acc_transactions` where status=1 AND (debit_account  = "+myArray1[i]+" OR credit_account = "+myArray1[i]+") " + context.psGlobal.getWhereClause(filterColumns.current, false)+""

        };
        context.psGlobal.apiRequest(reqData, context.adminUser(userId).mode).then((res) => {  
            pushincome2.push(res); 
            let liabilit = [].concat(pushincome2, res);
            setLiabilitiesIds(liabilit);
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
       
        getExpenses(geteids);
        getIncomes(getids);
        getLiabilities(liablit);
      
        setRefreshTable((prev) => prev + 1);      
  
    };
    let previous_total =0;
    const getpdate = (id)=>{ 
        if(incomeids.length>0){
            var legdername = incomeids.find(items => items.ids == id );
            if(legdername){
                previous_total+=Math.abs((legdername.prev_debit ? legdername.prev_debit : 0) - (legdername.prev_credit ? legdername.prev_credit : 0));
                return ((legdername.prev_credit ? legdername.prev_credit : 0) - (legdername.prev_debit ? legdername.prev_debit : 0));
            }
        }else{
            return 0;
        }
    }
    let current_total = 0;
    const getcdate = (id)=>{ 
        if(incomeids.length>0){
            var legdername = incomeids.find(items => items.ids == id);
            if(legdername){
                current_total+= Math.abs((legdername.debit ? legdername.debit : 0) - (legdername.credit ? legdername.credit : 0));
                return  ((legdername.credit ? legdername.credit : 0) - (legdername.debit ? legdername.debit : 0));
            }
        }else{
            return 0;
        }
    }
    let asset_total = 0;
    const gettdate = (id)=>{                
        if(incomeids.length>0){
            var legdername = incomeids.find(items => items.ids == id);
            if(legdername){
                asset_total+=  Math.abs((parseFloat((legdername.prev_debit ? legdername.prev_debit : 0) - (legdername.prev_credit ? legdername.prev_credit : 0)) + parseFloat((legdername.debit ? legdername.debit : 0) - (legdername.credit ? legdername.credit : 0))));  

                return Math.abs((parseFloat((legdername.prev_debit ? legdername.prev_debit : 0) - (legdername.prev_credit ? legdername.prev_credit : 0)) + parseFloat((legdername.debit ? legdername.debit : 0) - (legdername.credit ? legdername.credit : 0))));              
            }
        }else{
            return 0;
        }
    }

    const getepdate = (id)=>{
        if(expenseids.length>0){
            var legdername = expenseids.find(items => items.debit_account  == id || items.credit_account == id);
            if(legdername){
                return Math.abs((legdername.prev_debit ? legdername.prev_debit : 0) - (legdername.prev_credit ? legdername.prev_credit : 0));
            }
        }else{
            return 0;
        }
    }
    const getecdate = (id)=>{        
        //console.log(incomeids);
        if(expenseids.length>0){
            var legdername = expenseids.find(items => items.debit_account  == id || items.credit_account == id);
            if(legdername){
                return Math.abs((legdername.debit ? legdername.debit : 0) - (legdername.credit ? legdername.credit : 0));
            }
        }else{
            return 0;
        }
    }
    const getetdate = (id)=>{                
        if(expenseids.length>0){
            var legdername = expenseids.find(items => items.debit_account == id || items.credit_account == id);
            if(legdername){
                return Math.abs(parseFloat((legdername.prev_debit ? legdername.prev_debit : 0) - (legdername.prev_credit ? legdername.prev_credit : 0)) + parseFloat((legdername.debit ? legdername.debit : 0) - (legdername.credit ? legdername.credit : 0)));              
            }
        }else{
            return 0;
        }
    }
    let expense_prev_total=0;
    const getlpdate = (id)=>{
        if(liabilitiesids.length>0){
            var legdername = liabilitiesids.find(items => items.ids  == id );
            if(legdername){
                expense_prev_total+=Math.abs((legdername.prev_debit ? legdername.prev_debit : 0) - (legdername.prev_credit ? legdername.prev_credit : 0));
                return Math.abs((legdername.prev_debit ? legdername.prev_debit : 0) - (legdername.prev_credit ? legdername.prev_credit : 0));
            }
        }else{
            return 0;
        }
    }
    let expense_current_total=0;
    const getlcdate = (id)=>{        
       
        if(liabilitiesids.length>0){
            var legdername = liabilitiesids.find(items => items.ids  == id);
            if(legdername){
                expense_current_total+=Math.abs((legdername.debit ? legdername.debit : 0) - (legdername.credit ? legdername.credit : 0));
                return Math.abs((legdername.debit ? legdername.debit : 0) - (legdername.credit ? legdername.credit : 0));
            }
        }else{
            return 0;
        }
    }
    let expense_total=0;
    const getltdate = (id)=>{                
        if(liabilitiesids.length>0){
            var legdername = liabilitiesids.find(items => items.ids == id);
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
        setIsBalancePrint(true);              
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
                    <Breadcrumb.Item>Balance Sheet</Breadcrumb.Item>
                </Breadcrumb>  
                <Card title={ "Balance Sheet"} style={{ display: (curAction === "list" || isModal) ? 'block' : 'none' }}>
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
                <th>Assets</th>
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
                <th>Liabilities </th>
                <th>Previous</th>
                <th>Current</th>
                <th>Total</th>
                </tr>
                </thead>
                <tbody>
                    
                    {liabilities.map((item, i)=>{
                    return <tr>
                        <td>{item.ledger_name}</td>
                        <td>{getlpdate(item.id)}</td>
                        <td>{getlcdate(item.id)}</td>
                        <td>{getltdate(item.id)}</td>
                       </tr> 
                    })}
                    <tr>
                        <td>Trading Profit</td>                   
                        <td>{getepdate(18)}</td>
                        <td>{getecdate(18)}</td>
                        <td>{getetdate(18)}</td>                      
                    </tr>
                    {liabilities.length>0 ? 
                     <tr>
                        <td>Total</td>
                        <td>{expense_prev_total+getepdate(18)}</td>
                        <td>{expense_current_total+getecdate(18)}</td>
                        <td>{expense_total+getetdate(18)}</td>
                    </tr> :'' } 
                  
                </tbody>
                </table>
                </Card>
            </Content>

            {isBalancePrint && (<PrintBalanceSheet 
            listHeading={"Balance Sheet"}     
            incomedata={incomedata}
            incomeids={incomeids}
            expenseids={expenseids}
            liabilities={liabilities}
            liabilitiesids={liabilitiesids}
            userId={userId}
            geteids={geteids}
            liablit={liablit}     
            onSuccess={e => {
                setIsBalancePrint(false);
             }} 
        />)}        
        </>
    );
}
export default BalanceStatement;



