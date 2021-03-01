const morgan = require('morgan');
const express = require('express');
const cors = require('cors');

const cookies = require('./fortune-cookie');

const getCookie = function(){
    const idx = Math.floor(Math.random() * cookies.length);
    return cookies[idx];
}

console.info(getCookie());

const port = parseInt(process.env.PORT) || 3000;

const app = express();

//use cors on all request
app.use(cors());

// log all request
app.use(morgan('combined'));

app.get(['/', 'index.html'], (req, resp)=>{
    const cookieText = getCookie();
    resp.status(200)
        .type('text/html') // the content type, if text/plain will retrun the <h2>...</h2>
        .send(`<h2>${cookieText}</h2>`)
});

// getting up to 5 quotes per request
app.get('/api/fortune', (req, resp)=>{
    let count = parseInt(req.query['n']) || 1; //req.query.n mean n is given, ['n'] means may not have n
    count  = Math.min(count, 5);
    const cookieText = [];
    for (let i = 0; i < count; i++){
        cookieText.push(getCookie());
    }

    // resp.status(200).type('application/json').json(cookieText);
    resp.status(200).type('application/json').json({
        cookies: cookieText,
        timestamp: (new Date()).toLocaleString()
    });
});

app.listen(port, ()=>{
    console.info(`Application start on port ${port}`);
});