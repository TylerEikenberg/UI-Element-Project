let tabButtons = document.querySelectorAll('.tabContainer .buttonContainer button');
let tabPanels = document.querySelectorAll('.tabContainer .tabPanel');

function showPanel(panelIndex, colorCode) {
  tabButtons.forEach(function(node) {
    node.style.backgroundColor = '';
    node.style.color = '';
  });
  tabButtons[panelIndex].style.backgroundColor = colorCode;
  tabButtons[panelIndex].style.color = 'white';
  tabPanels.forEach(function(node) {
    node.style.display = 'none';
  });
  tabPanels[panelIndex].style.display = 'block';
  tabPanels[panelIndex].style.backgroundColor = colorCode;
}

showPanel(0, '#8406a1');
/**
 * **************************************************************************
 */

const marvelKeyPublic = '4be43da26f4e8d17b4c2804ae80c48d3';
const marvelKeyPrivate = '1e512f1ad0b7af9586a731e12e07db918d04d8fb';

function getAuthUrl() {
  let timestamp = Date.now();
  let hash = md5(timestamp + marvelKeyPrivate + marvelKeyPublic);
  let auth = `?&ts=${timestamp}&apikey=${marvelKeyPublic}&hash=${hash}`;
  return auth;
}
// set charactersUrl to url of all Marvel characters
const baseUrl = 'https://gateway.marvel.com/v1/public';
const charactersUrl = 'https://gateway.marvel.com:443/v1/public/characters' + getAuthUrl();

fetch(charactersUrl)
  .then(res => res.json())
  .then(res => {
    console.log(res);
  })
  .catch(err => console.log(err));

// fetch(url, {
//     headers: {
//       'cat-api-key': '947a2018-feec-4a13-a15d-081376ec218a',
//     },
//   })
//     .then(res => res.json())
//     .then(res => {
//       catImage = res[0].url;
//       console.log(res);
//       console.log(catImage);
//       img.src = catImage;
//     })

//     .catch(err => console.log(err));
// });
