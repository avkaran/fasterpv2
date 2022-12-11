import React, { useEffect } from 'react';
import { useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import PsContext from '../../../../context';
import { message } from 'antd';
const CustomerCourses = () => {
    const context = useContext(PsContext);
    const [data, setData] = useState([]);
    useEffect(() => {
        loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const loadData = () => {
        var reqData = {
                query_type: 'query', //query_type=insert | update | delete | query
                query: "select *,(select fee from course_fees where status='1' and course_id=c.id and country=(select country from users where id='"+ context.customerUser.id +"')) as country_fee from courses c where status='1' and course_status in ('enroll','view-only')"
            }
        ;

        context.psGlobal.apiRequest(reqData, context.customerUser.mode).then((res, error) => {
            setData(res);
           
        }).catch(err => {
            message.error(err);
            //setLoader(false);
        })
    }
    return (
        <>
            <div class="main-content bg-white right-chat-active">
            
            <div class="middle-sidebar-bottom">
                <div class="middle-sidebar-left">
                    <div class="row">
                        <div class="col-xl-12 col-xxl-12 col-lg-12">
                            <div class="row">
                                {
                                    data.map(item=>{
                                        return <div class="col-lg-4 col-md-6">
                                        <div class="card w-100 border-0 mt-4">
                                            <div class="card-image w-100 p-0 text-center bg-greylight rounded-3 mb-2">
                                                <a href={"/0/customer/courses/view/" + item.id}><img src={item.course_image?context.baseUrl+item.course_image:context.noImg} alt="product" class="w-100 mt-0 mb-0 p-5"/></a>
                                            </div>
                                            <div class="card-body w-100 p-0 text-center">
                                                <h2 class="mt-2 mb-1"><a href="single-product.html" class="text-black fw-700 font-xsss lh-26">{item.course_name}</a></h2>
                                                <h6 class="font-xsss fw-600 text-grey-500 ls-2">$ {item.country_fee || item.default_fee}</h6>
                                            </div>                                
                                        </div>
                                    </div>
                                    })
                                }
                                

                               
                                

                            </div>
                        </div>
                    </div>
                </div>
                 
            </div>            
        </div>
        </>
    );
};

export default CustomerCourses;