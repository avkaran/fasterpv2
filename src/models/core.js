import Axios from 'axios';
import toast from 'react-hot-toast';
import { Select, Radio, message } from 'antd';
/* import crypto from 'crypto-browserify'; */
import CryptoJS from "crypto-js";
import dayjs from 'dayjs'

export const listCollections = async () => {
	const form = new FormData();
	return new Promise((resolve, reject) => {
		let url = `v1/admin/list-collections`;
		Axios.get(url, form)
			.then(function ({ data }) {
				if (data.status !== '1') {
					toast.error(data.message || 'Error');
				}
				resolve(data.data);
			})
			.catch(function (error) {
				reject("Network Error")
			});
	});
}
export const collectionOptions = (collectionData, collectionName, type = "option", excludeItems = []) => {
	const { Option } = Select;
	if (collectionData && collectionData.length > 0) {
		let m = collectionData.find(item => item.name === collectionName)
		if (m) {
			let cData = m.collections.split(",")
			if (excludeItems.length > 0) {
				excludeItems.forEach(obj => {
					var removeIndex = cData.indexOf(obj);
					if (removeIndex > -1) cData.splice(removeIndex, 1)
				})
			}
			if (type === "option")
				return cData.map(item => <Option key={item} value={item} >{item}</Option>)
			else if (type === "radio")
				return cData.map(item => <Radio.Button key={item} value={item}>{item}</Radio.Button>)
		} else {
			if (type === "option")
				return <Option value=''>Not in Database</Option>
			else if (type === "radio")
				return <Radio.Button value=''>Not in Database</Radio.Button>
		}
	}
};
export const getBase64 = (img, callback) => {
	const reader = new FileReader();
	reader.addEventListener('load', () => callback(reader.result));
	reader.readAsDataURL(img);
};


/* export const encrypt = (textToEncrypt) => {
	let encryptionMethod = 'AES-256-CBC';
	let secret = "My32charPasswordAndInitVectorStr"; //must be 32 char length
	let iv = secret.substr(0, 16);
	var encryptor = crypto.createCipheriv(encryptionMethod, secret, iv);
	let encryptedMessage = encryptor.update(textToEncrypt, 'utf8', 'base64') + encryptor.final('base64');
	return encryptedMessage;
}
export const decrypt = (encryptedMessage) => {
	var encryptionMethod = 'AES-256-CBC';
	var secret = "My32charPasswordAndInitVectorStr"; //must be 32 char length
	var iv = secret.substr(0, 16);
	var decryptor = crypto.createDecipheriv(encryptionMethod, secret, iv);
	var decryptedMessage = decryptor.update(encryptedMessage, 'base64', 'utf8') + decryptor.final('utf8');
	return decryptedMessage;
} */

export const encrypt = (textToEncrypt) => {
	const secretKey = CryptoJS.enc.Utf8.parse("My32charPasswordAndInitVectorStr"); // 32-char key
const iv = CryptoJS.enc.Utf8.parse("My32charPasswordAndInit"); // 16-char IV

    const encrypted = CryptoJS.AES.encrypt(textToEncrypt, secretKey, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
    });
    return encrypted.toString(); // Convert to Base64
};

// Decrypt function (AES-256-CBC)
export const decrypt = (encryptedMessage) => {
	const secretKey = CryptoJS.enc.Utf8.parse("My32charPasswordAndInitVectorStr"); // 32-char key
const iv = CryptoJS.enc.Utf8.parse("My32charPasswordAndInit"); // 16-char IV

    const decrypted = CryptoJS.AES.decrypt(encryptedMessage, secretKey, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
    });
    return decrypted.toString(CryptoJS.enc.Utf8);
};

