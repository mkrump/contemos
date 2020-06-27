import "whatwg-fetch";

const getNumberUrl = `/api/numbers`;

export default function getNumber(languageCode, n) {
  return window
    .fetch(`${getNumberUrl}?languageCode=${languageCode}&number=${n}`)
    .then((res) => res.json())
    .then((number) => {
      if (!number.url) {
        throw new Error(`${n} not found for ${languageCode}`);
      }
      return number;
    });
}
