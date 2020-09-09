import Field from '../field/index.js';

// создание HTML Шаблона

const createTemplate = function (inputs) {
    const inputTemplate = inputs
        .map((item, index) => {
            return `<div id="${item.id}" data-id="${index + 1}"></div>`;
        })
        .join('');

    return `
        <span class="todo-playlist__title">Добавить новый трек</span>
        <div class="field-block flex">
            ${inputTemplate}
        </div>
        <button class="btn" data-type="button-add">Добавить</button>
        <div id="list"></div>
    `;
};

const listTemplate = function (playlistJSON) {
    const playlistTemplate =
        playlistJSON !== null
            ? `
        <span class="todo-playlist__title">Список треков</span>
        <a href="" class="todo-playlist__clear" data-type="clear-list">Очистить список</a>
        <ul class="todo-playlist__list">
        ${playlistJSON
            .map((item, index) => {
                return `
                <li class="todo-playlist__item" data-id="${index + 1}">
                    <div class="todo-playlist__item__song">
                        <span>${index + 1}</span> ${
                    item.songName ? item.songName : ''
                }
                    </div>
                    <div class="todo-playlist__item__autor">
                        ${item.autorName ? item.autorName : ''}
                    </div>
                    <div class="todo-playlist__item__close"></div>
                </li>
            `;
            })
            .join('')}
        </ul>`
            : '';
    return playlistTemplate;
};

export default class TodoPlaylist {
    constructor(selectedId, inputs) {
        this.inputs = inputs;

        this.$fields = [];
        this.$el = document.querySelector(selectedId);

        this.#render();

        this.$list = document.getElementById('list');

        this.#renderList();

        this.handlerClick = this.handlerClick.bind(this);

        this.$el.addEventListener('click', this.handlerClick);
    }

    #getList() {
        // Получение JSON из localStorage
        this.playlist = localStorage.getItem('playlist');
        this.playlistJSON = JSON.parse(this.playlist);
    }

    #render() {
        this.$el.innerHTML = createTemplate(this.inputs);

        // инициализация полей ввода
        this.inputs.forEach(
            (item, index) =>
                (this.$fields[index] = new Field(item.id, item.placeholder))
        );
    }

    #renderList() {
        this.#getList();
        this.$list.innerHTML = listTemplate(this.playlistJSON);
    }

    handlerClick(event) {
        const { type } = event.target.dataset;

        switch (type) {
            case 'button-add':
                // playlist = [{"songName":"Dont Stop", "autorName":"Dovgan Evgeny"}]
                let card = {};
                let currentList = this.playlist
                    ? JSON.parse(this.playlist)
                    : [];
                this.$fields.forEach((item, index) => {
                    if (this.$fields[index].value) {
                        card[this.$fields[index].name] = this.$fields[
                            index
                        ].value;
                        this.$fields[index].clear();
                    }
                });
                if (card.songName || card.autorName) {
                    currentList.push(card);
                    localStorage.setItem(
                        'playlist',
                        JSON.stringify(currentList)
                    );
                    this.#renderList();
                }
                break;
            case 'clear-list':
                localStorage.removeItem('playlist');
                this.#renderList();
                break;
        }
    }

    destroy() {
        this.$el.removeEventListener('click', this.handlerClick);
        this.$el.remove();
    }
}
