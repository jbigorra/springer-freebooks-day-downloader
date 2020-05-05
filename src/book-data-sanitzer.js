const fs = require("fs");

const books = JSON.parse(fs.readFileSync("out/books.json", { encoding: "utf-8" }));

const cleanedBooks = books
  .filter(bookPair => bookPair.length > 0)
  .map(bookPair => {
    const book = { title: bookPair[0].title.replace(/[\\|\/|\:|\?|\"|\<|\>|\||\*]/gi, "_") };

    if (bookPair[0].downloadAt.includes("/pdf/")) book.pdf = bookPair[0].downloadAt;
    else if (bookPair[0].downloadAt.includes("/pdf/")) book.epub = bookPair[0].downloadAt;
    
    if (bookPair[1] && bookPair[1].downloadAt.includes("/pdf/")) book.pdf = bookPair[1].downloadAt;
    else if (bookPair[1] && bookPair[1].downloadAt.includes("/epub/")) book.epub = bookPair[1].downloadAt;

    return book;
  });

fs.writeFileSync("out/sanitzed-books.json", JSON.stringify(cleanedBooks, null, 2), {encoding: "utf-8"});

process.exit(1);