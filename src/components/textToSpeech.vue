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
  <audio id="audio" :src="props.audioLink"></audio>
  <button @click="speak('hola mundo')">speak</button>
  <p>{{question.getEnglishText()}}</p>
</template>

<style scoped>

</style>