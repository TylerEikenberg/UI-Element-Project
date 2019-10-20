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
let limit = 10;
let offset = 0;
const charactersUrl = `https://gateway.marvel.com:443/v1/public/characters?limit=${limit}` + getAuthUrl(); // set charactersUrl to url of all Marvel characters
// const limitAndOffset = ?limit=60&offset=20

const charactersTabButton = document.querySelector('.marvelCharacters'); //get character tab button
const characterImage = document.querySelector('.char-image-box'); //get character image box
const characterBio = document.querySelector('.character-bio'); //get character bio paragraph
const characterName = document.querySelector('.character-name');

/*************************************************************************** */

//loading indicator and overlay
const l = document.getElementById('loading-indicator');
const o = document.getElementById('loading-overlay');

/**Event listener to retrieve random Marvel character */
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
/************************************************************************************ */
/**The following code controls the XMEN PANEL */
const xmenCharacterMap = {
  cyclops: characterMap['Cyclops'],
  // wolverine: characterMap['Wolverine'],
  professorx: characterMap['Professor X'],
  jeangrey: characterMap['Jean Grey'],
  rogue: characterMap['Rogue'],
  beast: characterMap['Beast'],
  colossus: characterMap['Colossus'],
  kitty: characterMap['Kitty Pryde'],
  angel: characterMap['Angel (Warren Worthington III)'],
  jubilee: characterMap['Jubilee'],
  iceman: characterMap['Iceman'],
  bishop: characterMap['Bishop'],
  morph: characterMap['Morph'],
  nightcrawler: characterMap['Nightcrawler'],
  havok: characterMap['Havok'],
  psylocke: characterMap['Psylocke'],
  banshee: characterMap['Banshee'],
  dazzler: characterMap['Dazzler'],
  gambit: characterMap['Gambit'],
  magneto: characterMap['Magneto'],
  cable: characterMap['Cable'],
  emma: characterMap['Emma Frost'],
  juggernaut: characterMap['Juggernaut'],
  mystique: characterMap['Mystique'],
  quicksilver: characterMap['Quicksilver'],
  blob: characterMap['Blob'],
  domino: characterMap['Domino'],
  forge: characterMap['Forge'],
  sabretooth: characterMap['Sabretooth'],
  fantomex: characterMap['Fantomex'],
  multipleman: characterMap['Multiple Man'],
  // storm: characterMap['Storm'],
};

const xKeys = Object.keys(xmenCharacterMap); //store xmenCharacterMap keys in array xKeys

const xMenTabButton = document.querySelector('.xmenCharacters'); //get X-Men tab panel button
const xmenCharacterImage = document.querySelector('.char-image-box-xmen'); //get x-men image
const xmenBio = document.querySelector('.xmen-bio');
const xmenName = document.querySelector('.xmen-name');
const prevXMen = document.querySelector('#prevXMen');
const nextXMen = document.querySelector('#nextXMen');
let xIterator = 0;

/*******************
 * Event listeners to for functional previous and next buttons that will
 * cycle back and forth through each character
 *
 */
nextXMen.addEventListener('click', function(e) {
  e.preventDefault();
  l.style.display = 'block';
  o.style.display = 'block';
  let imageUrl =
    xmenCharacterMap[xKeys[xIterator]].thumbnail.path + '.' + xmenCharacterMap[xKeys[xIterator]].thumbnail.extension;
  xmenCharacterImage.style.backgroundImage = `url(${imageUrl})`;
  if (xmenCharacterMap[xKeys[xIterator]].description !== '') {
    //if a character has no bio, keep current paragraph text
    xmenBio.innerHTML = xmenCharacterMap[xKeys[xIterator]].description;
  }
  console.log(xmenCharacterMap[xKeys[xIterator]].description);
  xmenName.innerHTML = xmenCharacterMap[xKeys[xIterator]].name;
  //if else statement to reset character order
  if (xIterator !== xKeys.length - 1) {
    xIterator++;
  } else {
    xIterator = 0;
  }
  // Add to character map
  l.style.display = 'none';
  o.style.display = 'none';
});

