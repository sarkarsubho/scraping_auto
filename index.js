import puppeteer from "puppeteer";

const url = "https://rule34video.com/";
// "http://quotes.toscrape.com/";

const getQuotes = async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
  });

  // Open a new page
  const page = await browser.newPage();

  // On this new page:
  // - open the "http://quotes.toscrape.com/" website
  // - wait until the dom content is loaded (HTML is ready)
  await page.goto(url, {
    waitUntil: "domcontentloaded",
  });

  const quotes = await page.evaluate(() => {
    let videoList = document.querySelectorAll(".js-open-popup");

    return Array.from(videoList).map((video) => {
      const href = video.getAttribute("href");

      return href;
    });
  });

  

  console.log(quotes);
};

// Start the scraping
getQuotes();
