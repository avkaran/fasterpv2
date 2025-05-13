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
import noImage from "../assets/images/no-image.jpg"
import { AvatarPaginatedList } from '../../../../comp';
const Collections = (props) => {
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
    const [isDocumentLoaded, setIsDocumentLoaded] = useState(false)
    const [searchText, setSearchText] = useState("")
    useEffect(() => {

        if (searchData) {
            var filter_clauses = [];

          
            if (searchData.product_brand) {
             
                filter_clauses.push("m.product_brand='" + searchData.product_brand +"'");
            }
           
            filterColumns.current = filter_clauses;


        }
        console.log("sdata",searchData)
        setIsDocumentLoaded(true)
        setRefreshList(prev => prev + 1)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const onListPageChange = (page, allData) => {


    }
    const getCategories = () => {
        let m = context.psGlobal.collectionData.find(item => item.name === 'product-category');
        let cData = m.collections.split(",");
        return cData.map(item => <Checkbox key={item} value={item} >{item}</Checkbox>)
    }
    const onSearchClick = () => {
        var filter_clauses = [];
        if (searchText) {
            var subClauses = [];
            subClauses.push(" m.product_name like  '%" + searchText + "%'")
            subClauses.push(" m.product_brand like  '%" + searchText + "%'")
            subClauses.push(" m.product_category like  '%" + searchText + "%'")
            filter_clauses.push("(" + subClauses.join(" OR ") + ")");

            filterColumns.current = filter_clauses;


            setRefreshList(prev => prev + 1)

        }
    }
    const onApplyCategories = (e) => {
        var filter_clauses = [];
        var subClauses = [];
        checkedList.forEach(item => {
            subClauses.push(" m.product_category='" + item + "'")
        })

        if (subClauses.length > 0)
            filter_clauses.push("(" + subClauses.join(" OR ") + ")");


      /*   //verify prices and add it if exists.
        if (selPriceFrom)
            filter_clauses.push("m.price>=" + selPriceFrom);
        if (selPriceTo)
            filter_clauses.push("m.price<=" + selPriceTo);
 */
        filterColumns.current = filter_clauses;


        setRefreshList(prev => prev + 1)
    }
    const onCheckboxChange = (list) => {

        setCheckedList(list)
    }
    return (
        <>

            <Row gutter={12}>
            <Col xs={24} xl={1}>
            </Col>
                <Col xs={24} xl={22}>
                   
                    {
                        isDocumentLoaded && (<>
                         <AvatarPaginatedList
                                ref={InfiniteListRef}
                                listHeading={"Collections"}
                                countQuery={"select COUNT(DISTINCT product_category) AS count from products m where m.status=1 and m.active_status=1"}
                                listQuery={"select min(m.product_category) as product_category,min(m.product_image) as product_image,min(m.product_type) as product_type,@rownum:=@rownum+1 as row_num from products m  CROSS JOIN (SELECT @rownum:={rowNumberVar}) crsj  where m.status=1 and m.active_status=1  GROUP BY m.product_category "}
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
                                                    href={(isLoggedView ? '/#/0/customer/myproduct-view/' : '/apps/#/public/products-by-collection/') + item.product_category}>
                                                    <img src={context.baseUrl + '/cloud-file/' + encodeURIComponent(encodeURIComponent(item.product_image))} />
                                                </a>
                                                <div className="card-content">
                                                    <h6 className="text-center" style={{ color: '#1976bc', fontSize: 'medium' }}>
                                                        <b>{item.product_category}</b>
                                                    </h6>
                                                    <h6 className="text-center" style={{ color: 'green', fontSize: 'medium' }}>
                                                        <b>Type : {item.product_type}</b>
                                                    </h6>
                                                   {/*  <p className="text-center">
                                                        {item.product_category ? item.product_category.slice(0, 50) + "..." : '-'}
                                                    </p> */}
                                                </div>
                                                <div className="card-read-more">
                                                    <a href={(isLoggedView ? '/#/0/customer/myproduct-view/' : '/apps/#/public/products-by-collection/') + item.product_category} className="btn btn-link btn-block" style={{ color: 'white', backgroundColor: '#1976bc' }}>
                                                        View Products
                                                    </a>
                                                </div>
                                            </div>
                                        </div>

                                    </>
                                }}
                            />

                            <AvatarPaginatedList
                                ref={InfiniteListRef}
                                listHeading={"Brands"}
                                countQuery={"select COUNT(DISTINCT product_brand) AS count from products m where m.status=1 and m.active_status=1"}
                                listQuery={"select min(m.product_brand) as product_brand,min(m.product_image) as product_image,min(m.product_type) as product_type,@rownum:=@rownum+1 as row_num from products m  CROSS JOIN (SELECT @rownum:={rowNumberVar}) crsj  where m.status=1 and m.active_status=1  GROUP BY m.product_brand "}
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
                                                    href={(isLoggedView ? '/#/0/customer/myproduct-view/' : '/apps/#/public/products-by-brand/') + item.product_brand}>
                                                    <img src={context.baseUrl + '/cloud-file/' + encodeURIComponent(encodeURIComponent(item.product_image))} />
                                                </a>
                                                <div className="card-content">
                                                    <h6 className="text-center" style={{ color: '#1976bc', fontSize: 'medium' }}>
                                                        <b>{item.product_brand}</b>
                                                    </h6>
                                                    <h6 className="text-center" style={{ color: 'green', fontSize: 'medium' }}>
                                                        <b>Type : {item.product_type}</b>
                                                    </h6>
                                                   {/*  <p className="text-center">
                                                        {item.product_category ? item.product_category.slice(0, 50) + "..." : '-'}
                                                    </p> */}
                                                </div>
                                                <div className="card-read-more">
                                                    <a href={(isLoggedView ? '/#/0/customer/myproduct-view/' : '/apps/#/public/products-by-brand/') + item.product_brand} className="btn btn-link btn-block" style={{ color: 'white', backgroundColor: '#1976bc' }}>
                                                        View Products
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
                <Col xs={24} xl={1}>
                </Col>
            </Row>
        </>
    );

}
export default Collections;