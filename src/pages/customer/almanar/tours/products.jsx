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
const Products = (props) => {
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
            if (searchData.product_name) {
             
                filter_clauses.push("( m.product_name like '%" + searchData.product_name +"%' or m.product_brand like '%" + searchData.product_name +"%' or m.product_category like '%" + searchData.product_name +"%') ");
            }
          
            if (searchData.product_brand) {
             
                filter_clauses.push("m.product_brand='" + searchData.product_brand +"'");
            }
            if (searchData.product_category) {
             
                filter_clauses.push("m.product_category='" + searchData.product_category +"'");
            }
           
           
            filterColumns.current = filter_clauses;


        }
        console.log("sdata",searchData)
        setIsDocumentLoaded(true)
        setRefreshList(prev => prev + 1)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchData]);
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
    const getTitle=()=>{
        var title="Products"
        if(searchData){
            if(searchData.product_brand)
                title=searchData.product_brand +" Products"
            if(searchData.product_category)
                 title=searchData.product_category +" Products"
        }

        return title;
    }
    return (
        <>

            <Row gutter={12}>
                <Col xs={24} xl={6}>
                    <Card title="Collections" extra={<MyButton type="outlined" color="#1976bc" onClick={onApplyCategories}>Apply</MyButton>}>
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

                            <Col xs={12} xl={8}>
                                <Input placeholder="type here"
                                    value={searchText}
                                    onChange={(e) => setSearchText(e.target.value)}
                                    style={{ width: '300px' }} />
                            </Col>
                            <Col xs={12} xl={2}>
                                <MyButton type="outlined" color="#1976bc" onClick={onSearchClick}>Search</MyButton>
                            </Col>
                        </Row>
                    </Card>
                    {
                        isDocumentLoaded && (<>
                            <AvatarPaginatedList
                                ref={InfiniteListRef}
                                listHeading={getTitle()}
                                countQuery={"select count(*) AS count from products m where m.status=1 and m.active_status=1 " + context.psGlobal.getWhereClause(filterColumns.current, false)}
                                listQuery={"select m.*,@rownum:=@rownum+1 as row_num from products m  CROSS JOIN (SELECT @rownum:={rowNumberVar}) crsj  where m.status=1 and m.active_status=1  " + context.psGlobal.getWhereClause(filterColumns.current, false) + "  order by id desc"}
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
                                                    href={(isLoggedView ? '/#/0/customer/myproduct-view/' : '/apps/#/public/product-view/') + item.id}>
                                                    <img src={context.baseUrl + '/cloud-file/' + encodeURIComponent(encodeURIComponent(item.product_image))} />
                                                </a>
                                                <div className="card-content">
                                                    <h6 className="text-center" style={{ color: '#1976bc', fontSize: 'medium' }}>
                                                        <b>{item.product_name}</b>
                                                    </h6>
                                                    <h6 className="text-center" style={{ color: 'green', fontSize: 'medium' }}>
                                                        <b>Dhs. {item.selling_price}</b>
                                                    </h6>
                                                    <p className="text-center">
                                                        {item.product_category ? item.product_category.slice(0, 50) + "..." : '-'}
                                                    </p>
                                                </div>
                                                <div className="card-read-more">
                                                    <a href={(isLoggedView ? '/#/0/customer/myproduct-view/' : '/apps/#/public/product-view/') + item.id} className="btn btn-link btn-block" style={{ color: 'white', backgroundColor: '#1976bc' }}>
                                                        Add to Cart
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
export default Products;