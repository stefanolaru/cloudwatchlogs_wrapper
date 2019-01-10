'use strict';
var AWS = require('aws-sdk'),
	CloudWatchLogs = require('./cloudwatchlogs_wrapper.js');

// load aws config
AWS.config.loadFromPath('./aws.json');

exports.handler = async (event, context) => {

	var logs = new CloudWatchLogs(AWS);
    
    await logs.put([
			{
				message: 'Whatever message', // JSON.stringify(object)
				timestamp: Date.now()
			}
		], 'LogGroupName', 'LogStreamName');

    return {
    	statusCode: 200,
    	body: 'All rightly! Stuff logged.'
    };

};
