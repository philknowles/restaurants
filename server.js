const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());

app.get('/restaurants', (req, res) => {
    fs.readFile('restaurants.json', (err, data) => {
        if (err) {
            res.status(500).send('Error reading restaurants data');
        } else {
            res.send(JSON.parse(data));
        }
    });
});

app.post('/restaurants', (req, res) => {
    fs.readFile('restaurants.json', (err, data) => {
        if (err) {
            res.status(500).send('Error reading restaurants data');
        } else {
            const restaurants = JSON.parse(data);
            restaurants.restaurants.push(req.body);
            fs.writeFile('restaurants.json', JSON.stringify(restaurants, null, 2), err => {
                if (err) {
                    res.status(500).send('Error saving restaurant');
                } else {
                    res.status(200).send('Restaurant added successfully');
                }
            });
        }
    });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
