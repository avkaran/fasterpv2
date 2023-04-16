import React, { useState, useEffect, useContext, useRef } from 'react';
import { Navigate, useParams, Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Row, Col, message } from 'antd';
import { ImageUpload } from '../../../../comp'
import { Spin, Card } from 'antd';
import { Button, Checkbox, Space, DatePicker } from 'antd';
import { Form, Input, Select, InputNumber, Modal, Image } from 'antd';
import PsContext from '../../../../context';
import dayjs from 'dayjs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserCheck, faUser, faUserTimes, faUserClock, faEye, faCheck, faClose } from '@fortawesome/free-solid-svg-icons'
import { MyButton, MyTable } from '../../../../comp'
import { green, yellow, grey } from '@ant-design/colors';
import { FormViewItem } from '../../../../comp';
import moment from 'moment'
import './tourStyle.css'
import { AvatarPaginatedList } from '../../../../comp';
const Tours = (props) => {
    const context = useContext(PsContext);
    const navigate = useNavigate();
    const filterColumns = useRef(null);
    const [refreshList, setRefreshList] = useState(0);
    const InfiniteListRef = useRef();
    const { filterColumnsRef, refreshComponent, userId, onSendInterestClick, onViewClick,isLoggedView,...other } = props;
    const [checkedList,setCheckedList]=useState([]);
    useEffect(() => {
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const onListPageChange = (page, allData) => {


    }
    const getCategories = () => {
        let m = context.psGlobal.collectionData.find(item => item.name === 'tour-package-categories');
        let cData = m.collections.split(",");
        return cData.map(item => <Checkbox key={item} value={item} >{item}</Checkbox>)
    }
    const onApplyCategories=(e)=>{
        var filter_clauses = [];
        var subClauses=[];
        checkedList.forEach(item=>{
            subClauses.push(" m.categories like  '%" + item + "%'")
        })
        filter_clauses.push("(" + subClauses.join(" OR ") + ")");
        if(subClauses.length>0)
        filterColumns.current = filter_clauses; 
        else
        filterColumns.current = []; 
        setRefreshList(prev=>prev+1)
    }
    const onCheckboxChange=(list)=>{
       
        setCheckedList(list)
    }
    return (
        <>

            <Row gutter={12}>
                <Col xs={24} xl={6}>
                    <Card title="Categories" extra={<MyButton type="outlined" onClick={onApplyCategories}>Apply</MyButton>}>
                        <Checkbox.Group onChange={onCheckboxChange}>
                            <Space direction='vertical'>
                                {getCategories()}
                            </Space>
                        </Checkbox.Group>
                    </Card>

                </Col>
                <Col xs={24} xl={18}>


                    <AvatarPaginatedList
                        ref={InfiniteListRef}
                        listHeading={"Tours"}
                        countQuery={"select count(*) AS count from tour_packages m where m.status=1 and m.active_status=1 " + context.psGlobal.getWhereClause(filterColumns.current, false)}
                        listQuery={"select m.*,@rownum:=@rownum+1 as row_num from tour_packages m  CROSS JOIN (SELECT @rownum:={rowNumberVar}) crsj  where m.status=1 and m.active_status=1  " + context.psGlobal.getWhereClause(filterColumns.current, false) + "  order by id desc"}
                        recordsPerRequestOrPage={10}
                        userId={userId}
                        refresh={refreshList}
                        isCheckboxList={false}
                        wrapperClass="row"
                        //  onCheckedChange={onCheckedChange}
                        onPageChange={onListPageChange}
                        renderItem={(item, index) => {
                            return <>
                                <div className="col-xs-12 col-sm-4">
                                    <div className="card">
                                        <a className="img-card" href={"/#/0/customer/"+(isLoggedView?'mytour':'tour')+"-view/"+item.id}>
                                            <img src={context.baseUrl  +'/cloud-file/'+ encodeURIComponent(encodeURIComponent(item.package_image))} />
                                        </a>
                                        <div className="card-content">
                                            <h6 className="text-center" style={{ color: '#1976bc', fontSize: 'medium' }}>
                                                <b>{item.package_name}</b>
                                            </h6>
                                            <h6 className="text-center" style={{ color: 'green', fontSize: 'medium' }}>
                                                <b>$ {item.price}</b>
                                            </h6>
                                            <p className="text-center">
                                                {item.categories?item.categories.slice(0,50)+"...":'-'}
                                            </p>
                                        </div>
                                        <div className="card-read-more">
                                            <a href={"/#/0/customer/"+(isLoggedView?'mytour':'tour')+"-view/"+item.id} className="btn btn-link btn-block" style={{ color: 'white', backgroundColor: '#1976bc' }}>
                                                Book Now
                                            </a>
                                        </div>
                                    </div>
                                </div>

                            </>
                        }}
                    />





                </Col>
            </Row>
        </>
    );

}
export default Tours;