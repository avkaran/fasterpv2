import { apiRequest } from "../../../../../models/core";
import dayjs from 'dayjs';
export const getPaymentInfo = async (id) => {

    return new Promise((resolve, reject) => {
        var reqData = {
            query_type: 'query',
            query: "select * from orders where member_auto_id=" + id + " and status=1 and order_status='Paid' and is_current_plan=1"
        }

        apiRequest(reqData, "prod").then((res) => {
            var paymentInfo = {
                id: 0,
                status: 'Unpaid',
                totalCredits: 0,
                availableCredits: 0,
                orderData: null,


            }
            if (res.length > 0) {
                var expiryDate = dayjs(res[0].expiry_date);
                if (dayjs() > expiryDate){
                    paymentInfo.status = 'Expired';
                    paymentInfo.id = res[0].id;
                }  
                else {
                    paymentInfo.id = res[0].id;
                    paymentInfo.status = 'Paid';
                    paymentInfo.totalCredits = parseInt(res[0].consume_credits);
                    paymentInfo.availableCredits = parseInt(res[0].consume_credits) - parseInt(res[0].used_credits);
                }
                paymentInfo.orderData = res[0];
            }
            resolve(paymentInfo)

        }).catch(err => {
            reject(err)
        })
    });
}
export const getUserAction = async (id, toId, action) => {

    return new Promise((resolve, reject) => {


        var reqData = {
            query_type: 'query',
            query: "select * from member_actions where member_auto_id='" + id + "' and to_member_auto_id='" + toId + "' and action='" + action + "' order by action_date desc"
        }

        apiRequest(reqData, "prod").then((res) => {
            var actionInfo = {
                isActionDone: false,
                lastActionDate: null,
                actionInfo: '',
            }
            if (res.length > 0) {

                actionInfo.isActionDone = true;
                actionInfo.lastActionDate = dayjs(res[0].action_date);
                actionInfo.actionInfo = res[0].action_info;

            }
            resolve(actionInfo)
        }).catch(err => {
            reject(err)
        })
    });
}
export const getResellerBalance = async (resellerType,resellerId) => {

    return new Promise((resolve, reject) => {
        var reqData = {
            query_type: 'query',
            query: "select coalesce(sum(credit)-sum(debit),0) as balance from fr_br_transactions where user_type='" + resellerType + "' and user_id='" + resellerId + "' and transaction_status='Paid' and status=1"
        }

        apiRequest(reqData, "prod").then((res) => {
            resolve(res[0].balance)
        }).catch(err => {
            reject(err)
        })
    });
}