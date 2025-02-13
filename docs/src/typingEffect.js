const attributes = ["Software Engineer", "Student", "Language Learner", "Silly Guy"];
let index = 0;
let charIndex = 0;
const typingSpeed = 100;
const erasingSpeed = 50;
const delayBetweenAttributes = 2000; // Delay between current and next text

const typingElement = document.getElementById("typing");

function type() {
  if (charIndex < attributes[index].length) {
    typingElement.textContent += attributes[index].charAt(charIndex);
    charIndex++;
    setTimeout(type, typingSpeed);
  } else {
    setTimeout(erase_word, delayBetweenAttributes);
  }
}

function erase_word() {
  if (charIndex > 0) {
    typingElement.textContent = attributes[index].substring(0, charIndex - 1);
    charIndex--;
    setTimeout(erase_word, erasingSpeed);
  } else {
    index++;
    if (index >= attributes.length) index = 0;
    setTimeout(type, typingSpeed + 1100);
  }
}

document.addEventListener("DOMContentLoaded", function () {
  if (attributes.length) setTimeout(type, delayBetweenAttributes + 250);
});

function toggleAnimation() {
  isAnimating = !isAnimating;
  let icon = document.getElementById('toggle-icon');
  if (isAnimating) {
    icon.src = './pause-button.png'; // Placeholder for pause icon
  } else {
    icon.src = './play-button.png'; // Placeholder for play icon
  }
}

console.log('loaded')