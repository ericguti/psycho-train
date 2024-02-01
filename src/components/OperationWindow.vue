<script setup lang="ts">


import {onMounted, ref} from "vue";
  import {SimpleOperation, Excersise, NumberGuesser} from "@/services/operation";
  import {Stopwatch} from "@/services/timer";
  import textToSpeech from "@/components/textToSpeech.vue";

  const user_sol=ref("")

  const currentQuestion=ref(-1)
  const totalQuestions=ref(-1)

  const answerInputClass = ref("");

  const props = defineProps({
    questionList: {
      type: Array<Excersise>,
      required: true
    }
  })
  const emit = defineEmits(['finishedQuestions'])
  const results = [];

  const stopwatch = new Stopwatch();

  const audiocomponent = ref(null);

  onMounted(()=>{
    window.addEventListener("keydown", (e)=>{
      if(e.key == " "){
        const a = document.getElementById("user-sol");
        a.focus();
      }
    })
    window.addEventListener("keydown", (e)=>{
      if(e.key == "+"){
        audiocomponent.value[0].speak();
      }
    })
  });
    totalQuestions.value = props.questionList.length;
    stopwatch.start();
  //---------

/*
----- TIMER
 */
  const currentTimer = ref(0);
  const fakeTimer = ref(0);
  const timerIsFake = ref(false);
  const updateTimer = ()=>{
    currentTimer.value = (stopwatch.stop() / 1000);
    setTimeout(updateTimer, 10);
  }
  setTimeout( updateTimer, 10);


  const renderOperation = (questionNum)=>{
    const questionString = document.getElementById("questionString");
    questionString.innerText = props.questionList[currentQuestion].toString();
  }

  const updateViewCorrectAnswer = ()=> {
    user_sol.value = "";
    answerInputClass.value = "correct-answer";
    const end_audio = document.getElementById("correct-audio");
    if (end_audio) {
      end_audio.play();
    }
  }
  const updateViewWrongAnswer = ()=>{
    const inputElement = document.querySelector("input");
    user_sol.value = "";
    answerInputClass.value = "wrong-answer";
  }
  const submitAnswer = ()=>{
    results.push({
      "questionNum": currentQuestion.value,
      "expectedResult": props.questionList[currentQuestion.value].getResult(),
      "userResult": Number(user_sol.value),
      "time": stopwatch.stop(),
    })
    // CORRECT ANSWER
    if(props.questionList[currentQuestion.value].checkResult(Number(user_sol.value))){
      updateViewCorrectAnswer();
      nextQuestion();
      fakeTimer.value = stopwatch.stop()/1000;
      timerIsFake.value = true;
    }else{
      updateViewWrongAnswer();
    }

  }

  const nextQuestion = ()=>{
    setTimeout(()=>{
      // CHECK IF NUMBER IS NOT IN THE VALID INTERVAL
      if (! (currentQuestion.value<=-2 || currentQuestion.value>=totalQuestions.value)) {
        if (currentQuestion.value < totalQuestions.value - 1) {
          currentQuestion.value++;
          // PLAY NEXT QUESTION SPEECH
          setTimeout( ()=>audiocomponent.value[0].speak(),500);
          timerIsFake.value = false;
        // LAST QUESTION
        } else if (currentQuestion.value === totalQuestions.value -1) {
          const end_audio = document.getElementById("finish-audio");
          if (end_audio) end_audio.play();
          setTimeout(()=>emit("finishedQuestions", results), 1000);
        }
        // START STOPWATCH OF QUESTION TIMING
        stopwatch.start();
      }else{
        currentQuestion.value = 0;
      }
    },
      //TIMEOUT BETWEEN QUESTIONS
      10
    )
  }

</script>

<template>
  <div class="op-window-wrapper">
  <div v-if="currentQuestion >=0 " class="op-window">
    <h1>Question {{currentQuestion+1}} of {{totalQuestions}}</h1>
    <h3 class="stopwatch
">{{timerIsFake? fakeTimer: currentTimer}}</h3>
    <div  v-for="(nthquestion, key) in props.questionList">
      <text-to-speech
          class="player"
          v-if="key===currentQuestion"
          ref="audiocomponent"
          :audio-link="'https://www.myinstants.com/media/sounds/the-weeknd-rizzz.mp3'"
          :enableai="false"
          :playbackspeed="0.75"
          :question="props.questionList[currentQuestion]"
      ></text-to-speech>
    </div>
    <audio id="finish-audio" src="https://www.myinstants.com/media/sounds/the-weeknd-rizzz.mp3"></audio>
    <audio id="correct-audio" src="https://www.myinstants.com/media/sounds/rizz-sounds.mp3"></audio>
<!--    <h3>{{props.questionList[currentQuestion].toString()}}</h3>-->
    <!--
    AUDIO ITEMS PER EXCERSISE
    -->
    <input
        v-model="user_sol"
        type="text" id="user-sol" :class="answerInputClass"
        v-on:keyup.enter="submitAnswer()"
    >
    <button
        @click="submitAnswer()" class="sol-button"
    >Check</button>
  </div>
  <button class="start" v-if="currentQuestion===-1" @click="nextQuestion()">Start test</button>
  </div>
</template>

<style scoped>
  .wrong-answer{
    border: solid red 2px;
  }
  .correct-answer{
    border: solid green 2px;
  }
  .op-window-wrapper{
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 50vh;
    width: 60%;
  }
  @media only screen and (max-width: 767px) {
    .op-window-wrapper{
      width: 100%;
    }
  }

  .stopwatch{
  }

  .op-window{
    padding: 5px 5px 5px 5px;
    width: 100%;
    display: flex;
    flex-direction: column;
  }
  #user-sol{
    background-color: #303245;
    border-radius: 12px;
    box-sizing: border-box;
    color: #eee;
    font-size: 18px;
    height: 100%;
    outline: 0;
    padding: 4px 20px;
    width: 100%;
  }
  ol,ul{
    list-style-type: none ;
  }
  .player{
    margin: 1em 0;
  }

  .start{
    all: unset;
    border: 1.5px solid white;
    padding: 5px 15px;
  }
  .start:hover{
    background: white;
    color: black;
  }
  .sol-button{
    margin-top: 10px;
  }
</style>