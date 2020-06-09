var socket = io();

//import preact stuff
window.h = preact.h;
window.Component = preact.Component;
window.render = preact.render;

var html = htm.bind(h);

var types = ["Open", "Choice", "Slide"];

var colors = ["#41bbc5", "#fa557a", "#6bdd8c", "#f764de", "#72df19", "#d592eb", "#8dbcf9", "#90a65d"];

// function Answer(n) {
//     return html`<div class="pa3 bg-black-20" key="${n}" style="background-color:${colors[n]}">
//     <label>Answer ${n}: </label>
//     <input id="1a1" type="text" autofocus />
//     </div>`
// }

function Answer(props) {
    return html`
    <div class="pr2 dib-ns w-50-ns">
        <div class="dib relative pa3 mb3 mr2 br4 flex items-center justify-between" style="background-color:${props.color}">
            <button class="absolute top-0 left-0 pl2 pt1 glow o-50 f6 bg-transparent white bn outline-none" onClick=${props.onDelete}>x</button>
            <input 
                class="f3 bn input-reset white bg-transparent"  
                id="1a1" 
                type="text" 
                placeholder="Answer" 
                value="${props.value}" 
                onChange=${e => props.handleAnswerChange(e)} 
                autofocus /> 
            <div class="dib relative">
                <input type="checkbox" class="checkbox absolute z-5 w-100 h-100 o-0 input-reset pointer" onClick=${props.handleChecked} checked="${props.correct}" /> 
                <span class="checkbox-wrapper relative z-4 dib w2 h2 bg-transparent overflow-hidden br-pill ba bw2 b--white v-mid bg-animate bg-center"></span>
            </div>
        </div>
    </div>`;
}



function Question(props) {
    // var answers;
    // for (var i = 0; i < 4; i++) {
    //     answers[i] = Answer(i);
    // }
    return html`<div class="question-field mh4 pa4 br4 bg-light-gray mb3">
        <div class="mb3">
            <input class="db w-100 question bn bg-transparent f2 b tc input-reset" type="text" placeholder="${props.type !== "Slide" ? "Question" : "Title"}" value=${props.title} onChange=${e => props.onTitleChange(e)} autofocus />
        </div>

        ${props.type !== "Slide" && props.answers.map((answer, i) => html`<${Answer} key=${answer.id} color=${colors[i % colors.length]} value="${answer.value}" correct="${answer.correct}" onDelete=${e => props.onDelete(i, e)} handleAnswerChange=${e => props.onAnswerChange(i, e)} handleChecked=${() => props.onChecked(i)} />`)}
        
        ${props.type !== "Slide" && html`<button onClick=${() => props.onAddAnswer()} class="button link bg-transparent bn f3">+</button>`}

        <div class="mt2 flex justify-between">
            <select value=${props.type} onChange=${(e) => props.onTypeChange(e)}>
                ${types.map(v => html`<option value="${v}">${v}</option>`)}
            </select>
            <button onClick=${() => props.onDelete()}>Delete</button>
        </div>
    </div>`;
}

class QuestionList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: "",
            questions: [
                {
                    id: 1,
                    question: "",
                    answers: [
                        {
                            id: 1,
                            value: "",
                            correct: false
                        }
                    ]
                    // id
                    // title
                    // answers
                }
            ]
        }

        console.log(this.state)
    }

    handleAnswerChange(q, i, event) {
        var questions = this.state.questions.slice();
        var question = questions[q];
        question.answers[i].value = event.target.value;
        this.setState({ questions: questions });
    }
    handleAddAnswer(q) {
        var questions = this.state.questions.slice();
        var question = questions[q];
        var answers = question.answers;
        answers.push({
            id: answers[answers.length - 1] + 1,
            value: ""
        });
        this.setState({ questions: questions });
    }
    handleTitleChange(q, event) {
        var questions = this.state.questions.slice();
        var question = questions[q];
        var title = event.target.value;
        question.question = title;
        this.setState({ questions: questions });
    }
    handleDelete(q, i) {
        var questions = this.state.questions.slice();
        var question = questions[q];
        var answers = question.answers;
        answers.splice(i, 1);
        this.setState({ questions: questions });
    }
    handleChecked(q, i) {
        var questions = this.state.questions.slice();
        var question = questions[q];
        var answers = question.answers;
        answers[i].correct = !answers[i].correct;
        this.setState({ questions: questions });
    }

    handleTypeChange(q, event) {
        var questions = this.state.questions.slice();
        var question = questions[q];
        question.type = event.target.value;
        this.setState({ questions: questions });
    }
    handleQuestionDelete(q) {
        var questions = this.state.questions.slice();
        questions.splice(q, 1);
        this.setState({ questions: questions });
    }


    handleAddQuestion() {
        var questions = this.state.questions.slice();
        var id = questions.length ? questions.sort((a, b) => b.id - a.id)[0] : 1;
        questions.push({
            id: id,
            question: "",
            answers: [
                {
                    id: 1,
                    value: "",
                    correct: false
                }
            ],
            type: ""
            // id
            // title
            // answers
        })
        this.setState({ questions: questions });
    }

    handleUpdateDatabase() {
        var quiz = { id: 0, name: this.state.title, questions: this.state.questions };
        socket.emit('newQuiz', quiz);
    }

    handleQuizTitleChange(event) {
        var newTitle = event.target.value;
        this.setState({title: newTitle});
    }

    render() {
        var questions = this.state.questions;
        return html`<div>
        <div class="mb3">
            <input class="db w-100 question bn bg-transparent f3 b tc input-reset" type="text" placeholder="Quiz Title" value=${this.state.title} onChange=${e => this.handleQuizTitleChange(e)} autofocus />
        </div>
        ${ questions.map((question, q) => 
            html`<${Question} 
                key=${question.id} 
                title=${question.question} 
                answers=${question.answers} 
                type=${question.type}
                onAnswerChange=${(i, event) => this.handleAnswerChange(q, i, event)}
                onAddAnswer=${() => this.handleAddAnswer(q)}
                onTitleChange=${event => this.handleTitleChange(q, event)}
                onDelete=${i => this.handleDelete(q, i)} 
                onChecked=${i => this.handleChecked(q, i)}
                onTypeChange=${event => this.handleTypeChange(q, event)} 
                onDelete=${() => this.handleQuestionDelete(q)} />`
        )}
        <div class="tc">
            <button class="input-reset bn br2 pa2" onClick=${() => this.handleAddQuestion()}>Add a question</button>
            <button class="input-reset bn br2 pa2" onClick=${() => this.handleUpdateDatabase()}>Create quiz</button>
        </div>
      </div>`
    }
}

var app = html`<div><h1 class="tc">Quiz Creator Studio</h1><${QuestionList} /></div>`;
render(app, document.getElementById("app"));