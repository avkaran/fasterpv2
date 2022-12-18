import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import PsContext from "../../../context";
import dayjs from "dayjs";
import { Breadcrumb, Layout, Spin, Card, Tag, Modal, Button, Row, Col } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserXmark } from "@fortawesome/free-solid-svg-icons";
import { green, blue, red, cyan, grey } from '@ant-design/colors';
const PermissionError = (props) => {
  const context = useContext(PsContext);
  const { Content } = Layout;
  const navigate = useNavigate();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <><Content
    className="site-layout-background"
    style={{
      padding: '5px 24px 0px 24px',
      margin: 0

    }}
  >
    <Breadcrumb style={{ margin: '0', padding: '8px 0px 8px 0px' }}>
      <Breadcrumb.Item href="">
        <HomeOutlined />
      </Breadcrumb.Item>
      <Breadcrumb.Item >
      </Breadcrumb.Item>
      <Breadcrumb.Item>List SmsTemplate</Breadcrumb.Item>
    </Breadcrumb>
    <Card title="No Permission">
      <Row align='middle' gutter={32}>
        <Col className='gutter-row' xs={24} xl={3}>
          <FontAwesomeIcon icon={faUserXmark}  style={{fontSize:'100px',color:red[7]}}/>
        </Col>
        <Col className='gutter-row' xs={24} xl={21} >
        No Permission to View this Page/Malfunction detected,Contact System Administrator.
        </Col>
      </Row>

     
    </Card>
  </Content></>;
};
export default PermissionError;
