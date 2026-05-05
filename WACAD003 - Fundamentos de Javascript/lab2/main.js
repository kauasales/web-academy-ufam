const displayedImage = document.querySelector('.displayed-img');
const thumbBar = document.querySelector('.thumb-bar');

const btn = document.querySelector('button');
const overlay = document.querySelector('.overlay');

const imageFilenames = ['pic1.jpg', 'pic2.jpg', 'pic3.jpg', 'pic4.jpg', 'pic5.jpg'];

const altTexts = {
  'pic1.jpg': 'Closeup of a human eye',
  'pic2.jpg': 'Rock patterns',
  'pic3.jpg': 'Purple and white flowers',
  'pic4.jpg': 'Egyptian wall painting',
  'pic5.jpg': 'Butterfly on a leaf'
};

for (let i = 0; i < imageFilenames.length; i++) {
  const newImage = document.createElement('img');
  const imagePath = `images/${imageFilenames[i]}`;
  const altText = altTexts[imageFilenames[i]];
  
  newImage.setAttribute('src', imagePath);
  newImage.setAttribute('alt', altText);
  thumbBar.appendChild(newImage);
  
  /* Adicionando um manipulador onclick para cada imagem em miniatura */
  newImage.addEventListener('click', function(event) {
    const clickedImage = event.target;
    const imageSrc = clickedImage.getAttribute('src');
    displayedImage.setAttribute('src', imageSrc);
  });
}

btn.addEventListener('click', function() {
  const currentClass = btn.getAttribute('class');
  
  if (currentClass === 'dark') {
    btn.setAttribute('class', 'light');
    btn.textContent = 'Lighten';
    overlay.style.backgroundColor = 'rgba(0,0,0,0.5)';
  } else {
    btn.setAttribute('class', 'dark');
    btn.textContent = 'Darken';
    overlay.style.backgroundColor = 'rgba(0,0,0,0)';
  }
});