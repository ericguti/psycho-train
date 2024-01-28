export class Stopwatch {
    constructor() {
        this.runtime = 0;
    }

    start() {
        this.startTime = Date.now();
    }

    stop() {
        this.runtime = Date.now() - this.startTime ;
        return this.runtime;
    }

    reset() {
        this.runtime = 0;
    }

    getRuntime(){
        return this.runtime;
    }

    step() {
        // TO BE DONE
    }
}

console.log(Date.now())