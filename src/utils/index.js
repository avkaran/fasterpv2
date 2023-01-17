import moment from 'moment';
import React from 'react';
export const currentInstance = { index: 1, name: 'classpro' };

export const businesses = [

  { //0
    key: 'matrimony',
    name: 'Raj Matrimony',
    shortName: 'RAJ',
    apiUrl: 'https://rajmatrimony.com/api/v2_0/',
    dbName: 'rajmatrimony',
    activeModels: ['dashboard', 'members', 'contents',],
    companies: [{ id: '1', name: 'Raj Matrimony', logo: '' }],
    //responsive: { isMobile: true, }
    hasCustomerPortal: true,
  },
  { //1
    key: 'classpro',
    name: 'Test T',
    shortName: 'Test',
    apiUrl: 'https://24stardoctors.com/nermai/api/v3_0/',
    dbName: 'stardoctor_nermai',
    // multilingual: ['en', 'ta', 'ml', 'hi'],
    activeModels: ['dashboard', 'members', 'contents',],
    //cmsContentListType:'table',
    companies: [{ id: '1', name: 'NHBoard', logo: '' }],
    theme: {
      adminTheme: { baseColor: { color: '#00474f', reverseColor: '#fff' } },
      adminMobileTheme: { baseColor: { color: '#00474f', reverseColor: '#fff' } },
    },
    // responsive: { isMobile: true, }
    hasCustomerPortal: false,
  },
  { //2
    key: 'mywatch',
    name: 'Test M',
    shortName: 'Test',
    apiUrl: 'https://rajmatrimony.com/mywatch/api/v3_0/',
    dbName: 'rajmatrimony_watch',
    multilingual: ['en', 'ta', 'ml', 'hi'],
    activeModels: ['dashboard', 'members', 'contents',],
    //cmsContentListType:'table',
    companies: [{ id: '1', name: 'NHBoard', logo: '' }],
    theme: {
      adminTheme: { baseColor: { color: '#00474f', reverseColor: '#fff' } },
      adminMobileTheme: { baseColor: { color: '#00474f', reverseColor: '#fff' } },
    },
    responsive: { isMobile: true, },
    hasCustomerPortal: false,
  },
  { //3
    key: 'tourism',
    name: 'Test T',
    shortName: 'Test',
    apiUrl: 'https://azizatourism.com/api/v3_0/',
    dbName: 'azizatourism',
    // multilingual: ['en', 'ta', 'ml', 'hi'],
    activeModels: ['dashboard', 'members', 'contents',],
    //cmsContentListType:'table',
    companies: [{ id: '1', name: 'NHBoard', logo: '' }],
    theme: {
      adminTheme: { baseColor: { color: '#00474f', reverseColor: '#fff' } },
      adminMobileTheme: { baseColor: { color: '#00474f', reverseColor: '#fff' } },
    },
    //  responsive: { isMobile: true, }
    hasCustomerPortal: false,
  },
  { //4
    key: 'shopy',
    name: 'Test S',
    shortName: 'Test',
    apiUrl: 'https://mobbicare.com/api/v3_0/',
    dbName: 'mobbicare',
    // multilingual: ['en', 'ta', 'ml', 'hi'],
    activeModels: ['dashboard', 'members', 'contents',],
    //cmsContentListType:'table',
    companies: [{ id: '1', name: 'NHBoard', logo: '' }],
    theme: {
      adminTheme: { baseColor: { color: '#00474f', reverseColor: '#fff' } },
      adminMobileTheme: { baseColor: { color: '#00474f', reverseColor: '#fff' } },
    },
    // responsive: { isMobile: true, }
    hasCustomerPortal: false,
  },
  { //5
    key: 'jewel',
    name: 'Test J',
    shortName: 'Test',
    apiUrl: 'https://avkaran.com/aik/api/v3_0/',
    dbName: 'mobbicare',
    // multilingual: ['en', 'ta', 'ml', 'hi'],
    activeModels: ['dashboard', 'members', 'contents',],
    //cmsContentListType:'table',
    companies: [{ id: '1', name: 'NHBoard', logo: '' }],
    theme: {
      adminTheme: { baseColor: { color: '#00474f', reverseColor: '#fff' } },
      adminMobileTheme: { baseColor: { color: '#00474f', reverseColor: '#fff' } },
    },
    // responsive: { isMobile: true, }
    hasCustomerPortal: false,
  },
  { //6
    key: 'estimate',
    name: 'Test E',
    shortName: 'Test',
    apiUrl: 'https://avkaran.com/aik-es/api/v3_0/',
    dbName: 'mobbicare',
    // multilingual: ['en', 'ta', 'ml', 'hi'],
    activeModels: ['dashboard', 'members', 'contents',],
    //cmsContentListType:'table',
    companies: [{ id: '1', name: 'NHBoard', logo: '' }],
    theme: {
      adminTheme: { baseColor: { color: '#00474f', reverseColor: '#fff' } },
      adminMobileTheme: { baseColor: { color: '#00474f', reverseColor: '#fff' } },
    },
    // responsive: { isMobile: true, }
    hasCustomerPortal: false,
  },

]
export const baseUrl = businesses[currentInstance.index].apiUrl;
export const CardFixedTop = ({ title, children }) => {
  return <div className="card card-fixed-top">
    <div className="card-body">
      <div className="d-flex  justify-content-between">
        <div style={{ padding: '5px 0 0 8px' }}><b>{title}</b></div>
        <div>
          {children}
        </div>
      </div>
    </div>
  </div>;
};
export const printDocument = (printId) => {
  var content = document.getElementById(printId);
  var pri = document.getElementById("print_frame").contentWindow;
  pri.document.open();
  pri.document.write(content.innerHTML);
  pri.document.close();
  pri.focus();
  pri.print();
}

