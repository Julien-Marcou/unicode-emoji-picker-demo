import fs from 'fs';
import https from 'https';

const localFolder = './flags';
const distFolder = 'https://raw.githubusercontent.com/googlefonts/noto-emoji/main/third_party/region-flags/waved-svg';
const integerToLetterOffset = 65;
const letterToCountryCodePointOffset = 127397;

function integerToLetter(value) {
  return String.fromCharCode(value + integerToLetterOffset);
}

function integerToCountryCodePoint(value) {
  return value + integerToLetterOffset + letterToCountryCodePointOffset;
}

async function saveFlag(letter1, letter2, codePoint1, codePoint2) {
  const localUrl = `${localFolder}/${letter1}${letter2}.svg`;
  const distUrl = `${distFolder}/emoji_u${codePoint1.toString(16)}_${codePoint2.toString(16)}.svg`;
  const flagEmoji = String.fromCodePoint(codePoint1, codePoint2);

  return new Promise((resolve, reject) => {
    https.get(distUrl, { timeout: 10000 }, (response) => {
      if (response.statusCode === 404) {
        resolve(false);
        return;
      }
      if (response.statusCode === 429) {
        reject(`Stop spamming, you need to wait ${response.headers.get('retry-after') ?? 'NA'} seconds before retrying`);
        return;
      }
      if (response.statusCode !== 200) {
        reject(`Unexpected ${response.statusCode} status code for ${flagEmoji} flag`);
        return;
      }

      const file = fs.createWriteStream(localUrl);
      response.pipe(file);
      file.on('finish', () => {
        console.log(` ${flagEmoji}  flag has been saved`);
        file.close();
        resolve(true);
      });
      file.on('error', (error) => {
        reject(error);
      })
    });
  });
}

async function main() {
  console.time('Duration');
  fs.mkdirSync(localFolder, { recursive: true });

  const requests = [];
  for (let i = 0; i < 26; i++) {
    for (let j = 0; j < 26; j++) {
      const letter1 = integerToLetter(i);
      const letter2 = integerToLetter(j);
      const codePoint1 = integerToCountryCodePoint(i);
      const codePoint2 = integerToCountryCodePoint(j);
      requests.push(saveFlag(letter1, letter2, codePoint1, codePoint2));
    }
  }

  try {
    const flagCount = (await Promise.all(requests)).reduce((count, success) => success ? count + 1 : count, 0);
    console.log('\n');
    console.log(`${flagCount} flags saved`);
  }
  catch(error) {
    console.error(error);
  }

  console.timeEnd('Duration');
  process.exit();
}

main();
