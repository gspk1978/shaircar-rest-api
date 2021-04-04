const request = require('request')

module.exports = {
    /*
    ** This method returns a promise object. Further process is based on 
    ** resolve or reject occurred while executing the Promise.
    */
    make_rest_call : function(url){
        return new Promise((resolve, reject) => {
            request(url, { json: true }, (err, res, body) => {
              if (err) reject(err)
              resolve(body)
            });
        })
    },

    make_vindetails_call : function(url){
        return new Promise((resolve, reject) => {
            request(url, { json: true }, (err, res, body) => {
              if (err) reject(err)
              let tempBody = JSON.parse(body);
              var customResponse = {Count:tempBody.Count}
              resolve(customResponse)
            });
        })
    }
}