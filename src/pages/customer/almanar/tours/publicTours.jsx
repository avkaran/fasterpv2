import React, { useState, useEffect, useContext } from 'react';
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
import Tours from './products';
const PublicTours = (props) => {
    const context = useContext(PsContext);
    const navigate = useNavigate();
    const [curAction, setCurAction] = useState('view')
    const { brand } = useParams();
    const { collection } = useParams();
    const { phrase } = useParams();
    const [searchData,setSearchData]=useState({})
    useEffect(() => {
     
        if(brand)
        {
            setSearchData(
                {
                    product_brand:brand,
                  
                }
            )
        }
        if(collection)
            {
                setSearchData(
                    {
                        product_category:collection,
                      
                    }
                )
            }
            if(phrase)
                {
                    setSearchData(
                        {
                            product_name:phrase,
                          
                        }
                    )
                }
        console.log("brandchange",brand)
            
    }, [brand]);

    return (
        <>
            <Tours isLoggedView={false} searchData={searchData}/> 
        </>
    );

}
export default PublicTours;