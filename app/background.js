const siteTemplates = {
  "u.gg": "https://u.gg/lol/champions/{champ}/build",
  "op.gg": "https://op.gg/lol/champions/{champ}/build",
  "blitz.gg": "https://blitz.gg/lol/champions/{champ}/build",
  "lolalytics": "https://lolalytics.com/lol/{champ}/build/",
  "mobalytics.gg": "https://mobalytics.gg/lol/champions/{champ}/build",
  "poro.gg": "https://poro.gg/champions/{champ}",
  "metasrc": "https://www.metasrc.com/lol/build/{champ}"
};

let cachedExceptions = null;
async function getExceptions() {
  if (!cachedExceptions) {
    const response = await fetch(chrome.runtime.getURL("exceptions.json"));
    cachedExceptions = await response.json();
  }
  return cachedExceptions;
}

let cachedChampions = null;
async function getChampions() {
  if (!cachedChampions) {
    const response = await fetch(chrome.runtime.getURL("champions.json"));
    const data = await response.json();
    cachedChampions = data.champions;
  }
  return cachedChampions;
}

chrome.omnibox.onInputEntered.addListener(async (text) => {
  const { preferredSite = "u.gg" } = await chrome.storage.local.get("preferredSite");

  const input = text.toLowerCase().trim();

  const [champions, exceptions] = await Promise.all([getChampions(), getExceptions()]);

  const championEntry = champions.find(c => c.names.some(name => name.toLowerCase() === input));

  let url;
  if (championEntry) {
    let finalId = championEntry.id;

    const siteExceptions = exceptions[preferredSite];
    if (siteExceptions && siteExceptions[finalId]) {
      finalId = siteExceptions[finalId];
    }

    url = siteTemplates[preferredSite].replace("{champ}", finalId);
  }
  else { url = new URL(siteTemplates[preferredSite]).origin; }

  chrome.tabs.update({ url });
});