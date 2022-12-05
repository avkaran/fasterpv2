import React, { useEffect } from 'react';
import { Row, Col } from 'antd';
import { Breadcrumb, Layout } from 'antd';
import { HomeOutlined, UserOutlined } from '@ant-design/icons';

const Blank = (props) => {
    const { Content } = Layout;
    useEffect(() => {
      
    }, []);
    return (
        <>

<ResponsiveLayout
         
         userId={props.match.params.userId}
         customHeader={null}
         bottomMenues={null}
         breadcrumbs={[
            {name:'Application List',link:null},
            {name:'Application',link:null},
        ]}
        >
               
                <Row gutter={16}>
                    <Col className="gutter-row" span={6}>
                       
                    </Col>
                    <Col className="gutter-row" span={18}>
                       
                    </Col>
                </Row>

            </ResponsiveLayout>

        </>
    );

}
export default Blank;