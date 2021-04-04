var express = require('express');
const request = require('request');
const rest_api_helper = require('./makeRestCalls');
const cors = require('cors');
var app = express();
app.use(cors())

app.listen(8080, () => {
 console.log("Server running on port 8080");
});

app.get('/getVinDetails/:vinnumber', (req, res) => {
    if (!req.params.vinnumber) {
        res.status(500).json({ err: 'The VIN number cannot be empty' })
    }
    // //rest_api_helper.make_rest_call('https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVin/'+req.params.vinnumber+'?format=json')
    // rest_api_helper.make_vindetails_call('https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVin/'+req.params.vinnumber+'?format=json')
    // .then(response => {
    //     res.json(response)
    // })
    // .catch(error => {
    //     res.send(error)
    // })

    request.get({ url: "https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVin/"+req.params.vinnumber+"?format=json" },
         function(error, response, body) {
        if (!error && response.statusCode == 200) {
            let tempBody = JSON.parse(body);
            let customResponse = {};
            let results = tempBody.Results;
            for (var result of results) 
            {
              if(result.VariableId === 191)
              {
                customResponse.vinvaliditystatus = result.Value;
              }
              if(result.VariableId === 26)
              {
                customResponse.vehiclemake = result.Value;
              }
              if(result.VariableId === 27)
              {
                customResponse.vehiclemanufacturer = result.Value;
              }
              if(result.VariableId === 29)
              {
                customResponse.vehiclemodelyear = result.Value;
              }
              if(result.VariableId === 34)
              {
                customResponse.vehicleseries = result.Value;
              }
            }
            res.json(customResponse);
           }
           else{
            res.status(500).json({ error: 'The VIN number cannot be empty' })
           }
       });
})

app.get('/getAllManufacturers', (req, res) => {
    rest_api_helper.make_rest_call('https://vpic.nhtsa.dot.gov/api/vehicles/GetAllManufacturers?format=json')
    .then(response => {
        res.json(response)
    })
    .catch(error => {
        res.send(error)
    })
})

app.get('/getMakeForManufacturers/:manuname', (req, res) => {
    if (!req.params.manuname) {
        res.status(500);
        res.send({"Error": "The manufacturer name seems to be not valid."});
        console.log("The manufacturer name seems to be not valid.");
    }
    rest_api_helper.make_rest_call('https://vpic.nhtsa.dot.gov/api/vehicles/GetMakeForManufacturer/'+req.params.manuname+'?format=json')
    .then(response => {
        res.json(response)
    })
    .catch(error => {
        res.send(error)
    })
})