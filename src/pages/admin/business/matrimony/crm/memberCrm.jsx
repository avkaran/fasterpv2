import React, { useState, useEffect, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Row, Col, message, Space } from "antd";
import { MyButton } from "../../../../../comp";
import { Breadcrumb, Layout, Card, Tag, Modal, Button } from "antd";
import { HomeOutlined } from "@ant-design/icons";
import PsContext from "../../../../../context";
import {
    PaginatedTable,
    FormItem,
} from "../../../../../comp"
import { green, red, cyan } from "@ant-design/colors";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import moment from "moment";
import { capitalizeFirst, printDocument } from "../../../../../utils";
import { Form, DatePicker, Select } from "antd";
import {
    faTrash,
    faClose,
    faSearch,
    faPrint,
} from "@fortawesome/free-solid-svg-icons";
import CRMList from "../../../crm/crmList";

const MemberCRM = (props) => {
    const context = useContext(PsContext);
    const { Content } = Layout;
    useEffect(() => {
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <Content
                className="site-layout-background"
                style={{
                    padding: "5px 24px 0px 24px",
                    margin: 0,
                }}
            >
                <Breadcrumb style={{ margin: "0", padding: "8px 0px 8px 0px" }}>
                    <Breadcrumb.Item href="">
                        <HomeOutlined />
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        <span>CRM</span>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>List CRM</Breadcrumb.Item>
                </Breadcrumb>
                <CRMList  userId={props.match.params.userId}/>
            </Content>
        </>
    )
}
export default MemberCRM;
