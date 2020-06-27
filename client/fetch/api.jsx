import "whatwg-fetch";
import netlifyIdentity from "netlify-identity-widget";

const getNumberUrl = `/api/numbers`;

function generateHeaders() {
  const headers = { "Content-Type": "application/json" };
  if (netlifyIdentity.currentUser()) {
    return netlifyIdentity
      .currentUser()
      .jwt()
      .then((token) => {
        return { ...headers, Authorization: `Bearer ${token}` };
      });
  }
  return Promise.resolve(headers);
}

export default function getNumber(languageCode, n) {
  return generateHeaders().then((headers) => {
    return window
      .fetch(`${getNumberUrl}?languageCode=${languageCode}&number=${n}`, {
        headers,
      })
      .then((res) => res.json())
      .then((number) => {
        if (!number.url) {
          throw new Error(`${n} not found for ${languageCode}`);
        }
        return number;
      });
  });
}
