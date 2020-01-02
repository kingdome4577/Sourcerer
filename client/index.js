import { token } from './token.js';
// console.log(token.auth);
// import React from 'react';
// import { render } from 'react-dom';
// import { BrowserRouter } from 'react-router-dom';
// import App from './App';

// render(
//   <BrowserRouter>
//     <App />
//   </BrowserRouter>,
//   document.getElementById('app')
// );

const btnRepos = document.getElementById('btnRepos');
const btnIssues = document.getElementById('btnIssues');
const btnIssuesPrivate = document.getElementById('btnIssuesPrivate');
const btnCreateIssue = document.getElementById('btnCreateIssue');
const btnCommits = document.getElementById('btnCommits');
const divResult = document.getElementById('divResult');
btnRepos.addEventListener('click', getRepos);
btnIssues.addEventListener('click', getIssues);
btnIssuesPrivate.addEventListener('click', getIssuesPrivate);
btnCreateIssue.addEventListener('click', createIssue);
btnCommits.addEventListener('click', e => getCommits());

async function getRepos() {
  clear();
  // still need to modularize these search parameters for query string
  const url = 'https://api.github.com/search/repositories?q=stars:50000..300000';
  const response = await fetch(url);
  const result = await response.json();

  result.items.forEach(i => {
    console.log(i);
    const img = document.createElement('img');
    img.src = i.owner.avatar_url;
    img.style.width = '32px';
    img.style.height = '32px';
    const anchor = document.createElement('a');
    anchor.href = i.html_url;
    anchor.textContent = i.name;
    divResult.appendChild(img);
    divResult.appendChild(anchor);
    divResult.appendChild(document.createElement('br'));
  });
}

async function getIssues() {
  clear();
  // still need to add modular repo selection
  const url = 'https://api.github.com/search/issues?q=repo:freecodecamp/freecodecamp type:issue';
  const response = await fetch(url);
  const result = await response.json();

  result.items.forEach(i => {
    console.log(i);
    const anchor = document.createElement('a');
    anchor.href = i.html_url;
    anchor.textContent = i.title;
    divResult.appendChild(anchor);
    divResult.appendChild(document.createElement('br'));
  });
}

async function getIssuesPrivate() {
  clear();
  const headers = {
    Authorization: token.auth
  };
  const url =
    'https://api.github.com/search/issues?q=repo:jsonroyjones/sourcerer type:issue state:open';
  const response = await fetch(url);
  const result = await response.json();

  result.items.forEach(i => {
    console.log(i);
    const anchor = document.createElement('a');
    anchor.href = i.html_url;
    anchor.textContent = i.title;
    divResult.appendChild(anchor);
    divResult.appendChild(document.createElement('br'));
  });
}

async function getCommits(
  // still need to modularize this function for multiple search parameters
  url = 'https://api.github.com/search/commits?q=test repo:freecodecamp/freecodecamp author-date:2018-03-01..2019-03-31'
) {
  clear();

  const headers = {
    Accept: 'application/vnd.github.cloak-preview'
  };
  const response = await fetch(url, {
    method: 'GET',
    headers: headers
  });

  const link = response.headers.get('link');
  const links = link.split(',');
  const urls = links.map(a => {
    return {
      url: a
        .split(';')[0]
        .replace('<', '')
        .replace('>', ''),
      title: a.split(';')[1]
    };
  });
  const result = await response.json();

  result.items.forEach(i => {
    console.log(i);
    const img = document.createElement('img');
    img.src = i.author.avatar_url;
    img.style.width = '32px';
    img.style.height = '32px';
    const anchor = document.createElement('a');
    anchor.href = i.html_url;
    anchor.textContent = i.commit.message.substr(0, 120) + '...';
    divResult.appendChild(img);
    divResult.appendChild(anchor);
    divResult.appendChild(document.createElement('br'));
  });

  urls.forEach(u => {
    const btn = document.createElement('button');
    btn.textContent = u.title.split('"')[1];
    btn.addEventListener('click', e => getCommits(u.url));
    divResult.appendChild(btn);
  });
}

async function createIssue() {
  clear();
  // still need to add modular repo selection
  const url = 'https://api.github.com/repos/jsonroyjones/sourcerer/issues';
  const headers = {
    Authorization: token.auth
  };
  const payload = {
    title: 'Testing the create issue',
    body: 'works'
  };
  const response = await fetch(url, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(payload)
  });
  const result = await response.json();

  const i = result;
  console.log(i);
  const anchor = document.createElement('a');
  anchor.href = i.html_url;
  anchor.textContent = i.title;
  divResult.appendChild(anchor);
  divResult.appendChild(document.createElement('br'));
}

function clear() {
  while (divResult.firstChild) divResult.removeChild(divResult.firstChild);
}
