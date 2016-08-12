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

var constants = require('./constants')

// Create bot and add dialogs
bot.dialog('/', [
    function (session, args, next) {
        problemLogic.clearData()
        session.beginDialog('/profile')
    },
    function (session, results) {
        problemLogic.clearData()
        session.send('Ha det på badet')
        session.endDialog()
    }
])
bot.dialog('/profile', [
    function (session) {
        if(problemLogic.solution === undefined)
            builder.Prompts.text(session, 'Hei! Jeg er en digital Olav. Du kan kalle meg Olav 2.0. Hva kan jeg hjelpe deg med?')
        else if (problemLogic.solution === constants.noSolution)
        {
            session.send(problemLogic.solution)
            session.endDialog()
        }
        else
            builder.Prompts.text(session, 'Forslag: ' + problemLogic.solution + '.\n\tLøste det problemet ditt?')
    },
    function (session, results) {
        if(problemLogic.userProblem === undefined)
        {
            problemLogic.userProblem = results.response
            problemLogic.setMatchNumber(problemLogic.userProblem)
        }
        problemLogic.solution = problemLogic.response(problemLogic.userProblem)
        if(results.response === "ja")
            session.endDialog()
        else
            session.beginDialog('/profile')
    }
])

let problemLogic = {
    solution: undefined,
    userProblem: undefined,
    highestMatch: 0,
    percentage: 0.5,
    numberOfPossibleSolutions: 0,

    usedUpProblems: '{ }',
    JSONproblems: JSON.parse(constants.problems),

    response: function(string)
    {
        let index = 0
        let currentHighestMatch = 0
        for(var i=0; i < this.JSONproblems.problems.length; i++)
        {
            if(this.JSONproblems.problems[i].isUsed === '' && this.JSONproblems.problems[i].matchNumber > currentHighestMatch)
            {
                currentHighestMatch = this.JSONproblems.problems[i].matchNumber
                index = i
            }
        }
        if(this.highestMatch * this.percentage < currentHighestMatch){
            this.JSONproblems.problems[index].isUsed = true        
            return this.JSONproblems.problems[index].solution
        }

        return constants.noSolution
    },

    getMatchNumber: function(knownProblem, userProblem){
        let m = 0;
        let userProblemWords = userProblem.split(' ')
        let knownProblemWords = knownProblem.split(' ')
        for(i = 0; i < userProblemWords.length; i++){
            for(j = 0; j < knownProblemWords.length; j++){
                if(userProblemWords[i] === knownProblemWords[j]) m++
            }
        }
        return m
    },

    setMatchNumber: function(string){
        this.numberOfPossibleSolutions = 0
        for(var i=0; i < this.JSONproblems.problems.length; i++)
            this.JSONproblems.problems[i].matchNumber = this.getMatchNumber(this.JSONproblems.problems[i].problem, string);
        
        for(var i=0; i < this.JSONproblems.problems.length; i++)
            if(this.JSONproblems.problems[i].isUsed === '' && this.JSONproblems.problems[i].matchNumber > this.highestMatch)
                this.highestMatch = this.JSONproblems.problems[i].matchNumber
                
        for(var i=0; i < this.JSONproblems.problems.length; i++)
            if(this.JSONproblems.problems[i].isUsed === '' && this.JSONproblems.problems[i].matchNumber > this.highestMatch * this.percentage)
                this.numberOfPossibleSolutions++
    },

    clearData: function(){
        this.highestMatch = 0
        this.solution = undefined
        this.userProblem = undefined
        for(var i=0; i < this.JSONproblems.problems.length; i++){
            this.JSONproblems.problems[i].matchNumber = ""
            this.JSONproblems.problems[i].isUsed = ""
        }
    }
}
