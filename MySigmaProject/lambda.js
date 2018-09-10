let AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB.DocumentClient();

exports.handler = function (event, context, callback) {

    ddb.put({
        TableName: 'MySigmaTable',
        Item: { 'id': event.id, 'name': event.name }
    }).promise().then(function (data) {
        callback(null, {
            "isBase64Encoded": true,
            "statusCode": 200,
            "headers": {
                "Content-Type": "application/json"
            },
            "body": JSON.stringify({
                "Message": "Report successfully added",
                "Item": event
            })
        });
    }).catch(function (err) {
        callback(null, {
            "isBase64Encoded": false,
            "statusCode": err.statusCode,
            "headers": {
                "Content-Type": "application/json"
            },
            "body": JSON.stringify({
                "Code": err.code,
                "Message": err.message
            })
        });
    });
}