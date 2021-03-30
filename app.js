const puppeteer = require('puppeteer');

// get page(s) to be saved as pdf
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

//removes forward slashes from text
function removeSlashes(text){
    return text.replace(/\//ig, '-');
}

//save pages as pdf
async function savePdf(links) {

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    try {
        for (let i = 1; i <= links.length - 1; i++){
            
            let href = links[i];

            await page.goto(href, {waitUntil: 'networkidle2'});

            let title = await page.title() 

            let name = removeSlashes(title) + '.pdf'; //name file is to be saved as
            
            await page.pdf({
                path: `./pdfs/${name}`
            })
        }

        console.log('Pdfs have been saved');

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
