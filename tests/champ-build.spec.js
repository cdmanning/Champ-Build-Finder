import { test, expect } from "./fixtures";
import fs from "fs";
import path from "path";

const championData = fs.readFileSync(path.join(__dirname, "../app/champions.json"), "utf8");
const { champions } = JSON.parse(championData);

const exceptionData = fs.readFileSync(path.join(__dirname, "../app/exceptions.json"), "utf8");
const exceptions = JSON.parse(exceptionData);

const SITES = [
  { name: "U.GG", key: "u.gg", base: "https://u.gg", path: (id) => `/lol/champions/${id}/build` },
  { name: "OP.GG", key: "op.gg", base: "https://op.gg", path: (id) => `/lol/champions/${id}/build` },
  { name: "Mobalytics", key: "mobalytics.gg", base: "https://mobalytics.gg", path: (id) => `/lol/champions/${id}/build` },
  { name: "Lolalytics", key: "lolalytics", base: "https://lolalytics.com", path: (id) => { const siteId = (exceptions["lolalytics"] && exceptions["lolalytics"][id]) || id; return `/lol/${siteId}/build`; }  }, 
  { name: "Blitz", key: "blitz.gg", base: "https://blitz.gg", path: (id) => `/lol/champions/${id}/build` },
  { name: "Poro", key: "poro.gg", base: "https://poro.gg", path: (id) => `/champions/${id}` },
  { name: "Metasrc", key: "metasrc", base: "https://www.metasrc.com", path: (id) => { const siteId = (exceptions["metasrc"] && exceptions["metasrc"][id]) || id; return `/lol/build/${siteId}`; } }
];

async function runRedirectTest(page, context, siteKey, champ, name, expectedUrlPart, baseUrl) {
  let background = context.serviceWorkers()[0];
  if (!background) background = await context.waitForEvent("serviceworker");

  await background.evaluate(async (site) => {
    await chrome.storage.local.set({ preferredSite: site });
  }, siteKey);

  await new Promise(resolve => setTimeout(resolve, 500));
  await background.evaluate(async (input) => {
    chrome.omnibox.onInputEntered.dispatch(input);
  }, name);

  await page.waitForURL(url => url.href.includes(expectedUrlPart), {
    timeout: 15000,
    waitUntil: "domcontentloaded"
  });

  expect(page.url()).not.toBe(baseUrl + "/");

  const errorStrings = ["THIS PAGE DOESN'T EXIST", "Looks like you are lost", "Resource Not Found", "Champion not found", "404 Not Found"];
  for (const err of errorStrings) {
    await expect(page.getByText(err, { exact: false })).not.toBeVisible({ timeout: 5000 });
  }

  // Testing took exactly 3 hours with 1 worker on a 4 second delay and 
  await page.waitForTimeout(4000);
}

test.describe("Webpage Load Test", () => {
  test.beforeEach(async ({ page }) => {
    await page.route("**/*.{png,jpg,jpeg,gif,svg,webp}", route => route.abort());
    await page.route("**/google-analytics/**", route => route.abort());
  });

  test.describe("Loads Correct Champion Build Page", () => {
    for (const site of SITES) {
      test.describe(site.name, () => {
        for (const champ of champions) {
          for (const name of champ.names) {
            test(`Omnibox: "${name}"`, async ({ page, context }) => {
              await runRedirectTest(page, context, site.key, champ, name, site.path(champ.id), site.base);
            });
          }
        }
      });
    }
  });

  test.describe("Error Handling - Invalid Input", () => {
    for (const site of SITES) {
      test(`${site.name}`, async ({ page, context }) => {
        let background = context.serviceWorkers()[0];
        if (!background) background = await context.waitForEvent("serviceworker");

        await background.evaluate(async (siteKey) => {
          await chrome.storage.local.set({ preferredSite: siteKey });
        }, site.key);

        const invalidInput = "Test-Bad-Input";
        await background.evaluate(async (input) => {
          chrome.omnibox.onInputEntered.dispatch(input);
        }, invalidInput);

        await new Promise(resolve => setTimeout(resolve, 3000));

        const currentUrl = page.url();
        expect(currentUrl).not.toContain("build");

        expect(currentUrl).toContain(site.key);
      });
    }
  });
});