const cool = require('cool-ascii-faces')
const express = require('express')
const path = require('path')
const app = express()
const PORT = process.env.PORT || 8888

// Connects to the database that is connected to this node.js app
//  app: pacific-island-66556, db: postresql-graceful-43235
const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true
});

/*
express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .get('/cool', (req, res) => res.send(cool()))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))
*/

// tell it to use the public directory as one where static files live
app.use(express.static(path.join(__dirname, '/public')))

// views is directory for all template files
app.set('views', __dirname + '/views')
app.set('view engine', 'ejs')

app.get('/', (req, res) => {
    res.sendFile('postal_form.html', {
        root: path.join(__dirname, './views/pages')
    })
})

app.get('/postal', postalCalculation)


// start the server listening
app.listen(PORT, function() { console.log('Node app is running on port', PORT); })

function postalCalculation(request, response) {
    console.log("In the postalCalculation function.");
    
    const dest = request.query.destination;
    const category = request.query.category;
	const weight = Number(request.query.weight);
    const zone = Number(request.query.zone)
    let multiplier = 0;
    
    if (dest == "Domestic")
        multiplier = 1;
    else if (dest == "International")
        multiplier = 2;
    
    if (category == "Letters (Stamped)") {
        console.log("Going to stampedLetterCost function.");
        stampedLetterCost(response, category, weight, multiplier);
    }
    else if (category == "Letters (Metered)") {
        console.log("Going to meteredLetterCost function.");
        meteredLetterCost(response, category, weight, multiplier);
    }
    else if (category == "Large Envelopes (Flats)") {
        console.log("Going to largeEnvelopeCost function.");
        largeEnvelopeCost(response, category, weight, multiplier);
    }
    else if (category == "First-Class Package Service—Retail") {
        console.log("Going to firstClassPackageCost function.");
        firstClassPackageCost(response, category, weight, zone, multiplier)
    }
}

function stampedLetterCost(response, category, weight, multiplier) {
    console.log("In the stampedLetterCost function.");
    let result = 0;
    let zone = null;
    
    if (weight <= 1)
        result = 0.55;
    else if (weight <= 2 && weight > 1)
        result = 0.70;
    else if (weight <= 3 && weight > 2)
        result = 0.85;
    else if (weight <= 3.5 && weight > 3)
        result = 1.00;
    
    result = (result.toFixed(2) * multiplier);
    
    const params = {category: category, weight: weight, zone: zone, result: result};
    response.render('pages/postal_result', params);
}

function meteredLetterCost(response, category, weight, multiplier) {
    console.log("In the meteredLetterCost function.");
    let result = 0;
    let zone = null;
    
    if (weight <= 1)
        result = 0.50;
    else if (weight <= 2 && weight > 1)
        result = 0.65;
    else if (weight <= 3 && weight > 2)
        result = 0.80;
    else if (weight <= 3.5 && weight > 3)
        result = 0.95;
    
    result = (result.toFixed(2) * multiplier);
    
    const params = {category: category, weight: weight, zone: zone, result: result};
    response.render('pages/postal_result', params);
}

function largeEnvelopeCost(response, category, weight, multiplier) {
    console.log("In the largeEnvelopeCost function.");
    let result = 0;
    let zone = null;
    
    if (weight <= 1)
        result = 1.00;
    else if (weight <= 2 && weight > 1)
        result = 1.15;
    else if (weight <= 3 && weight > 2)
        result = 1.30;
    else if (weight <= 4 && weight > 3)
        result = 1.45;
    else if (weight <= 5 && weight > 3)
        result = 1.60;
    else if (weight <= 6 && weight > 3)
        result = 1.75;
    else if (weight <= 7 && weight > 3)
        result = 1.90;
    else if (weight <= 8 && weight > 3)
        result = 2.05;
    else if (weight <= 9 && weight > 3)
        result = 2.20;
    else if (weight <= 10 && weight > 3)
        result = 2.35;
    else if (weight <= 11 && weight > 3)
        result = 2.50;
    else if (weight <= 12 && weight > 3)
        result = 2.65;
    else if (weight <= 13 && weight > 3)
        result = 2.80;
    
    result = (result.toFixed(2) * multiplier);
    
    const params = {category: category, weight: weight, zone: zone, result: result};
    response.render('pages/postal_result', params);
}

function firstClassPackageCost(response, category, weight, zone, multiplier) {
    console.log("In the firstClassPackageCost function.");
    let result = 0;
    let extra = (zone - 1) * 0.05;
    
    //These prices are for zone 1 and 2, might add other zones later
    if (weight <= 1)
        result = 3.66 + extra;
    else if (weight <= 2 && weight > 1)
        result = 3.66 + extra;
    else if (weight <= 3 && weight > 2)
        result = 3.66 + extra;
    else if (weight <= 4 && weight > 3)
        result = 3.66 + extra;
    else if (weight <= 5 && weight > 3)
        result = 4.39 + extra;
    else if (weight <= 6 && weight > 3)
        result = 4.39 + extra;
    else if (weight <= 7 && weight > 3)
        result = 4.39 + extra;
    else if (weight <= 8 && weight > 3)
        result = 4.39 + extra;
    else if (weight <= 9 && weight > 3)
        result = 5.19 + extra;
    else if (weight <= 10 && weight > 3)
        result = 5.19 + extra;
    else if (weight <= 11 && weight > 3)
        result = 5.19 + extra;
    else if (weight <= 12 && weight > 3)
        result = 5.19 + extra;
    else if (weight <= 13 && weight > 3)
        result = 5.71 + extra;
    
    result = (result.toFixed(2) * multiplier);
    
    const params = {category: category, weight: weight, zone: zone, result: result};
    response.render('pages/postal_result', params);
}