const { FirehoseClient, PutRecordCommand } = require('@aws-sdk/client-firehose');
const { fromUtf8 } = require('@aws-sdk/util-utf8-node');

exports.sendToFirehose = async (event, context) => {
    const firehoseClient = new FirehoseClient({ region: 'us-east-1' }); // Replace with your region

    console.log('Received event:', event);

    let requestBody;
    try {
        requestBody = JSON.parse(event.body);
        console.log('Parsed request body:', requestBody);
    } catch (error) {
        console.error('Error parsing request body:', error);
        return { statusCode: 400, body: 'Invalid request body' };
    }

    const params = {
        DeliveryStreamName: 'PUT-S3-EBGEB', 
        Record: {
            Data: fromUtf8(JSON.stringify(requestBody)) 
        }
    };

    try {
        const response = await firehoseClient.send(new PutRecordCommand(params));
        console.log('Kinesis Firehose response:', response);
        return { statusCode: 200, body: 'Data sent to Kinesis Firehose successfully!' };
    } catch (error) {
        console.error('Error sending data to Kinesis Firehose:', error);
        return { statusCode: 500, body: 'Error sending data to Kinesis Firehose' };
    }
};
