const contractADDR = 'KT1AFq5XorPduoYyWxs5gEyrFK6fVjJVbtCj';
const uniqueTAG = 'TBC25001';
const artistADDR = 'tz1Z8Xwm2qWnWWtL3MJ7T3A9uLmaQJiy8Uct';

let canGoNext = false;

let search = new URLSearchParams(window.location.search)

let qNum = search.get('q') ?? 0;
let poll, polls, pollDOM;

let OBJKT_ID = '';
// polls[0].answersWeight[2] = 1;

// fs.writeFile('../assets/data.json', JSON.stringify(polls), function writeJSON(err) {
//   if (err) return console.log(err);
//   console.log(JSON.stringify(polls))
//   console.log(`writing to ${polls_filename}`)
// })

GetIdByTag();

fetch('../assets/data.json')
  .then(res => res.json())
  .then(json => main(json))

async function GetIdByTag() {
  let apiUrl = `https://api.akaswap.com/v2/accounts/${artistADDR}/creations?tag=${uniqueTAG}`;
  let response = await fetch(apiUrl);
  let dataJson = await response.json();
  let objktJson = dataJson.tokens[0];
  OBJKT_ID = objktJson.tokenId;
  console.log(`objkt id: ${OBJKT_ID}`)
}

function main(polls) {

  poll = polls[qNum]

  pollDOM = {
    question: document.querySelector(".poll .question"),
    answers: document.querySelector(".poll .answers"),
    next: document.querySelector(".next"),
  };

  pollDOM.question.innerText = poll.question;
  // console.log(pollDOM.question.innerText);
  pollDOM.answers.innerHTML = poll.answers.map((answer, i) => {
    return (
      `
            <div class="answer" onclick="markAnswer('${i}')">
                ${answer}
                <span class="percentage-bar"></span>
                <span class="percentage-value"></span>
            </div>
        `
    );
  }).join("");
}

function markAnswer(i) {
  poll.selectedAnswer = +i;
  try {
    document.querySelector(
      ".poll .answers .answer .selected"
    ).classList.remove("selected");
  } catch (msg) { }
  document.querySelectorAll(
    ".poll .answers .answer"
  )[+i].classList.add("selected");
  pollDOM.next.innerHTML = `
        <button onClick="goNextPage()">Next Question</button>
    `

  showResults();
}

function showResults() {
  let answers = document.querySelectorAll(".poll .answers .answer");
  for (let i = 0; i < answers.length; i++) {
    let percentage = 0;
    if (i == poll.selectedAnswer) {
      percentage = Math.round(
        (poll.answersWeight[i] + 1) * 100 / (poll.pollCount + 1)
      );
    } else {
      percentage = Math.round(
        (poll.answersWeight[i]) * 100 / (poll.pollCount + 1)
      );
    }

    answers[i].querySelector(".percentage-bar").style.width = percentage + "%";
    answers[i].querySelector(".percentage-value").innerText = percentage + "%";
  }
}

function goNextPage(polls) {
  let index = poll.selectedAnswer
  window.location = `/submitvotedata?q=${qNum}&i=${index}`
  // poll.answersWeight[index]++;
  // polls[qNum].answersWeight = poll.answersWeight
  // console.log(poll.answersWeight)
  // console.log(poll.selectedAnswer)
}
