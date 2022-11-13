const contractADDR = 'KT1AFq5XorPduoYyWxs5gEyrFK6fVjJVbtCj';
const uniqueTAG = 'TBC001';
const artistADDR = 'tz1Z8Xwm2qWnWWtL3MJ7T3A9uLmaQJiy8Uct';

let canGoNext = false;

let search = new URLSearchParams(window.location.search)

let qNum = search.get('q') ?? 0;
const viewer_address = search.get('viewer')
let poll, pollDOM;

let owner_list = -1;
get_owner_list();

fetch('../assets/data.json')
  .then(res => res.json())
  .then(json => main(json))


async function get_owner_list() {
  let api_url = `https://api.akaswap.com/v2/accounts/${artistADDR}/creations?tag=${uniqueTAG}`;
  let res = await fetch(api_url);
  let json_data = await res.json();
  owner_list = await json_data.tokens[0].owners;
  Object.keys(owner_list).forEach(key => {
    if (![artistADDR, 'KT1Dn3sambs7KZGW88hH2obZeSzfmCmGvpFo'].includes(key)) {
      console.log(`| ${key}\t-->\t${owner_list[key]}\t|`);
    }
  });
}

function array_equals(a, b) {
  return Array.isArray(a) &&
    Array.isArray(b) &&
    a.length === b.length &&
    a.every((val, index) => val === b[index]);
}

function main(polls_json) {
  const viewer_vote_status
    = polls_json.auths[viewer_address] ?? [[0, 0], [0, 0]];
  console.log(viewer_vote_status);


  console.log(array_equals(viewer_vote_status[0], [0, 0]));
  if (viewer_vote_status != null && viewer_address != 'guest') {
    if (!array_equals(viewer_vote_status[0], [0, 0]) && array_equals(viewer_vote_status[1], [0, 0]))
      qNum = 1;
    else if (array_equals(viewer_vote_status[0], [0, 0]) && !array_equals(viewer_vote_status[1], [0, 0]))
      qNum = 0;
    else if (!array_equals(viewer_vote_status[0], [0, 0]) && !array_equals(viewer_vote_status[1], [0, 0]))
      window.location = '/thanks';
  }


  poll = polls_json.polls[qNum];

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
  window.location = `/submitvotedata?q=${qNum}&i=${index}&viewer=${viewer_address}`
}
