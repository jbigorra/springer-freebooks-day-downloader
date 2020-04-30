const puppeteer = require("puppeteer");
const fs = require("fs");

async function getDownloadableUrls(browser, book) {
  try {
    const page = await browser.newPage();
    await page.goto(book.url);

    const downloadableUrlsPair = await page.evaluate((book) => {
      const links = document.querySelectorAll(".main-container .cta-button-container__item a");
      const downloadableUrls = Array
        .from(links)
        .slice(0, 2)
        .map(link => ({ title: book.title, downloadAt: link.href}));

      return downloadableUrls;
    }, book);

    page.close();

    return downloadableUrlsPair;
  } catch (e) {
    console.info("Failed at getDownloadableUrls");
    console.error(e);
    console.info("Process will end now...");
    process.exit(0);
  }
}

async function run() {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://www.thebiomics.com/notes/springer-free-e-books-list.html');

    const books = await page.evaluate(() => {
      const table = document.querySelector("table");
      const rows = table.querySelectorAll("tr");

      const books = Array
        .from(rows)
        .map(row => row.querySelectorAll("td"))
        .filter((cols, index) => index !== 0 && cols.length > 1)
        .map((cols) => {
          return ({
            title: cols[0].querySelector("a").innerHTML,
            url: cols[0].querySelector("a").href
          });
        });

      return books;
    });

    page.close();

    const downloadableBooks = [];
    for (let i = 0; i < books.length; i++) {
      const book = books[i];
      const downloadableBook = await getDownloadableUrls(browser, book);
      console.log(downloadableBook);
      downloadableBooks.push(downloadableBook);
    }

    const json = JSON.stringify(downloadableBooks, null, 2);
    fs.writeFileSync("out/books.json", json, { encoding: "utf-8"} );

    browser.close();
  } catch (e) {
    console.info("Failed at run");
    console.error(e);
    console.info("Process will end now...");
    process.exit(0);
  }

  process.exit(1);
}


run();