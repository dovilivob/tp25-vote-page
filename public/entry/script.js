let viewer_alias = "";
let owner_list = [];
let email_list = {};
const UNIQUE_TAG = "TBC001";
const ARTIST_ADDR = "tz1Z8Xwm2qWnWWtL3MJ7T3A9uLmaQJiy8Uct";

const search = new URLSearchParams(window.location.search);

const viewer_address = search.get("viewer") ?? 0;
get_viewer_alias(viewer_address);

const addr_confirmed = search.get("addr-confirmed") ?? 0;
const email_confirmed = search.get("email-confirmed") ?? 0;


async function get_email_list() {
    let res = await fetch('../assets/emails.json');
    let json_data = await res.json();
    email_list = json_data;
    if (email_list[viewer_address] != null) window.location = `/?viewer=${viewer_address}`
    console.log(email_list)
}

async function get_viewer_alias(addr) {
    if (addr != "guest") {
        const api_url = `https://api.akaswap.com/v2/accounts/${addr}/alias`;
        let res = await fetch(api_url);
        let json_data = await res.json();
        viewer_alias = json_data;
        console.log(viewer_alias);
        document.getElementById("viewer-alias").innerHTML = viewer_alias;
    }
}

async function get_owner_list() {
    const api_url = `https://api.akaswap.com/v2/accounts/${ARTIST_ADDR}/creations?tag=${UNIQUE_TAG}`;
    let res = await fetch(api_url);
    let json_data = await res.json();
    let owner_list_obj = json_data.tokens[0].owners;
    console.log(owner_list_obj);
    Object.keys(owner_list_obj).forEach((key) => {
        console.log(`${key}\t-->\t${owner_list_obj[key]}`);
        owner_list.push(key);
    });
    console.log(owner_list);
    if (!owner_list.includes(viewer_address)) window.location.href = "/?viewer=guest";
    else console.log("you are one of the owners");
}

get_owner_list();
get_email_list();

const main_container = document.querySelector(".main-container");
const ask_addr_container = document.querySelector(".ask-address");
const ask_email_container = document.querySelector(".ask-email");

document.getElementById("viewer-address").innerHTML = viewer_address;

console.log(owner_list)

ask_addr_container.style.display =
    addr_confirmed ? "none" : "block";

ask_email_container.style.display =
    addr_confirmed && !email_confirmed ? "block" : "none";

function go_url() {
    window.location = `/entry?viewer=${viewer_address}&addr-confirmed=1`;
}

function go_back() {
    window.location = "https://akaswap.com/akaobj/11892";
}

function submit_email() {
    let email_form = document.getElementById('email-form');
    let email = email_form.elements['user-email'].value
    console.log(email);
    alert(viewer_address + "-->" + email);
    email_form.action = `/submitemail?viewer=${viewer_address}&email=${email}`;
}

