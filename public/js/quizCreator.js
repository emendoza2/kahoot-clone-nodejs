//var socket = io();

//import preact stuff
window.h = preact.h;
window.Component = preact.Component;
window.render = preact.render;

var questionNum = 1; //Starts at two because question 1 is already present

function updateDatabase() {
    var questions = [];
    var name = document.getElementById('name').value;
    for (var i = 1; i <= questionNum; i++) {
        var question = document.getElementById('q' + i).value;
        var answer1 = document.getElementById(i + 'a1').value;
        var answer2 = document.getElementById(i + 'a2').value;
        var answer3 = document.getElementById(i + 'a3').value;
        var answer4 = document.getElementById(i + 'a4').value;
        var correct = document.getElementById('correct' + i).value;
        var answers = [answer1, answer2, answer3, answer4];
        questions.push({ "question": question, "answers": answers, "correct": correct })
    }

    var quiz = { id: 0, "name": name, "questions": questions };
    socket.emit('newQuiz', quiz);
}

function addQuestion() {
    questionNum += 1;

    var questionsDiv = document.getElementById('allQuestions');

    var newQuestionDiv = document.createElement("div");

    var questionLabel = document.createElement('label');
    var questionField = document.createElement('input');

    var answer1Label = document.createElement('label');
    var answer1Field = document.createElement('input');

    var answer2Label = document.createElement('label');
    var answer2Field = document.createElement('input');

    var answer3Label = document.createElement('label');
    var answer3Field = document.createElement('input');

    var answer4Label = document.createElement('label');
    var answer4Field = document.createElement('input');

    var correctLabel = document.createElement('label');
    var correctField = document.createElement('input');

    questionLabel.innerHTML = "Question " + String(questionNum) + ": ";
    questionField.setAttribute('class', 'question');
    questionField.setAttribute('id', 'q' + String(questionNum));
    questionField.setAttribute('type', 'text');

    answer1Label.innerHTML = "Answer 1: ";
    answer2Label.innerHTML = " Answer 2: ";
    answer3Label.innerHTML = "Answer 3: ";
    answer4Label.innerHTML = " Answer 4: ";
    correctLabel.innerHTML = "Correct Answer (1-4): ";

    answer1Field.setAttribute('id', String(questionNum) + "a1");
    answer1Field.setAttribute('type', 'text');
    answer2Field.setAttribute('id', String(questionNum) + "a2");
    answer2Field.setAttribute('type', 'text');
    answer3Field.setAttribute('id', String(questionNum) + "a3");
    answer3Field.setAttribute('type', 'text');
    answer4Field.setAttribute('id', String(questionNum) + "a4");
    answer4Field.setAttribute('type', 'text');
    correctField.setAttribute('id', 'correct' + String(questionNum));
    correctField.setAttribute('type', 'number');

    newQuestionDiv.setAttribute('id', 'question-field');//Sets class of div

    newQuestionDiv.appendChild(questionLabel);
    newQuestionDiv.appendChild(questionField);
    newQuestionDiv.appendChild(document.createElement('br'));
    newQuestionDiv.appendChild(document.createElement('br'));
    newQuestionDiv.appendChild(answer1Label);
    newQuestionDiv.appendChild(answer1Field);
    newQuestionDiv.appendChild(answer2Label);
    newQuestionDiv.appendChild(answer2Field);
    newQuestionDiv.appendChild(document.createElement('br'));
    newQuestionDiv.appendChild(document.createElement('br'));
    newQuestionDiv.appendChild(answer3Label);
    newQuestionDiv.appendChild(answer3Field);
    newQuestionDiv.appendChild(answer4Label);
    newQuestionDiv.appendChild(answer4Field);
    newQuestionDiv.appendChild(document.createElement('br'));
    newQuestionDiv.appendChild(document.createElement('br'));
    newQuestionDiv.appendChild(correctLabel);
    newQuestionDiv.appendChild(correctField);

    questionsDiv.appendChild(document.createElement('br'));//Creates a break between each question
    questionsDiv.appendChild(newQuestionDiv);//Adds the question div to the screen

    newQuestionDiv.style.backgroundColor = randomColor();
}

//Called when user wants to exit quiz creator
function cancelQuiz() {
    if (confirm("Are you sure you want to exit? All work will be DELETED!")) {
        window.location.href = "../";
    }
}

// socket.on('startGameFromCreator', function(data){
//     window.location.href = "../../host/?id=" + data;
// });

function randomColor() {

    var colors = ['#4CAF50', '#f94a1e', '#3399ff', '#ff9933'];
    var randomNum = Math.floor(Math.random() * 4);
    return colors[randomNum];
}

function setBGColor() {
    var randColor = randomColor();
    document.getElementById('question-field').style.backgroundColor = randColor;
}

var html = htm.bind(h);

var colors = [
    "#2ecc71",
    "#e74c3c",
    "#3498db",
    "#f39c12"
]

// function Answer(n) {
//     return html`<div class="pa3 bg-black-20" key="${n}" style="background-color:${colors[n]}">
//     <label>Answer ${n}: </label>
//     <input id="1a1" type="text" autofocus />
//     </div>`
// }

function Question(props) {
    // var answers;
    // for (var i = 0; i < 4; i++) {
    //     answers[i] = Answer(i);
    // }
    this.props = props;
}

Question.prototype.render = function() {
    return html`<div class="question-field mh4 pa4 br4 bg-light-gray">
        <div class="mb3">
            <input class="question bn br4 bg-black-10 ph3 pv2 f4 b" id="q1" type="text" placeholder="Question Title" value=${this.props.title} autofocus />
        </div>

        ${this.props.answers.map(n => html`<div class="pr2 dib-ns w-50-ns"><div class="dib pa3 mb3 mr2 br4 flex items-center justify-between" style="background-color:${colors[n]}">
        <input class="f3 bn input-reset white bg-transparent" key="${n}" id="1a1" type="text" placeholder="Answer ${n+1}" autofocus /> <div class="dib relative"><input type="checkbox" class="checkbox absolute z-5 w-100 h-100 o-0 input-reset pointer" /> <span class="checkbox-wrapper relative z-4 dib w2 h2 bg-transparent overflow-hidden br-pill ba bw2 b--white v-mid bg-animate bg-center"></span></div>
    </div></div>`)}

        <label>Correct Answer (1-4) :</label>
        <input class="correct" id="correct1"  type="number" autofocus />
    </div>`;
}

class QuestionList extends Component {
    state = { 
        questions: [
            // id
            // title
            // answers
        ]
    }
    constructor(props) {
        super(props);
        this.params
    }
    render() {
        var questions = this.state.questions;
        return html`<div>
        ${ questions.map( function(q) { return html`<${Question} key=${q.id} title=${q.title} answers=${q.answers} />` } ) }
      </div>`
    }
}

var app = html`<div><h1 class="tc">Quiz Creator Studio</h1><${Question} /></div>`;
render(app, document.getElementById("app"));