class Sound {
    constructor(context) {
        this.context = context;
    }

    setup() {
        this.oscillator = this.context.createOscillator();
        this.gainNode = this.context.createGain();
        this.oscillator.connect(this.gainNode);
        this.gainNode.connect(this.context.destination);
        this.oscillator.type = 'sine';
    }

    play(value) {
        this.setup();

        this.oscillator.frequency.value = value;
        this.gainNode.gain.setValueAtTime(0, this.context.currentTime);
        this.gainNode.gain.linearRampToValueAtTime(1, this.context.currentTime + 0.01);
        this.oscillator.start(this.context.currentTime);
        this.stop(this.context.currentTime);
    }

    stop() {
        this.gainNode.gain.exponentialRampToValueAtTime(0.001, this.context.currentTime + 1);
        this.oscillator.stop(this.context.currentTime + 1);
    }
};

let context = new (window.AudioContext || window.webkitAudioContext)();

document.addEventListener('keydown', e => {
    const stroke = document.querySelector(`.key[data-key="${e.keyCode}"]`);
    playSound(stroke);
    createCircle();
});

playSound = stroke => {
    if(stroke === null) return;
    let sound = new Sound(context);
    let value = stroke.dataset.frequency;
    sound.play(value);
    sound.stop();
    stroke.classList.add('playing');
}

function removeTransition(e) {
    if(e.propertyName !== 'transform') return;
    this.classList.remove('playing');
}

createCircle = () => {
    const circle = document.createElement('div');
    circle.style.height = '100px';
    circle.style.width = '100px';
    circle.style.borderRadius = '50%';
    circle.style.backgroundColor = 'blue';
    circle.style.position = 'absolute';
    circle.style.left = '200px';
    circle.style.top = '200px';
    document.body.appendChild(circle);
}

const keys = document.querySelectorAll('.key');
keys.forEach(key => key.addEventListener('transitionend', removeTransition));