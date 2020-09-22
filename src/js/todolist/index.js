// Server response

const usersUrlJson = 'https://jsonplaceholder.typicode.com/todos';

function serverResponse(method, url) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open(method, url);
        xhr.responseType = 'json';

        xhr.onload = () => {
            if (xhr.status >= 400) {
                reject(xhr.response);
            } else {
                resolve(xhr.response);
            }
        };

        xhr.onerror = () => {
            reject(xhr.response);
        };

        xhr.send();
    });
}

const createTodolist = (data) => {
    const wrapper = document.querySelector('#todolist');
    wrapper.classList.add('todolist');

    const listTemplate = `${data
        .filter((_el, idx) => idx < 10)
        .map((item) => {
            //console.log(item);
            return `<div class="todolist__item${item.completed ? ' active' : ''}">
            <div class="todolist__complete"></div>
            <div class="todolist__title"><span>${item.id}.</span> ${
                item.title
            }</div>                
        </div>
        `;
        })
        .join('')}`;

    wrapper.innerHTML = listTemplate;
};

async function fakeData() {
    try {
        const data = await serverResponse('GET', usersUrlJson);
        createTodolist(data);
    } catch (e) {
        console.error(e);
    }
}

fakeData();
