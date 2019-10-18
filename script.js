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
/**
 * Noah helped me get connected to the API
 */

const marvelKeyPublic = '4be43da26f4e8d17b4c2804ae80c48d3';
const marvelKeyPrivate = '1e512f1ad0b7af9586a731e12e07db918d04d8fb';
//getAuthUrl gets the authorized url with given API keys
function getAuthUrl() {
  let timestamp = Date.now();
  let hash = md5(timestamp + marvelKeyPrivate + marvelKeyPublic);
  let auth = `?&ts=${timestamp}&apikey=${marvelKeyPublic}&hash=${hash}`;
  return auth;
}

const baseUrl = 'https://gateway.marvel.com/v1/public' + getAuthUrl(); // set baseUrl to main marvel info
const charactersUrl = 'https://gateway.marvel.com:443/v1/public/characters' + getAuthUrl(); // set charactersUrl to url of all Marvel characters

const charactersTabButton = document.querySelector('.x-men'); //get character tab button
const characterImage = document.querySelector('.char-image-box'); //get character image box
const characterBio = document.querySelector('.character-bio'); //get character bio paragraph
const characterName = document.querySelector('.character-name');

charactersTabButton.addEventListener('click', function(e) {
  e.preventDefault();
  fetch(charactersUrl)
    .then(res => res.json())
    .then(res => {
      console.log(res);
      //get random character
      let i = 0;
      i = Math.floor(Math.random() * res.data.results.length);
      // console.log(i);

      //imageUrl = concats the image url and extension together into one string
      let imageUrl = res.data.results[i].thumbnail.path + '.' + res.data.results[i].thumbnail.extension;
      // console.log(imageUrl);
      characterImage.style.backgroundImage = `url(${imageUrl})`;
      characterBio.innerHTML = res.data.results[i].description;
      characterName.innerHTML = res.data.results[i].name;
    })
    .catch(err => console.log(err));
});
