import { faIndianRupeeSign, faList, faListCheck, faPeopleRobbery, faPeopleRoof, faTriangleExclamation, faUser, faUserCheck, faUserClock, faUsers, faUserTag, faUserTie, faUserTimes, faUserXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    Card,
    Col,
    Row,
    Spin,
    message,
    Button
} from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import PsContext from '../../../../../context';
import { Layout,Form, Input, Select, InputNumber, Radio, Checkbox, DatePicker } from 'antd';
import StatCard from './statcard';
import { green, blue, red, cyan, grey, magenta, yellow, gold } from '@ant-design/colors';
import { MyButton, MyTable,FormItem } from '../../../../../comp';
import dayjs from 'dayjs';
import { HomeOutlined } from '@ant-design/icons';
import { currentInstance, businesses } from '../../../../../utils';
import HomeContainer from '../../../layout-mobile/homeContainer';
import ResponsiveLayout from '../../../layout'
import { Button as MButton } from 'antd-mobile'
const Dashboard = (props) => {
    const context = useContext(PsContext);
    const { userId } = useParams();
    const { Content } = Layout;
    const [loader, setLoader] = useState(false);
    const [addeditFormAdjustments] = Form.useForm();
    const [products, setProducts] = useState([])
    const [countData, setCountData] = useState(null)
    const [selDates, setSelDates] = useState([dayjs().format("YYYY-MM-DD"), dayjs().format("YYYY-MM-DD")])
    const theme = {
        primaryColor: '#007bff',
        infoColor: '#1890ff',
        successColor: '#52c41a',
        processingColor: '#1890ff',
        errorColor: '#f5222d',
        highlightColor: '#f5222d',
        warningColor: '#faad14',
        normalColor: '#d9d9d9',
        backgroundColor: '#f7f7f9',
        darkColor: 'rgb(51, 51, 51)',
        textColor: 'rgba(0, 0, 0, .65)',
        textColorSecondary: 'rgba(0, 0, 0, .45)',

    }
    useEffect(() => {
        //console.log('userdata',context.adminUser(userId))
        // loadMemberCounts();
        //  loadCountData();
        // loadTableCountData()
        // loadMetalRates()
       // loadCountData(selDates);
       // loadProducts()
    }, []);
    const getStock = (id) => {
        var item = products.find(item => parseInt(item.id) === parseInt(id));
        var stock = 0;
        if (item)
            stock = parseFloat(item.stock) + parseFloat(item.purchase) - parseFloat(item.sales)
        return stock;

    }
    const loadCountData = (dates) => {
        setLoader(true)
        var reqData = [{
            query_type: 'query',
            query: "select coalesce(sum(a.qty),0) as qty,coalesce(sum(a.qty*a.cost_per),0) as sales_cost,coalesce(sum(a.qty*p.cost_price),0) as purchase_cost  from adjustments a,products p where  a.product_id=p.id and a.adjustment_type='Sales'  and a.status=1 and date(a.date)>='" + dates[0] + "' and date(a.date)<='" + dates[1] + "'"
        },
        {
            query_type: 'query',
            query: "select coalesce(sum(a.qty),0) as qty,coalesce(sum(a.qty*a.cost_per),0) as purchase_cost  from adjustments a,products p where  a.product_id=p.id and a.adjustment_type='Purchase'  and a.status=1 and date(a.date)>='" + dates[0] + "' and date(a.date)<='" + dates[1] + "'"
        }
        ]
        context.psGlobal.apiRequest(reqData, context.adminUser(userId).mode).then((res) => {

            setCountData(res)
            setLoader(false)
        }).catch(err => {
            message.error(err);

        })
    }
    const onFinish = (values) => {
        setLoader(true);
        var processedValues = {};
        Object.entries(values.adjustments).forEach(([key, value]) => {
            if (value) {
                processedValues[key] = value;
            }
        });
        processedValues['adjustment_type'] ='Sales'
        processedValues['date'] = dayjs().format("YYYY-MM-DD HH:mm:ss")
        processedValues['total_cost'] = parseFloat(values.adjustments.qty) * parseFloat(values.adjustments.cost_per)

        var reqDataInsert = {
            query_type: 'insert',
            table: 'adjustments',
            values: processedValues

        };
        context.psGlobal.apiRequest(reqDataInsert, context.adminUser(userId).mode).then((res) => {
            setLoader(false);
            message.success("New Sales Done");
            addeditFormAdjustments.resetFields()
           // onSaveFinish();
            //navigate('/' + userId + '/admin/courses');
        }).catch(err => {
            message.error(err);
            setLoader(false);
        })


    };
    const productIdOnChange=(value)=>{
        
            var curProduct=products.find(item=>parseInt(item.id)===parseInt(value))
            if(curProduct)
            addeditFormAdjustments.setFieldsValue({adjustments:{cost_per:curProduct.selling_price}})
      
    }

    const loadProducts = () => {

        var reqData = {
            query_type: 'query',
            query: "select p.*,(select coalesce(sum(qty),0) from adjustments where product_id=p.id and adjustment_type='Purchase' and status=1) as purchase,(select coalesce(sum(qty),0) from adjustments where product_id=p.id and adjustment_type='Sales' and status=1) as sales from products p where p.active_status=1 and p.status=1"
        };
        context.psGlobal.apiRequest(reqData, context.adminUser(userId).mode).then((res) => {
            setProducts(res);
        }).catch(err => {
            message.error(err);
        })
    }

    const onChangeDate = (dates) => {
        setSelDates([dayjs(dates[0]).format("YYYY-MM-DD"), dayjs(dates[1]).format("YYYY-MM-DD")])
        loadCountData([dayjs(dates[0]).format("YYYY-MM-DD"), dayjs(dates[1]).format("YYYY-MM-DD")])
    }
    return (
        <>
            <ResponsiveLayout
                userId={userId}
                customHeader={null}
                bottomMenues={null}
                breadcrumbs={[{ name: 'Dashboard', link: '#/' + userId + '/admin' }]}
            >
                <Card title="Dashboard">
                    Welcome <span style={{color:'green'}}>{context.adminUser(userId).username}!</span>
                </Card>
              
            </ResponsiveLayout>
        </>)

};
export default Dashboard;
