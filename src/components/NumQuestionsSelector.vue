<script setup>
import {onMounted, ref} from "vue";

  const emit = defineEmits(["updateInput"])

  const numQ = ref(5);

  const caretClass = ref("caretHid");
  const inputDivClass = ref("input");

  onMounted(()=>{
    const body = document.querySelector("body");
    body.addEventListener("click", (ev)=>{
      caretClass.value = "caretHid";
      inputDivClass.value = "input";
      }, false
    )
  })
  function changeInput(newValue){
    numQ.value = newValue;
    emit("updateInput", numQ.value);
  }

  function focusInput(){
    const realinput = document.getElementById('realinput');
    if(realinput) {
      realinput.focus();
    }
    caretClass.value = "caret";
    inputDivClass.value = "input-focus"
  }

defineExpose({
  numQ
})
</script>

<template>
  <div class="wrap">
    <button @click="changeInput(Number(numQ)-1)">&lt;</button>
    <div :class="inputDivClass"
         @click="(ev)=>{
           ev.stopPropagation();
           focusInput();
         }">
      <div class="num-div">{{numQ}}<span :class="caretClass">&nbsp</span></div>
    </div>
    <button id="inc" @click="changeInput(Number(numQ)+1)">&gt;</button>
  </div>
  <input id="realinput" :value="numQ" @input="changeInput($event.target.value)" type="number">
</template>

<style scoped>

*{
  margin: 0 5px;
}
.wrap{
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 0 15px 0 ;
  height: 9vh;
}
input{
  all: unset;
  background: none;
  color: rgba(30, 28, 34, 0);
  position: absolute;
}
.input, .input-focus{
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  height: 1.8em;
  width: 300px;
  color: var(--color-text);
  text-align: center;
  box-shadow: none;
  border: 1px solid white;
  transition: 0.7s;
  overflow: clip;
}
/* ___ REMOVE ARROWS ___ */
/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
/* Firefox */
input[type=number] {
  -moz-appearance: textfield;
}
.input:hover{
  background: white;
  color: black;
  overflow: clip;
}
.input-focus{
  background: white;
  color: black;
}
.num-div{
  display: flex;
  align-items: center;
}

.caretHid{
  margin: 0;
}

.caret{
  display: block;
  animation: blink 0.3s step-end infinite;
  border-bottom: 1.2px solid #000000;
  margin: 0;
  height: 10px;
}

@keyframes blink {
  from,
  to {
    border-color: black;
  }
  50% {
    border-color: transparent;
  }
}

button{
  width: 2em;
  height: 2em;
  font-weight: bold;
  padding: 0;
  background: none;
  border: 1.2px solid white;
  border-radius: 100%;
  color: var(--color-text);
  transition: 0.5s;
}
button:hover{
  background: white;
  color: black;
  transition: 0.5s;
}

</style>