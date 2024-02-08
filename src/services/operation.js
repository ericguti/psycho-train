
export class Excersise{
    getResult(){}
    checkResult(){}
    getSpeech(){}
}

export class NumberGuesser{
    constructor(rangeStart, rangeEnd) {
        this.num = 0;
        this.speechLink = "";
        this.num = getRandomInt(rangeStart, rangeEnd);
    }
    async generateSpeech(){
        if(this.speechLink === "") {
            try {
                const audioRawData = await getSpeechApiBlob(this.getEnglishText());
                this.speechLink = URL.createObjectURL(audioRawData)
            } catch (e) {
                console.error(e)
            }
        }
    }
    getSpeech(){
        if(this.speechLink === ""){
            throw Error("Speech not generated yet");
        }
        return this.speechLink;
    }

    getEnglishText(){
        return convertNumToEnglish(this.num);
    }

    getTranscription (language){
        switch (language){
            case "zh":
                return convertNumToChinese(this.num);
            case "en":
                return convertNumToEnglish(this.num);
            case "es":
                return convertNumToSpanish(this.num);
            default:
                return null
        }
    };

    getResult(){
        return this.num
    }
    checkResult(inp){
        return inp === this.num;
    }
    toString(){
        return this.num;
    }
}

export class SimpleOperation{
    constructor(op1Range, op2Range, type) {
        this.op_types_enum = ["+", "-", "*", "/"];
        this.operation_names = {
            "en": ["plus", "minus", "multiplied by", "divided by"],
            "es": ["más", "menos", "por", "entre"],
            "zh": ["加", "减", "乘以", "除以"]
        }
        this.op1 = getRandomInt(0,op1Range);
        this.op2 = getRandomInt(0,op2Range);
        this.type = type;

        if(this.type===1 && this.op2>this.op1){
            let aux = this.op2;
            this.op2 = this.op1;
            this.op1 = aux;
        }
        while(this.type===0 && this.getResult()>100){
            this.op1 = getRandomInt(0,op1Range);
            this.op2 = getRandomInt(0,op2Range);
        }
        this.speechLink = "";
    };
    getResult(){
        return eval(this.toString())
    };
    checkResult(inp){
        return this.getResult() === inp;
    };

    getEnglishText (){
        return convertNumToSpanish(this.op1) + " " + this.operation_names["es"][this.type] + " " + convertNumToChinese(this.op2);
    };

    getTranscription (language){
        switch (language){
            case "zh":
                return convertNumToChinese(this.op1) + this.operation_names["zh"][this.type] + convertNumToChinese(this.op2);
            case "en":
                return convertNumToEnglish(this.op1) + " " + this.operation_names["en"][this.type] + " " + convertNumToEnglish(this.op2);
            case "es":
                return convertNumToSpanish(this.op1) + " " +  this.operation_names["es"][this.type] + " " +  convertNumToSpanish(this.op2);
            default:
                return null
        }
    };

    toString (){
        return String(this.op1) + this.op_types_enum[this.type] + String(this.op2);
    };

    async generateSpeech(){
        // if(this.speechLink === "") {
            try {
                const audioRawData = await getSpeechApiBlob(this.getEnglishText());
                this.speechLink = URL.createObjectURL(audioRawData);
            } catch (e) {
                console.error(e);
            }
        }
    // };
    getSpeech(){
        if(this.speechLink === ""){
            // throw Error("Speech not generated yet");
            console.log("Speech not generated yet");
        }
        return this.speechLink;
    };
}

export async function getSpeechApiBlob(text) {
    const options = {
        method: 'POST',
        headers: {
            'xi-api-key': 'b85924d0a5104f38042d5092ec9cafb1',
            'Content-Type': 'application/json'
        },
        body: `{"text":"${text}","voice_settings":{"similarity_boost":0.6,"stability":0.3,"use_speaker_boost":true,"style":0.3},"model_id":"eleven_multilingual_v2"}`
    };

    let response = await fetch('https://api.elevenlabs.io/v1/text-to-speech/oWAxZDx7w5VEj9dCyTzz?output_format=mp3_44100_128', options);
    if (!response.ok) throw response;
    return response.blob();
}

