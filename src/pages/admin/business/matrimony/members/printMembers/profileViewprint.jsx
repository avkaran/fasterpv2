import PsContext from '../../../../../../context'
import React, { useState, useEffect, useContext, useRef } from 'react';
import { Row, Col, message, Spin } from 'antd';
import dayjs from 'dayjs'
import { heightList } from '../../../../../../models/core';
import ProfileViewPrintSingle from './profileViewPrintSingle';
const ProfileViewPrint = (props) => {
    const context = useContext(PsContext);
    const { allData, selMembers, memberData, business, language, isContact, ...other } = props;
    useEffect(() => {
        //load photos of
        // eslint-disable-next-line react-hooks/exhaustive-deps
       // console.log('test', allData, selMembers)
    }, []);
    const getHeight = (cm) => {
        let d = heightList.find((item) => item.cm == cm);
        return d && d.label;
    }
    const getRaasiChart = (item) => {
        var viewValuesRaasi = Array(12).fill('');
        if (item.raasi_chart)
            viewValuesRaasi = item.raasi_chart.split("##");
        viewValuesRaasi = viewValuesRaasi.map(obj => {
            if (obj) {
                var tmpValues = obj.split(",")
                for (var i = 0; i < tmpValues.length; i++) {
                    tmpValues[i]=tmpValues[i].substring(0, 2);
                   
                }
                obj =tmpValues.join(",")
            }
            return obj;
        })
        return <table border="1" style={{ width: '80%', borderCollapse: 'collapse', marginLeft: '30px' }}>
            <tr>
                <td style={{ width: '25%', height: '50px' }}>{viewValuesRaasi[12 - 1]}</td>
                <td style={{ width: '25%' }}>{viewValuesRaasi[1 - 1]}</td>
                <td style={{ width: '25%' }}>{viewValuesRaasi[2 - 1]}</td>
                <td style={{ width: '25%' }}>{viewValuesRaasi[3 - 1]}</td>
            </tr>
            <tr>
                <td style={{ height: '50px' }}>{viewValuesRaasi[11 - 1]}</td>
                <td colspan="2" rowspan="2" style={{ textAlign: 'center' }}><h4>ராசி</h4></td>
                <td>{viewValuesRaasi[4 - 1]}</td>
            </tr>
            <tr>
                <td style={{ height: '50px' }}>{viewValuesRaasi[10 - 1]}</td>

                <td>{viewValuesRaasi[5 - 1]}</td>
            </tr>
            <tr>
                <td style={{ height: '50px' }}>{viewValuesRaasi[9 - 1]}</td>
                <td>{viewValuesRaasi[8 - 1]}</td>
                <td>{viewValuesRaasi[7 - 1]}</td>
                <td>{viewValuesRaasi[6 - 1]}</td>
            </tr>
        </table>

    }
    const getAmsamChart = (item) => {
        var viewValuesAmsam = Array(12).fill('');
        if (item.amsam_chart)
            viewValuesAmsam = item.amsam_chart.split("##");
        viewValuesAmsam = viewValuesAmsam.map(obj => {
            if (obj) {
                var tmpValues = obj.split(",")
                for (var i = 0; i < tmpValues.length; i++) {
                    tmpValues[i]=tmpValues[i].substring(0, 2);
                   
                }
                obj =tmpValues.join(",")
            }
            return obj;
        })
        return <table border="1" style={{ width: '80%', borderCollapse: 'collapse' }}>
            <tr>
                <td style={{ width: '25%', height: '50px' }}>{viewValuesAmsam[12 - 1]}</td>
                <td style={{ width: '25%' }}>{viewValuesAmsam[1 - 1]}</td>
                <td style={{ width: '25%' }}>{viewValuesAmsam[2 - 1]}</td>
                <td style={{ width: '25%' }}>{viewValuesAmsam[3 - 1]}</td>
            </tr>
            <tr>
                <td style={{ height: '50px' }}>{viewValuesAmsam[11 - 1]}</td>
                <td colspan="2" rowspan="2" style={{ textAlign: 'center' }}><h4>அம்சம்</h4></td>
                <td>{viewValuesAmsam[4 - 1]}</td>
            </tr>
            <tr>
                <td style={{ height: '50px' }}>{viewValuesAmsam[10 - 1]}</td>

                <td>{viewValuesAmsam[5 - 1]}</td>
            </tr>
            <tr>
                <td style={{ height: '50px' }}>{viewValuesAmsam[9 - 1]}</td>
                <td>{viewValuesAmsam[8 - 1]}</td>
                <td>{viewValuesAmsam[7 - 1]}</td>
                <td>{viewValuesAmsam[6 - 1]}</td>
            </tr>
        </table>
    }
    const getMemberData = () => {
        var memberDataNew = [];
        selMembers.forEach(curId => {
            var curMember = allData.find(member => member.id === curId);
            if (curMember)
                memberDataNew.push(curMember);
        })
        return memberDataNew;
    }
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
    return (
        <> <div style={{ display: 'none' }}>
            <div id="profile-view" style={{ fontSize: '8pt !important' }}>
                {
                    business && allData && selMembers.length > 0 && getMemberData().map(item => {
                        return <>
                            
                            <ProfileViewPrintSingle key={item.id} item={item} isContact={isContact} business={business}/>
                            <p style={{ pageBreakAfter: 'always' }}></p></>
                    })
                }



            </div>
        </div>

        </>
    );

}
export default ProfileViewPrint;