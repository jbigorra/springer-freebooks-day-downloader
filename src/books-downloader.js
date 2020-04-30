const fetch = require("node-fetch");
const fs = require("fs");

async function downloadAndSave(bookTitle, bookUrl) {
  try {
    console.log("Downloading: " + bookTitle);
    const response = await fetch(bookUrl);
    await new Promise((resolve, reject) => {
      const fileStream = fs.createWriteStream("out/books/" + bookTitle);
      response.body.pipe(fileStream);
      response.body.on("error", reject);
      response.body.on("finish", () => {
        console.log("Downloaded and Saved: " + bookTitle);
        resolve();
      });
    });
  } catch (e) {
    console.error(e.message);
    process.exit(0);
  }
}

async function run() {
  const books = JSON.parse(fs.readFileSync("out/sanitzed-books.json", { encoding: "utf-8" }));
  console.log()
  for (let i = 0; i < books.length; i++) {
    const book = books[i];
    
    if (book.epub) await downloadAndSave(book.title + ".epub", book.epub);
    else await downloadAndSave(book.title + ".pdf", book.pdf);
  }

  console.log("process ended");
  process.exit(1);
}

run();