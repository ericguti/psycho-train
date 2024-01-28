
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
        this.op_types_enum_en = ["plus", "minus", "multiplied by", "divided by"]
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
        return convertNumToEnglish(this.op1) + " " + this.op_types_enum_en[this.type] + " " + convertNumToEnglish(this.op2);
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

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}
