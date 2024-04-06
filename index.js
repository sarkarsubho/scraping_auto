import puppeteer from "puppeteer";
import fetch from "node-fetch";
import fs from "fs";

const url = "https://rule34video.com/";
// http://quotes.toscrape.com/;

function filterTitle(title) {
  // Use a regular expression to replace any characters that are not 'a' to 'z' or spaces with an empty string
  return title.replace(/[^a-z\s]/gi, "");
}

async function downloadVideo(url, index, videoTitle) {
  try {
    // const response = await fetch(url);
    // const fileStream = fs.createWriteStream(`videos/${videoTitle.toString()}.mp4`);
    // response.body.pipe(fileStream);
    console.log(videoTitle, "-->", filterTitle(videoTitle));
    console.log(`Video ${index} downloaded successfully.`);
    return;
  } catch (error) {
    console.error(`Failed to download video ${index}: ${error}`);
  }
}

const getPopups = async (videoUrls) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Loop through each video URL and download the video
  for (let i = 0; i < videoUrls.length; i++) {
    const url = videoUrls[i];
    await page.goto(url, { waitUntil: "load" });
    const videoUrl = await page.evaluate(
      () => document.querySelector("video").src
    );
    const videoTitle = await page.evaluate(
      () => document.querySelector(".title_video").textContent
    );

    if (videoUrl) {
      await downloadVideo(videoUrl, i + 1, videoTitle);
    } else {
      console.log(`Video ${i + 1} not found on page: ${url}`);
    }
  }

  await browser.close();
  console.log("All videos downloaded successfully.");
};

const getVideos = async () => {
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

  const videoUrls = await page.evaluate(() => {
    let videoList = document.querySelectorAll(".js-open-popup");

    return Array.from(videoList).map((video) => {
      const href = video.getAttribute("href");

      return href;
    });
  });

  getPopups(videoUrls);
  console.log(videoUrls);
};

// Start the scrapin
getVideos();

const getImages=()=>{}

export {getVideos,getImages}
