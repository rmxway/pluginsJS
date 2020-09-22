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
    const resetButton = document.createElement('button');
    wrapper.classList.add('todolist');
    resetButton.classList.add('btn', 'btn-black', 'todolist__resetbtn');
    resetButton.innerText = 'сбросить задачи';

    const listTemplate = `${data
        .filter((_el, idx) => idx < 10)
        .map((item, idx) => {
            //console.log(item);
            return `<div class="todolist__item${item.completed ? ' active' : ''}">
            <div class="todolist__complete"></div>
            <div class="todolist__number">${idx + 1}.</div>
            <div class="todolist__title">${item.title}</div>                
        </div>
        `;
        })
        .join('')}`;

    wrapper.innerHTML = listTemplate;
    wrapper.prepend(resetButton);

    const listItems = wrapper.querySelectorAll('.todolist__item');
    listItems.forEach((item) => {
        item.addEventListener('click', () => {
            item.classList.toggle('active');
        });
    });

    resetButton.addEventListener('click', () => {
        listItems.forEach((item) => {
            item.classList.remove('active');
        });
    });
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
