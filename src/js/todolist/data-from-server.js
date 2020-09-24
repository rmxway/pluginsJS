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

async function fakeData() {
    let data;
    try {
        data = await serverResponse('GET', usersUrlJson);
    } catch (e) {
        console.error(e);
    }
    return data;
}

const data = fakeData();

export default data;
