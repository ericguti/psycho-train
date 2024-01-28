<script setup>
import TheWelcome from './components/TheWelcome.vue'
import TextToSpeech from "@/components/textToSpeech.vue";
import ContentView from "@/components/ContentView.vue";
import OperationWindow from "@/components/OperationWindow.vue";
</script>

<template>
  <header>
    <img alt="Vue logo" class="logo" src="./assets/logo.svg" width="25" height="25" />
    <p style="text-align: center">ERICGUTI SOFTWARE INDUSTRIES</p>
    <h1 class="h1-main">PSYCOTECHNICS PREPARATION</h1>
  </header>
  <main>
    <ContentView></ContentView>
  </main>
</template>

<style scoped>
header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}
.h1-main{
  text-align: center;
}

ul{
  @media (min-width: 1024px) {
    header {
      display: flex;
      place-items: center;
      padding-right: calc(var(--section-gap) / 2);
    }

    .logo {
      margin: 0 auto;
    }

    header .wrapper {
      display: flex;
      place-items: flex-start;
      flex-wrap: wrap;
    }
  }
  list-style-type: none!important;
}
</style>
