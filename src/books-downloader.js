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
  const downloadedBooks = fs.readdirSync("out/books");

  const booksLeft = books.filter((book, i, arr) => { 
    return !downloadedBooks.some(b => b.replace(/(.epub|e.pdf)/, "") === book.title);
  });

  for (let i = 0; i < booksLeft.length; i++) {
    const book = booksLeft[i];
    
    if (book.epub) await downloadAndSave(book.title + ".epub", book.epub);
    else await downloadAndSave(book.title + ".pdf", book.pdf);
  }

  console.log("process ended");
  process.exit(1);
}

run();