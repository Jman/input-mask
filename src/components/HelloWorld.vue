<template>
  <h1>{{ msg }}</h1>

  <div class="card">
    <input-mask
      id="dob0"
      v-model="date0"
      class="input-text"
      name="dob0"
      placeholder="mm/dd/yyyy"
      :class="{ error: hasError0, success: date0 && !hasError0 }"
      @error="hasError0 = $event"
    />
    <p>Date: {{ date0 }}</p>
    <input-mask
      id="dob1"
      v-model="date1"
      class="input-text"
      name="dob1"
      placeholder="dd.mm.yyyy"
      :class="{ error: hasError1, success: date1 && !hasError1 }"
      @error="hasError1 = $event"
    />
    <p>Date: {{ date1 }}</p>
    <input-mask
      id="dob1"
      v-model="date2"
      class="input-text"
      name="dob2"
      placeholder="yyyy-mm/dd"
      :class="{ error: hasError2, success: date2 && !hasError2 }"
      @error="hasError2 = $event"
    />
    <p>Date: {{ date2 }}</p>
  </div>

  <p>
    Check out
    <a href="https://vuejs.org/guide/quick-start.html#local" target="_blank"
      >create-vue</a
    >, the official Vue + Vite starter
  </p>
  <p>
    Install
    <a href="https://github.com/johnsoncodehk/volar" target="_blank">Volar</a>
    in your IDE for a better DX
  </p>
  <p class="read-the-docs">Click on the Vite and Vue logos to learn more</p>
</template>

<script setup>
import { ref } from 'vue';
import InputMask from './InputMask.vue';

defineProps({
  msg: {
    type: String,
    default: '',
  },
});

const hasError0 = ref(false);
const hasError1 = ref(false);
const hasError2 = ref(false);
const date0 = ref('');
const date1 = ref('');
const date2 = ref('2000-02/29');
</script>

<style>
.read-the-docs {
  color: #888;
}

.input-text {
  font-size: 20px;
  padding: 0.2em 0.5em;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.input-text.error {
  border-color: red;
  outline-color: red;
}

.input-text.success {
  border-color: green;
  outline-color: green;
}
</style>
