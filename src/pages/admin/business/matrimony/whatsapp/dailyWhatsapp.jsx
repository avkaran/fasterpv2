import React, { useState, useEffect, useContext, useRef } from 'react';
import { withRouter } from 'react-router-dom';
import toast from 'react-hot-toast';
import { green, blue, red, cyan, grey } from '@ant-design/colors';
import axios from 'axios';
import {
    Card,
    Col,
    message,
    Row, Button, Form,
    Spin, Image, Table, InputNumber
} from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserCheck, faUser, faUserTimes, faUserClock } from '@fortawesome/free-solid-svg-icons'
import PsContext from '../../../../../context';
import moment from 'moment';
import { MyButton, MyTable, ViewItem } from '../../../../../comp';

const DailyWhatsapp = (props) => {
    const [data, setData] = useState([]);

    const context = useContext(PsContext);
    const [loader, setLoader] = useState(false);
    const currentCompleted = useRef(0);
    const [countData, setCountData] = useState(null);
    const [addForm] = Form.useForm();
    const [migrateLoading, setMigrateLoading] = useState(false);
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

    }, []);

    const SendDailyProfile = (start) => {
        //setLoader(true);
        context.psGlobal.apiRequest("send-daily-whatsapp/0/1", context.adminUser(props.match.params.userId).mode,null).then((res) => {
           
        if(res){
            message.success(res[0].w_status+ "("+start.toString()+") "+ res[0].name)
            setTimeout(SendDailyProfile(start+1), 2000);
        }
        else{
            message.error("Not Waiting Msg to Send");
            setMigrateLoading(false);
        }
         

          
        }).catch(err => {
            message.error(err);
           
        })

    }
    const onSaveCollections = () => {
        data.forEach((item) => {
            /*  var isEditable = 0;
             if (item.CollectionType == "Active")
                 isEditable = 1; */

            var reqData = {
                query_type: 'insert',
                table: 'districts',

                values: {
                    //id:item.course_id,
                    country: 'IN',
                    state: item.state,
                    district_name: item.asciiname,
                    // caste_status:'Active'
                },

            };

            context.psGlobal.apiRequest(reqData, context.adminUser(props.match.params.userId).mode).then((res) => {
                message.success("updated " + item.asciiname)

            }).catch(err => {
                message.error(err);
                // setLoader(false);
            })
        })
    }
    const onMigrateClickNew = (item, start) => {

       
    }

    return (
        <>
            <Card title="Send Daily Whatsapp">
                <Row>
                    <Col>

                    </Col>
                    <Col>
                        <MyButton onClick={() => { SendDailyProfile(0); setMigrateLoading(true); }} loading={migrateLoading}>Start Whatsapp</MyButton>
                    </Col>
                </Row>
                <Row>



                </Row>
            </Card>
        </>
    );
};

export default DailyWhatsapp;