prevXMen.addEventListener('click', function(e) {
  e.preventDefault();
  l.style.display = 'block';
  o.style.display = 'block';
  let imageUrl =
    xmenCharacterMap[xKeys[xIterator]].thumbnail.path + '.' + xmenCharacterMap[xKeys[xIterator]].thumbnail.extension;
  xmenCharacterImage.style.backgroundImage = `url(${imageUrl})`;
  if (!xmenCharacterMap[xKeys[xIterator]].description === '') {
    //if a character has no bio, keep current paragraph text
    xmenBio.innerHTML = xmenCharacterMap[xKeys[xIterator]].description;
  }
  console.log(xmenCharacterMap[xKeys[xIterator]].description);
  xmenName.innerHTML = xmenCharacterMap[xKeys[xIterator]].name;
  //if else statement to reset character order
  if (xIterator !== xKeys.length) {
    xIterator--;
    if (xIterator < 0) {
      xIterator = xKeys.length - 1;
    }
  } else {
    xIterator = 0;
  }
  // Add to character map
  l.style.display = 'none';
  o.style.display = 'none';
});
/************************************************* */

/*********************
 * The following code is for the AVENGERS PANEL
 *
 */

const avengersCharacterMap = {
  captainAmerica: characterMap['Captain America'],
  // spiderman: characterMap['Spider-Man'],
  ironman: characterMap['Iron Man'],
};

const avengersKeys = Object.keys(avengersCharacterMap); //store avengersCharacterMap keys in array avengersKeys
console.log(avengersKeys);

const avengersTabButton = document.querySelector('.avengersCharacters'); //get Avenger tab panel button
const avengersCharacterImage = document.querySelector('.char-image-box-avengers'); //get Avenger image
const avengersBio = document.querySelector('.avengers-bio');
const avengersName = document.querySelector('.avengers-name');
const prevAvenger = document.querySelector('#prevAvenger');
const nextAvenger = document.querySelector('#nextAvenger');
let avengerIterator = 0;

/*******************
 * Event listeners to for functional previous and next buttons that will
 * cycle back and forth through each character
 *
 */
nextAvenger.addEventListener('click', function(e) {
  e.preventDefault();
  l.style.display = 'block';
  o.style.display = 'block';
  let imageUrl =
    avengersCharacterMap[avengersKeys[avengerIterator]].thumbnail.path +
    '.' +
    avengersCharacterMap[avengersKeys[avengerIterator]].thumbnail.extension;
  avengersCharacterImage.style.backgroundImage = `url(${imageUrl})`;
  if (avengersCharacterMap[avengersKeys[avengerIterator]].description !== '') {
    //if a character has no bio, keep current paragraph text
    avengersBio.innerHTML = avengersCharacterMap[avengersKeys[avengerIterator]].description;
  }
  console.log(avengersCharacterMap[avengersKeys[avengerIterator]].description);
  xmenName.innerHTML = avengersCharacterMap[avengersKeys[avengerIterator]].name;
  //if else statement to reset character order
  if (avengerIterator !== avengersKeys.length - 1) {
    avengerIterator++;
  } else {
    avengerIterator = 0;
  }
  // Add to character map
  l.style.display = 'none';
  o.style.display = 'none';
});

prevAvenger.addEventListener('click', function(e) {
  e.preventDefault();
  l.style.display = 'block';
  o.style.display = 'block';
  let imageUrl =
    avengersCharacterMap[avengersKeys[avengerIterator]].thumbnail.path +
    '.' +
    avengersCharacterMap[avengersKeys[avengerIterator]].thumbnail.extension;
  avengersCharacterImage.style.backgroundImage = `url(${imageUrl})`;
  if (avengersCharacterMap[avengersKeys[avengerIterator]].description !== '') {
    //if a character has no bio, keep current paragraph text
    avengersBio.innerHTML = avengersCharacterMap[avengersKeys[avengerIterator]].description;
  }
  console.log(avengersCharacterMap[avengersKeys[avengerIterator]].description);
  avengersName.innerHTML = avengersCharacterMap[avengersKeys[avengerIterator]].name;
  //if else statement to reset character order
  if (avengerIterator !== avengersKeys.length) {
    avengerIterator--;
    if (avengerIterator < 0) {
      avengerIterator = avengersKeys.length - 1;
    }
  } else {
    avengerIterator = 0;
  }
  // Add to character map
  l.style.display = 'none';
  o.style.display = 'none';
});

// Only query for the data again when characterMap loaded is empty
if (Object.keys(characterMap).length === 0) {
  getAllCharacters();
}
