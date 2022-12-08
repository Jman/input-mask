<template>
  <input
    ref="inputRef"
    type="text"
    :value="inputValue"
    :placeholder="placeholder"
    @keydown="keydownHandler"
    @focus="focused = true"
    @blur="focused = false"
  />
</template>

<script setup>
import { ref, computed, watch } from 'vue';

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  placeholder: {
    type: String,
    default: 'mm/dd/yyyy',
  },
});

if (props.modelValue && !validateDate(props.modelValue, props.modelValue)) {
  console.warn(
    '[Vue warn]: Invalid prop: custom validator check failed for prop "modelValue".'
  );
}

const mask = props.placeholder.replace(/\w/g, '_');
const emit = defineEmits(['update:modelValue', 'error']);
const inputRef = ref(null);
const inputHolder = ref(props.modelValue);
const focused = ref(false);

const inputValue = computed(() => {
  return inputHolder.value || focused.value
    ? applyMask(inputHolder.value, mask)
    : '';
});

watch(inputValue, (str) => {
  if (validateDate(str, props.placeholder)) {
    emit('update:modelValue', str);
    emit('error', false);
  } else {
    emit('error', true);
    emit('update:modelValue', '');
  }
  if (focused.value) {
    focus();
  }
});

watch(focused, (val) => {
  if (val) {
    focus();
  }
});

function keydownHandler(event) {
  const { key } = event;
  if (isControlKey(event) && key !== 'Backspace') {
    return;
  }
  event.preventDefault();
  let str = inputHolder.value ?? '';
  if (['Backspace', 'Delete'].includes(key)) {
    str = str.slice(0, -1);
  } else if (!isNaN(key)) {
    str += key;
  }
  if (validateInput(str, mask, props.placeholder) || str === '') {
    inputHolder.value = str;
  }
}

function focus() {
  const cursor = inputValue.value.indexOf('_');
  setTimeout(() => {
    inputRef.value.setSelectionRange(cursor, cursor);
  }, 0);
}
</script>

<script>
const regExpChar = /[\\^$.*+?()[\]{}|]/g;
const hasRegExpChar = RegExp(regExpChar.source);

function escapeRegExp(str) {
  return str && hasRegExpChar.test(str)
    ? str.replace(regExpChar, '\\$&')
    : str || '';
}

// Check if key is control key like Enter, Backspace
function isControlKey({ code, key, altKey, metaKey, ctrlKey }) {
  return altKey || metaKey || ctrlKey || code === key;
}

function removePlaceholders(str) {
  return str.replace(/_/g, '');
}

function getSeparator(str) {
  const separators = [...new Set(str.replace(/\w/g, '').split(''))];
  const escapedSeparators = separators.map(escapeRegExp);
  return new RegExp(escapedSeparators.join('|'));
}

function validateDate(str, placeholder) {
  if (str.indexOf('_') !== -1) {
    return false;
  }
  const { day, month, year } = splitDate(str, placeholder);
  const value = new Date(year, month - 1, day);
  return value !== 'Invalid Date';
}

function validateMonth(month, day, year) {
  const value = month ? parseInt(month, 10) : 0;
  if (month.length < 2) {
    return value <= 1;
  } else if (day) {
    const monthIndex = new Date(year || '2000', month - 1, day).getMonth();
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

// TODO refrite validateYear to support short notation yy
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
      case 'yy':
      case 'yyyy':
        result.year = dateArray[index];
        break;
      default:
        console.error('Unhandled switch value');
    }
  });
  return result;
}

function validateInput(str, mask, placeholder) {
  const dateStr = removePlaceholders(applyMask(str, mask));
  const { month, day, year } = splitDate(dateStr, placeholder);
  console.log(
    validateMonth(month),
    validateDay(day, month, year),
    validateYear(year, month, day)
  );
  return (
    validateMonth(month) &&
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
</script>
