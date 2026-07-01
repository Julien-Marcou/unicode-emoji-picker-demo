import { defineUnicodeEmojiPicker } from 'unicode-emoji-picker';

defineUnicodeEmojiPicker();

const pickedEmojiInput = document.querySelector('.picked-emoji .input');
const pickedEmojiTooltip = document.querySelector('.picked-emoji .tooltip');
const emojiPicker = document.querySelector('unicode-emoji-picker');
const invertThemeButton = document.querySelector('.invert-theme-button');
const tabsPositionInput = document.querySelector('.tabs-position-dropdown .input');
const versionInput = document.querySelector('.version-dropdown .input');
const fontInput = document.querySelector('.font-dropdown .input');
let tooltipTimeout = null;

function toggleDarkTheme() {
  if (document.documentElement.getAttribute('data-theme') === 'dark') {
    document.documentElement.setAttribute('data-theme', 'light');
    invertThemeButton.textContent = 'Turn off the light 🌙';
  }
  else {
    document.documentElement.setAttribute('data-theme', 'dark');
    invertThemeButton.textContent = 'Turn on the light ☀️';
  }
}

function copyToClipboard() {
  if (tooltipTimeout) {
    clearTimeout(tooltipTimeout);
  }
  navigator.clipboard.writeText(pickedEmojiInput.value).then(() => {
    pickedEmojiTooltip.classList.add('displayed');
    tooltipTimeout = setTimeout(() => {
      tooltipTimeout = null;
      pickedEmojiTooltip.classList.remove('displayed');
    }, 1200);
  });
}

pickedEmojiInput.addEventListener('click', () => {
  copyToClipboard();
});

pickedEmojiInput.addEventListener('focus', () => {
  copyToClipboard();
});

emojiPicker.addEventListener('emoji-pick', (event) => {
  pickedEmojiInput.value = event.detail.emoji;
});

invertThemeButton.addEventListener('click', () => {
  toggleDarkTheme();
});

tabsPositionInput.addEventListener('change', () => {
  emojiPicker.setAttribute('tabs-position', tabsPositionInput.value);
});

versionInput.addEventListener('change', () => {
  versionInput.querySelectorAll('option').forEach((option) => {
    option.textContent = option.textContent.replace(' ✔️', '');
    if (option.selected) {
      option.textContent += ' ✔️';
    }
  });
  emojiPicker.setAttribute('version', versionInput.value);
});

fontInput.addEventListener('change', () => {
  fontInput.querySelectorAll('option').forEach((option) => {
    option.textContent = option.textContent.replace(' ✔️', '');
    if (option.selected) {
      option.textContent += ' ✔️';
    }
  });
  const fallBackFonts = 'apple color emoji, segoe ui emoji, android emoji, emojisymbols, emojione mozilla, twemoji mozilla, segoe ui symbol, sans-serif';
  emojiPicker.setAttribute('style', fontInput.value ? `--emoji-font-family: "${fontInput.value}", ${fallBackFonts};` : '');
});

const darkThemeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
darkThemeMediaQuery.addEventListener('change', () => {
  toggleDarkTheme();
}, { passive: true });
if (darkThemeMediaQuery.matches) {
  toggleDarkTheme();
}

// window.customElements.whenDefined('unicode-emoji-picker').then(() => {
//   emojiPicker.setTranslation({
//     'search': {
//       emoji: '🔎',
//       title: 'Rechercher un Emoji',
//       inputPlaceholder: 'Rechercher un Emoji...',
//     },
//     'face-emotion': {
//       emoji: '🙂',
//       title: 'Émoticônes & Émotions',
//     },
//     'food-drink': {
//       emoji: '🍉',
//       title: 'Alimentation & Boissons',
//     },
//     'animals-nature': {
//       emoji: '🦋',
//       title: 'Nature & Animaux',
//     },
//     'activities-events': {
//       emoji: '⚽',
//       title: 'Activités & Événements',
//     },
//     'person-people': {
//       emoji: '👨‍🚀',
//       title: 'Personnes',
//     },
//     'travel-places': {
//       emoji: '🏝️',
//       title: 'Voyages & Lieux',
//     },
//     'objects': {
//       emoji: '💡',
//       title: 'Objets',
//     },
//     'symbols': {
//       emoji: '🗯️',
//       title: 'Symboles',
//     },
//     'flags': {
//       emoji: '🏴‍☠️',
//       title: 'Drapeaux',
//     },
//   });
//   emojiPicker.selectTab('search');
//   emojiPicker.searchEmoji('love face');
//   emojiPicker.focusContent(true);
// });
