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
mainTabs.showPanel(0, '#66565554');

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

/**
 * Retrieving all characters
 *
 */
let characterMap;
const baseStorageKey = '@marvel-character-map';

try {
  characterMap = Object.entries(window.localStorage).reduce((acc, [key, value]) => {
    if (key.startsWith(baseStorageKey)) {
      return {
        ...acc,
        ...JSON.parse(value),
      };
    }
    return acc;
  }, {});
} catch (error) {
  console.log(error);
  window.localStorage.clear();
  characterMap = {};
}

// Add each character into the map keyed off by name and value equal to the rest of the characeter data
const buildCharacterMap = characters => {
  const localCharacterMap = {};
  for (let i = 0; i < characters.length; i++) {
    // Get current character
    const character = characters[i];
    // Add name to character map as key and set value characters info
    const { name, description, id, thumbnail } = character;
    localCharacterMap[name] = {
      id,
      name,
      description,
      thumbnail,
    };
  }
  return localCharacterMap;
};

//function charactersUrl gets a new url using the limit and offset values
const getCharactersUrl = (limit, offset) =>
  `https://gateway.marvel.com:443/v1/public/characters?limit=${limit}&offset=${offset}` + getAuthUrl();

const getAllCharacters = async () => {
  let limit = 100;
  let offset = 0;
  let totalCharacters;

  if (Object.keys(characterMap).length > 0) {
    return;
  }

  // Add loading indicator set spinning
  l.style.display = 'block';
  o.style.display = 'block';
  // Fetch data
  const res = await fetch(getCharactersUrl(limit, offset)).then(res => res.json());
  characterMap = buildCharacterMap(res.data.results);
  window.localStorage.setItem(`${baseStorageKey}0`, JSON.stringify(characterMap));
  totalCharacters = res.data.total;
  //Loop through and retrieve 100 new characters every loop and continue looping until offset >= totalCharacters
  for (let i = limit; i <= totalCharacters; i += limit) {
    await fetch(getCharactersUrl(limit, i))
      .then(res => res.json())
      .then(res => {
        const results = buildCharacterMap(res.data.results);
        characterMap = {
          ...characterMap,
          ...results,
        };
        window.localStorage.setItem(`${baseStorageKey}${i / limit}`, JSON.stringify(results));
      });
  }

  // Add loading indicator set spinning false
  l.style.display = 'none';
  o.style.display = 'none';
};

