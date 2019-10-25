const express = require('express');
const path = require('path');
const {getEntity} = require('third-party-web')

getEntities = (urls) => {
    arr = [];
    console.log(urls)
    if (typeof(urls) !== Array) urls = urls.split(',');
    console.log(urls)
    urls.forEach(url => {
        if (url) {
            let obj = getEntity(decodeURIComponent(url)) || {}
            obj.url = url
            delete(obj.totalExecutionTime)
            delete(obj.totalOccurrences)
            delete(obj.examples)
            delete(obj.domains)
            if (obj.categories) {
                let newCats = []
                obj.categories.forEach(category => {
                    newCats.push(categoryData[category])
                })
                obj.categories = newCats
            } else {
                obj.categories = [{color:"hsl(0,0%,60%)",title:"Unknown",description:"Unknown third-party"}]
            }
            obj.name = obj.name || obj.url
            obj.company = obj.company || "Unknown"
            arr.push(obj)
        }
    })
    return arr;
}

var bodyParser = require('body-parser');
var app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.get('/',(req,res) => {
    res.sendFile(path.join(__dirname+'/index.html'));
})
app.get('/api/', (req,res) => {
    urls = req.query.url;
    if (urls) {
        res.json(getEntities(urls))
    } else {
        res.json({error:true,message:"Submit a URL (or comma-separated list of URLs) as a query parameter named `url`"})
    }
})
app.post('/api/', (req,res) => {
    console.log(req.body)
    urls = req.body.url;
    if (urls) {
        res.json(getEntities(urls))
    } else {
        res.json({error:true,message:"POST a URL (or comma-separated list of URLs) as an object named `url`"})
    }
})

const categoryData = {
    "ad": {
        "color": "hsl(0, 90%, 60%)",
        "title": "Advertising",
        "description": "These scripts are part of advertising networks, either serving or measuring."
    },
    "analytics": {
        "color": "hsl(30, 90%, 60%)",
        "title": "Analytics",
        "description":
        "These scripts measure or track users and their actions. There's a wide range in impact here depending on what's being tracked."
    },
    "social": {
        "color": "hsl(60, 90%, 60%)",
        "title": "Social",
        "description": "These scripts enable social features."
    },
    "video": {
        "color": "hsl(150, 90%, 30%)",
        "title": "Video",
        "description": "These scripts enable video player and streaming functionality."
    },
    "utility": {
        "color": "hsl(120, 90%, 60%)",
        "title": "Developer Utilities",
        "description":
        "These scripts are developer utilities (API clients, site monitoring, fraud detection, etc)."
    },
    "hosting": {
        "color": "hsl(180, 90%, 60%)",
        "title": "Hosting Platforms",
        "description":
        "These scripts are from web hosting platforms (WordPress, Wix, Squarespace, etc). Note that in this category, this can sometimes be the entirety of script on the page, and so the \"impact\" rank might be misleading. In the case of WordPress, this just indicates the libraries hosted and served _by_ WordPress not all sites using self-hosted WordPress."
    },
    "marketing": {
        "color": "hsl(220, 90%, 60%)",
        "title": "Marketing",
        "description": "These scripts are from marketing tools that add popups/newsletters/etc."
    },
    "customer-success": {
        "color": "hsl(270, 90%, 60%)",
        "title": "Customer Success",
        "description":
        "These scripts are from customer support/marketing providers that offer chat and contact solutions. These scripts are generally heavier in weight."
    },
    "content": {
        "color": "hsl(30, 90%, 30%)",
        "title": "Content & Publishing",
        "description":
        "These scripts are from content providers or publishing-specific affiliate tracking."
    },
    "cdn": {
        "color": "hsl(300, 90%, 30%)",
        "title": "CDNs",
        "description":
        "These are a mixture of publicly hosted open source libraries (e.g. jQuery) served over different public CDNs and private CDN usage. This category is unique in that the origin may have no responsibility for the performance of what's being served. Note that rank here does not imply one CDN is better than the other. It simply indicates that the scripts being served from that origin are lighter/heavier than the ones served by another."
    },
    "tag-manager": {
        "color": "hsl(345, 90%, 30%)",
        "title": "Tag Management",
        "description": "These scripts tend to load lots of other scripts and initiate many tasks."
    },
    "other": {
        "color": "hsl(330, 90%, 60%)",
        "title": "Mixed / Other",
        "description":
        "These are miscellaneous scripts delivered via a shared origin with no precise category or attribution. Help us out by identifying more origins!"
    }
}

app.listen(process.env.PORT || 8012);