
// Constructor class to create sounds that can be layered on top of each other
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

// Adding event listener that looks for the assigned frequency on each key that is pressed
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

createCircle = () => {
    // Randomize the size and color of created element
    const divsize = ((Math.random()*100) + 50).toFixed();
    const color = `#${Math.round(0xffffff * Math.random()).toString(16)}40`;

    // Make position sensitive to size and document's width
    const posx = `${(Math.random() * (document.body.clientWidth - divsize)).toFixed()}px`;
    const posy = `${(Math.random() * (document.body.clientHeight - divsize)).toFixed()}px`;

    const circle = document.createElement('div');
    circle.className = 'circle';
    circle.style.height = `${divsize}px`;
    circle.style.width = `${divsize}px`;
    circle.style.borderRadius = '50%';
    circle.style.backgroundColor = color;
    circle.style.position = 'absolute';
    circle.style.left = posx;
    circle.style.top = posy;
    document.body.appendChild(circle);
}

// Removes the scale effect from the keys as they are played
function removeTransition(e) {
    if(e.propertyName !== 'transform') return;
    this.classList.remove('playing');
}

const keys = document.querySelectorAll('.key');
keys.forEach(key => key.addEventListener('transitionend', removeTransition));

// Removes first div.circle after a second
removeCircle = () => {
    const circle = document.getElementsByClassName('circle')[0];

    if (circle === undefined) return;
    document.body.removeChild(circle);
}

window.setInterval(removeCircle, 1000);