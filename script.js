class Tabs {
  constructor(tabButtons, tabPanels) {
    this.tabButtons = tabButtons;
    this.tabPanels = tabPanels;
  }
  showPanel(panelIndex, colorCode) {
    this.tabButtons.forEach(function(node) {
      node.style.backgroundColor = '';
      node.style.color = '';
    });
    this.tabButtons[panelIndex].style.backgroundColor = colorCode;
    this.tabButtons[panelIndex].style.color = 'white';
    this.tabPanels.forEach(function(node) {
      node.style.display = 'none';
    });
    this.tabPanels[panelIndex].style.display = 'flex';
    this.tabPanels[panelIndex].style['flex-direction'] = 'column';
    this.tabPanels[panelIndex].style.backgroundColor = colorCode;
  }
}

let mainTabs = new Tabs(
  document.querySelectorAll('.tabContainer .buttonContainer button'),
  document.querySelectorAll('.tabContainer .tabPanel')
);
mainTabs.showPanel(0, '#f3d403');

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
  let auth = `&ts=${timestamp}&apikey=${marvelKeyPublic}&hash=${hash}`;
  return auth;
}

const baseUrl = 'https://gateway.marvel.com/v1/public' + getAuthUrl(); // set baseUrl to main marvel info
let limit = 100;
let offset = 0;
let name = 'Spider-Man';
const charactersUrl = `https://gateway.marvel.com:443/v1/public/characters?limit=${limit}` + getAuthUrl(); // set charactersUrl to url of all Marvel characters
// const limitAndOffset = ?limit=60&offset=20

const charactersTabButton = document.querySelector('.marvelCharacters'); //get character tab button
const characterImage = document.querySelector('.char-image-box'); //get character image box
const characterBio = document.querySelector('.character-bio'); //get character bio paragraph
const characterName = document.querySelector('.character-name');

// Store all the characetrs here
// const characterMap = {};

const l = document.getElementById('loading-indicator');
const o = document.getElementById('loading-overlay');

charactersTabButton.addEventListener('click', function(e) {
  e.preventDefault();
  // Get all characters
  // Trigger loading
  l.style.display = 'block';
  o.style.display = 'block';

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
      console.log(res.data.results[i].description);
      characterName.innerHTML = res.data.results[i].name;
      // Add to character map
      l.style.display = 'none';
      o.style.display = 'none';
    })
    .catch(err => console.log(err));
});

/**
 * Retrieving all characters
 *
 */
const storedMap = window.localStorage.getItem('@marvel-character-map');
const characterMap = storedMap ? JSON.parse(storedMap) : {};

// Add each character into the map keyed off by name and value equal to the rest of the characeter data
const buildCharacterMap = characters => {
  for (let i = 0; i < characters.length; i++) {
    // Get current character
    const character = characters[i];
    // Add name to character map as key and set value characters info
    characterMap[character.name] = character;
  }
};

//function charactersUrl gets a new url using the limit and offset values
const getCharactersUrl = (limit, offset) =>
  `https://gateway.marvel.com:443/v1/public/characters?limit=${limit}&offset=${offset}` + getAuthUrl();

const getAllCharacters = characterResults => {
  let limit = 100;
  let offset = 0;
  let totalCharacters;

  fetch(getCharactersUrl(limit, offset))
    .then(res => res.json())
    .then(res => {
      buildCharacterMap(res.data.results);
      totalCharacters = res.data.total;
      //Loop through and retrieve 100 new characters every loop and continue looping until offset >= totalCharacters
      for (let i = 100; i <= totalCharacters; i += 100) {
        fetch(getCharactersUrl(limit, i))
          .then(res => res.json())
          .then(res => {
            buildCharacterMap(res.data.results);
            window.localStorage.setItem('@marvel-character-map', JSON.stringify(characterMap));
          });
      }
    });
};

// Only query for the data again when characterMap loaded is empty
if (Object.keys(characterMap).length === 0) {
  getAllCharacters();
}
