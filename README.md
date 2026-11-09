# Password Generator

A password generator and strength checker built with **HTML, CSS and vanilla JavaScript** (no libraries).

## Features
- Generates random passwords from 8 to 32 characters
- Choose uppercase, lowercase, numbers and symbols (at least one of each chosen type is always included)
- Strength meter (Weak, Fair, Good, Strong) for the generated password
- **Check your own password**: type any password and see its strength live
- Copy to clipboard button and a show/hide option
- Dark theme and mobile friendly

## Security notes
- Uses `crypto.getRandomValues()` (a cryptographically secure source) instead of `Math.random()`
- Everything runs in the browser. Passwords are never sent anywhere or stored.

## How to run
No installation needed. Download the files and open `index.html` in your browser.

## What I practiced
- Secure randomness with the Web Crypto API
- Arrays, loops and the Fisher-Yates shuffle
- Regular expressions to detect character types
- DOM events, checkboxes, range sliders and the Clipboard API

## Files
| File | Purpose |
|---|---|
| `index.html` | Page structure |
| `style.css` | Styling |
| `script.js` | Generator and strength logic |

Made by Abdul Wasio.
