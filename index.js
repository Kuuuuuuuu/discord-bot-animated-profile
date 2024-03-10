const { readFile, readdir } = require("node:fs").promises;
const dotenv = require("dotenv");
const path = require("node:path");

dotenv.config();

async function main() {
  // Read all files in the images folder
  const files = (await readdir(path.join(__dirname, "images"))).filter((f) =>
    f.endsWith(".gif")
  );

  if (!files.length) {
    return console.log("No files found");
  }

  // Read the first image
  const image = await readFile(path.join(__dirname, "images", files[0]));

  if (!image) {
    return console.log("No found image");
  }

  // Convert image to base64
  const base64 = Buffer.from(image).toString("base64");

  const response = await fetch("https://discord.com/api/v10/users/@me", {
    method: "GET",
    headers: {
      Authorization: `Bot ${process.env.TOKEN}`,
      "Content-Type": "application/json",
    },
  });

  const user = await response.json();

  if (!response.ok) {
    return console.log("Failed to fetch user");
  }

  console.log(`Login as: ${user.username}#${user.discriminator} (${user.id})`);

  const patchAvatar = await fetch(`https://discord.com/api/v10/users/@me`, {
    method: "PATCH",
    headers: {
      Authorization: `Bot ${process.env.TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      avatar: `data:image/png;base64,${base64}`,
    }),
  });

  if (patchAvatar.ok) {
    console.log("Avatar updated");
  } else {
    console.log("Failed to update avatar");
  }
}

void main();
