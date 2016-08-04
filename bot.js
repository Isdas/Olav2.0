var builder = require('botbuilder')
var restify = require('restify')

// Setup Restify Server
server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
console.log('%s listening to %s', server.name, server.url)
});

// Create chat bot
var connector = new builder.ChatConnector({
    appId: 'cadfc57f-59e6-4fd7-a4bb-63a338f97c7d',
    appPassword: 'yWcDPt69UgbfOUEhV6LXXrh',
});
var bot = new builder.UniversalBot(connector)

server.post('/api/messages', connector.listen())

var helloWorld = require('./helloWorld')
var constants = require('./constants')

// Create bot and add dialogs
bot.dialog('/', [
    function (session, args, next) {
        helloWorld.clearData()
        session.beginDialog('/profile')
    },
    function (session, results) {
        helloWorld.clearData()
        session.send('Ha det på badet')
        session.endDialog()
    }
])
bot.dialog('/profile', [
    function (session) {
        if(helloWorld.solution === undefined)
            builder.Prompts.text(session, 'Hei! Jeg er en digital Olav. Du kan kalle meg Olav 2.0. Hva kan jeg hjelpe deg med?')
        else if (helloWorld.solution === constants.noSolution)
        {
            session.send(helloWorld.solution)
            session.endDialog()
        }
        else
            builder.Prompts.text(session, 'Forslag: ' + helloWorld.solution + '.\n\tLøste det problemet ditt?')
    },
    function (session, results) {
        if(helloWorld.userProblem === undefined)
        {
            helloWorld.userProblem = results.response
            helloWorld.setMatchNumber(helloWorld.userProblem)
        }
        helloWorld.solution = helloWorld.response(helloWorld.userProblem)
        if(results.response === "ja")
            session.endDialog()
        else
            session.beginDialog('/profile')
    }
])