/**
  * setLs
  * to store the user inputs into localStorage
**/
export function setLs(key, value) {

  localStorage.setItem(key, value);
};


/**
  * getLs
  * to get the stored values from localStorage
**/
export function getLs(key) {

  return localStorage.getItem(key) || false;
};
export function RemoveLs(key) {

  return localStorage.removeItem(key);
};

export function getAscSortOrder(prop) {
  return function (a, b) {
    if (a[prop] > b[prop]) {
      return 1;
    } else if (a[prop] < b[prop]) {
      return -1;
    }
    return 0;
  }
}

/**
* getDescSortOrder
* to sort an array by particular field 
* @param Property of an array
* @return int
*/
export function getDescSortOrder(prop) {
  return function (a, b) {
    if (a[prop] < b[prop]) {
      return 1;
    } else if (a[prop] > b[prop]) {
      return -1;
    }
    return 0;
  }
}

/**
* removeBothSlash
* to remove the first and last slash from a string
* @param1 $string
* @return String
*/
export function removeBothSlash(str) {
  return str.replace(/^\/|\/$/g, '');
}

/**
* capitalizeFirst
* to capitalize the first letter of the word
* @param1 $str (string)
* @return string
*/
export function capitalizeFirst(str) {
  if (str === '' || str === null || str === ' ') {
    return '';
  }

  str = str.toLowerCase();
  //return str.charAt(0).toUpperCase() + str.slice(1);
  return str.replace(/(?:^|\s)\S/g, function (a) { return a.toUpperCase(); });
}

/**
* upperCase
* to conver the string to upper case
* @param1 $str (string)
* @return string
*/
export function upperCase(str) {
  if (str === '' || str === null || str === ' ' || str.length < 1) return '';
  return str.toString().toUpperCase();
}



/**
* makeUrl
* to convert the string into url
* to remove all the special characters and remove space 
*
* @param1 $str 
* @return String
*/
export function groupByMultiple(array, f) {
  var groups = {};
  array.forEach(function (o) {
    var group = JSON.stringify(f(o));
    groups[group] = groups[group] || [];
    groups[group].push(o);
  });
  return Object.keys(groups).map(function (group) {
    return groups[group];
  });
}

/**
* yesorNo
* to get the value yes or no form the boolean
* @param1 $val (bool) true,false, 1,0
* @param2 $withColor (true,false) default false
* @return String
*/
export function yesorNo(val) {
  if (val === '' || val === null || val === ' ') return 'No';
  if (val === '1' || val === true) return 'Yes';
  return 'No';
}

/**
* isNullOrEmpty
* to check the given value is null or empty
* @param $val
* @return Boolean
*/
export function isNullOrEmpty(val) {
  try {
    if (val === '' || val === null || val === ' ' || isNaN(val)) return false;
    return true;
  } catch (error) {
    console.log(error);
    return true;
  }
}

/**
 * calculateMessageCount
 * to calculate letters count
 * @param1 $textArea
 * @param2 $displayArea
 * @return HTML
 */
