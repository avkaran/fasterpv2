import React, { useState, useEffect, useContext ,useRef} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Row, Col, message, Space } from 'antd';
import { MyButton } from '../../../../comp'
import dayjs from 'dayjs';
import $ from 'jquery';
import { Breadcrumb, Layout, Card, Form, DatePicker, Select, Modal, Button, Tag, } from "antd";

import { HomeOutlined } from '@ant-design/icons';
import PsContext from '../../../../context';
import { MyTable, DeleteButton, PaginatedTable ,FormItem} from '../../../../comp';

import { green, blue, red, cyan, grey } from '@ant-design/colors';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faClose, faPrint, faFileExcel } from "@fortawesome/free-solid-svg-icons";
import { capitalizeFirst } from '../../../../utils';
import {PrintLedgerTransactions} from "../printFormats/printLedgerTransaction";
import { useReactToPrint } from 'react-to-print';
import Pagination from 'react-responsive-pagination';

const LedgerTransaction = (props) => {
    const context = useContext(PsContext);
    const { userId } = useParams();
    const { Content } = Layout;
    const navigate = useNavigate();
    const [loader, setLoader] = useState(false);
    const [data, setData] = useState([]);
    const [curAction, setCurAction] = useState('list');
    const [isModal] = useState(true);
    const [viewOrEditData, setViewOrEditData] = useState(null);
    const [visibleModal, setVisibleModal] = useState(false);
    const [heading] = useState('Finance');
    const [refreshTable, setRefreshTable] = useState(0);
    const [refreshPrintData,setRefreshPrintData]=useState(0);
    const [searchForm] = Form.useForm();
    const [isPrint,setIsPrint]=useState(false);
    const [ledgers, setLedgers] = useState([]);
    const [selectLedgerid, setLedgerid] = useState(0);
    const [selectLedgerName, setLedgerName] = useState();
    const [debitAccount, setDebitAccount] = useState();
    const [creditAccount, setCreditAccount] = useState();
    const [debitamt, setDebitAmount] = useState([]);
    const [creditamt, setCreditAmount] = useState([]);
    const [debit, setDebit] = useState(0);
    const [credit, setCredit] = useState(0);
    const [totfinal, setFinal] = useState(0);
    const [filterDate, setFilterDate] = useState(0);
    const [ptotal, setPTotal] = useState(0);
    const [lastcredit, setLastCredit] = useState(0);
    const [lastdebit, setLastDebit] = useState(0);
    const [paginate, setPaginate] = useState([]);
    const [prevals, setPreval] = useState([]);

    
    const filterColumns = useRef([
      " date(tr_date)>='" + dayjs().format("YYYY-MM-DD") + "'",
      " date(tr_date)<='" + dayjs().format("YYYY-MM-DD") + "'",
  
    ]);
    const componentRef = useRef();
    const handlePrint = useReactToPrint({
      content: () => componentRef.current,
    //  onAfterPrint:()=>setIsPrint(false),
    });
    
    useEffect(() => {
        //  loadData();
        LoadLedgers();
        getTotalTransaction();
        getTransactionAmt();
        getLedgerTransaction();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getTotalTransaction =()=>{ 
      var reqData1 = {
        query_type: 'query', //query_type=insert | update | delete | query
        query: "select count(*) as total from acc_transactions trans left join acc_ledgers led on trans.debit_account = led.id AND trans.debit_account !="+ selectLedgerid +"  left join acc_ledgers leds on trans.credit_account = leds.id AND trans.credit_account !="+ selectLedgerid +" where trans.status=1 " + context.psGlobal.getWhereClause(filterColumns.current, false)
        };
        context.psGlobal.apiRequest(reqData1, context.adminUser(userId).mode).then((res) => {
              setPTotal(res[0].total);
              setPaginate({
                total: res[0].total,
                limit: 100,
                offset: 1,
                beforeval:0,
            });
        }) ;
    }
   
    const getTransactionAmt=()=>{
      let pushincome1 = new Array();
      let off = ((paginate.offset > 0 ? paginate.offset : 1) - 1) * paginate.limit;
      var getCreditData = {
        query_type: 'get', //query_type=insert | update | delete | query
        query:"select sum(amount) as amt from (SELECT amount FROM `acc_transactions` trans where trans.status=1 " + context.psGlobal.getWhereClause(filterColumns.current, false) + " AND (trans.credit_account ="+ selectLedgerid +" OR trans.debit_account ="+ selectLedgerid +") order by trans.tr_date LIMIT "+off+" OFFSET 0) as subt"  
      };         
      context.psGlobal.apiRequest(getCreditData, context.adminUser(userId).mode).then((res) => { 
        var getDebitData = {
          query_type: 'get', //query_type=insert | update | delete | query
          query:"select sum(amount) as amt from (SELECT amount FROM `acc_transactions` trans where trans.status=1 " + context.psGlobal.getWhereClause(filterColumns.current, false) + " AND trans.debit_account ="+ selectLedgerid +" order by trans.tr_date LIMIT "+off+" OFFSET 0) as subt" 
        };         
        context.psGlobal.apiRequest(getDebitData, context.adminUser(userId).mode).then((res1) => {          
          getLedgerTransaction(res.amt,res1.amt);
        });
      });      
                 
    }

    //console.log(creditamt);
    const getLedgerTransaction=(creditamt,debitamt)=>{ 
      var total = 0;
      var subtotal = (creditamt - debitamt);      
      if(subtotal){
        total = ((subtotal - debitamt) + Math.abs(credit - debit));
      }      
      if(total==0){ 
        total = $("#prevval").val();
      }

      let off = ((paginate.offset > 0 ? paginate.offset : 1) - 1) * paginate.limit;
      let prev_amount = paginate.beforeval;
      var reqData = {
          query_type: 'query', //query_type=insert | update | delete | query
          query: "select @b := @b + trans.amount AS balance, trans.id,trans.tr_date,trans.credit_account,trans.debit_account,trans.amount,trans.narration,led.ledger_name as debit_ledname,leds.ledger_name as credit_ledname from (SELECT @b := "+total+") AS dummy ,acc_transactions trans left join acc_ledgers led on trans.debit_account = led.id AND trans.debit_account !="+ selectLedgerid +"  left join acc_ledgers leds on trans.credit_account = leds.id AND trans.credit_account !="+ selectLedgerid +" where trans.status=1 " + context.psGlobal.getWhereClause(filterColumns.current, false) + " order by trans.tr_date LIMIT "+paginate.limit+" OFFSET "+off          
      };       
   
      context.psGlobal.apiRequest(reqData, context.adminUser(userId).mode).then((res) => { 
             setData(res);
             setPaginate({ 
              total: ptotal,
              limit: paginate.limit,
              offset: (paginate.offset),
              beforeval:prev_amount ? prev_amount : 0,
          });
       })         
       .catch(err => {
         // message.error(err);
      })

    }
    var total =0;
    var balance = 0;
    
    if(data.length>0){
      if(data[0].prev_amt!=0){   balance = data[0].prev_amt;   }else{ balance = Math.abs(credit - debit); }
    }else{
      balance = Math.abs(credit - debit);
    }

   

    var totalbalance = 0;
    const found = data.findLast((element) => element );
    const calculateAmount =(debits, credits,amt,ids,prev_amt)=>{
      if(credits==selectLedgerid){
        if(credit){       
              total = (parseFloat(balance) + parseFloat(amt));            
              balance = total; 
               if(found.id==ids){
                paginate.beforeval = balance;               
              } 
              totalbalance+= balance;  
             
              return balance;
        } else{          
            balance = (parseFloat(balance) + parseFloat(amt));
            totalbalance+= balance;
           
            return parseFloat(balance);
        }
      }
      if(debits==selectLedgerid){
        if(debit){
            total = (parseFloat(balance) - parseFloat(amt));        
            balance = total;  
            /* if(found.id == ids){
              setLastDebit(balance);
            } */
            totalbalance+= balance;  
           
            return balance;
        }
        else{
          balance = (parseFloat(balance) - parseFloat(amt));
          totalbalance+= balance;
          return parseFloat(balance);
         // return 0;
      }
      }      
    };

    const handlePaginateChange=(e)=>{ 
      let m = paginate;
      m.offset = e; 
      setPaginate(prevState => ({
          ...prevState,
          offset:e
      }));        
  }

    const onChangeDate = (dates) => {
      searchForm.setFieldsValue({ tr_date: dates });
    };
    
    const ledgersOnChange = (val) => {
      setLedgerid(val);      
      var legdername = ledgers.find(items => items.id == val);
      setLedgerName(legdername.ledger_name);
      searchForm.setFieldsValue({ debit_account: val });
    };
    const onFinishSearch = (values) => {
      var filter_clauses = [];     
      filter_clauses.push(
        " date(trans.tr_date)>='" + dayjs(values.tr_date[0]).format("YYYY-MM-DD") + "'"
      )
      filter_clauses.push(
        " date(trans.tr_date)<='" + dayjs(values.tr_date[1]).format("YYYY-MM-DD") + "'"
      );
      filter_clauses.push(
        " (trans.debit_account =" + values.debit_account + " OR trans.credit_account =" + values.debit_account +")"
      );      
      filterColumns.current = filter_clauses;      
      //getLedgerTransaction();
      setFilterDate(dayjs(values.tr_date[0]).format("YYYY-MM-DD")); 
      getTransactionDebit(values.debit_account);
      getTransactionCredit(values.debit_account);
      getTotalTransaction();
      getTransactionAmt();
      setRefreshTable((prev) => prev + 1);      

    };
    const onPrintClick=()=>{
      setIsPrint(true);
      setRefreshPrintData(prev=>prev+1);      
    }

  const LoadLedgers = () => {
      var reqData = {
          query_type: 'query', //query_type=insert | update | delete | query
          query: "select id,ledger_name from acc_ledgers where status=1"
      };
      context.psGlobal.apiRequest(reqData, context.adminUser(userId).mode).then((res) => {
          setLedgers(res);
      }).catch(err => {
          message.error(err);
      })
  }
  const getTransactionDebit= (ledgerid) => {  
    var filterDate = filterColumns.current[0].replace('date(trans.tr_date)>=','date(tr_date)<');    
    var reqData = {
        query_type: 'query', //query_type=insert | update | delete | query
        query: "select amount,debit_account,SUM(amount) as total from acc_transactions where status=1 AND debit_account = "+ledgerid+" AND "+filterDate+""
    };    
    context.psGlobal.apiRequest(reqData, context.adminUser(userId).mode).then((res) => {
        if(res.length>0){
          
            setDebit(res[0].total);
            setDebitAccount(res);
        }         
     })         
     .catch(err => {
       // message.error(err);
    })
};
  const getTransactionCredit = (ledgerid) => {
    
    var filterDate = filterColumns.current[0].replace('date(trans.tr_date)>=','date(tr_date)<');
    
    var reqData = {
        query_type: 'query', //query_type=insert | update | delete | query
        query: "select amount,credit_account,SUM(amount) as total from acc_transactions where status=1 AND credit_account = "+ledgerid+" AND "+filterDate+""
    };  
    context.psGlobal.apiRequest(reqData, context.adminUser(userId).mode).then((res) => {
        if(res.length>0){
            setCredit(res[0].total);
            setCreditAccount(res);
        }         
     })         
     .catch(err => {
       // message.error(err);
    })
};

useEffect(()=>{
  getTransactionAmt();
  getLedgerTransaction();
},[paginate.offset]);

const sNo=(index)=> ((paginate.limit * (paginate.offset-1)) + index)

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
                    <Breadcrumb.Item>Ledgers Transacation </Breadcrumb.Item>
                </Breadcrumb>
                
                <Card title={"Ledgers Transacation"}>
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
                      name="tr_date"
                    // rules={[{ required: true, message: 'Please Enter Msg Date' }]}
                    >
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
              <Col className="gutter-row" xs={24} xl={6}>
                <FormItem
                    label="Ledger"
                    name="debit_account">
              <Select
                  showSearch
                  placeholder="Ledger"
                  optionFilterProp="children"
                  style={{ width: 200 }}                  
                  onChange={ledgersOnChange}
                  filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
              >
                  {
                      ledgers.map(item => {
                          return <Select.Option value={item.id}>{item.ledger_name}</Select.Option>
                      })
                  }
                </Select>
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
              {/* <Col className="gutter-row" xs={24} xl={2}>
                  <MyButton type="primary" >
                    <FontAwesomeIcon icon={faFileExcel} /> Excel
                  </MyButton>
              </Col> */}
             
            </Row>
          </Form>
          
         <div style={{float:'right'}}>
          <Pagination 
                        current={parseInt(paginate.offset)}
                        total={parseInt(Math.ceil(parseInt(ptotal) / parseInt(paginate.limit)))}
                        //total={parseInt(Math.ceil(parseInt(paginate.total) / parseInt(paginate.limit))) || 1}
                        onPageChange={handlePaginateChange}
                        extraClassName="mb-0"
                    />
         </div> 
         
          <table id="employees" style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid' }}>
                <thead>
                <tr>
                <th style={{width:'50px'}}>Sl No</th>
                <th style={{width:'100px'}}>Date</th>
                <th>Account</th>
                <th>Description</th>
                <th style={{width:'75px'}}>Debit</th>
                <th style={{width:'75px'}}>Credit</th>
                <th style={{width:'75px'}}>Balance</th>
                </tr>
                </thead>
                <tbody>
                <tr style={{fontWeight: 'bold'}}>
                <td colSpan={4} align="right">Opening</td>
                <td>{debit ? debit : 0}</td>
                <td>{credit ? credit : 0}</td>
                <td>{Math.abs(credit - debit)}
                <input type="hidden" id="prevval" value={Math.abs(credit - debit)}></input></td>
               </tr>
               {data.map((item, i)=>{                
                    return <tr>
                        <td>{sNo(i+1)}</td>
                        <td>{dayjs(item.tr_date).format("DD/MM/YYYY hh:mm a")}</td>                       
                        <td>{item.debit_ledname} {item.credit_ledname}</td>           
                        <td>{item.narration}</td>            
                        <td>{(item.debit_account==selectLedgerid ? item.amount : '')}</td>                       
                        <td>{(item.credit_account==selectLedgerid ? item.amount : '')}</td>                       
                        <td>{item.balance}</td>                       
                    </tr>                 
                     })}
                    {/*  <tr>
                      <td colSpan={6}>{totalbalance}</td>
                     </tr> */}
                </tbody>
                </table>
                <div style={{float:'right'}}>
                <Pagination 
                              current={parseInt(paginate.offset)}
                              total={parseInt(Math.ceil(parseInt(ptotal) / parseInt(paginate.limit)))}
                              //total={parseInt(Math.ceil(parseInt(paginate.total) / parseInt(paginate.limit))) || 1}
                              onPageChange={handlePaginateChange}
                              extraClassName="mb-0"
                          />
              </div>                   
                </Card>

            </Content>

            {
            isPrint && (<PrintLedgerTransactions 
            ref={componentRef}      
            listHeading={"Ledger Transactions"}
            countQuery={"select count(*) as count from acc_transactions trans where status=1" + context.psGlobal.getWhereClause(filterColumns.current, false)}
            listQuery={"select trans.id,trans.tr_date,trans.credit_account,trans.debit_account,trans.amount,trans.narration,led.ledger_name as debit_ledname,leds.ledger_name as credit_ledname from acc_transactions trans left join acc_ledgers led on trans.debit_account = led.id AND trans.debit_account !="+ selectLedgerid +"  left join acc_ledgers leds on trans.credit_account = leds.id AND trans.credit_account !="+ selectLedgerid +" where trans.status=1 " + context.psGlobal.getWhereClause(filterColumns.current, false) + " order by trans.tr_date"}
            userId={userId}
            filterColumns={filterColumns}
            ledgerid={selectLedgerid}
            ledgername={selectLedgerName}
            recordsPerRequestOrPage={10}
            refresh={refreshPrintData}
            onDataLoadFinish={()=>{handlePrint()}}
            onPrintCancel={()=>setIsPrint(false)}
            onSuccess={e => {
              setIsPrint(false);
           }}
          
            />)
        } 

        </>
    );
}
export default LedgerTransaction;



