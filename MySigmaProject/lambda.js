let AWS = require('aws-sdk');
let validate = require('validate.js');
const ddb = new AWS.DynamoDB.DocumentClient();

exports.handler = function (event, context, callback) {

    var constraints = {
        id: {
            presence: true
        },
        name: {
            presence: true,
            length: {
                minimum: 1
            }
        }
    };

    let invalid = validate(event, constraints);

    if (!invalid) {
        ddb.put({
            TableName: 'MySigmaTable',
            Item: { 'id': event.id, 'name': event.name }
        }).promise().then(function (data) {
            callback(null, {
                "isBase64Encoded": true,
                "statusCode": 200,
                "headers": {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "*",
                    "Access-Control-Allow-Headers": "*",
                    "Access-Control-Expose-Headers": "*,x-amzn-remapped-authorization"
                },
                "body": JSON.stringify({
                    "Message": "Report successfully added to the table",
                    "Item": event
                })
            });
        }).catch(function (err) {
            callback(null, {
                "isBase64Encoded": false,
                "statusCode": err.statusCode,
                "headers": {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "*",
                    "Access-Control-Allow-Headers": "*",
                    "Access-Control-Expose-Headers": "*,x-amzn-remapped-authorization"
                },
                "body": JSON.stringify({
                    "Code": err.code,
                    "Message": err.message
                })
            });
        });
    } else {
        callback(JSON.stringify(invalid), null);
    }
}