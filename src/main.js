import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'

import {createI18n} from "vue-i18n";

const messages = {
    en: {
        app:{
            appname: "Psychometrics training",
            devname: "ERICGUTI HUA SOFTWARE"
        },
        contentview: {
            choosequestionnumber: "Choose the number of questions",
            menu: "Menu",
            starttest: "Start Test",
            sum: "Sum",
            substract: "Substract",
            numberguesser: "Number guesser"
        },
        operationwindow: {
            questionnumber: "Question",
            check: "Check",
        },
        texttospeech: {
          showtranscription: "Show transcription",
          speakagain: "Speak again",
        },
    },
    es: {
        app:{
            appname: "Prácticas para psicotécnicos",
            devname: "ERICGUTI HUA SOFTWARE"
        },
        contentview: {
            choosequestionnumber: "Elige el número de preguntas",
            menu: "Menú",
            starttest: "Comenzar Test",
            sum: "Suma",
            substract: "Resta",
            numberguesser: "Reconocer números"
        },
        operationwindow: {
            questionnumber: "Pregunta",
            check: "Corregir",
        },
        texttospeech: {
            speakagain: "Volver a reproducir",
            showtranscription: "Mostrar transcripción",
        },
    },
    zh: {
        app:{
            appname: "心理检测",
            devname: "ERICGUTI华软件"
        },
        contentview: {
            choosequestionnumber: "输入题目数量",
            menu: "选页",
            sum: "加",
            substract: "减",
            numberguesser: ""
        },
        operationwindow: {
            questionnumber: "",
            check: "",
        },
        texttospeech: {
            speakagain: "",
            showtranscription: "",
        },
    }
}

const i18n = createI18n({
    legacy: false,
    locale: "en",
    fallbackLocale: "en",
    messages
})

const app = createApp(App)
app.use(i18n)
app.mount('#app')
