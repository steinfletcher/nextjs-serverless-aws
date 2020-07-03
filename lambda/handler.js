const express = require('express');
const {parse} = require("url");
const app = express();

app.use('/_next/static', express.static('.next/static', { maxAge: '1y' }));

function newLambdaHandler(pagesManifest, dynamicRoutes, pageCache, artifactsDir = './.next/serverless') {
    app.get('*', function (req, res) {
        const parsedUrl = parse(req.url, true);
        const page = getPage(parsedUrl.pathname, pagesManifest, dynamicRoutes)

        if (page) {
            if (page.endsWith(".html")) {
                const html = pageCache[page];
                if (html) {
                    res.type("text/html");
                    res.set('Cache-Control', 'public, max-age=86400'); // 1 day
                    res.status(200);
                    res.send(html);
                } else {
                    res.status(404);
                    res.end();
                }
                return
            } else if (page.endsWith(".js")) {
                const module = require(`${artifactsDir}/${page}`);
                if (page.match(/^pages\/api\/.*\.js$/)) {
                    module.default(req, res)
                } else {
                    module.render(req, res, parsedUrl)
                }
                return
            }
        }

        res.status(404);
        res.end();
    });

    return app;
}

function getPage(pathname, pagesManifest, dynamicRoutes) {
    const staticRoutePage = pagesManifest[pathname];
    if (staticRoutePage) {
        return staticRoutePage
    }

    const dynamicRoutePage = getDynamicRoutes(pathname, dynamicRoutes)
    if (dynamicRoutePage) {
        return pagesManifest[dynamicRoutePage]
    }

    return undefined
}

function getDynamicRoutes(reqPath, dynamicRoutes) {
    const route = dynamicRoutes.find(route => reqPath.match(route.regex))
    return route && route.page
}

exports.newLambdaHandler = newLambdaHandler
