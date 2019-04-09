import { HoverButton } from './hover-button.js';
import { Keyboard } from './keyboard.js';
import { ToneSlider } from './tone-slider.js';

class Word {
  constructor(word) {
    this.word = word.toLowerCase();
    this.$element = document.createElement('span');
    this.$element.textContent = word;
  }
  speak(tone) {
    var utterance = new SpeechSynthesisUtterance(this.word);
    utterance.pitch = tone*2; // on a scale of 0-2 for some reason?
    utterance.rate = 1 + (tone-0.5)*0.7; // it's a literal speed coefficient so we're gonna be careful here
    this.$element.classList.add('highlight');
    const promise = new Promise((resolve, reject) => {
      utterance.addEventListener('end', () => {
        this.$element.classList.remove('highlight');
        resolve();
      });
      utterance.addEventListener('error', () => {
        this.$element.classList.remove('highlight');
        reject();
      });
    });
    speechSynthesis.speak(utterance);
    return promise;
  }
}

const STATES = {
  keyboard: Symbol('STATES.keyboard'),
  tone_slider: Symbol('STATES.tone_slider'),
};
let state;

window.addEventListener('load', () => {
  const $display = document.querySelector('#display'),
        $keyboard = document.querySelector('#keyboard'),
        $toneSlider = document.querySelector('#tone-slider');
  const keyboard = new Keyboard($keyboard, val => $display.textContent = val);
  let tone = 0.5;
  const toneSlider = new ToneSlider($toneSlider, t => tone = t);

  function setState(newstate) {
    if(state == newstate) return;
    $keyboard.style.display = (newstate == STATES.keyboard) ? '' : 'none';
    $toneSlider.style.display = (newstate == STATES.tone_slider) ? '' : 'none';
  }
  setState(STATES.keyboard)

  let words;
  function objectifyWords(value) {
    while($display.firstChild) $display.firstChild.remove();
    const word_vals = value.split(' ');
    words = []
    for(const word_s of word_vals) {
      const word = new Word(word_s);
      words.push(word);
      $display.appendChild(word.$element);
      $display.appendChild(document.createTextNode(' '));
    }
  }

  let isSpeaking = false;
  async function speakSentence() {
    if(isSpeaking) return;
    isSpeaking = true;
    try {
      await new Promise(res => setTimeout(res, 500)); // gime a sec to use the slider
      for(const word of words) {
        await word.speak(tone);
      }
    } finally {
      isSpeaking = false;
    }
  }

  toneSlider.addButton(new HoverButton('say again', speakSentence, false));
  toneSlider.addButton(new HoverButton('start over', () => !isSpeaking && setState(STATES.keyboard), false));
  
  keyboard.setSubmitCallback(async (value) => {
    setState(STATES.tone_slider);
    objectifyWords(value);
    speakSentence();
  });
});