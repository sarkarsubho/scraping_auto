import puppeteer from "puppeteer";
import fetch from "node-fetch";
import fs from "fs";
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function removeExtraSpaces(str) {
  return str.trim().replace(/\s+/g, " ");
}

function filterTitle(title) {
  // regular expression to replace any characters that are not 'a' to 'z' or spaces with an empty string
  return removeExtraSpaces(title.replace(/[^a-z\s]/gi, ""));
}

async function downloadVideo(url, index, videoTitle) {
  console.log("down v", index);

  try {
    const dir = path.join(__dirname, "videos");
    // Check if the directory exists, if not create it
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const response = await fetch(url);
    const fileStream = fs.createWriteStream(
      // path.join(dir, `${videoTitle.toString()}.mp4`)
      path.join(dir, `${filterTitle(videoTitle).toString()}.mp4`)
    );
    response.body.pipe(fileStream);
    console.log(videoTitle, "-->", filterTitle(videoTitle));
    console.log(`Video ${index} downloaded successfully.`);
    return;
  } catch (error) {
    console.error(`Failed to download video ${index}: ${error}`);
  }
}

const getPopups = async (videoUrls) => {
  try {
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
    return true;
  } catch (error) {
    console.log("get POPup error", error);
    return false;
  }
};

const getVideos = async (url) => {
  if (!url) {
    console.log("url not available");

    return { status: false, mesage: "url is required." };
  }
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

  let videos = await getPopups(videoUrls);
  console.log(videoUrls);

  if (videos) {
    return { status: true, mesage: "videos downloaded." };
  } else {
    return { status: false, mesage: "error download videos , cheeck logs" };
  }
};

// Start the scrapin
// await getVideos(url);

const getImages = () => {};

export { getVideos, getImages };
