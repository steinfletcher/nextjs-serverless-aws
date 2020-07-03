const serverless = require('serverless-http');
const {newLambdaHandler} = require("./handler");
const {join} = require('path');
const fs = require('fs');

module.exports.handler = function () {
    const pagesManifest = require('./.next/serverless/pages-manifest.json');
    const dynamicRoutes = require('./.next/routes-manifest.json').dynamicRoutes;
    const pageCache = buildPageCache("./.next/serverless", pagesManifest);

    return serverless(newLambdaHandler(pagesManifest, dynamicRoutes, pageCache))
}()

function buildPageCache(basePath, pagesManifest) {
    const cache = {};
    for (const [route, page] of Object.entries(pagesManifest)) {
        try {
            cache[page] = fs.readFileSync(join(__dirname, `${basePath}/${page}`),
                {encoding: 'utf8', flag: 'r'});
        } catch (err) {
            if (err.code !== 'ENOENT') { // nextjs manifest contains optional pages like _app
                throw err;
            }
        }
    }
    return cache
}
