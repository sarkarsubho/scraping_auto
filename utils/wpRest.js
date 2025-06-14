import dotenv from "dotenv";
import axios from "axios";
dotenv.config();

let WP_POST_REST_API = process.env.WP_POST_REST_API;
let username = process.env.WP_USER;
let password = process.env.WP_PASSWORD;

let createCtegory =
  "https://test.mainakghosh.com/wp-json/wp/v2/categories?_locale=user";
let payload = { name: "gbhg" };

async function getJWTToken() {
  const WP_SITE_URL = "https://test.mainakghosh.com";
  try {
    const response = await axios.post(
      `${WP_SITE_URL}/wp-json/jwt-auth/v1/token`,
      {
        username,
        password,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ Token received:", response.data.data.token);
    return response.data.data.token;
  } catch (error) {
    console.error(
      "❌ Error getting token:",
      error.response?.data || error.message
    );
  }
}

// getJWTToken();

async function createWordPressPost() {
  // try {
  //   const auth = {
  //     username,
  //     password,
  //   };

  //   const response = await axios.post(
  //     "http://test.mainakghosh.com/wp-json/wp/v2/posts?_locale=user",
  //     {
  //       title: "StickLewds-mem---Theres-no-way....mp4",
  //       content: `<video src="https://pub-6a689a155a6a474db5dd6f2079744df9.r2.dev/rulebucket/1748596264543-StickLewds-mem---Theres-no-way....mp4" controls></video>`,
  //       //   status: "draft", // or 'publish'
  //       status: "publish",
  //       categories: [1], // Replace with your category IDs
  //       tags: [2], // Replace with your tag IDs
  //       meta: {
  //         custom_field_1: "value1",
  //         custom_field_2: "value2",
  //       },
  //     },
  //     { auth }
  //   );

  //   console.log("Post created:", response.data);
  //   return { postUpdated: true, data: response.data };
  // } catch (error) {
  //   console.error(
  //     "Error creating post:",
  //     error.response ? error.response.data : error.message
  //   );
  //   throw new Error("Failed to create WordPress post");
  // }
  try {
    const WP_BASE_URL = "https://test.mainakghosh.com";
    const WP_API = `${WP_BASE_URL}/wp-json/wp/v2/posts`;
    const JWT_TOKEN = await getJWTToken(); // Ensure you have a valid JWT token
    if (!JWT_TOKEN) {
      throw new Error("Failed to retrieve JWT token");
    }

    // Example video post creation

    async function publishVideoPost() {
      try {
        const response = await axios.post(
          WP_API,
          {
            title: "My First Video via API",
            status: "publish",
            content: "This is a video post published via backend.",
            meta: {
              video_url: "https://pub-6a689a155a6a474db5dd6f2079744df9.r2.dev/rulebucket/1748596264543-StickLewds-mem---Theres-no-way....mp4",
              video_hd: true,
            },
            categories: [1], // Replace with your actual video category ID
          },
          {
            headers: {
              Authorization: `Bearer ${JWT_TOKEN}`,
              "Content-Type": "application/json",
            },
          }
        );

        console.log("✅ Video post published!");
        console.log("🔗 Post URL:", response.data.link);
      } catch (error) {
        console.error(
          "❌ Error publishing video post:",
          error.response?.data || error.message
        );
      }
    }

    publishVideoPost();
  } catch (error) {
    console.error(
      "Error creating post:",
      error.response ? error.response.data : error.message
    );
    throw new Error("Failed to create WordPress post");
  }
}
export default createWordPressPost;

// | Field        | Description                         |
// | ------------ | ----------------------------------- |
// | `title`      | Title of the post                   |
// | `content`    | HTML or text content of the post    |
// | `status`     | `draft`, `publish`, `pending`, etc. |
// | `categories` | Category ID(s)                      |
// | `tags`       | Tag ID(s)                           |
// | `meta`       | Custom meta fields                  |

// createWordPressPost();

async function registerTag() {
  return axios.post(
    "https://test.mainakghosh.com/wp-json/wp/v2/tags",
    {
      name: "new-tag",
      description: "This is a new tag",
    },
    {
      auth: {
        username,
        password,
      },
    }
  );
}

async function registerActor() {
  return axios
    .post("https://test.mainakghosh.com/wp-json/wp/v2/actors?_locale=user", {
      name: "newuser",
    })
    .then((response) => {
      console.log("Actor created:", response.data);
      return response.data;
    })
    .catch((error) => {
      console.error(
        "Error creating actor:",
        error.response ? error.response.data : error.message
      );
      throw new Error("Failed to create WordPress actor");
    });
}
