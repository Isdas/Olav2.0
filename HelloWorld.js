var restify = require('restify')
var builder = require('botbuilder')

var userProblem = undefined;
var solution = undefined;
var highestMatch = 0
var percentage = 0.5
var numberOfPossibleSolutions = 0

const problems = '{ "problems" : [' +
'{ "problem":"hvit grafikk" , "solution":"installer 2017-utgaven", "matchNumber":"", "isUsed" : "" },' +
'{ "problem":"hvit grafikk" , "solution":"oppdater driveren", "matchNumber":"", "isUsed" : "" },' +
'{ "problem":"hvit grafikk når jeg installerer programmet" , "solution":"oppdater driveren", "matchNumber":"", "isUsed" : "" },' +
'{ "problem":"svart grafikk" , "solution":"installer 2016-utgaven", "matchNumber":"", "isUsed" : "" } ]}';

const usedUpProblems = '{ }';
const JSONproblems = JSON.parse(problems)
const noSolution = 'Jeg beklager, men jeg kan ikke hjelpe deg. Ring Olav 1.0'

var response = function(string)
{
    var index = 0
    var currentHighestMatch = 0
    for(var i=0; i < JSONproblems.problems.length; i++)
    {
        if(JSONproblems.problems[i].isUsed === '' && JSONproblems.problems[i].matchNumber > currentHighestMatch)
        {
            currentHighestMatch = JSONproblems.problems[i].matchNumber
            index = i
        }
    }
    if(highestMatch * percentage < currentHighestMatch){
        JSONproblems.problems[index].isUsed = true        
        return JSONproblems.problems[index].solution
    }
    return noSolution
}

var setMatchNumber = function(string){
    numberOfPossibleSolutions = 0
    for(var i=0; i < JSONproblems.problems.length; i++)
        JSONproblems.problems[i].matchNumber = getMatchNumber(JSONproblems.problems[i].problem, string);
    
     for(var i=0; i < JSONproblems.problems.length; i++)
        if(JSONproblems.problems[i].isUsed === '' && JSONproblems.problems[i].matchNumber > highestMatch)
            highestMatch = JSONproblems.problems[i].matchNumber
            
     for(var i=0; i < JSONproblems.problems.length; i++)
        if(JSONproblems.problems[i].isUsed === '' && JSONproblems.problems[i].matchNumber > highestMatch * percentage)
            numberOfPossibleSolutions++
}

function getMatchNumber(knownProblem, userProblem){
    var m = 0;
    var userProblemWords = userProblem.split(' ');
    var knownProblemWords = knownProblem.split(' ');
    for(i = 0; i < userProblemWords.length; i++){
        for(j = 0; j < knownProblemWords.length; j++){
            if(userProblemWords[i] === knownProblemWords[j]) m++
        }
    }
    return m
}

function clearData(){
    highestMatch = 0
    solution = undefined
    userProblem = undefined
    for(var i=0; i < JSONproblems.problems.length; i++){
        JSONproblems.problems[i].matchNumber = "";
        JSONproblems.problems[i].isUsed = "";
    }
}

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});
  
// Create chat bot
var connector = new builder.ChatConnector({
    appId: 'cadfc57f-59e6-4fd7-a4bb-63a338f97c7d',
    appPassword: 'yWcDPt69UgbfOUEhV6LXXrh',
});
var bot = new builder.UniversalBot(connector);
server.post('/api/messages', connector.listen());

// Create bot and add dialogs
bot.dialog('/', [
    function (session, args, next) {
        clearData()
        session.beginDialog('/profile')
    },
    function (session, results) {
        clearData()
        session.send('Ha det på badet')
    }
]);
bot.dialog('/profile', [
    function (session) {
        if(solution === undefined)
            builder.Prompts.text(session, 'Hei! Jeg er en digital Olav. Du kan kalle meg Olav 2.0. Hva kan jeg hjelpe deg med?')
        else if (solution === noSolution)
        {
           session.send(solution)
           session.endDialog()
        }
        else
            builder.Prompts.text(session, 'Forslag: ' + solution + '.\n\tLøste det problemet ditt?')
    },
    function (session, results) {
        if(userProblem === undefined)
        {
            userProblem = results.response
            setMatchNumber(userProblem)
        }
        solution = response(userProblem);        
        if(results.response === "ja")
            session.endDialog()
        else
            session.beginDialog('/profile')
    }
]);
