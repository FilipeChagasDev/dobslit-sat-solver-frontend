//const host = 'http://127.0.0.1:5000'
//const host = 'http://dobsat-app-api-env.eba-hjimnqd4.us-east-1.elasticbeanstalk.com'
const host = 'https://cors-everywhere.herokuapp.com/http://dobsat-app-api-env.eba-hjimnqd4.us-east-1.elasticbeanstalk.com'
const login_url = host + '/login'

function login(username, password) 
{
    const headers = new Headers();
    headers.set('Authorization', 'Basic ' + btoa(username + ':' + password))

    fetch(login_url, {
        method: 'GET',
        headers: headers,
    })
    .then(response => {
        if(response.status !== 200)
        {
            if(response.status === 401) throw {error: 'unauth'}
            else throw {error: 'req_error', status: response.status}        
        }
        return response.json()
    })
    .then(response => {
        console.log(response.token)
        if(response)
        {
            localStorage.setItem('token', response.token)
            localStorage.setItem('username', username)
            localStorage.setItem('password', password)
            window.location.replace('tasks.html')
        }
    })
    .catch(error => {
        console.log(error)
        if(error.error === 'unauth')
        {
            alert('Incorrect username or password!')
        }
        else
        {
            alert('Error ' + error.status)
        }
    });
}

document.body.onload = function(){
    localStorage.removeItem('token')
    localStorage.removeItem('username')
    localStorage.removeItem('password')

    login_btn = document.getElementById('login_btn')
    register_btn = document.getElementById('register_btn')
    username_in = document.getElementById('username')
    password_in = document.getElementById('password')
    
    login_btn.onclick = function(){
        username = username_in.value
        password = password_in.value
        login(username, password)
    }
}