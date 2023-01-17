import PsContext from "../../../../../../context";
import React, { useState, useEffect, useContext, useRef } from "react";
import { Form, Row, Col, Input, Button, Icon } from "antd";
import dayjs from "dayjs";
import { heightList } from "../../../../../../models/core";
const ProfileViewPrintSingle = (props) => {
  const context = useContext(PsContext);
  const { item, isContact, business, ...other } = props;
  useEffect(() => {
    //load photos of
    // eslint-disable-next-line react-hooks/exhaustive-deps
    // console.log('test', allData, selMembers)
  }, []);
  const getHeight = (cm) => {
    let d = heightList.find((item) => item.cm == cm);
    return d && d.label;
  };
  const getRaasiChart = (item) => {
    var viewValuesRaasi = Array(12).fill("");
    if (item.raasi_chart) viewValuesRaasi = item.raasi_chart.split("##");
    viewValuesRaasi = viewValuesRaasi.map((obj) => {
      if (obj) {
        var tmpValues = obj.split(",");
        for (var i = 0; i < tmpValues.length; i++) {
          tmpValues[i] = tmpValues[i].substring(0, 2);
        }
        obj = tmpValues.join(",");
      }
      return obj;
    });
    return (
      <table
        border="1"
        style={{ width: "80%", borderCollapse: "collapse", marginLeft: "30px" }}
      >
        <tr>
          <td style={{ width: "25%", height: "50px" }}>
            {viewValuesRaasi[12 - 1]}
          </td>
          <td style={{ width: "25%" }}>{viewValuesRaasi[1 - 1]}</td>
          <td style={{ width: "25%" }}>{viewValuesRaasi[2 - 1]}</td>
          <td style={{ width: "25%" }}>{viewValuesRaasi[3 - 1]}</td>
        </tr>
        <tr>
          <td style={{ height: "50px" }}>{viewValuesRaasi[11 - 1]}</td>
          <td colspan="2" rowspan="2" style={{ textAlign: "center" }}>
            <h4>ராசி</h4>
          </td>
          <td>{viewValuesRaasi[4 - 1]}</td>
        </tr>
        <tr>
          <td style={{ height: "50px" }}>{viewValuesRaasi[10 - 1]}</td>

          <td>{viewValuesRaasi[5 - 1]}</td>
        </tr>
        <tr>
          <td style={{ height: "50px" }}>{viewValuesRaasi[9 - 1]}</td>
          <td>{viewValuesRaasi[8 - 1]}</td>
          <td>{viewValuesRaasi[7 - 1]}</td>
          <td>{viewValuesRaasi[6 - 1]}</td>
        </tr>
      </table>
    );
  };
  const getAmsamChart = (item) => {
    var viewValuesAmsam = Array(12).fill("");
    if (item.amsam_chart) viewValuesAmsam = item.amsam_chart.split("##");
    viewValuesAmsam = viewValuesAmsam.map((obj) => {
      if (obj) {
        var tmpValues = obj.split(",");
        for (var i = 0; i < tmpValues.length; i++) {
          tmpValues[i] = tmpValues[i].substring(0, 2);
        }
        obj = tmpValues.join(",");
      }
      return obj;
    });
    return (
      <table border="1" style={{ width: "80%", borderCollapse: "collapse" }}>
        <tr>
          <td style={{ width: "25%", height: "50px" }}>
            {viewValuesAmsam[12 - 1]}
          </td>
          <td style={{ width: "25%" }}>{viewValuesAmsam[1 - 1]}</td>
          <td style={{ width: "25%" }}>{viewValuesAmsam[2 - 1]}</td>
          <td style={{ width: "25%" }}>{viewValuesAmsam[3 - 1]}</td>
        </tr>
        <tr>
          <td style={{ height: "50px" }}>{viewValuesAmsam[11 - 1]}</td>
          <td colspan="2" rowspan="2" style={{ textAlign: "center" }}>
            <h4>அம்சம்</h4>
          </td>
          <td>{viewValuesAmsam[4 - 1]}</td>
        </tr>
        <tr>
          <td style={{ height: "50px" }}>{viewValuesAmsam[10 - 1]}</td>

          <td>{viewValuesAmsam[5 - 1]}</td>
        </tr>
        <tr>
          <td style={{ height: "50px" }}>{viewValuesAmsam[9 - 1]}</td>
          <td>{viewValuesAmsam[8 - 1]}</td>
          <td>{viewValuesAmsam[7 - 1]}</td>
          <td>{viewValuesAmsam[6 - 1]}</td>
        </tr>
      </table>
    );
  };

  const getMobileNo = (encrypted) => {
    var decrypted = "-";
    try {
      if (encrypted) decrypted = context.psGlobal.decrypt(encrypted);
    } catch (err) {
      // document.getElementById("demo").innerHTML = err.message;
    }
    return decrypted;
  };
  return (
    <>
      {item && (
        <div
          style={{
            borderStyle: "solid",
            borderWidth: "1px",
            height: "97%",
            fontSize: "8pt !important",
            width: "100%",
          }}
        >
          <table width="100%" border="0" cellpadding="0">
            <tr>
              <tr>
                <td
                  colspan="3"
                  style={{
                    color: "#C00",
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  <span style={{ fontSize: "20pt" }}>
                    {business.business_name}
                  </span>
                </td>
              </tr>
              <tr>
                <td
                  colspan="3"
                  style={{
                    color: "#063",
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  <span style={{ fontSize: "14pt" }}>
                    Phone:{business.phone}&nbsp;&nbsp;,&nbsp;
                    {business.alternative_phone_1} &nbsp;&nbsp;&nbsp;Email:
                    {business.email_id}
                  </span>
                </td>
              </tr>
              <tr>
                <td
                  colspan="3"
                  style={{
                    color: "#000",
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  <span style={{ fontSize: "10pt" }}>
                    {business.business_address}
                  </span>
                </td>
              </tr>
              <tr>
                <td colspan="3">
                  <strong>
                    பதிவு எண் : {item.member_id} &nbsp;EMP :{" "}
                    {item.member_created_ref_id} &nbsp;Amount :{" "}
                    {item.paid_amount}{" "}
                    <span style={{ float: "right" }}>
                      பதிவு தேதி :{" "}
                      {dayjs(item.created_date).format("DD/MM/YYYY h:mm a")}{" "}
                    </span>
                  </strong>
                  <hr />
                </td>
              </tr>
            </tr>
          </table>
          <table
            style={{
              borderCollapse: "collapse",
              width: "100%",
              border: "1px solid black",
            }}
          >
            <tr>
              <td>
                பெயர்
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:
                {item.name}
                {item.education_detail.substring(0, 3)}
              </td>
              <td rowspan="9">
                <img
                  src={
                    item.photo
                      ? context.baseUrl + item.photo
                      : item.gender === "Male"
                      ? context.noMale
                      : context.noFemale
                  }
                  alt={item.member_id}
                  style={{ maxHeight: "300px", maxWidth: "150px" }}
                />
              </td>

              <td
                rowspan="9"
                style={{
                  textAlign: "center",
                  width: "40%",
                }}
              >
                {getRaasiChart(item)}
              </td>
            </tr>
            <tr>
              <td>
                {" "}
                வயது
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:
                {item.age}
              </td>
            </tr>
            <tr>
              <td>
                தந்தை
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:
                {item.father_name}
              </td>
            </tr>
            <tr>
              <td>
                தாயார்
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:
                {item.mother_name}
              </td>
            </tr>
            <tr>
              <td>
                ராசி
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:
                {item.raasi}
              </td>
            </tr>
            <tr>
              <td> நட்சத்திரம்&nbsp;&nbsp;&nbsp;:{item.star}</td>
            </tr>
            <tr>
              <td>
                உணவு &nbsp;
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:
                {item.food}
              </td>
            </tr>
            <tr>
              <td>
                முகவரி
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:
                {item.district}-{item.pincode}
              </td>
            </tr>
            <tr>
              <td>தொடர்புக்கு :{getMobileNo(item.mobile_no)}</td>
            </tr>
            {/*  <tr>
              <td>திசை இருப்பு :{item.dasa}</td>
            </tr> */}
          </table>
        </div>
      )}
    </>
  );
};
export default ProfileViewPrintSingle;
