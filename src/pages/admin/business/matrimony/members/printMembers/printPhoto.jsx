import PsContext from "../../../../../../context";
import React, { useState, useEffect, useContext, useRef } from "react";
import { Row, Col, message, Spin } from "antd";
import dayjs from "dayjs";
import { heightList } from "../../../../../../models/core";
const PrintPhoto = (props) => {
  const context = useContext(PsContext);
  const { allData, selMembers, memberData, business, language, isContact, ...other } = props;
  useEffect(() => {
    //load photos of
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
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
        <div id="print-photo" style={{ fontSize: "9pt !important" }}>
          <table width="100%" border="1" cellpadding="5px" borderCollapse="collapse">
           
            { business && allData && selMembers.length > 0 && getMemberData().map((item, index) => {
                return (
                  <>
                    
            <Row>
         <h3 className="text-center" style={{marginTop:'3%'}}>{item.member_id}</h3>
            </Row><br></br>
                <Row>
                <br></br>
                <br></br>
                <img src={item.photo?context.baseUrl + item.photo:item.gender==='Male'?context.noMale:context.noFemale} alt={item.member_id} style={{ maxHeight: '270px' ,marginTop:'4%',marginBottom:'9%'}} />
                </Row>
                <br/>        <br/>
               
                  </>
                );
              })}
          </table>
        </div>
      </div>
    </>
  );
};
export default PrintPhoto;
