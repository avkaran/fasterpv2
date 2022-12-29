import PsContext from "../../../../../../context";
import React, { useState, useEffect, useContext, useRef } from "react";
import { Row, Col, message, Spin } from "antd";
import dayjs from "dayjs";
import { heightList } from "../../../../../../models/core";
const ShortLinePrint = (props) => {
  const context = useContext(PsContext);
  const { allData, selMembers, memberData, business, language, isContact, isPhoto, isAddress, ...other } = props;
  useEffect(() => {
    //load photos of
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const getMobileNo = (encrypted) => {
    var decrypted = '-';
    try {
      if (encrypted)
        decrypted = context.psGlobal.decrypt(encrypted);
    }
    catch (err) {
      // document.getElementById("demo").innerHTML = err.message;
    }
    return decrypted;

  }
  const getMemberData = () => {
    var memberDataNew = [];
    selMembers.forEach(curId => {
      var curMember = allData.find(member => member.id === curId);
      if (curMember)
      memberDataNew.push(curMember);
    })
    // setPrintData(memberData);
    return memberDataNew;
  }
  const cellStyle={ borderCollapse:"collapse",border:'1px solid black'}
  return (
    <>
      <div style={{ display: "none" }}>
        <div id="short-line" style={{ fontSize: "9pt !important" }}>
          <table width="100%"  cellpadding="5px" style={{border:'1px solid black',borderCollapse:"collapse"}}  >
            <tr>
              <th style={cellStyle}>S.No</th>
              <th style={cellStyle}>Profile Id</th>
             
              <th style={cellStyle}><img src={context.baseUrl+context.noFemale} style={{width:'10px'}} /></th>
              <th style={cellStyle}>Name<br/>Father Name</th>
              <th style={cellStyle}>Edu<br/>Age</th>
              <th style={cellStyle}>Job<br/>Income(PM)</th>
              <th style={cellStyle}>Star<br/>Rassi</th>
              <th style={cellStyle}>Taluk<br/>District</th>
              {isContact && (<th style={cellStyle}>Mobile</th>)}
            </tr>
            {business && allData && selMembers.length > 0 && getMemberData().map((item, index) => {
              return (
                <>
                  <tr>
                    <td style={cellStyle}>{index + 1}</td>
                    <td style={cellStyle}> {item.member_id}<br/>{item.paid_amount}</td>
                    <td style={cellStyle}> {parseInt(item.is_photo_updated) === 1 ? 'Yes' : 'No'} </td>
                    
                    <td style={cellStyle}>{item.name && item.name.substr(0, 15)} <br/>{item.father_name && item.father_name.substr(0, 15)}
                    </td>
                    <td style={cellStyle}>
                      {item.course_name}<br/>{item.age}
                    </td>

                    <td  style={cellStyle}>{item.job_name}<br/>
                      {parseFloat(item.job_annual_income) > 0
                        ? (parseFloat(item.job_annual_income) / 12).toFixed(2)
                        : "NA"}
                    </td>
                    <td style={cellStyle}>
                      {item.star}<br/>{item.raasi}
                    </td>
                    <td style={cellStyle}>
                      {item.taluk}<br/>{item.district}
                    </td>
                    {isContact && (<td style={cellStyle}><strong>{getMobileNo(item.mobile_no)}<br/>{getMobileNo(item.mobile_alt_no_1)}</strong></td>)}
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