// Only query for the data again when characterMap loaded is empty
getAllCharacters().then(() => {
  // We retrieved all the characters
  const charMapKeys = Object.keys(characterMap);

  const nameInput = document.querySelector('#name-input');
  const submitButton = document.querySelector('#submit');

  submitButton.addEventListener('click', function(e) {
    e.preventDefault();
    for (let i = 0; i < charMapKeys.length; i++) {
      if (nameInput.value === charMapKeys[i]) {
        let imageUrl =
          characterMap[charMapKeys[i]].thumbnail.path + '.' + characterMap[charMapKeys[i]].thumbnail.extension;
        characterImage.style.backgroundImage = `url(${imageUrl})`;
        characterBio.innerHTML = characterMap[charMapKeys[i]].description;

        characterName.innerHTML = characterMap[charMapKeys[i]].name;
      }
    }
  });

  /************************************************************************************ */
  /**The following code controls the XMEN PANEL */
  const xmenCharacterMap = {
    cyclops: characterMap['Cyclops'],
    wolverine: characterMap['Wolverine'],
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
    storm: characterMap['Storm'],
  };

  const xKeys = Object.keys(xmenCharacterMap); //store xmenCharacterMap keys in array xKeys
  const xMenDefaultBio =
    'The X-Men are a team of mutants assembled and led by Charles Xavier who use their combined powers to protect mutants, humanity, the world and to promote equality between mutants and humans.';
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
    if (xIterator === xKeys.length - 1) {
      xIterator = 0;
    } else {
      xIterator++;
    }

    let imageUrl =
      xmenCharacterMap[xKeys[xIterator]].thumbnail.path + '.' + xmenCharacterMap[xKeys[xIterator]].thumbnail.extension;
    xmenCharacterImage.style.backgroundImage = `url(${imageUrl})`;
    if (xmenCharacterMap[xKeys[xIterator]].description !== '') {
      //if a character has no bio, keep current paragraph text
      xmenBio.innerHTML = xmenCharacterMap[xKeys[xIterator]].description;
    } else {
      xmenBio.innerHTML = xMenDefaultBio;
    }
    xmenName.innerHTML = xmenCharacterMap[xKeys[xIterator]].name;
    //if else statement to reset character order
  });

  prevXMen.addEventListener('click', function(e) {
    e.preventDefault();

    if (xIterator === 0) {
      xIterator = xKeys.length - 1;
    } else {
      xIterator--;
    }

    let imageUrl =
      xmenCharacterMap[xKeys[xIterator]].thumbnail.path + '.' + xmenCharacterMap[xKeys[xIterator]].thumbnail.extension;
    xmenCharacterImage.style.backgroundImage = `url(${imageUrl})`;
    if (xmenCharacterMap[xKeys[xIterator]].description !== '') {
      //if a character has no bio, keep current paragraph text
      xmenBio.innerHTML = xmenCharacterMap[xKeys[xIterator]].description;
    } else {
      xmenBio.innerHTML = xMenDefaultBio;
    }

    xmenName.innerHTML = xmenCharacterMap[xKeys[xIterator]].name;
  });
  /************************************************* */

  /*********************
   * The following code is for the AVENGERS PANEL
   *
   */

  const avengersCharacterMap = {
    nickfury: characterMap['Nick Fury'],
    captainAmerica: characterMap['Captain America'],
    spiderman: characterMap['Spider-Man'],
    ironman: characterMap['Iron Man'],
    blackwidow: characterMap['Black Widow'],
    hulk: characterMap['Hulk'],
    thor: characterMap['Thor'],
    falcon: characterMap['Falcon'],
    antman: characterMap['Ant-Man (Scott Lang)'],
    hankpym: characterMap['Hank Pym'],
    scarlet: characterMap['Scarlet Witch'],
    blackpanther: characterMap['Black Panther'],
    hawkeye: characterMap['Hawkeye'],
    msmarvel: characterMap['Ms. Marvel (Kamala Khan)'],
    captainMarvel: characterMap['Captain Marvel (Carol Danvers)'],
    shield: characterMap['S.H.I.E.L.D.'],
    namor: characterMap['Namor'],
    moonknight: characterMap['Moon Knight'],
    captainBritain: characterMap['Captain Britain'],
    lukecage: characterMap['Luke Cage'],
    nova: characterMap['Nova'],
    ironfist: characterMap['Iron Fist (Danny Rand)'],
    jessica: characterMap['Jessica Jones'],
    drstrange: characterMap['Doctor Strange'],
    daredevil: characterMap['Daredevil'],
    ironpatriot: characterMap['Iron Patriot'],
    ghostrider: characterMap['Ghost Rider (Johnny Blaze)'],
    punisher: characterMap['Punisher'],
    deadpool: characterMap['Deadpool'],
  };

  const avengersKeys = Object.keys(avengersCharacterMap); //store avengersCharacterMap keys in array avengersKeys

  const avengersCharacterImage = document.querySelector('.char-image-box-avengers'); //get Avenger image
  const avengersBio = document.querySelector('.avengers-bio');
  const avengersName = document.querySelector('.avengers-name');
  const prevAvenger = document.querySelector('#prevAvenger');
  const nextAvenger = document.querySelector('#nextAvenger');
  const avengersDefaultBio =
    'The Avengers are a team of superheroes assembled by Nick Fury and the intelligence agency S.H.I.E.L.D. through the Avengers Initiative.';
  let avengerIterator = 0;

  /*******************
   * Event listeners to for functional previous and next buttons that will
   * cycle back and forth through each character
   *
   */
  nextAvenger.addEventListener('click', function(e) {
    e.preventDefault();
    if (avengerIterator !== avengersKeys.length - 1) {
      avengerIterator++;
    } else {
      avengerIterator = 0;
    }

    let imageUrl =
      avengersCharacterMap[avengersKeys[avengerIterator]].thumbnail.path +
      '.' +
      avengersCharacterMap[avengersKeys[avengerIterator]].thumbnail.extension;
    avengersCharacterImage.style.backgroundImage = `url(${imageUrl})`;
    if (avengersCharacterMap[avengersKeys[avengerIterator]].description !== '') {
      //if a character has no bio, keep current paragraph text
      avengersBio.innerHTML = avengersCharacterMap[avengersKeys[avengerIterator]].description;
    } else {
      avengersBio.innerHTML = avengersDefaultBio;
    }
    avengersName.innerHTML = avengersCharacterMap[avengersKeys[avengerIterator]].name;
  });

  prevAvenger.addEventListener('click', function(e) {
    e.preventDefault();
    if (avengerIterator !== avengersKeys.length) {
      avengerIterator--;
      if (avengerIterator < 0) {
        avengerIterator = avengersKeys.length - 1;
      }
    } else {
      avengerIterator = 0;
    }
    let imageUrl =
      avengersCharacterMap[avengersKeys[avengerIterator]].thumbnail.path +
      '.' +
      avengersCharacterMap[avengersKeys[avengerIterator]].thumbnail.extension;
    avengersCharacterImage.style.backgroundImage = `url(${imageUrl})`;
    if (avengersCharacterMap[avengersKeys[avengerIterator]].description !== '') {
      //if a character has no bio, keep current paragraph text
      avengersBio.innerHTML = avengersCharacterMap[avengersKeys[avengerIterator]].description;
    } else {
      avengersBio.innerHTML = avengersDefaultBio;
    }
    avengersName.innerHTML = avengersCharacterMap[avengersKeys[avengerIterator]].name;
  });

  /*************************************************************************
   * The following code is for the GUARDIANS OF THE GALAXY panel
   * */

  const gotgCharacterMap = {
    starlord: characterMap['Star-Lord (Peter Quill)'],
    gamora: characterMap['Gamora'],
    drax: characterMap['Drax'],
    groot: characterMap['Groot'],
    rocket: characterMap['Rocket Raccoon'],
    mantis: characterMap['Mantis'],
    cosmo: characterMap['Cosmo (dog)'],
    adam: characterMap['Adam Warlock'],
    quasar: characterMap['Quasar (Phyla-Vell)'],
    moondragon: characterMap['Moondragon'],
    betaray: characterMap['Beta-Ray Bill'],
  };

  const gotgKeys = Object.keys(gotgCharacterMap); //store gotgCharacterMap keys in array gotgKeys

  const gotgTabButton = document.querySelector('.gotgCharacters'); //get Gotg tab panel button
  const gotgCharacterImage = document.querySelector('.char-image-box-gotg'); //get GOTG image
  const gotgBio = document.querySelector('.gotg-bio');
  const gotgName = document.querySelector('.gotg-name');
  const prevGotg = document.querySelector('#prevGotg');
  const nextGotg = document.querySelector('#nextGotg');
  gotgDefaultBio =
    'The Guardians of the Galaxy are a band of intergalactic outlaws, who teamed together to protect the galaxy from planetary threats.';
  let gotgIterator = 0;

  /*******************
   * Event listeners to for functional previous and next buttons that will
   * cycle back and forth through each character
   *
   */
  nextGotg.addEventListener('click', function(e) {
    e.preventDefault();
    if (gotgIterator !== gotgKeys.length - 1) {
      gotgIterator++;
    } else {
      gotgIterator = 0;
    }
    let imageUrl =
      gotgCharacterMap[gotgKeys[gotgIterator]].thumbnail.path +
      '.' +
      gotgCharacterMap[gotgKeys[gotgIterator]].thumbnail.extension;
    gotgCharacterImage.style.backgroundImage = `url(${imageUrl})`;
    if (gotgCharacterMap[gotgKeys[gotgIterator]].description !== '') {
      //if a character has no bio, keep current paragraph text
      gotgBio.innerHTML = gotgCharacterMap[gotgKeys[gotgIterator]].description;
    } else {
      gotgBio.innerHTML = gotgDefaultBio;
    }
    gotgName.innerHTML = gotgCharacterMap[gotgKeys[gotgIterator]].name;
  });

  prevGotg.addEventListener('click', function(e) {
    e.preventDefault();
    if (gotgIterator !== gotgKeys.length) {
      gotgIterator--;
      if (gotgIterator < 0) {
        gotgIterator = gotgKeys.length - 1;
      }
    } else {
      gotgIterator = 0;
    }
    let imageUrl =
      gotgCharacterMap[gotgKeys[gotgIterator]].thumbnail.path +
      '.' +
      gotgCharacterMap[gotgKeys[gotgIterator]].thumbnail.extension;
    gotgCharacterImage.style.backgroundImage = `url(${imageUrl})`;
    if (gotgCharacterMap[gotgKeys[gotgIterator]].description !== '') {
      //if a character has no bio, keep current paragraph text
      gotgBio.innerHTML = gotgCharacterMap[gotgKeys[gotgIterator]].description;
    } else {
      gotgBio.innerHTML = gotgDefaultBio;
    }

    gotgName.innerHTML = gotgCharacterMap[gotgKeys[gotgIterator]].name;
  });
});
