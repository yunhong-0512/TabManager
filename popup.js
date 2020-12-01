let container = document.getElementById('container');
let tabsCollect = [];
let tabContainers = []
let closeBtns = []

document.addEventListener('DOMContentLoaded', function() {
  chrome.tabs.query({currentWindow: true}, function (tabs) {
    tabsCollect = tabs
    for (let i = 0; i < tabs.length; i++) {
      createTab(tabs[i])
    }
    console.log(tabsCollect);
    chooseTab();
    bindClose();
  });
  
});


function chooseTab() {
  tabContainers = [...document.getElementsByClassName('title-contaner')];
  console.log(tabContainers);
  for (let i = 0; i < tabContainers.length; i++) {
    tabContainers[i].addEventListener('click', function() {
      chrome.tabs.update(tabsCollect[i].id, {'active': true})
    });
    if (tabsCollect[i].active === true) {
      tabContainers[i].parentNode.style.backgroundColor = '#bbbfca';
    }
  }
}

function createTab(obj) {
  let newDiv = document.createElement('div');

  let icon = document.createElement('img');
  icon.src = obj.favIconUrl;
  icon.classList.add('icon');
  newDiv.appendChild(icon);

  let title = document.createElement('span');
  title.innerHTML = obj.title;
  title.classList.add('title-contaner')
  newDiv.appendChild(title);

  let close = document.createElement('img');
  close.src = './images/close.png';
  close.classList.add('close');
  newDiv.appendChild(close);

  newDiv.setAttribute('id',obj.id.toString());
  document.body.appendChild(newDiv);
}

function bindClose() {
  closeBtns = [...document.getElementsByClassName('close')];
  for (let i = 0; i < closeBtns.length; i++) {
    closeBtns[i].addEventListener('click', function() {
      chrome.tabs.remove(tabsCollect[i].id);
      document.getElementById(tabsCollect[i].id.toString()).remove();
    });
  }
}

