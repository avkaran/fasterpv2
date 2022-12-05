import React, { useState, useContext, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { message, Skeleton, Divider, Card, Spin, Checkbox, Row, Col } from 'antd';
import { cyan } from '@ant-design/colors';
import PsContext from '../context'
import axios from 'axios';
import InfiniteScroll from 'react-infinite-scroll-component';
const AvatarInfiniteList = forwardRef((props, ref) => {
    const context = useContext(PsContext);
    const { countQuery, listQuery, renderItem, recordsPerRequestOrPage, encryptFields, refresh, userId, listHeading, isCheckboxList, ...other } = props;
    const [data, setData] = useState([]);
    const [ids, setIds] = useState([])
    const [loading, setLoading] = useState(false);
    const currentTotalRecords = useRef(0);
    const currentFetchedRecords = useRef(0)
    const hasMoreData = useRef(false);
    const [initLoading, setInitLoading] = useState(false);


    useEffect(() => {
        resetResult();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [refresh]);

    useImperativeHandle(ref, () => ({
        getTotalRecords: () =>{
            return currentTotalRecords.current;
        }

    }));
    const loadMoreData = () => {
        if (loading) {
            return;
        }
        setLoading(true);

        var form = new FormData();
        var reqData = { //if array of queries pass [] outside
            query_type: 'query',
            query: listQuery + " LIMIT " + currentFetchedRecords.current + "," + recordsPerRequestOrPage,
            // table:'test',
            // where:{id:'1'},
            //values:{name:'senthil',age:'13'}
            encrypt: encryptFields

        };
        form.append('queries', context.psGlobal.encrypt(JSON.stringify(reqData)))
        form.append('mode', 'dev');
        axios.post('v1/admin/db-query', form).then(res => {
            if (res['data'].status === '1') {

                setData([...data, ...res['data'].data]);
                //ids in a separate state for checkbox purpose
                var currentIds = [];
                res['data'].data.forEach(item => { currentIds.push(item.id) });
                console.log('ids', currentIds)
                setIds(...ids, ...currentIds);

                currentFetchedRecords.current = currentFetchedRecords.current + res['data'].data.length;
                if (currentTotalRecords.current > currentFetchedRecords.current)
                    hasMoreData.current = true;


                if (currentFetchedRecords.current < recordsPerRequestOrPage)
                    hasMoreData.current = false;


                setLoading(false);
                setInitLoading(false);

            }
            else {

                setLoading(false);

            }

        });

    };
    const resetResult = () => {
        setLoading(true);
        setInitLoading(true);
        //reset records
        var form = new FormData();
        var reqData = { //if array of queries pass [] outside
            query_type: 'query',
            query: countQuery,
            // table:'test',
            // where:{id:'1'},
            //values:{name:'senthil',age:'13'}

        };
        form.append('queries', context.psGlobal.encrypt(JSON.stringify(reqData)))
        axios.post('v1/admin/db-query', form).then(res => {
            if (res['data'].status === '1') {

                currentTotalRecords.current = res['data'].data[0].count;
                currentFetchedRecords.current = 0;
                data.length = 0
                loadMoreData()
            }
            else {

                message.error("Error")

            }

        });

    }
    return (
        <><Spin spinning={initLoading}>
            <Card
                bodyStyle={{ padding: "8px", fontWeight: 'bold', fontSize: '18px', color: cyan[7] }}
                style={{
                    margin: "0px",
                    border: '1px solid #d9d9d9',
                    borderRadius: '2px',

                    //borderRadius: "20px",
                }}


            > <Checkbox />
                {listHeading} ({currentTotalRecords.current})

                {/*  <MyButton style={{ float: 'right' }} href={"#" + props.match.params.userId + "/admin/members/add-member"}> <i class="fa-solid fa-plus pe-2"></i> Add</MyButton> */}
            </Card>
            <InfiniteScroll
                dataLength={currentFetchedRecords.current}
                next={loadMoreData}
                hasMore={hasMoreData.current}
                //hasMore={data.length < 50}
                loader={
                    <Skeleton
                        avatar={{ size: 100 }}
                        title
                        paragraph={{
                            rows: 1,
                        }}
                        active
                    />
                }
                endMessage={<Divider plain>It is all, nothing more 🤐</Divider>}
                //scrollableTarget="scrollableDiv"
                {...other}
            >

                {
                    data.map((item, index) => {
                        if (isCheckboxList)
                            return (<Row style={{background: '#fff'}}><Col style={{padding:'5px 5px 5px 5px',textAlign:"center"}}><Checkbox key={item.id} /></Col><Col>{renderItem(item, index)}</Col></Row>)
                        else
                            return renderItem(item, index)
                    })
                }


            </InfiniteScroll></Spin></>
    );
})
export {
    AvatarInfiniteList,
} 