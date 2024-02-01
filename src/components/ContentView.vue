<script setup>

  import {ref} from "vue";
  import {useToast} from "vue-toast-notification";
  import OperationWindow from "@/components/OperationWindow.vue";
  import {SimpleOperation, NumberGuesser} from "@/services/operation.js";
  import CyberButton from "@/components/CyberButton.vue";
  import NumQuestionsSelector from "@/components/NumQuestionsSelector.vue";

  // PAGE VARIABLES
  const currentWindow = ref(0);
  const opa=ref([]);
  const $toast = useToast();

  const customNumOfQuestions = ref(5);


  const user_results = ref();
  class UserResults{
    opa = [];
    constructor(user_results) {
      this.opa = user_results;
    }
    getAverageTime(){
      let acc=0; let cnt=0;
      const filtered = this.opa.filter((a)=>a["expectedResult"]===a["userResult"])
      for(let a of filtered) {
        acc+=a.time; cnt++;
      }
      return acc/cnt;
    }
    getTotalTime(){
      if(!this.opa) return 0;
      return this.opa.reduce( (acc, cur)=>{return acc+cur.time}, 0)
    }
    getWrongNumber(){
      return this.opa.filter( (a)=>a["expectedResult"]!==a["userResult"] ).length;
    }

  }

  class ExcersiseList{
    constructor(type, num_questions) {
      num_questions = Number(num_questions);
      this.questionList = [];
      // types 0-3 = [+,-,*,/]
      if(type>=0 && type <=3) {
        for (let i = 0; i < num_questions; i++) {
          this.questionList.push(new SimpleOperation(100, 100, type));
        }
      }
      if(type===4){
        for (let i=0; i<num_questions;i++) {
          this.questionList.push(new NumberGuesser(1000, 1000000));
        }
      }
    }
  }
  const exc_list = ref([]);
  async function start_excersises(type, num_questions){
    if(! ( Number(num_questions) <= 0 || Number(num_questions) > 1000) ){
      try{
        let ec = new ExcersiseList(type, num_questions);
        console.log(ec);
        // GENERATE SPEECH FROM API SEQ/CONCURRENT
        // const promiseArray = [];
        // for (let q of ec.questionList) {
        //   try{
        //     await q.generateSpeech();
        //   }catch (e){
        //     $toast.error("Error generating speech for: " + q);
        //   }
        // }
        // await Promise.all(promiseArray);
        exc_list.value.push(...ec.questionList);
        currentWindow.value = 2;
      }catch (e){
        console.error(e);
      }
    }else {
      $toast.error("Number of questions must be between 1 and 1000");
    }
  }
</script>

<template>
  <div class="wrapper">
  <button class="menu-bttn" @click="()=>{currentWindow=0;exc_list = [];}">= Menu</button>
<!--<cyber-button text="Menu" @click="()=>{currentWindow=0;exc_list = [];}"></cyber-button>-->
  <div v-if="currentWindow===0" class="main-menu">
    <h3>Choose the number of questions</h3>
    <NumQuestionsSelector
      @updateInput="(new_value)=>{customNumOfQuestions=new_value}"
    ></NumQuestionsSelector>
<!--    buttons-->
    <button class="cybr-btn" @click="()=>{start_excersises(0,customNumOfQuestions)}">
      Sum<span aria-hidden>_</span>
      <span aria-hidden class="cybr-btn__glitch">Sum</span>
      <span aria-hidden class="cybr-btn__tag"></span>
    </button>
    <button class="cybr-btn" @click="()=>{start_excersises(1, customNumOfQuestions)}">
      Substract<span aria-hidden>_</span>
      <span aria-hidden class="cybr-btn__glitch">Sum</span>
      <span aria-hidden class="cybr-btn__tag"></span>
    </button>
    <button class="cybr-btn" @click="()=>{start_excersises(4,customNumOfQuestions)}">
      Number Guesser<span aria-hidden>_</span>
      <span aria-hidden class="cybr-btn__glitch">Sum</span>
      <span aria-hidden class="cybr-btn__tag"></span>
    </button>
  </div>
  <div v-if="currentWindow===1">Test{{opa}}</div>
  <div v-if="currentWindow===2" class="main-menu">
    <OperationWindow
        :question-list="exc_list"
        @finishedQuestions="(i)=>{
          currentWindow=3;
          user_results = new UserResults(i)
          exc_list = [];
        }"
    ></OperationWindow>
  </div>
  <div v-if="currentWindow===3" class="results">
    <h1>Results</h1>
    <h3>total time</h3>
    <h2>{{user_results.getTotalTime()/1000}} s</h2>
    <h3>average time</h3>
    <h2 style="color: greenyellow">{{user_results.getAverageTime()/1000}} s</h2>
    <h3>wrong answers</h3>
    <h2 style="color: red">{{user_results.getWrongNumber()}}</h2>
    Results:
      {{user_results.opa}}
  </div>
  </div>
</template>

<style scoped>
.wrapper{
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px 0;
}
.menu-bttn{
  width: 60px;
}
.main-menu{
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
}

@font-face {
  font-family: Cyber;
  src: url("https://assets.codepen.io/605876/Blender-Pro-Bold.otf");
  font-display: swap;
}

.results{
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 5%;
}




