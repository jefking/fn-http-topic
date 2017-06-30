const azure = require('azure-sb');

module.exports = function (context, req) {

    let model = (typeof req.body != 'undefined' && typeof req.body == 'object') ? req.body : null;
    let error = !model ? "no data; or invalid payload in body" : null;

    context.res = {
        status: error ? 500 : 200,
        body: error
    };

    var brokeredMessage = {
        body: JSON.stringify(model),
        customProperties: {
            //Add custom properties to filter on with Subscriptions
        }
    }

    let serviceBusService = azure.createServiceBusService(process.env.AzureWebJobsServiceBus);
    serviceBusService.sendTopicMessage(process.env.TopicName, brokeredMessage, function (error) {
        context.done(error);
    });

    context.done(error);
};