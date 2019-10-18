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

// marvel api public key 4be43da26f4e8d17b4c2804ae80c48d3
// marvel api private key 1e512f1ad0b7af9586a731e12e07db918d04d8fb