export const getWhereClause = (filterColumns, withWhere = false) => {
	var whereClause = "";
	if (filterColumns) {
		var filterClause = [];
		//propvalue is array use = or in pending code
		if (Array.isArray(filterColumns)) {
			filterClause = filterColumns;
		}
		else {
			Object.entries(filterColumns).forEach(([key, value], index) => {
				if (Array.isArray(filterColumns[key])) {
					if (value && value.length > 0) {
						//remove all empty entries
						let nonEmptyValues = [];
						value.forEach((item, index) => {
							if (item !== '') nonEmptyValues.push(value)
						})
						filterClause.push(key + " IN ('" + nonEmptyValues.join("','") + "')")
					}
				}
				else
					if (value && value !== '') {
						if (key === "name")
							filterClause.push(key + " like '%" + value + "%'")
						else if (key === "mobile_no" || key === "mobile")
							filterClause.push(key + " in ('" + value + "','91" + value + "')")
						else if (key.includes("date"))
							filterClause.push("DATE(" + key + ")='" + value + "'")
						else
							filterClause.push(key + "='" + value + "'")
					}
			})
		}
		if (filterClause.length > 0) {
			if (withWhere)
				whereClause = " WHERE " + filterClause.join(" AND ");
			else
				whereClause = " AND " + filterClause.join(" AND ");
		}
	}

	return whereClause;
}
export const capitalizeFirst = (str) => {
	if (str === '' || str === null || str === ' ') {
		return '';
	}

	str = str.toLowerCase();
	//return str.charAt(0).toUpperCase() + str.slice(1);
	return str.replace(/(?:^|\s)\S/g, function (a) { return a.toUpperCase(); });
}
export const apiRequest = async (reqData, mode, postForm = false) => {

	return new Promise((resolve, reject) => {
		var form = new FormData();
		var url = "";
		if (typeof reqData === 'string' || reqData instanceof String) {

			url = reqData;
		}
		else {

			url = 'v1/admin/db-query';
		}
		if (postForm) {

			for (const [key, value] of postForm) {
				form.append(key, value)
			}
		}
		else {
			form.append('queries', encrypt(JSON.stringify(reqData)));
		}
		if (mode === "dev")
			form.append('mode', "dev");

		Axios.post(url, form).then(res => {
			if (parseInt(res['data'].status) === 1) {
				resolve(res['data'].data);
			}
			else {
				console.log('Api Call Error:', reqData);
				reject(res['data'].message || 'Api Call Error');
			}

		}).catch(err => {
			console.log('Axios Error', err)
			reject("Network Error")
		});;
	});
}
export const addLog = async (logData) => {
	return new Promise((resolve, reject) => {
		logData['log_time'] = dayjs().format('YYYY-MM-DD HH:mm:ss')
		var reqData = {
			query_type: 'insert',
			table: 'logs',
			values: logData
		};
		apiRequest(reqData, "prod").then((res) => {
			resolve(true)
		}).catch(err => {
			reject(err)
		})
	});
}
export const addFinancialTransaction = async (trData) => {
	return new Promise((resolve, reject) => {
		var reqData = {
			query_type: 'insert',
			table: 'acc_transactions',
			values: trData
		};
		apiRequest(reqData, "dev").then((res) => {
			resolve(true)
		}).catch(err => {
			reject(err)
		})
	});
}
export const deleteFinancialTransaction = async (id) => {
	return new Promise((resolve, reject) => {
		var reqData = {
			query_type: 'update',
			table: 'acc_transactions',
			where: { id: id },
			values: { status: 0 }
		};
		apiRequest(reqData, "prod").then((res) => {
			resolve(true)
		}).catch(err => {
			reject(err)
		})
	});
}
export const deleteFinancialTransactionByRef = async (ref_table_column, ref_id, ref_id2 = null) => {
	return new Promise((resolve, reject) => {
		var reqData = {
			query_type: 'update',
			table: 'acc_transactions',
			//where: { ref_table_column: ref_table_column, ref_id: ref_id },
			values: { status: 0 }
		};
		if (ref_id)
			reqData['where'] = { ref_table_column: ref_table_column, ref_id: ref_id };
		else if(ref_id2)
			reqData['where'] = { ref_table_column: ref_table_column, ref_id2: ref_id2 };

		apiRequest(reqData, "prod").then((res) => {
			resolve(true)
		}).catch(err => {
			reject(err)
		})
	});
}
export const sendSms = async (smsData) => {

	return new Promise((resolve, reject) => {
		var form = new FormData();
		var url = 'send-sms';
		form.append('sms_data', encrypt(JSON.stringify(smsData)));
		Axios.post(url, form).then(res => {
			if (parseInt(res['data'].status) === 1) {
				resolve(res['data'].data);
			}
			else {

				reject(res['data'].message || 'Send Sms Error');
			}

		});
	});
}
export const sendWhatsapp = async (whatsappData) => {

	return new Promise((resolve, reject) => {
		var form = new FormData();
		var url = 'send-whatsapp';
		form.append('whatsapp_data', encrypt(JSON.stringify(whatsappData)));
		Axios.post(url, form).then(res => {
			if (parseInt(res['data'].status) === 1) {
				resolve(res['data'].data);
			}
			else {

				reject(res['data'].message || 'Send Whatsapp Error');
			}

		});
	});
}
export const sendEmail = async (emailData) => {

	return new Promise((resolve, reject) => {
		var form = new FormData();
		var url = 'send-email';
		form.append('email_data', encrypt(JSON.stringify(emailData)));
		Axios.post(url, form).then(res => {
			if (parseInt(res['data'].status) === 1) {
				resolve(res['data'].data);
			}
			else {

				reject(res['data'].message || 'Send Email Error');
			}

		}).catch(err => {
			console.log('Axios Error', err)
			reject("Network Error")
		});
	});
}
export const shortenUrl = async (longUrl) => {

	return new Promise((resolve, reject) => {
		var form = new FormData();
		var url = 'tinyurl-create';
		form.append('long_url', longUrl);
		Axios.post(url, form).then(res => {
			if (parseInt(res['data'].status) === 1) {

				var resultJson = JSON.parse(res['data'].data);
				if (resultJson.link)
					resolve(resultJson.link)
				else
					reject('Shorten Url Api Error');

				resolve(res['data'].data);
			}
			else {

				reject(res['data'].message || 'Api Call Error');
			}

		}).catch(err => {
			console.log('Axios Error', err)
			reject("Network Error")
		})
	});
}

