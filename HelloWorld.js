var solution = undefined
var userProblem = undefined;
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
function response(string)
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

    let constants = require('./constants')
    return constants.noSolution
}

function setMatchNumber(string){
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
    var userProblemWords = userProblem.split(' ')
    var knownProblemWords = knownProblem.split(' ')
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
        JSONproblems.problems[i].matchNumber = ""
        JSONproblems.problems[i].isUsed = ""
    }
}

exports.response = response
exports.setMatchNumber = setMatchNumber
exports.getMatchNumber = getMatchNumber
exports.clearData = clearData