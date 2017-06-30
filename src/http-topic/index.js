const azure = require('azure-sb');

module.exports = function (context, req) {
    let model = (typeof req.body != 'undefined' && typeof req.body == 'object') ? req.body : null;
    let err = !model ? "no data; or invalid payload in body" : null;

    var brokeredMessage = {
        body: JSON.stringify(model),
        customProperties: {
            //Add custom properties to filter on with Subscriptions
        }
    }

    if (!err) {
        let serviceBusService = azure.createServiceBusService(process.env.ServiceBus);
        serviceBusService.sendTopicMessage(process.env.TopicName, brokeredMessage, function (error) {

            context.res = {
                status: error ? 500 : 200,
                body: error
            };

            context.done(error);
        });
    } else {
        context.res = {
            status: err ? 500 : 200,
            body: err
        };

        context.done(err);
    }
};