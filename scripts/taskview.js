//const host = 'http://127.0.0.1:5000'
//const host = 'http://dobsat-app-api-env.eba-hjimnqd4.us-east-1.elasticbeanstalk.com'
const host = 'https://cors-everywhere.herokuapp.com/http://dobsat-app-api-env.eba-hjimnqd4.us-east-1.elasticbeanstalk.com'

newTaskURL = (token) => `${host}/task/new?token=${token}`
getTaskURL = (task_id, token) => `${host}/task/get/${task_id}?token=${token}`
listTasksURL = (username, token) => `${host}/task/list/${username}?token=${token}`

function getURLParam(param)
{
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    return urlParams.get(param);
}

document.body.onload = function(){
    if(localStorage.getItem('token') === null)
    {
        alert('You\'re not loged-in. Redirecting to the login page')
        window.location.replace('index.html')
    }
    
    username = localStorage.getItem('username')
    password = localStorage.getItem('password')
    token = localStorage.getItem('token')

    document.getElementById('navbar-username').innerText = username

    id = getURLParam('id')

    fetch(getTaskURL(id, token))
    .then(response => {
        if(response.status !== 200)
        {
            if(response.status === 401) throw {error: 'unauth'}
            else throw {error: 'req_error', status: response.status}        
        }
        return response.json()
    })
    .then(data => {
        console.log(data)
        document.getElementById("task-name").value = data.taskname
        document.getElementById("number-of-shots").value = data.shots
        document.getElementById("quantum-backend").value = data.backend
        document.getElementById("start-time").value = data['start-datetime']
        document.getElementById("end-time").value = data['end-datetime']
        document.getElementById("status").value = data.status
        document.getElementById("code").value = data.code

        jspreadsheet(document.getElementById('spreadsheet'), {
            data: data.result.rows,
            columns: data.result.columns.map((val)=>({'title':val, 'readOnly':true}))
        });
    })
    .catch(error => {
        console.error(error)
        alert('The page failed to get informations from dobslit\'s server. Some of possible reasons of this are network problems or internal problems on the server side.')
    });
}

document.getElementById('return-btn').onclick = function(){
    window.location.replace('tasks.html')
}

document.getElementById('delete-btn').onclick = function(){
    if(confirm('Are you sure you want to delete this task ?'))
    {
        alert('Sorry, task deletion is not available yet')
    }
}
 
