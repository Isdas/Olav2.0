//Hello

var restify = require('restify')
var builder = require('botbuilder')

var userProblem = undefined;
var solution = undefined;
var highestMatch = 0
var percentage = 0.5
var numberOfPossibleSolutions = 0

const problems = '{ "problems" : [' +
'{ "problem":"white graphics" , "solution":"install 2017", "matchNumber":"", "isUsed" : "" },' +
'{ "problem":"white graphics" , "solution":"new driver", "matchNumber":"", "isUsed" : "" },' +
'{ "problem":"white graphics when installing the program" , "solution":"new driver", "matchNumber":"", "isUsed" : "" },' +
'{ "problem":"black graphics" , "solution":"install 2016", "matchNumber":"", "isUsed" : "" } ]}';

const usedUpProblems = '{ }';
const JSONproblems = JSON.parse(problems)
const noSolution = 'No solution man, call Olav maaaaan'

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

// Create bot and add dialogs
var bot = new builder.BotConnectorBot({ appId: 'b67bd053-8309-4d5c-a627-f9325e85ce1c', appSecret: 'gfeE0zuWSuhmTHv8j5Fi8Wt' })
bot.add('/', [
    function (session, args, next) {
        clearData()
        session.beginDialog('/profile')
    },
    function (session, results) {
        clearData()
        session.send('later, dude')
    }
]);
bot.add('/profile', [
    function (session) {
        if(solution === undefined)
            builder.Prompts.text(session, 'Hi! What is your problem dude?')
        else if (solution === noSolution)
        {
           session.send(solution)
           session.endDialog()
        }
        else
            builder.Prompts.text(session, 'Suggestion: ' + solution + '\n\tDid this solve your problem, man?')
    },
    function (session, results) {
        if(userProblem === undefined)
        {
            userProblem = results.response
            setMatchNumber(userProblem)
        }
        solution = response(userProblem);        
        if(results.response === "yes")
            session.endDialog()
        else
            session.beginDialog('/profile')
    }
]); 

// Setup Restify Server
var server = restify.createServer();
server.post('/api/messages', bot.verifyBotFramework(), bot.listen());
server.listen(process.env.port || 3978, function () {
    console.log('%s listening to %s', server.name, server.url); 
});
