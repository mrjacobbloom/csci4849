process.env.GOOGLE_APPLICATION_CREDENTIALS = __dirname + '/credentials.json';

const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const dialogflow = require('dialogflow');
const PORT = process.env.PORT || 5000;

const sessionClient = new dialogflow.SessionsClient();
const contextClient = new dialogflow.ContextsClient();

const app = express()
  .use(express.static(path.join(__dirname, 'public')))
  //.use(bodyParser.urlencoded({extended: true}))
  //.use(bodyParser.json())
  .use(session({secret: 'foo'}))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs');

app.get('/', (req, res) => {
  req.session.sessionPath = sessionClient.sessionPath('csci4849-toaster', req.sessionID);
  
  res.render('pages/index', {sessionID: req.sessionID})
});

app.post('/analyze_audio', (req, res) => {
  req.on('readable', async () => {

    /*const greq = {
      session: req.session.sessionPath,
      queryInput: {
        audioConfig: {
          audioEncoding: 'AUDIO_ENCODING_OGG_OPUS',
          sampleRateHertz: 16000,
          languageCode: 'en',
        },
      },
      inputAudio: req.read(),
    };*/
    const greq = {
      session: req.session.sessionPath,
      queryInput: {
        text: {
          // The query to send to the dialogflow agent
          text: 'hello',
          // The language used by the client (en-US)
          languageCode: 'en-US',
        },
      },
    };

    // Recognizes the speech in the audio and detects its intent.
    const [gres] = await sessionClient.detectIntent(greq);

    console.log(gres);
  });
  //console.log(req.body)
  res.send('POST request to the homepage')
});


app.post('/analyze_text', (req, res) => {
  req.on('readable', async () => {
    const greq = {
      session: req.session.sessionPath,
      queryInput: {
        text: {
          // The query to send to the dialogflow agent
          text: req.read().toString(),
          // The language used by the client (en-US)
          languageCode: 'en-US',
        },
      }
  
    };

    const [[gresult], [contexts]] = await Promise.all([
      await sessionClient.detectIntent(greq),
      await contextClient.listContexts({parent: req.session.sessionPath})
    ]);
    gresult.contexts = contexts;

    res.send(gresult);
    console.log(gresult);
  });
});


app.listen(PORT, () => console.log(`Listening on ${ PORT }`));