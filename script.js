// script.js - Password Generator and Strength Checker

// The characters each option can use
const SETS = {
  upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lower: 'abcdefghijklmnopqrstuvwxyz',
  numbers: '0123456789',
  symbols: '!@#$%^&*()-_=+[]{};:,.?',
};

// A few very common passwords. These are always rated weak.
const COMMON_PASSWORDS = [
  'password', 'password1', 'password123', '123456', '12345678', '123456789',
  'qwerty', 'qwerty123', 'abc123', 'admin', 'letmein', 'iloveyou', 'welcome',
];

// ---------- Page elements ----------
const output = document.getElementById('passwordOutput');
const copyBtn = document.getElementById('copyBtn');
const copyMessage = document.getElementById('copyMessage');
const generatedMeter = document.getElementById('generatedMeter');
const generatedLabel = document.getElementById('generatedLabel');
const lengthInput = document.getElementById('length');
const lengthValue = document.getElementById('lengthValue');
const errorMessage = document.getElementById('errorMessage');
const generateBtn = document.getElementById('generateBtn');
const checkInput = document.getElementById('checkInput');
const showCheck = document.getElementById('showCheck');
const checkMeter = document.getElementById('checkMeter');
const checkLabel = document.getElementById('checkLabel');

// ---------- Secure random number ----------
// Math.random() is NOT safe for passwords. crypto.getRandomValues() is.
// The loop avoids "modulo bias" so every character has an equal chance.
function randomInt(max) {
  const limit = Math.floor(0x100000000 / max) * max;
  const buffer = new Uint32Array(1);
  do {
    crypto.getRandomValues(buffer);
  } while (buffer[0] >= limit);
  return buffer[0] % max;
}

// ---------- Make a password ----------
function generatePassword(length, chosenSets) {
  const chars = [];

  // 1. Take one character from every chosen set, so each type appears at least once
  chosenSets.forEach((set) => chars.push(set[randomInt(set.length)]));

  // 2. Fill the rest with random characters from all chosen sets together
  const allChars = chosenSets.join('');
  while (chars.length < length) {
    chars.push(allChars[randomInt(allChars.length)]);
  }

  // 3. Shuffle (Fisher-Yates) so the guaranteed characters are not always at the start
  for (let i = chars.length - 1; i > 0; i--) {
    const j = randomInt(i + 1);
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }
  return chars.join('');
}

// ---------- Rate a password ----------
// Returns a level from 0 to 4 and a text label.
function checkStrength(password) {
  if (password === '') return { level: 0, label: '' };
  if (COMMON_PASSWORDS.includes(password.toLowerCase())) {
    return { level: 1, label: 'Weak - this is a very common password' };
  }

  let points = 0;
  if (password.length >= 8) points++;
  if (password.length >= 12) points++;
  if (password.length >= 16) points++;

  // How many kinds of characters are used?
  const kinds = [/[a-z]/, /[A-Z]/, /[0-9]/, /[^A-Za-z0-9]/].filter((rule) => rule.test(password)).length;
  if (kinds >= 3) points++;
  if (kinds === 4) points++;

  if (points <= 1) return { level: 1, label: 'Weak - use more characters and mix types' };
  if (points === 2) return { level: 2, label: 'Fair - longer is better' };
  if (points === 3) return { level: 3, label: 'Good' };
  return { level: 4, label: 'Strong' };
}

function showStrength(meter, label, password) {
  const result = checkStrength(password);
  meter.dataset.level = result.level;
  label.textContent = result.label;
}

// ---------- Generate button ----------
function onGenerate() {
  const chosen = [];
  if (document.getElementById('optUpper').checked) chosen.push(SETS.upper);
  if (document.getElementById('optLower').checked) chosen.push(SETS.lower);
  if (document.getElementById('optNumbers').checked) chosen.push(SETS.numbers);
  if (document.getElementById('optSymbols').checked) chosen.push(SETS.symbols);

  if (chosen.length === 0) {
    errorMessage.textContent = 'Please select at least one character type.';
    return;
  }
  errorMessage.textContent = '';
  copyMessage.textContent = '';

  const password = generatePassword(Number(lengthInput.value), chosen);
  output.value = password;
  showStrength(generatedMeter, generatedLabel, password);
}

// ---------- Copy button ----------
async function onCopy() {
  if (output.value === '') {
    copyMessage.textContent = '';
    errorMessage.textContent = 'Generate a password first.';
    return;
  }
  errorMessage.textContent = '';
  try {
    await navigator.clipboard.writeText(output.value);
    copyMessage.textContent = 'Copied!';
  } catch (error) {
    // Clipboard blocked: select the text so the user can press Ctrl+C
    output.select();
    copyMessage.textContent = 'Press Ctrl + C to copy.';
  }
}

// ---------- Events ----------
lengthInput.addEventListener('input', () => {
  lengthValue.textContent = lengthInput.value;
});
generateBtn.addEventListener('click', onGenerate);
copyBtn.addEventListener('click', onCopy);
checkInput.addEventListener('input', () => showStrength(checkMeter, checkLabel, checkInput.value));
showCheck.addEventListener('change', () => {
  checkInput.type = showCheck.checked ? 'text' : 'password';
});

// Make a first password when the page opens
onGenerate();
