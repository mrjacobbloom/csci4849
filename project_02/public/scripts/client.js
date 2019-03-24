import parseDuration from 'https://dev.jspm.io/parse-duration';

let prevmode = null;
let mode = null;
let duration = null;
let startTime = null;
function updateMode(contexts) {
  const contexts2 = contexts.map(c => c.name.split('/').pop());
  prevmode = mode;
  mode = contexts2[0] || 'mode_none';

  if(prevmode !== mode) { // mode changed, let's do things!
    console.log(`mode changed from ${prevmode} to ${mode}`);
    document.body.classList.remove(prevmode);
    document.body.classList.add(mode);
    if(prevmode == 'mode_toasting') duration = null;
    document.querySelector('#insert-bread').classList.toggle('disabled', mode != 'mode_none');
    document.querySelector('#remove-toast').classList.toggle('disabled', mode != 'mode_done');
    if(mode == 'mode_done') {
      let audio = new Audio('/confirm.mp3');
      audio.play();
    }
  }
}
function parseParams(params) {
  const fields = params && params.fields;
  if(!fields || !Object.keys(fields).length) return;
  startTime = Date.now();
  duration = 0;
  if(fields['toast-preset']) {
    switch(fields['toast-preset'].stringValue) {
      case 'rare toast': duration = 30000; break;
      case 'medium toast': duration = 60000; break;
      case 'burnt toast': duration = 120000; break;
      case 'bagel': duration = 60000; break;
    }
  } else if(fields['duration']) {
    const f = fields['duration'].structValue.fields;
    duration = parseDuration(`${f.amount.numberValue} ${f.unit.stringValue}`);
  }
}

// adapted from https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder
window.addEventListener('load', () => {
  //if (!navigator.mediaDevices) throw 'FFFFFFF';
  /*let chunks = [];
  
  const record = document.querySelector('#record');
  const stop = document.querySelector('#stop');
  
  navigator.mediaDevices.getUserMedia({ audio: true })
  .then(function(stream) {
  
    const mediaRecorder = new MediaRecorder(stream, {
      audioBitsPerSecond : 16000
    });
  
    record.onclick = function() {
      mediaRecorder.start();
    }
  
    stop.onclick = function() {
      mediaRecorder.stop();
    }
  
    mediaRecorder.onstop = async function(e) {
      const blob = new Blob(chunks, { 'type' : 'audio/ogg; codecs=opus' });
      chunks = [];

      fetch('/analyze_audio', {
        method: 'POST',
        body: blob,
      });
    }
  
    mediaRecorder.ondataavailable = function(e) {
      chunks.push(e.data);
    }
  });*/

  const $output = document.querySelector('#output');
  const $input = document.querySelector('#input');
  $input.focus();
  const output = msg => {
    if(!msg) return;
    $output.textContent = msg;
    if(prevmode != mode && mode == 'mode_done') return; // don't speak, we're gonna play the toast noise instead
    var utterThis = new SpeechSynthesisUtterance(msg);
    speechSynthesis.speak(utterThis);
  }

  const sendInput = (msg, clearInput = true) => {
    fetch('/analyze_text', {
      method: 'POST',
      body: msg,
      headers: {
        "Content-Type": "text/plain"
      },
    }).then(res => res.json()).then(res => {
      if(clearInput) $input.value = '';
      updateMode(res.contexts);
      parseParams(res.queryResult.parameters);
      let rmsg = res.queryResult.fulfillmentText;
      if(rmsg == 'Your toast will be ready in DURATION.' && duration) {
        rmsg = `Your toast will be ready in ${Math.round((duration + startTime - Date.now()) / 1000)} seconds.`;
      }
      output(rmsg)
    });
  };

  $input.addEventListener('keyup', e => {
    if(e.keyCode == 13) {
      e.preventDefault();
      e.stopPropagation();
      sendInput($input.value);
      return false;
    }
  });

  // I couldn't get events working so explicit state changes happen through specific commands
  sendInput('cmd welcome');

  const $toast = document.querySelector('#toast');
  setInterval(() => {
    if(mode == 'mode_toasting' && duration) {
      let toastedness = Math.min((Date.now() - startTime) / 30000, 1);
      $toast.setAttribute('style', `--toastedness: ${toastedness};`);
      if(Date.now() > startTime + duration) sendInput('cmd toast finishes');
    } else if(mode == 'mode_none') {
      $toast.setAttribute('style', `--toastedness: 0;`);
    }
  }, 1000);

  document.querySelector('#insert-bread').addEventListener('click', () => sendInput('cmd insert bread'));
  document.querySelector('#remove-toast').addEventListener('click', () => sendInput('cmd remove toast'));
});