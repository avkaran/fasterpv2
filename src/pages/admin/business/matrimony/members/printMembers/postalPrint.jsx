import PsContext from "../../../../../../context";
import React, { useState, useEffect, useContext, useRef } from "react";
import { Row, Col, message, Spin } from "antd";
import moment from "moment";
import { heightList } from "../../../../../../models/core";
const PostalPrint = (props) => {
  const context = useContext(PsContext);
  const { memberData, business, language, isContact, ...other } = props;
  useEffect(() => {
    //load photos of
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  
  const getAddressPrintData = (mData) => {
    var rows = [];
    for (var i = 0; i < mData.length / 2; i += 2) {
      var item = mData[i];
      var itemTwo = i + 1 < mData.length ? mData[i + 1] : {};
      rows.push(
        <tr>
          <td>{getAddress(item)}</td>
          <td>{getAddress(itemTwo)}</td>
        </tr>
      );
    }
    return rows;
  };
  const getAddress = (item) => {
    if (Object.entries(item).length > 0) {
      return (
        <>
          <div
            style={{
              float: "left",
              width: "80%",
              padding: "10px",
              height: "200px",
              borderStyle: "solid",
            }}
          >
            <p>{item.name}</p>
            <p>
              {item.door_no}, {item.street} , {item.area} , {item.taluk} ,
              {item.district},{item.state},{item.landmark}, Pin-
              {item.pincode}
            </p>
            <p>Mobile Number:{context.psGlobal.decrypt(item.mobile_no)}</p>
          </div>
        </>
      );
    } else return "";
  };
  return (
    <>
      <div style={{ display: "none" }}>
        <div id="postal" style={{ fontSize: "12pt !important" }}>
          <table width="100%" border="0" cellpadding="0">
            {business &&
              memberData &&
              memberData.length > 0 &&
              getAddressPrintData(memberData)}
          </table>
        </div>
      </div>
    </>
  );
};
export default PostalPrint;