.cybr-btn {
  margin: 10px;
  --primary: hsl(var(--primary-hue), 85%, calc(var(--primary-lightness, 50) * 1%));
  --shadow-primary: hsl(var(--shadow-primary-hue), 90%, 50%);
  --primary-hue: 0;
  --primary-lightness: 50;
  --color: hsl(0, 0%, 100%);
  --font-size: 26px;
  --shadow-primary-hue: 180;
  --label-size: 9px;
  --shadow-secondary-hue: 60;
  --shadow-secondary: hsl(var(--shadow-secondary-hue), 90%, 60%);
  --clip: polygon(0 0, 100% 0, 100% 100%, 95% 100%, 95% 90%, 85% 90%, 85% 100%, 8% 100%, 0 70%);
  --border: 4px;
  --shimmy-distance: 5;
  --clip-one: polygon(0 2%, 100% 2%, 100% 95%, 95% 95%, 95% 90%, 85% 90%, 85% 95%, 8% 95%, 0 70%);
  --clip-two: polygon(0 78%, 100% 78%, 100% 100%, 95% 100%, 95% 90%, 85% 90%, 85% 100%, 8% 100%, 0 78%);
  --clip-three: polygon(0 44%, 100% 44%, 100% 54%, 95% 54%, 95% 54%, 85% 54%, 85% 54%, 8% 54%, 0 54%);
  --clip-four: polygon(0 0, 100% 0, 100% 0, 95% 0, 95% 0, 85% 0, 85% 0, 8% 0, 0 0);
  --clip-five: polygon(0 0, 100% 0, 100% 0, 95% 0, 95% 0, 85% 0, 85% 0, 8% 0, 0 0);
  --clip-six: polygon(0 40%, 100% 40%, 100% 85%, 95% 85%, 95% 85%, 85% 85%, 85% 85%, 8% 85%, 0 70%);
  --clip-seven: polygon(0 63%, 100% 63%, 100% 80%, 95% 80%, 95% 80%, 85% 80%, 85% 80%, 8% 80%, 0 70%);
  font-family: 'Cyber', sans-serif;
  color: var(--color);
  cursor: pointer;
  background: transparent;
  text-transform: uppercase;
  font-size: var(--font-size);
  outline: transparent;
  letter-spacing: 2px;
  position: relative;
  font-weight: 700;
  border: 0;
  min-width: 260px;
  height: 75px;
  line-height: 75px;
  transition: background 0.2s;
}

.cybr-btn:hover {
  --primary: hsl(var(--primary-hue), 85%, calc(var(--primary-lightness, 50) * 0.8%));
}
.cybr-btn:active {
  --primary: hsl(var(--primary-hue), 85%, calc(var(--primary-lightness, 50) * 0.6%));
}

.cybr-btn:after,
.cybr-btn:before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  clip-path: var(--clip);
  z-index: -1;
}

.cybr-btn:before {
  background: var(--shadow-primary);
  transform: translate(var(--border), 0);
}

.cybr-btn:after {
  background: var(--primary);
}

.cybr-btn__tag {
  position: absolute;
  padding: 1px 4px;
  letter-spacing: 1px;
  line-height: 1;
  bottom: -5%;
  right: 5%;
  font-weight: normal;
  color: hsl(0, 0%, 0%);
  font-size: var(--label-size);
}

.cybr-btn__glitch {
  position: absolute;
  top: calc(var(--border) * -1);
  left: calc(var(--border) * -1);
  right: calc(var(--border) * -1);
  bottom: calc(var(--border) * -1);
  background: var(--shadow-primary);
  text-shadow: 2px 2px var(--shadow-primary), -2px -2px var(--shadow-secondary);
  clip-path: var(--clip);
  animation: glitch 2s infinite;
  display: none;
}

.cybr-btn:hover .cybr-btn__glitch {
  display: block;
}

.cybr-btn__glitch:before {
  content: '';
  position: absolute;
  top: calc(var(--border) * 1);
  right: calc(var(--border) * 1);
  bottom: calc(var(--border) * 1);
  left: calc(var(--border) * 1);
  clip-path: var(--clip);
  background: var(--primary);
  z-index: -1;
}

@keyframes glitch {
  0% {
    clip-path: var(--clip-one);
  }
  2%, 8% {
    clip-path: var(--clip-two);
    transform: translate(calc(var(--shimmy-distance) * -1%), 0);
  }
  6% {
    clip-path: var(--clip-two);
    transform: translate(calc(var(--shimmy-distance) * 1%), 0);
  }
  9% {
    clip-path: var(--clip-two);
    transform: translate(0, 0);
  }
  10% {
    clip-path: var(--clip-three);
    transform: translate(calc(var(--shimmy-distance) * 1%), 0);
  }
  13% {
    clip-path: var(--clip-three);
    transform: translate(0, 0);
  }
  14%, 21% {
    clip-path: var(--clip-four);
    transform: translate(calc(var(--shimmy-distance) * 1%), 0);
  }
  25% {
    clip-path: var(--clip-five);
    transform: translate(calc(var(--shimmy-distance) * 1%), 0);
  }
  30% {
    clip-path: var(--clip-five);
    transform: translate(calc(var(--shimmy-distance) * -1%), 0);
  }
  35%, 45% {
    clip-path: var(--clip-six);
    transform: translate(calc(var(--shimmy-distance) * -1%));
  }
  40% {
    clip-path: var(--clip-six);
    transform: translate(calc(var(--shimmy-distance) * 1%));
  }
  50% {
    clip-path: var(--clip-six);
    transform: translate(0, 0);
  }
  55% {
    clip-path: var(--clip-seven);
    transform: translate(calc(var(--shimmy-distance) * 1%), 0);
  }
  60% {
    clip-path: var(--clip-seven);
    transform: translate(0, 0);
  }
  31%, 61%, 100% {
    clip-path: var(--clip-four);
  }
}

.cybr-btn:nth-of-type(2) {
  --primary-hue: 260;
}
.cybr-btn:nth-of-type(3) {
  --primary-hue: 050;
}

</style>