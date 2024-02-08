<script setup>
/**
 * This component given a BLOB generated link renders a audio component, otherwise uses the native
 * browser text to speech API
 */
  import {ref} from "vue";

  import {useI18n} from "vue-i18n";
  const t = ref();
  const locale = ref();
  t.value = useI18n().t;
  locale.value = useI18n().locale

  const props = defineProps({
    audioLink: {
      type: String,
      default: "",
    },
    enableai: {
      type: Boolean,
      default: false
    },
    question:{
      type: Object
    }
  })

  const browserLocale = {
    en: {
      chrome : "en-US",
      firefox: "en",
    },
    es: {
      chrome : "es-ES",
      firefox: "es",
    },
    zh: {
      chrome: "zh-CN",
      firefox: "cmn",
    }
  }


  const playbackspeed = ref(1);
  const showTranscription = ref(false);
  function speak(text) {
    if (props.enableai && props.audioLink) {
      let audioElement = document.getElementById("audio");
      audioElement.play();
    } else {
      let msg = new SpeechSynthesisUtterance();
      msg.text = props.question.getTranscription(locale.value.value);
      msg.rate = playbackspeed.value;
      const userAgent = navigator.userAgent;
      if (userAgent.indexOf("Chrome") !== -1) {
        msg.lang = browserLocale[locale.value.value]["chrome"];
      } else if (userAgent.indexOf("Firefox") !== -1) {
        msg.lang = browserLocale[locale.value.value]["firefox"];
      }
      // } else if (userAgent.indexOf("Safari") !== -1) {
      //   console.log("You are using Apple Safari.");
      // } else if (userAgent.indexOf("Edge") !== -1) {
      //   console.log("You are using Microsoft Edge.");
      // } else if (userAgent.indexOf("Opera") !== -1 || userAgent.indexOf("OPR") !== -1) {
      //   console.log("You are using Opera.");
      // } else if (userAgent.indexOf("Trident") !== -1) {
      //   console.log("You are using Microsoft Internet Explorer.");
      // } else {
      //   console.log("Unable to detect your browser.");
      // }
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
  <button @click="speak('hola mundo')">{{t("texttospeech.speakagain")}}</button>
    <p :style="`visibility: ${showTranscription? 'show': 'hidden'}`">{{question.getTranscription(locale.value)}}</p>
  <div class="inp-wrapper">
    <input type="checkbox" id="transcription-cb" v-model="showTranscription">
    <label for="transcription-cb"> -> {{t("texttospeech.showtranscription")}}</label>
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
  min-width: 100px;
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