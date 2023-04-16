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
const Hotels = (props) => {
    const context = useContext(PsContext);
    const navigate = useNavigate();
    const filterColumns = useRef(null);
    const [refreshList, setRefreshList] = useState(0);
    const InfiniteListRef = useRef();
    const { filterColumnsRef, refreshComponent, userId, onSendInterestClick, onViewClick, isLoggedView, searchData, ...other } = props;
    const [checkedList, setCheckedList] = useState([]);
    const [selTravelDate, setSelTravelDate] = useState(null)
    const [selPriceFrom, setSelPriceFrom] = useState(null);
    const [selPriceTo, setSelPriceTo] = useState(null);
    const [isDocumentLoaded,setIsDocumentLoaded]=useState(false)
    useEffect(() => {
        
        if (searchData) {
            var filter_clauses=[];

            if (searchData.travel_date)
                setSelTravelDate(searchData.travel_date)
            if (searchData.price_from){
                setSelPriceFrom(searchData.price_from)
                filter_clauses.push("m.price>=" + searchData.price_from);
            }
            if (searchData.price_to){
                setSelPriceTo(searchData.price_to)
                filter_clauses.push("m.price<=" + searchData.price_to);
            }
            filterColumns.current=filter_clauses;
           

        }
        setIsDocumentLoaded(true)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const onListPageChange = (page, allData) => {


    }
    const getCategories = () => {
        let m = context.psGlobal.collectionData.find(item => item.name === 'hotel-features');
        let cData = m.collections.split(",");
        return cData.map(item => <Checkbox key={item} value={item} >{item}</Checkbox>)
    }
    const onApplyCategories = (e) => {
        var filter_clauses = [];
        var subClauses = [];
        checkedList.forEach(item => {
            subClauses.push(" m.features like  '%" + item + "%'")
        })

        if (subClauses.length > 0)
            filter_clauses.push("(" + subClauses.join(" OR ") + ")");


        //verify prices and add it if exists.
        if (selPriceFrom)
            filter_clauses.push("m.price>=" + selPriceFrom);
        if (selPriceTo)
            filter_clauses.push("m.price<=" + selPriceTo);

        filterColumns.current = filter_clauses;


        setRefreshList(prev => prev + 1)
    }
    const onCheckboxChange = (list) => {

        setCheckedList(list)
    }
    return (
        <>

            <Row gutter={12}>
                <Col xs={24} xl={6}>
                    <Card title="Categories" extra={<MyButton type="outlined" color="#1976bc" onClick={onApplyCategories}>Apply</MyButton>}>
                        <Checkbox.Group onChange={onCheckboxChange}>
                            <Space direction='vertical'>
                                {getCategories()}
                            </Space>
                        </Checkbox.Group>
                    </Card>

                </Col>
                <Col xs={24} xl={18}>
                    <Card>
                        <Row gutter={16}>
                            <Col xs={12} xl={3}>
                                Checkin Date
                            </Col>
                            <Col xs={12} xl={4}>
                                <Space direction="vertical">
                                    <DatePicker
                                        // onChange={dateOnChange}
                                        format='DD/MM/YYYY'
                                        onChange={(date) => setSelTravelDate(date)}
                                        //disabledDate={dateDisabled}
                                        allowClear={false}
                                    />
                                </Space>
                            </Col>
                            <Col xs={12} xl={2}>
                                Price
                            </Col>
                            <Col xs={12} xl={3}>
                                <InputNumber placeholder="From" type="number"
                                    value={selPriceFrom}
                                    onChange={(value) => setSelPriceFrom(value)}
                                    style={{ width: '100px' }} />
                            </Col>
                            <Col xs={12} xl={1}>
                                To
                            </Col>
                            <Col xs={12} xl={3}>
                                <InputNumber placeholder="To" type="number"
                                    value={selPriceTo}
                                    onChange={(value) => setSelPriceTo(value)}
                                    style={{ width: '100px' }} />
                            </Col>
                            <Col xs={12} xl={1}>
                                <MyButton type="outlined" color="#1976bc" onClick={onApplyCategories}>Search</MyButton>
                            </Col>
                        </Row>
                    </Card>
                    {
                        isDocumentLoaded && (<>
                        <AvatarPaginatedList
                        ref={InfiniteListRef}
                        listHeading={"Hotels"}
                        countQuery={"select count(*) AS count from hotel_rooms m,hotels h where m.hotel_id=h.id and m.status=1 and m.availablity=1 " + context.psGlobal.getWhereClause(filterColumns.current, false)}
                        listQuery={"select m.*,h.hotel_name,@rownum:=@rownum+1 as row_num from hotel_rooms m,hotels h  CROSS JOIN (SELECT @rownum:={rowNumberVar}) crsj  where m.hotel_id=h.id and  m.status=1 and m.availablity=1  " + context.psGlobal.getWhereClause(filterColumns.current, false) + "  order by id desc"}
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
                                        <a className="img-card"
                                            href={(isLoggedView ? '/#/0/customer/myhotel-view/' : '/#/public/hotel-view/') + item.id}>
                                            <img src={context.baseUrl + '/cloud-file/' + encodeURIComponent(encodeURIComponent(item.room_image))} />
                                        </a>
                                        <div className="card-content">
                                            <h6 className="text-center" style={{ color: '#1976bc', fontSize: 'medium' }}>
                                                <b>{item.room_type}</b>
                                            </h6>
                                            <h6 className="text-center" style={{ color: '#1976bc', fontSize: 'medium' }}>
                                                <b>{item.hotel_name}</b>
                                            </h6>
                                            <h6 className="text-center" style={{ color: 'green', fontSize: 'medium' }}>
                                                <b>$ {item.price}</b>
                                            </h6>
                                            <p className="text-center">
                                                {item.features ? item.features.slice(0, 50) + "..." : '-'}
                                            </p>
                                        </div>
                                        <div className="card-read-more">
                                            <a href={(isLoggedView ? '/#/0/customer/myhotel-view/' : '/#/public/hotel-view/') + item.id} className="btn btn-link btn-block" style={{ color: 'white', backgroundColor: '#1976bc' }}>
                                                Book Now
                                            </a>
                                        </div>
                                    </div>
                                </div>

                            </>
                        }}
                    />

                        </>)
                    }

                    




                </Col>
            </Row>
        </>
    );

}
export default Hotels;