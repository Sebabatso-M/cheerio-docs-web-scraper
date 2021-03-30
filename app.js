const puppeteer = require('puppeteer');

async function getPageLinks() {

    const browser = await puppeteer.launch({
        headless: true
    });
    const page = await browser.newPage();

    try {

        await page.goto("https://cheerio.js.org/");

        let pageLinks = await page.$$eval('.accordion-title > a', (elements) => {
            return elements.map(element => element.href);
        });

        return pageLinks;

    } catch (err) {
        console.log(err);
    } finally {
        await browser.close();
    }
};

async function savePdf(links) {

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const options = {
        path: ''
    }
    try {
        for (let i = 1; i <= links.length - 1; i++){
            
            let href = links[i];
            await page.goto(href, {waitUntil: 'networkidle2'});
            console.log(await page.title());
        }

    } catch (err) {
        console.error(err)
    } finally {
        browser.close();
    }
}

(async () => {
    let links = await getPageLinks();
    savePdf(links);
})();