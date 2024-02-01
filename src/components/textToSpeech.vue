<script setup>
/**
 * This component given a BLOB generated link renders a audio component, otherwise uses the native
 * browser text to speech API
 */
  import {ref} from "vue";

  const props = defineProps({
    audioLink: {
      type: String,
      default: "",
    },
    enableai: {
      type: Boolean,
      default: false
    },
    playbackspeed:{
      type: Number,
      default: 1
    },
    question:{
      type: Object
    }
  })

  const showTranscription = ref(false);
  function speak(text) {
    if (props.enableai && props.audioLink) {
      let audioElement = document.getElementById("audio");
      audioElement.play();
    } else {
      let msg = new SpeechSynthesisUtterance();
      msg.text = props.question.getEnglishText();
      msg.rate = props.playbackspeed;
      window.speechSynthesis.speak(msg);
    }
  }

  defineExpose({
    speak,
  });
</script>

<template>
  <div class="wrapper">
  <audio id="audio" :src="props.audioLink"></audio>
  <button @click="speak('hola mundo')">Speak again</button>
    <p :style="`visibility: ${showTranscription? 'show': 'hidden'}`">{{question.getEnglishText()}}</p>
  <div class="inp-wrapper">
    <input type="checkbox" id="transcription-cb" v-model="showTranscription">
    <label for="transcription-cb"> -> Show transcription</label>
  </div>
  </div>

</template>

<style scoped>
.wrapper{
  display: flex;
  flex-direction: column;
  align-items: center;
}
button{
  width: 100px;
}
input[type="checkbox"]{
  margin-right: 5px;
}
.inp-wrapper{
  display: flex;
  align-items: center;
  width: 100%;
}
</style>