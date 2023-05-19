//const host = 'http://127.0.0.1:5000'
const host = 'http://dobsat-app-api-env.eba-hjimnqd4.us-east-1.elasticbeanstalk.com'

newTaskURL = (token) => `${host}/task/new?token=${token}`
getTaskURL = (task_id, token) => `${host}/task/get/${task_id}?token=${token}`
listTasksURL = (username, token) => `${host}/task/list/${username}?token=${token}`

function openTask(id, task) {
    window.location.replace('taskview.html?id=' + id)
}

function deleteTask(id, task) {
    if (confirm('Are you sure you want to delete task ' + task + '?')) {
        alert('Sorry, task deletion is not available yet')
    }
}

function addTaskRow(id, task, creationTime, completionTime, status) {
    taskCell = document.createElement('td')
    creationTimeCell = document.createElement('td')
    completionTimeCell = document.createElement('td')
    statusCell = document.createElement('td')
    deleteCell = document.createElement('td')

    taskCell.setAttribute('id', 'task' + id)
    creationTimeCell.setAttribute('id', 'creationTime' + id)
    completionTimeCell.setAttribute('id', 'completionTime' + id)
    statusCell.setAttribute('id', 'status' + id)

    taskButton = document.createElement('button')
    taskButton.setAttribute('type', 'button')
    taskButton.setAttribute('class', 'btn btn-light')
    taskButton.innerText = task
    taskButton.onclick = function () { openTask(id, task) }

    deleteButton = document.createElement('button')
    deleteButton.setAttribute('type', 'button')
    deleteButton.setAttribute('class', 'btn btn-danger')
    deleteButton.innerText = 'Delete'
    deleteButton.onclick = function () { deleteTask(id, task) }

    taskCell.appendChild(taskButton)
    creationTimeCell.innerText = creationTime
    completionTimeCell.innerText = completionTime
    statusCell.innerText = status
    deleteCell.appendChild(deleteButton)

    row = document.createElement('tr')
    row.setAttribute('id', 'row' + id)
    row.appendChild(taskCell)
    row.appendChild(creationTimeCell)
    row.appendChild(completionTimeCell)
    row.appendChild(statusCell)
    row.appendChild(deleteCell)

    table = document.getElementById('table-body')
    table.appendChild(row)
}

function listTasks() {
    token = localStorage.getItem('token')
    fetch(listTasksURL(username, token))
        .then(response => {
            if (response.status !== 200) {
                if (response.status === 401) throw { error: 'unauth' }
                else throw { error: 'req_error', status: response.status }
            }
            return response.json()
        })
        .then(data => {
            console.log(data)
            document.getElementById('table-body').innerHTML = ''
            data.tasks.forEach((task) => {
                addTaskRow(task._id, task.taskname, task['start-datetime'], task['end-datetime'], task.finished ? 'Done' : 'Processing')
            })
        })
        .catch(error => {
            console.error(error)
            alert('The page failed to get informations from dobslit\'s server. Some of possible reasons of this are session expiration, network problems or internal problems on the server side. You will be redirected to the login page.')
            window.location.replace('index.html')
        });
}

function autoRefreshLoop(){
    listTasks()
    setTimeout(autoRefreshLoop, 10*1000)
}

document.body.onload = function () {
    if (localStorage.getItem('token') === null) {
        alert('You\'re not loged-in. Redirecting to the login page')
        window.location.replace('index.html')
    }

    username = localStorage.getItem('username')
    password = localStorage.getItem('password')
    token = localStorage.getItem('token')

    document.getElementById('navbar-username').innerText = username
    autoRefreshLoop()
}

document.getElementById('refresh-btn').onclick = function () {
    listTasks()
}

document.getElementById('create-task-btn').onclick = function () {
    fetch(newTaskURL(localStorage.getItem('token')), {
        method: 'POST',
        body: JSON.stringify({
            'username': localStorage.getItem('username'),
            'taskname': document.getElementById('task-name').value,
            'code': document.getElementById('code').value,
            'iterations': parseInt(document.getElementById('iterations').value),
            'shots': parseInt(document.getElementById('number-of-shots').value),
            'backend': document.getElementById('quantum-backend').value
        }),
        headers: {
            'Content-type': 'application/json; charset=UTF-8'
        }
    })
    .then(response => {
        if (response.status !== 200) {
            if (response.status === 401) throw { error: 'unauth' }
            else throw { error: 'req_error', status: response.status }
        }
        return response.json()
    })
    .then(data => {
        console.log(data)
    })
    .catch(error => {
        console.error(error)
        alert('The page failed to get informations from dobslit\'s server. Some of possible reasons of this are session expiration, network problems or internal problems on the server side. You will be redirected to the login page.')
        //window.location.replace('index.html')
    });
}
