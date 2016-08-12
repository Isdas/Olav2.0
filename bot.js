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
        session.send(goodbyeMessage.getGoodbyeMessage())
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
            builder.Prompts.text(session, prefix.getPrefix() + ' ' + problemLogic.solution + '. ' + postfix.getPostfix())
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

let prefix = {
    prefixCollection: [
        'Hmm, la meg se.',
        'Kanskje dette kan hjelpe?',
        'Dette hørtes rart ut. Du kan prøve følgende:',
        'En kollega har vært borti dette før. Han sier:',
        'Jeg har sjekket med en kollega. Han sa:',
        'Dette er enkelt.',
        'Nå måtte jeg tenke meg litt om.',
        'Jeg skjønner.',
        'Jeg er litt usikker på om dette kan funke.',
        'Dette var en nøtt.'
    ],
    getPrefix: function(){
        return this.prefixCollection[randomInt(this.prefixCollection.length)]
    }
}

let postfix = {
    postfixCollection: [
        'Løste det problemet ditt?',
        'Hjalp det?',
        'Fungerte det?',
        'Dette har hjulpet mange kunder før. Hjalp det deg?',
        'Var det til hjelp?',
        'Kom du nærmere en løsning?',
        'Har du fortsatt problemet?',
        'Trenger du et løsningsforslag til?',
        'Var dette til hjelp?',
        'Var det en OK løsning?'
    ],
    getPostfix: function(){
        return this.postfixCollection[randomInt(this.postfixCollection.length)]
    }
}

let goodbyeMessage = {
    goodbyeCollection: [
        'Takk for at brukte Olav 2.0. Velkommen tilbake',
        'Ha en fin dag',
        'Jeg vet hvor du bor. Jeg tar meg en liten tur innom senere. Hade.',
        'Håper du likte å bruke Olav 2.0. Hade',
        'Håper jeg var til hjelp. Nå går jeg og spiller Pokémon Go!',
    ],
    getGoodbyeMessage: function(){
        return this.goodbyeCollection[randomInt(this.goodbyeCollection.length)]
    }
}

function randomInt(size){
    return Math.floor(Math.random() * size)
}

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
