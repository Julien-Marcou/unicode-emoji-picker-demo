import { defineUnicodeEmojiPicker, whenUnicodeEmojiPickerDefined } from 'unicode-emoji-picker';

defineUnicodeEmojiPicker();

const pickedEmojiInput = document.querySelector('.picked-emoji .input');
const pickedEmojiTooltip = document.querySelector('.picked-emoji .tooltip');
const emojiPicker = document.querySelector('unicode-emoji-picker');
const colorSchemeInput = document.querySelector('.color-scheme-dropdown .input');
const tabsPositionInput = document.querySelector('.tabs-position-dropdown .input');
const versionInput = document.querySelector('.version-dropdown .input');
const fontInput = document.querySelector('.font-dropdown .input');
let tooltipTimeout = null;

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

colorSchemeInput.addEventListener('change', () => {
  document.documentElement.setAttribute('data-theme', event.target.value);
});

tabsPositionInput.addEventListener('change', () => {
  emojiPicker.setAttribute('tabs-position', tabsPositionInput.value);
});

versionInput.addEventListener('change', () => {
  emojiPicker.setAttribute('version', versionInput.value);
});

fontInput.addEventListener('change', () => {
  const fallBackFonts = 'apple color emoji, segoe ui emoji, android emoji, emojisymbols, emojione mozilla, twemoji mozilla, segoe ui symbol, sans-serif';
  emojiPicker.setAttribute('style', fontInput.value ? `--emoji-font-family: "${fontInput.value}", ${fallBackFonts};` : '');
});

const darkThemeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
darkThemeMediaQuery.addEventListener('change', () => {
  colorSchemeInput.value = 'dark';
  colorSchemeInput.dispatchEvent(new Event('change'));
}, { passive: true });
if (darkThemeMediaQuery.matches) {
  colorSchemeInput.value = 'dark';
  colorSchemeInput.dispatchEvent(new Event('change'));
}

const paramMatching = [
  {
    param: 'scheme',
    input: colorSchemeInput,
  },
  {
    param: 'position',
    input: tabsPositionInput,
  },
  {
    param: 'version',
    input: versionInput,
  },
  {
    param: 'font',
    input: fontInput,
  },
];
const queryParams = new URLSearchParams(window.location.search);
for (const { param, input } of paramMatching) {
  if (queryParams.has(param)) {
    input.value = queryParams.get(param);
    input.dispatchEvent(new Event('change'));
  }
}
if (queryParams.has('tab')) {
  emojiPicker.setAttribute('default-tab', queryParams.get('tab'));
}

whenUnicodeEmojiPickerDefined().then(() => {
  if (queryParams.has('tab')) {
    const tab = queryParams.get('tab');
    emojiPicker.selectTab(tab)
  }
  if (queryParams.has('q')) {
    emojiPicker.searchEmoji(queryParams.get('q'))
  }
  if (queryParams.get('lang') === 'fr') {
    emojiPicker.setTranslation({
      'search': {
        emoji: '🔎',
        title: 'Rechercher un Emoji',
        inputPlaceholder: 'Rechercher un Emoji...',
      },
      'face-emotion': {
        emoji: '🙂',
        title: 'Émoticônes & Émotions',
      },
      'food-drink': {
        emoji: '🍉',
        title: 'Alimentation & Boissons',
      },
      'animals-nature': {
        emoji: '🦋',
        title: 'Nature & Animaux',
      },
      'activities-events': {
        emoji: '⚽',
        title: 'Activités & Événements',
      },
      'person-people': {
        emoji: '👨‍🚀',
        title: 'Personnes',
      },
      'travel-places': {
        emoji: '🏝️',
        title: 'Voyages & Lieux',
      },
      'objects': {
        emoji: '💡',
        title: 'Objets',
      },
      'symbols': {
        emoji: '🗯️',
        title: 'Symboles',
      },
      'flags': {
        emoji: '🏴‍☠️',
        title: 'Drapeaux',
      },
    });
  }
  if (queryParams.get('focus') === 'header') {
    emojiPicker.focusHeader();
  }
  else if (queryParams.get('focus') === 'content') {
    emojiPicker.focusContent(true);
  }
});
