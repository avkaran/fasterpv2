import PsContext from "../../../../../../context";
import React, { useState, useEffect, useContext, useRef } from "react";
import { Row, Col, message, Spin } from "antd";
import moment from "moment";
import { heightList } from "../../../../../../models/core";
const ShortLinePrint = (props) => {
  const context = useContext(PsContext);
  const { memberData, business, language, isContact, isPhoto,isAddress,...other } = props;
  useEffect(() => {
    //load photos of
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

 
  return (
    <>
      <div style={{ display: "none" }}>
        <div id="short-line" style={{ fontSize: "9pt !important" }}>
          <table width="100%" border="1" cellpadding="5px" borderCollapse="collapse">
            <tr>
              <th >S.No</th>
              <th>Profile Id</th>
              <th>Amount</th>
              {isContact &&( <th>Photo</th>)}
              <th>Name/Father Name</th>
              <th>Education/Age</th>
              <th>Job/Income</th>
              <th>Star/Rassi</th>
              {isAddress && (<th>Taluk/District</th>)}
              {isContact && (<th>Mobile Number</th>)}
            </tr>
            {business &&
              memberData &&
              memberData.length > 0 &&
              memberData.map((item, index) => {
                return (
                  <>
                    <tr>
                      <td>{index + 1}</td>
                      <td> {item.member_id}</td>
                      <td> {item.paid_amount}</td>
                      {isPhoto && (  <td>  <img src={item.photo?context.baseUrl + item.photo:item.gender==='Male'?context.noMale:context.noFemale} alt={item.member_id} style={{ maxHeight: '270px' }} /></td>)}
                      <td>{item.name} / {item.father_name}
                      </td>
                      <td>
                        {item.course_name},{item.education_detail},{item.age}
                      </td>
                     
                      <td>{item.job_name},
                        {parseFloat(item.annual_income) > 0
                          ? (parseFloat(item.annual_income) / 12).toFixed(2)
                          : "NA"}
                        /-&nbsp;
                      </td>
                      <td>{item.raasi}</td>
                      {isAddress && ( <td>
                        {item.taluk},{item.district}
                      </td>)}
                    {isContact && ( <td>{context.psGlobal.decrypt(item.mobile_no)}</td>)} 
                    </tr>
                  </>
                );
              })}
          </table>
        </div>
      </div>
    </>
  );
};
export default ShortLinePrint;
