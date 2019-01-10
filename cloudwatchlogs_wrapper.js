'use strict';

var CloudWatchLogs = function(aws) {
	this.AWS = aws;
};

CloudWatchLogs.prototype.put = async function(logEvents, logGroupName, logStreamName) {

	var client = new this.AWS.CloudWatchLogs();
	
	// start by finding the sequence token
    await client.describeLogStreams({
				logGroupName: logGroupName,
				logStreamNamePrefix: logStreamName,
				orderBy: 'LogStreamName',
				limit: 1
			}).promise()
			.then(res => {

				// create stream if doesn't exist
				if (!res.logStreams.length) {
					return client.createLogStream({
						logGroupName: logGroupName,
						logStreamName: logStreamName
					}).promise();
				} else {
					return res;
				}
			})
			.then(res => {

				var params = {
					logEvents: logEvents,
					logGroupName: logGroupName,
					logStreamName: logStreamName
				};

				// add sequenceToken if any
				if(res.logStreams && res.logStreams.length) {
					params.sequenceToken = res.logStreams[0].uploadSequenceToken;
				}
				
				return client.putLogEvents(params).promise();

			});
			
};

module.exports = CloudWatchLogs;
