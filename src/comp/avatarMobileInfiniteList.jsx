import React, { useState, useContext, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { message, Skeleton, Divider, Card, Spin, Checkbox, Row, Col } from 'antd';
import { cyan } from '@ant-design/colors';
import PsContext from '../context'
import axios from 'axios';
import InfiniteScroll from 'react-infinite-scroll-component';
import { List as MList } from 'antd-mobile'
const AvatarMobileInfiniteList = forwardRef((props, ref) => {
    const context = useContext(PsContext);
    const { countQuery, listQuery, renderItem, recordsPerRequestOrPage, refresh, userId, header, ...other } = props;
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const currentTotalRecords = useRef(0);
    const currentFetchedRecords = useRef(0)
    const hasMoreData = useRef(false);
    const [initLoading, setInitLoading] = useState(true);

    useEffect(() => {
        resetResult();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [refresh]);

    useImperativeHandle(ref, () => ({
        getTotalRecords: () => {
            return currentTotalRecords.current;
        }

    }));
    const loadMoreData = () => {
        if (loading) {
            return;
        }
        setLoading(true);
        var reqData = { //if array of queries pass [] outside
            query_type: 'query',
            query: listQuery + " LIMIT " + currentFetchedRecords.current + "," + recordsPerRequestOrPage,

        };
        context.psGlobal.apiRequest(reqData, context.adminUser(userId).mode).then((res, error) => {

            setData([...data, ...res]);
            currentFetchedRecords.current = currentFetchedRecords.current + res.length;
            if (currentTotalRecords.current > currentFetchedRecords.current)
                hasMoreData.current = true;


            if (currentFetchedRecords.current < recordsPerRequestOrPage)
                hasMoreData.current = false;
            if (res.length <= 0)
                hasMoreData.current = false;
            setLoading(false);
            setInitLoading(false);
        })

    };
    const resetResult = () => {
        setLoading(true);
        setInitLoading(true);
        var reqData = { //if array of queries pass [] outside
            query_type: 'query',
            query: countQuery,
            // table:'test',
            // where:{id:'1'},
            //values:{name:'senthil',age:'13'}

        };
        context.psGlobal.apiRequest(reqData, context.adminUser(userId).mode).then((res, error) => {


            currentTotalRecords.current = parseInt(res[0].count);
            currentFetchedRecords.current = 0;
            data.length = 0
            loadMoreData();

        });

    }
    return (
        <><Spin spinning={initLoading}>
            <InfiniteScroll
                dataLength={currentFetchedRecords.current}
                next={loadMoreData}
                hasMore={hasMoreData.current}
                //hasMore={data.length < 50}
                loader={
                    <Skeleton
                        avatar={{ size: 40 }}
                        title
                        /*  paragraph={{
                             rows: 1,
                         }} */
                        active
                    />
                }
                endMessage={<Divider plain>It is all, nothing more 🤐</Divider>}
                //scrollableTarget="scrollableDiv"
                {...other}
            >
                <MList header={<span>{currentTotalRecords.current} {header} </span>}>
                    {
                        data.map((item, index) => {

                            return renderItem(item, index)
                        })
                    }

                </MList>
            </InfiniteScroll></Spin></>
    );
})
export {
    AvatarMobileInfiniteList,
} 