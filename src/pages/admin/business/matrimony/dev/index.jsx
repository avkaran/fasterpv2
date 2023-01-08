import React, { useState, useEffect, useContext, useRef } from 'react';
import { useParams } from 'react-router-dom';
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
import dayjs from 'dayjs';
import { MyButton, MyTable, ViewItem } from '../../../../../comp';
import { StoreProfile } from './syncProfile'

const DeveloperHome = (props) => {
    const [data, setData] = useState([]);

    const context = useContext(PsContext);
    const {userId}=  useParams();
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

    const loadData = (start) => {
        //setLoader(true);
        var reqData = [{
            query_type: 'query',
            query: "select count(*) as count from user__cmp1_profiles p,user__cmp1_caste cs,user__cmp1_profile_status ps where  p.profile_id=ps.profile_id and p.caste=cs.id  and p.last_updated<>p.raj_updated"
        },
        {
            query_type: 'query',
            query: "select p.profile_id,p.name,p.mobile_no,p.father_name,p.gender,p.religion,cs.caste,p.sub_caste,p.martial_status,p.profile_status, ps.last_login_date,p.created_date,p.mother_tongue,ps.is_mobile_verified,ps.is_email_verified, ps.is_photo_updated,ps.is_contact_details_updated, ps.is_horroscope_updated,p.last_updated from user__cmp1_profiles p,user__cmp1_caste cs,user__cmp1_profile_status ps where p.profile_id=ps.profile_id and p.caste=cs.id and  p.last_updated<>p.raj_updated order by cast(p.last_updated as unsigned) desc limit " + start + ",1"
        },
        ];
        var form = new FormData();
        form.append('queries', context.psGlobal.encrypt(JSON.stringify(reqData)))
        // form.append('mode', 'dev');
        axios.post('https://rajeshwarimatrimony.com/synch/v1/admin/db-query', form).then(res => {
            console.log('res', res);
            if (res['data'].status === '1') {

                // setCountData(res['data'].data[0][0].count)
                // setData(res['data'].data[1]);
                // setLoader(false);
                // message.success( count + " data fetched")
                if (parseInt(res['data'].data[0][0].count) > 0)
                    onMigrateClickNew(res['data'].data[1][0], start);
                else
                    message.error("No waiting data to be migrated from rajeshwarimatrimony.com")


            }
            else {
                message.error("fetch error");
                //setLoader(false);
            }

        }).catch(err => {
            message.error(err);
            //setLoader(false);
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

            context.psGlobal.apiRequest(reqData, context.adminUser(userId).mode).then((res) => {
                message.success("updated " + item.asciiname)

            }).catch(err => {
                message.error(err);
                // setLoader(false);
            })
        })
    }
    const onMigrateClickNew = (item, start) => {

        StoreProfile(item.profile_id).then(res => {


            //remove if already stored,
            var reqDeleteData = [
                
                {
                    query_type: 'delete',
                    table: 'member_family_details',
                    where: { member_id: item.profile_id }

                },
                {
                    query_type: 'delete',
                    table: 'member_habits',
                    where: { member_id: item.profile_id }

                },
                {
                    query_type: 'delete',
                    table: 'member_physical_attributes',
                    where: { member_id: item.profile_id }

                },
                {
                    query_type: 'delete',
                    table: 'member_horoscope',
                    where: { member_id: item.profile_id }

                },
                {
                    query_type: 'delete',
                    table: 'member_partner_preference',
                    where: { member_id: item.profile_id }

                },
                {
                    query_type: 'delete',
                    table: 'orders',
                    where: { member_id: item.profile_id }

                },
                {
                    query_type: 'delete',
                    table: 'members',
                    where: { member_id: item.profile_id }

                },
            ]
            context.psGlobal.apiRequest(reqDeleteData, "dev").then((responseDelete) => {
                if (res.members.member_status !== 'Deleted') {
                    var reqData = {
                        query_type: 'insert',
                        table: 'members',

                        values: res.members,

                    };

                    context.psGlobal.apiRequest(reqData, "dev").then((resMembers) => {
                        var InsertedId = resMembers;
                        res.family['member_auto_id'] = InsertedId;
                        res.hobbies['member_auto_id'] = InsertedId;
                        res.physical['member_auto_id'] = InsertedId;
                        res.horoscope['member_auto_id'] = InsertedId;
                        res.partner['member_auto_id'] = InsertedId;

                        var reqDataM = [{
                            query_type: 'insert',
                            table: 'member_family_details',

                            values: res.family,

                        },
                        {
                            query_type: 'insert',
                            table: 'member_habits',

                            values: res.hobbies,

                        },
                        {
                            query_type: 'insert',
                            table: 'member_physical_attributes',

                            values: res.physical,

                        },
                        {
                            query_type: 'insert',
                            table: 'member_horoscope',

                            values: res.horoscope,

                        },
                        {
                            query_type: 'insert',
                            table: 'member_partner_preference',

                           // values: { member_auto_id: InsertedId, member_id: res.members.member_id },
                           values:res.partner,

                        },
                        ];

                        //insert order queries by push if any.
                        res.orders.forEach((order) => {
                            var MyOrder = order;
                            MyOrder['member_auto_id'] = InsertedId;
                            reqDataM.push({
                                query_type: 'insert',
                                table: 'orders',
                                values: MyOrder,
                            })
                        })
                        context.psGlobal.apiRequest(reqDataM, "dev").then((resOthers) => {
                            var formImage = new FormData();
                            formImage.append('member_id', item.profile_id);
                            formImage.append('member_auto_id', InsertedId)
                            context.psGlobal.apiRequest('v1/admin/update-rajimage', "prod", formImage).then((resImage) => {

                                var reqDataRajStaus = {
                                    query_type: 'update',
                                    table: 'user__cmp1_profiles',
                                    where: { profile_id: item.profile_id },
                                    values: { raj_updated: item.last_updated },
                                }
                                var form = new FormData();
                                form.append('queries', context.psGlobal.encrypt(JSON.stringify(reqDataRajStaus)))
                                form.append('mode', 'dev');
                                axios.post('https://rajeshwarimatrimony.com/synch/v1/admin/db-query', form).then(res => {
                                });


                                message.success("Migrated (" + item.profile_id + "): " + start.toString());
                                setTimeout(loadData(start + 1), 2000);



                            })

                        }).catch(err => {
                            message.error(err);

                        })

                    }).catch(err => {
                        message.error(err);

                    })
                }
                else{
                    var reqDataRajStaus = {
                        query_type: 'update',
                        table: 'user__cmp1_profiles',
                        where: { profile_id: item.profile_id },
                        values: { raj_updated: item.last_updated },
                    }
                    var form = new FormData();
                    form.append('queries', context.psGlobal.encrypt(JSON.stringify(reqDataRajStaus)))
                    form.append('mode', 'dev');
                    axios.post('https://rajeshwarimatrimony.com/synch/v1/admin/db-query', form).then(res => {
                    });
                    message.error("Deleted (" + item.profile_id + "): " + start.toString());
                    setTimeout(loadData(start + 1), 2000);
                }

            }).catch(err => {
                message.error(err);

            })







            //store data


        }).catch(err => {
            message.error("Error (" + err + "): " + start.toString());
            setTimeout(loadData(start + 1), 60000);
        });;

    }

    return (
        <>
            <Card title="Dashboard">
                <Row>
                    <Col>

                    </Col>
                    <Col>
                        <MyButton onClick={() => { loadData(0); setMigrateLoading(true); }} loading={migrateLoading}>Start Migration</MyButton>
                    </Col>
                </Row>
                <Row>



                </Row>
            </Card>
        </>
    );
};

export default DeveloperHome;