export function calculateMsgCount(textAreaId, divId) {
  try {
    const singleSmsLength = 160;
    const ele = document.getElementById(textAreaId);
    const charLength = ele.value.length;
    const msgCount = Math.ceil(charLength / singleSmsLength);
    document.getElementById(divId).innerHTML = `${charLength} / ${msgCount}`;
  } catch (error) {
    console.log(error);
  }
}

/**
 * momentDate
 * to convert a date format using moment
 * @param1 $date
 * @param2 $format
 * @return date
 */
export function momentDate(value, toFormat = 'DD/MMM/YYYY') {
  try {
    if (value === '0000-00-00' || value === '' || value === ' ' || value === null || isNaN(value)) {
      return '';
    }

    // var d = new Date(value).getTime();
    return moment(value).format(toFormat);
  } catch (error) {
    console.log(error);
    return '';
  }
}

/**
* integerKeyPress
* to handle textbox key press event and check whether the input is integer or not
*
* @param EVENT
* @return NULL
*/
export function integerKeyPress(e) {
  if (e.which !== 8 && (e.which < 48 || e.which > 57)) {
    // showAdvice(this, "Integer values only");
    e.preventDefault();
    return false;
  }
}

/**
* decimalKeyPress
* to handle textbox key press event and check whether the input is decimal or not
*
* @param EVENT
* @return NULL
*/
export function decimalKeyPress(e) {
  if (e.which !== 8 && e.which !== 46 && (e.which < 48 || e.which > 57)) {
    // showAdvice(this, "Decimal numbers only");
    e.preventDefault();
    return false;
  }
  if (e.which === 46 && e.target.value.indexOf('.') !== -1) {
    // showAdvice(this, "Only one period allowed in decimal numbers");
    e.preventDefault();
    return false; // only one decimal allowed
  }
}

/**
* lettersOnly
* to handle textbox key press event and check whether the input is alphabet or not
*
* @param EVENT
* @return NULL
*/
export function lettersOnly(e) {
  const inputValue = e.which;
  // allow letters and whitespaces only.
  if (e.which !== 8 && !(inputValue >= 65 && inputValue <= 122) && (inputValue !== 32 && inputValue !== 0)) {
    e.preventDefault();
    return (false);
  }
}


/**
* nameWithDotAndHypen
* to handle textbox key press event and check whether the input is alphabet or not
*
* @param EVENT
* @return NULL
*/
export function nameWithDotAndHypen(e) {
  const inputValue = e.which;
  // allow letters and whitespaces only.
  if (e.which !== 8 && e.which !== 45 && e.which !== 46 && !(inputValue >= 65 && inputValue <= 122) && (inputValue !== 32 && inputValue !== 0)) {
    e.preventDefault();
    return (false);
  }
}


/**
* integerIndMobile
* to handle textbox key press event and check whether the input is integer and less than 10 characters or not
*
* @param EVENT
* @return NULL
*/
export function integerIndMobile(e) {
  const len = e.target.value.length;
  if (len >= 10) {
    e.preventDefault();
    return false;
  }

  if (e.which !== 8 && (e.which < 48 || e.which > 57)) {
    // showAdvice(this, "Integer values only");
    e.preventDefault();
    return false;
  }
}

export function integerAadhar(e) {
  const len = e.target.value.length;
  if (len >= 12) {
    e.preventDefault();
    return false;
  }

  if (e.which !== 10 && (e.which < 48 || e.which > 57)) {
    // showAdvice(this, "Integer values only");
    e.preventDefault();
    return false;
  }
}

export function integerGst(e) {
  const len = e.target.value.length;
  if (len >= 15) {
    e.preventDefault();
    return false;
  }

  if (e.which !== 10 && (e.which < 48 || e.which > 57)) {
    // showAdvice(this, "Integer values only");
    e.preventDefault();
    return false;
  }
}



export function removeExtension(filename) {
  if (filename && filename !== '' && filename !== null && filename.length > 3)
    return filename.split('.').slice(0, -1).join('.');
}


export function calculateAge(dob) {
  try {
    var a = moment();
    var b = moment(moment(dob), 'YYYY');
    var diff = a.diff(b, 'years');
    return diff;
  }
  catch (er) { }
}

export function replaceBulk(str, findArray, replaceArray) {
  var i, regex = [], map = {};
  for (i = 0; i < findArray.length; i++) {
    regex.push(findArray[i].replace(/([-[\]{}()*+?.\\^$|#,])/g, '\\$1'));
    map[findArray[i]] = replaceArray[i];
  }
  regex = regex.join('|');
  str = str.replace(new RegExp(regex, 'g'), function (matched) {
    return map[matched];
  });
  return str;
}
