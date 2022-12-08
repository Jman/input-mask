const regExpChar = /[\\^$.*+?()[\]{}|]/g;
const hasRegExpChar = RegExp(regExpChar.source);

function escapeRegExp(str) {
  return str && hasRegExpChar.test(str)
    ? str.replace(regExpChar, '\\$&')
    : str || '';
}

function isControlKey({ code, key, altKey, metaKey, ctrlKey }) {
  if (['Backspace', 'Delete'].includes(key)) {
    return false;
  }
  return altKey || metaKey || ctrlKey || code === key;
}

function removePlaceholders(str) {
  return str.replace(/_/g, '');
}

function getSeparator(str) {
  const separators = [...new Set(str.replace(/\w/g, '').split(''))];
  const escapedSeparators = separators.map(escapeRegExp);
  return new RegExp(escapedSeparators.join('|'), 'g');
}

function convertDate(str, placeholder) {
  const { day, month, year } = splitDate(str, placeholder);
  return new Date(year, month - 1, day);
}

function validateDate(str, placeholder) {
  if (str.indexOf('_') !== -1) {
    return false;
  }
  const date = convertDate(str, placeholder);
  const { day } = splitDate(str, placeholder);
  return !isNaN(date.valueOf()) && parseInt(day, 10) === date.getDate();
}

function validateMonth(month, day, year) {
  const value = month ? parseInt(month, 10) : 0;
  if (month.length < 2) {
    return value <= 1;
  } else if (day) {
    const monthIndex = new Date(
      year.length === 4 ? year : '2000',
      month - 1,
      day
    ).getMonth();
    return monthIndex === month - 1;
  } else {
    return value <= 12 && value > 0;
  }
}

function validateDay(day, month, year) {
  const value = day ? parseInt(day, 10) : 0;
  if (day.length < 2) {
    return value <= 3;
  }
  const daysInMonth = month
    ? new Date(year.length === 4 ? year : '2000', month, 0).getDate()
    : 31;
  return value <= daysInMonth && value > 0;
}

function validateYear(year, month, day) {
  let value = year ? parseInt(year, 10) : 0;
  let leapOnly = false;

  if (year.length < 4) {
    let l = 4 - year.length;
    while (l--) {
      value *= 10;
    }
  } else {
    leapOnly = month === '02' && day === '29';
  }

  if (value > 3000 || (year.length === 4 && value === 0)) {
    return false;
  }

  if (leapOnly) {
    return value % 400 == 0 || (value % 100 != 0 && value % 4 == 0);
  }

  return true;
}

function splitDate(dateStr, placeholder) {
  const separator = getSeparator(placeholder);
  const result = {
    month: undefined,
    day: undefined,
    year: undefined,
  };
  const dateArray = dateStr.split(separator);
  placeholder.split(separator).forEach((elem, index) => {
    switch (elem) {
      case 'mm':
        result.month = dateArray[index];
        break;
      case 'dd':
        result.day = dateArray[index];
        break;
      case 'yyyy':
        result.year = dateArray[index];
        break;
      default:
        console.error('Unhandled switch value');
    }
  });
  return result;
}

function validateInput(str, placeholder) {
  if (str === '') {
    return true;
  }
  const dateStr = removePlaceholders(str);
  const { month, day, year } = splitDate(dateStr, placeholder);

  return (
    validateMonth(month, day, year) &&
    validateDay(day, month, year) &&
    validateYear(year, month, day)
  );
}

function applyMask(str, mask) {
  const charsArray = str.split('');
  if (!charsArray.length) {
    return mask;
  }
  let result = '';
  [...mask].forEach((el) => {
    if (el === '_' || el === charsArray[0]) {
      result += charsArray[0] ? charsArray.shift() : el;
    } else {
      result += el;
    }
  });
  return result;
}

function replaceChar(str, index, char) {
  const charArray = [...str];
  charArray[index] = char;
  return charArray.join('');
}

export {
  isControlKey,
  getSeparator,
  validateInput,
  validateDate,
  convertDate,
  applyMask,
  replaceChar,
};
