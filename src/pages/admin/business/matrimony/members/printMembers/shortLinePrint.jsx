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
  return (
    <>
      <div style={{ display: "none" }}>
        <div id="short-line" style={{ fontSize: "9pt !important" }}>
          <table width="100%" border="1" cellpadding="5px" borderCollapse="collapse">
            <tr>
              <th >S.No</th>
              <th>Profile Id</th>
              <th>Amount</th>
              <th>Photo</th>
              <th>Name/Father Name</th>
              <th>Education/Age</th>
              <th>Job/Income(PM)</th>
              <th>Star/Rassi</th>
              <th>Taluk/District</th>
              {isContact && (<th>Mobile</th>)}
            </tr>
            {business && allData && selMembers.length > 0 && getMemberData().map((item, index) => {
              return (
                <>
                  <tr>
                    <td>{index + 1}</td>
                    <td> {item.member_id}</td>
                    <td> {item.paid_amount}</td>
                    <td> {parseInt(item.is_photo_updated) === 1 ? 'Yes' : 'No'}</td>
                    <td>{item.name} / {item.father_name}
                    </td>
                    <td>
                      {item.course_name},{item.education_detail},{item.age}
                    </td>

                    <td>{item.job_name},
                      {parseFloat(item.job_annual_income) > 0
                        ? (parseFloat(item.job_annual_income) / 12).toFixed(2)
                        : "NA"}
                      /-&nbsp;
                    </td>
                    <td>
                      {item.star},{item.raasi}
                    </td>
                    <td>
                      {item.taluk},{item.district}
                    </td>
                    {isContact && (<td>{getMobileNo(item.mobile_no)}</td>)}
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