export const heightList = [
	{ cm: 122, label: '122cm - 4ft' },
	{ cm: 125, label: '125cm - 4ft 1in' },
	{ cm: 127, label: '127cm - 4ft 2in' },
	{ cm: 130, label: '130cm - 4ft 3in' },
	{ cm: 132, label: '132cm - 4ft 4in' },
	{ cm: 134, label: '134cm - 4ft 5in' },
	{ cm: 137, label: '137cm - 4ft 6in' },
	{ cm: 139, label: '139cm - 4ft 7in' },
	{ cm: 142, label: '142cm - 4ft 8in' },
	{ cm: 144, label: '144cm - 4ft 9in' },
	{ cm: 147, label: '147cm - 4ft 10in' },
	{ cm: 149, label: '149cm - 4ft 11in' },
	{ cm: 152, label: '152cm - 5ft' },
	{ cm: 154, label: '154cm - 5ft 1in' },
	{ cm: 157, label: '157cm - 5ft 2in' },
	{ cm: 160, label: '160cm - 5ft 3in' },
	{ cm: 162, label: '162cm - 5ft 4in' },
	{ cm: 165, label: '165cm - 5ft 5in' },
	{ cm: 167, label: '167cm - 5ft 6in' },
	{ cm: 170, label: '170cm - 5ft 7in' },
	{ cm: 172, label: '172cm - 5ft 8in' },
	{ cm: 175, label: '175cm - 5ft 9in' },
	{ cm: 177, label: '177cm - 5ft 10in' },
	{ cm: 180, label: '180cm - 5ft 11in' },
	{ cm: 182, label: '182cm - 6ft' },
	{ cm: 185, label: '185cm - 6ft 1in' },
	{ cm: 187, label: '187cm - 6ft 2in' },
	{ cm: 190, label: '190cm - 6ft 3in' },
	{ cm: 193, label: '193cm - 6ft 4in' },
	{ cm: 195, label: '195cm - 6ft 5in' },
	{ cm: 198, label: '198cm - 6ft 6in' },
	{ cm: 200, label: '200cm - 6ft 7in' },
	{ cm: 203, label: '203cm - 6ft 8in' },
	{ cm: 205, label: '205cm - 6ft 9in' },
	{ cm: 208, label: '208cm - 6ft 10in' },
	{ cm: 210, label: '210cm - 6ft 11in' },
	{ cm: 213, label: '213cm - 7ft' },
]
export const languages = [
	{ id: "en", englishName: 'English', name: "English" },
	{ id: "ta", englishName: 'Tamil', name: "தமிழ்" },
	{ id: "ml", englishName: 'Malayalam', name: "മലയാളം" },
	{ id: "hi", englishName: 'Hindi', name: "हिन्दी" },
]