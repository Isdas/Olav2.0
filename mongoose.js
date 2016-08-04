var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() { // we're connected! 
});

var problemsSchema = mongoose.Schema({ problem: String, solution: String }); 
var Problems = mongoose.model('Problems', problemsSchema); 

function addProblem(problemText, solutionText)
{
    var problem = new Problem({problem: problemText, solution: solutionText})
}

problemsSchema.methods.findProblems = function(problem)
{
    return this.model("Problem").find({ type: this.type })
}

var problem1 = new Problem({problem: "problem1", solution: "solution1"});
var problem1 = new Problem({problem: "problem2", solution: "solution2"});
var problem1 = new Problem({problem: "problem3", solution: "solution2"});
