// By Max and Kaarle

const toDoUl = document.getElementById("todoul");

let titleInput = document.getElementById("titleinput");
let statusInput = document.getElementById("status");
let addButton = document.getElementById("addbutton");
let radioInput = document.querySelector('input[name="radiobtn"]')
let dateInput = document.getElementById("dateinput");

let modTitleInput = document.getElementById("modtitleinput");
let modStatusInput = document.getElementById("status");
let modRadioInput = document.querySelector('input[name="radiobtn"]')
let modDateInput = document.getElementById("moddateinput");
let checkStatusInput;

let serial;

// postTodo function on click
addButton.addEventListener("click", postTodo);

//Kaarle || Destructuring - Checkbox passaa ja päivittää oman id:nsä serialiin
function checkbox(event){
    updateSerial(event);
    patch();
}

function updateSerial(event){
    const clicked_id = event.substring(3);
    serial = clicked_id;
}

function on(event) {
    updateSerial(event);
    document.querySelector(".overlay").style.display = "block";
    console.log(event)
}

function off() {
    document.querySelector(".overlay").style.display = "none";
}

// Max & Kaarle 
// GET all the todo items from the server
function getTodos() {
    $('#todoul').empty();
    fetch('/api/list') // demodata
        .then(response => response.json())
        .then(function (json) {

            json.forEach((todo) => {
                const title = todo.title;
                const deadline = todo.deadline;
                const status = todo.completed;
                const todoId = todo.id;
                const priority = todo.priority;
                console.log(status)

                var node = document.createElement("LI");
                node.classList.add("list-group-item");

                node.innerHTML =
                    `
                    <div class="custom-control custom-checkbox">
                        <div class="overlay">

                            <div class="col">
                                <!-- This is the form -->
                                <form>
                                    <!-- Input field -->
                                    <div class="row">
                                        <div class="col">
                                            <input type="text" class="form-control" placeholder="Go to gym" id="modtitleinput">
                                        </div>
                                        <!-- Input field with date picker -->
                                        <div class="col">
                                            <input type="date" name="duedate" max="3000-12-31" min="1000-01-01" class="form-control" id="moddateinput">
                                        </div>
                                    </div>

                                    <!-- Radio buttons -->
                                    <div class="form-group">

                                        <div class="custom-control custom-radio custom-control-inline">
                                            <input type="radio" class="custom-control-input" id="customRadio4" name="radiobtn2" value="high">
                                            <label class="custom-control-label text-white" for="customRadio4">High priority</label>
                                        </div>
                                        <div class="custom-control custom-radio custom-control-inline">
                                            <input type="radio" class="custom-control-input" id="customRadio5" name="radiobtn2" value="medium">
                                            <label class="custom-control-label text-white" for="customRadio5">Medium priority</label>
                                        </div>
                                        <div class="custom-control custom-radio custom-control-inline">
                                            <input type="radio" class="custom-control-input" id="customRadio6" name="radiobtn2" value="low">
                                            <label class="custom-control-label text-white" for="customRadio6">Low priority</label>
                                        </div>

                                    </div>
                                </form>

                                <!-- This is the submit button -->
                                <input class="btn btn-light btn-lg btn-block" type="button" onclick="modTodo()" value="save">
                            </div>

                        </div>

                        <div class="row">
                            <div class="col">
                                <input type="checkbox" class="custom-control-input" id="chk${todoId}" onclick="checkbox(this.id)">
                                <label class=" slightpadding custom-control-label" for="chk${todoId}">${title}</label>
                                <p class="nopadding text-muted">Deadline: ${deadline}</p>
                                <p class="nopadding text-muted">Priority: ${priority}</p> 
                            </div>
                            <div class="col">
                                <div class="text-right ontheright">
                                    <span class="col-sm-1">
                                        <button type="button" class="btn btn-outline-dark btn-sm" id="mod${todoId}" value="2" onClick="on(this.id)">Modify</button>
                                    </span>
                                    <span class="col-sm-offset-10 col-sm-1">
                                        <!-- This is the delete button -->
                                        <button type="button" class="btn btn-outline-danger btn-sm" id="del${todoId}" value="1" onClick="delTodo(this.id)">Delete</button>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                `

                toDoUl.appendChild(node);

                if (status === "on") {
                    document.getElementById("chk" + todoId).checked = true;
                } else {
                    document.getElementById("chk" + todoId).checked = false;
                }
            });
        });

}

// By Max
// POST a new todo to server
function postTodo() {
    let title = titleInput.value;
    let deadLine = dateInput.value;
    let radio = document.querySelector('input[name="radiobtn"]:checked').value;

    let newToDo = {
        title: title,
        deadline: deadLine,
        completed: false,
        priority: radio
    };

    fetch('/api/list', {
        method: 'POST',
        headers: new Headers({ 'Content-type': 'application/json' }),
        body: JSON.stringify(newToDo)
    }).then(function (res) {
        res.json();
        getTodos();
        dateInput.value = "";
        titleInput.value = "";
        document.querySelector('input[name="radiobtn"]:checked').checked = false;
    })
        //.then((data) => console.log(data))
        .catch((err) => console.log(err));
}

//Kaarle & Max
function modTodo(event) {
    const id = event;

    let modTitleInput = document.getElementById("modtitleinput").value;
    // let modStatusInput = document.getElementById("status").value;
    
    let modRadioInput;
    if (document.querySelector('input[name="radiobtn2"]:checked') !== null) {
        modRadioInput = document.querySelector('input[name="radiobtn2"]:checked').value;
    }

    let modDateInput = document.getElementById("moddateinput").value;

    let completed;
    if (document.getElementById(serial) !== null) {
        completed = document.getElementById(id).value;
    }
    console.log(completed);

    let newToDo = {
        id: serial,
        title: modTitleInput,
        deadline: modDateInput,
        completed: false,
        priority: modRadioInput
    };
    fetch(`http://localhost:3000/api/list/${serial}`, {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(newToDo)
    })
        .then(function (res) {
            res.json();
            off();
            getTodos();
        })
        .catch((err) => console.log(err))
}

// GET all todos on page load
getTodos();

// By Kaarle
function delTodo(event) {
    const id = event.substring(3);

    fetch(`http://localhost:3000/api/list/${id}`, {
        method: 'DELETE',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ id })
    })
        .then(res => res.json())
        .catch((err) => console.log(err))
    getTodos();
};


//Kaarle
//Patch checkbox values
function patch(){
    const patchId = 'chk' + serial;
    checkStatusInput = document.getElementById(patchId).value;

    fetch(`http://localhost:3000/api/list/${serial}`, {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ completed: checkStatusInput })
    })
    .then(function (res) {
        res.json();
        getTodos();
    })
    .catch((err) => console.log(err))
}

// By Kaarle (implemented by Meri)
function updateClock() {
    var time = new Date()
    var localDate = new Intl.DateTimeFormat('fi').format(time)

    document.getElementById('time').innerHTML = localDate
  }
  updateClock();
