import Field from '../field/index.js';

// создание HTML Шаблона

const createTemplate = function (inputs, playlistJSON) {
    const inputTemplate = inputs
        .map((item, index) => {
            return `<div id="${item.id}" data-id="${index + 1}"></div>`;
        })
        .join('');
    const playlistTemplate =
        playlistJSON !== null
            ? `
        <span class="todo-playlist__title">Список треков</span>
        <ul class="todo-playlist__list">
        ${playlistJSON
            .map((item, index) => {
                return `
                <li class="todo-playlist__item">
                    <div class="todo-playlist__item__song">
                        ${index + 1}. ${item.songName ? item.songName : ''}
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

    return `
        <span class="todo-playlist__title">Добавить новый трек</span>
        <div class="field-block flex">
            ${inputTemplate}
        </div>
        <button class="btn" data-type="button-add">Добавить</button>

        ${playlistTemplate}
    `;
};

export default class TodoPlaylist {
    constructor(selectedId, inputs) {
        this.inputs = inputs;

        this.playlist;
        this.playlistJSON;

        this.$fields = [];
        this.$el = document.querySelector(selectedId);

        this.#getList();

        this.#render();

        this.$buttonAdd = this.$el.querySelector('[data-type="button-add"]');

        this.handlerAdd = this.handlerAdd.bind(this);

        this.$buttonAdd.addEventListener('click', this.handlerAdd);
    }

    #getList() {
        // Получение JSON из localStorage
        this.playlist = localStorage.getItem('playlist');
        this.playlistJSON = JSON.parse(this.playlist);
    }

    #render() {
        this.$el.innerHTML = createTemplate(this.inputs, this.playlistJSON);
        this.inputs.forEach(
            (item, index) =>
                (this.$fields[index] = new Field(item.id, item.placeholder))
        );
    }

    handlerAdd() {
        // playlist = [{"songName":"Dont Stop", "autorName":"Dovgan Evgeny"}]
        let card = {};
        let currentList = JSON.parse(this.playlist) || [];
        this.$fields.forEach((item, index) => {
            if (this.$fields[index].value) {
                card[this.$fields[index].name] = this.$fields[index].value;
                this.$fields[index].clear();
            }
        });
        if (card.songName || card.autorName) {
            currentList.push(card);
            console.log(currentList);
            localStorage.setItem('playlist', JSON.stringify(currentList));
            this.#getList();
            this.#render();
        }
    }

    destroy() {}
}
