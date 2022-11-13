const express = require('express')
const serveIndex = require('serve-index');
const fs = require('fs');
const path = require('path')
const url = require('url')

const app = express();

const PORT = 3001;
const src_filename = './public/assets/data.json'
const TOTAL_Q = 2;

app.use(express.static(path.join(__dirname, 'public')));
const cors = require("cors");
app.use(cors());

function writeJSON(q, i, viewer) {
  fs.readFile(src_filename, 'utf-8', (err, data) => {
    let json_data = JSON.parse(data)

    if (json_data.auths[viewer] == null)
      json_data.auths[viewer] = [[0, 0], [0, 0]];

    if (viewer != 'guest') {
      for (let i of json_data.auths[viewer][q]) {
        if (i >= 1) return 0;
      }
    }

    json_data.auths[viewer][q][i] += 1;
    let targetWeight = json_data.polls[q].answersWeight[i]
    console.log(json_data.polls[0].answersWeight)
    json_data.polls[q].answersWeight[i] = targetWeight + 1;
    json_data.polls[q].pollCount = json_data.polls[q].pollCount + 1


    json_data.polls[q].answersWeight[i] = targetWeight + 1;
    console.log(json_data.polls[0].answersWeight)


    fs.writeFile(src_filename, JSON.stringify(json_data), (err) => {
      if (err) console.log(err)
      else {
        console.log("File written successfully\n");
        console.log("The written has the following contents:");
        console.log(fs.readFileSync(src_filename, "utf8"));
      }
    })
  })
}


app.use('/submitvotedata', (req, res, next) => {
  console.log('Request type: ', req.method);
  let url_query = url.parse(req.url, true);
  let q_data = url_query.query;
  console.log(q_data)

  writeJSON(q_data.q, q_data.i, q_data.viewer);

  let next_q = parseInt(q_data.q) + 1;
  res.redirect((next_q < TOTAL_Q) ? `/?q=${next_q}&viewer=${q_data.viewer}` : '/thanks')
  next();
});

app.use('/submitemail', (req, res, next) => {
  let src_filename = './public/assets/emails.json';
  console.log('email!!')
  let url_query = url.parse(req.url, true);
  let q_data = url_query.query;
  console.log(`${q_data.viewer} --> ${q_data.email}`)

  fs.readFile(src_filename, 'utf-8', (err, data) => {
    let json_data = JSON.parse(data)
    json_data[q_data.viewer] = q_data.email

    fs.writeFile(src_filename, JSON.stringify(json_data), (err) => {
      if (err) console.log(err)
      else {
        console.log("File written successfully\n");
        console.log("The written has the following contents:");
        console.log(fs.readFileSync(src_filename, "utf8"));
      }
    })
  })
  res.redirect(`/?viewer=${q_data.viewer}`);
});


app.get('/', (req, res) => {
  res.send('Successfully response!!')
})


// app.listen(PORT, () => console.log('Server listening at https://tp25.2enter.art/'))
app.listen(PORT, () => console.log('Server listening at https://tp25.2enter.art/'))