export  function convertNumToEnglish (num) {
    const ones = ["", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];
    const teens = ["", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"];
    const tens = ["", "ten", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];

    const convertTens = (chunk) => {
        if (chunk === 0) return "";
        else if (chunk < 10) return ones[chunk];
        else if (chunk > 10 && chunk < 20) return teens[chunk - 10];
        else return `${tens[Math.floor(chunk / 10)]} ${ones[chunk % 10]}`;
    };
    const convertHundreds = (num) => {
        return num > 99 ? `${ones[Math.floor(num / 100)]} hundred ${convertTens(num % 100)}` : convertTens(num);
    };
    const convertThousands = (num) => {
        return num >= 1000 ? `${convertHundreds(Math.floor(num / 1000))} thousand ${convertHundreds(num % 1000)}` : convertHundreds(num);
    };
    const convertMillions = (num) => {
        return num >= 1000000 ? `${convertMillions(Math.floor(num / 1000000))} million ${convertThousands(num % 1000000)}` : convertThousands(num);
    };
    return num === 0 ? "zero" : convertMillions(num);
}

function convertNumToChinese(num) {
    const chineseNumeral = ["", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
    const chineseUnit1 = ["", "十", "百", "千"];
    const chineseUnit2 = ["", "万", "亿"];

    const convertChunk = (chunk, unit) => {
        let result = "";
        for (let i = 0; i < 4; i++) {
            const digit = chunk % 10;
            if (digit !== 0) {
                result = chineseNumeral[digit] + chineseUnit1[i] + result;
            }
            chunk = Math.floor(chunk / 10);
        }
        return result === "" ? result : result + unit;
    };

    const convertNumber = (num, unitIndex) => {
        let result = "";
        for (let i = 0; i < 3; i++) {
            const chunk = num % 10000;
            if (chunk !== 0) {
                result = convertChunk(chunk, chineseUnit2[unitIndex]) + result;
            }
            num = Math.floor(num / 10000);
            unitIndex++;
        }
        return result;
    };

    return num !== 0 ? ((num>=10 && num<20) ?  `十${chineseNumeral[num%10]}` : convertNumber(num, 0)) : "零";
}

function convertNumToSpanish(num) {
    const spanishNumeral = ["", "uno", "dos", "tres", "cuatro", "cinco", "seis", "siete", "ocho", "nueve"];
    const spanishTeens = ["", "once", "doce", "trece", "catorce", "quince", "dieciséis", "diecisiete", "dieciocho", "diecinueve"];
    const spanishTens = ["", "diez", "veinte", "treinta", "cuarenta", "cincuenta", "sesenta", "setenta", "ochenta", "noventa"];
    const cienes = ["", "ciento", "doscientos", "trescientos", "cuatrocientos", "quinientos", "seiscientos", "setecientos", "ochocientos", "novecientos"];

    const convertTens = (chunk) => {
        if (chunk === 0) return "";
        else if (chunk < 10) return spanishNumeral[chunk];
        else if (chunk > 10 && chunk < 20) return spanishTeens[chunk - 10];
        else if (chunk > 20 && chunk < 30) return `veinti${spanishNumeral[chunk % 10]}`;
        else if (chunk % 10 === 0) return `${spanishTens[Math.floor(chunk/10)]}`;
        else return `${spanishTens[Math.floor(chunk / 10)]} y ${chunk % 10 !== 0 ? spanishNumeral[chunk % 10] : ""}`;
    };

    const convertHundreds = (num) => {
        if(num < 100) return convertTens(num);
        if(num === 100) return "cien";
        else return `${cienes[Math.floor(num/100)]} ${convertTens(num%100)}`
    };

    const convertThousands = (num) => {
        if(num<1000) return convertHundreds(num);
        if(num>=1000 && num<=1999) return `mil ${convertHundreds(num%1000)}`;
        else return `${convertHundreds(Math.floor(num/1000))} mil ${convertHundreds(num%1000)}`
    };

    const convertMillions = (num) => {
        return num >= 1000000 ? (Math.floor(num)/1000000)===1 ? `un millón ${convertThousands(num%1000000)}` : `${convertThousands(Math.floor(num/1000000))} millones ${convertThousands(num%1000000)}` : convertThousands(num);
    };

    return num === 0 ? "cero" : convertMillions(num);
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}
