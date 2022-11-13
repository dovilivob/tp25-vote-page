const express = require('express');
const serveIndex = require('serve-index');
const fs = require('fs');
const path = require('path')
const url = require('url')

const app = express();

const PORT = 3001;
const src_filename = './public/assets/data.json'
const TOTAL_Q = 2;

app.use(express.static(path.join(__dirname, 'public')));

function writeJSON(q, i) {
  fs.readFile(src_filename, 'utf-8', (err, data) => {
    let jsondata = JSON.parse(data)
    let targetWeight = jsondata.polls[q].answersWeight[i]
    console.log(jsondata[0].answersWeight)
    jsondata[q].answersWeight[i] = targetWeight + 1;
    jsondata[q].pollCount = jsondata[q].pollCount + 1
    console.log(jsondata[0].answersWeight)

    fs.writeFile(src_filename, JSON.stringify(jsondata), (err) => {
      if (err) console.log(err)
      else {
        console.log("File written successfully\n");
        console.log("The written has the following contents:");
        console.log(fs.readFileSync(src_filename, "utf8"));
      }
    })
  })
}

app.use((req, res, next) => {
  console.log('Time: ', Date.now());
  next();
})

app.use('/entry', (req, res, next) => {
  console.log('Request type: ', req.method);
  let url_query = url.parse(req.url, true);
  let qdata = url_query.query;
  console.log(qdata)

  res.redirect(`/?viewer=${qdata.viewer}`);
})


app.use('/submitvotedata', (req, res, next) => {
  console.log('Request type: ', req.method);
  let url_query = url.parse(req.url, true);
  let qdata = url_query.query;
  console.log(qdata)

  writeJSON(qdata.q, qdata.i);
  let next_q = parseInt(qdata.q) + 1;
  res.redirect((next_q < TOTAL_Q) ? `/?q=${next_q}` : '/thanks')
  res.redirect(`/?q=${parseInt(qdata.q) + 1}`);
  next();
});


app.use('/thanks', (req, res, next) => {
  console.log('Request type: ', req.method);

})
// app.use('/public', express.static('public'));
// app.use('/public', serveIndex('public'));

app.get('/', (req, res) => {
  res.send('Seccessfully reponse!!')
})


app.listen(PORT, () => console.log('Server listening at https://tp25.2enter.art/'))

