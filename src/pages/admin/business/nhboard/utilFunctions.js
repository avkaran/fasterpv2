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
  export function pincode(e) {
    const len = e.target.value.length;
    if (len >= 6) {
      e.preventDefault();
      return false;
    }
  
    if (e.which !== 8 && (e.which < 48 || e.which > 57)) {
      // showAdvice(this, "Integer values only");
      e.preventDefault();
      return false;
    }
  }