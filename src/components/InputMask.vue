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
import { ref, computed, watch, nextTick } from 'vue';
import {
  validateDate,
  getSeparator,
  validateInput,
  applyMask,
  convertDate,
  isControlKey,
  replaceChar,
} from './InputMask';

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

const mask = props.placeholder.replace(/\w/g, '_');
const emit = defineEmits(['update:modelValue', 'error', 'accept']);
const inputRef = ref(null);
const focused = ref(false);
const inputText = ref('');

const inputValue = computed(() => {
  return (inputText.value && inputText.value !== mask) || focused.value
    ? applyMask(inputText.value, mask)
    : '';
});

watch(
  () => props.modelValue,
  (str) => {
    inputText.value = str;
    if (!validateInput(str, props.placeholder)) {
      emit('error', true);
    }
  },
  { immediate: true }
);

watch(inputValue, (str) => {
  if (validateDate(str, props.placeholder)) {
    emit('update:modelValue', str);
    emit('accept', convertDate(str, props.placeholder));
    emit('error', false);
  } else {
    emit('error', true);
  }
});

watch(focused, (val) => {
  if (val) {
    focus(inputRef.value.selectionStart);
  }
});

function keydownHandler(event) {
  const { key } = event;
  if (isControlKey(event) && !['Backspace', 'Delete'].includes(key)) {
    return;
  }
  event.preventDefault();
  let { selectionStart: cursor } = inputRef.value;
  let str = applyMask(inputText.value, mask);
  const separator = getSeparator(str);
  if (key === 'Delete') {
    str =
      str.substring(0, cursor) +
      str.substring(cursor).replace(separator, '').substring(1);
    str = applyMask(str, mask);
  } else if (key === 'Backspace' && cursor !== 0) {
    cursor = separator.test(str.charAt(cursor - 1)) ? cursor - 2 : cursor - 1;
    str = replaceChar(str, cursor, '_');
  } else if (!isNaN(key)) {
    cursor = separator.test(str.charAt(cursor)) ? cursor + 1 : cursor;
    str = replaceChar(str, cursor, key);
    cursor++;
  }
  if (validateInput(str, props.placeholder) || str === '') {
    inputText.value = str;
    focus(cursor);
  }
}

function focus(cursor) {
  nextTick(() => {
    inputRef.value.setSelectionRange(cursor, cursor);
  });
}
</script>
