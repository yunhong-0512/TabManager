let container = document.getElementById('container');

document.addEventListener('DOMContentLoaded', function() {
  chrome.tabs.query({currentWindow: true}, function (tabs) {
    for (let i = 0; i < tabs.length; i++) {
      console.log(i);
      let newDiv = document.createElement('div');
      newDiv.innerHTML = tabs[i].title;
      container.appendChild(newDiv);
    }
    console.log(tabs);
  });
});

