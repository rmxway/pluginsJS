import Field from '../field/index.js';

// создание HTML Шаблона

const createTemplate = function (inputs) {
    const inputTemplate = inputs
        .map((item, index) => {
            return `<div id="${item.id}" data-id="${index + 1}"></div>`;
        })
        .join('');

    return `
        <span class="playlist__title">Добавить новый трек</span>
        <div class="fields-block flex">
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
        <span class="playlist__title">Список треков</span>
        <div class="playlist__clear fa fa-trash-o" data-type="clear-list"></div>
        <ul class="playlist__list">
        ${playlistJSON
            .map((item, index) => {
                return `
                <li class="playlist__item" data-id="${index}" data-type="list-item">
                    <div class="playlist__item__number">${index + 1}</div>
                    ${
                        item.songName
                            ? `<div class="playlist__item__song">${item.songName.trim()}</div>`
                            : ''
                    }
                    ${
                        item.autorName
                            ? `<div class="playlist__item__autor">${item.autorName.trim()}</div>`
                            : ''
                    }
                    <div class="playlist__item__close fa fa-close" data-type="list-item-close"></div>
                </li>
            `;
            })
            .join('')}
        </ul>`
            : '';
    return playlistTemplate;
};

export default class Playlist {
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
            (item, index) => (this.$fields[index] = new Field(item.id, item.placeholder))
        );
    }

    #renderList() {
        this.#getList();
        this.$list.innerHTML = listTemplate(this.playlistJSON);
    }

    handlerClick(event) {
        const { type } = event.target.dataset;
        let currentList = this.playlist ? JSON.parse(this.playlist) : [];
        let card = {};

        switch (type) {
            case 'button-add':
                // playlist = [{"songName":"Dont Stop", "autorName":"Dovgan Evgeny"}]
                this.$fields.forEach((item, index) => {
                    if (this.$fields[index].value) {
                        card[this.$fields[index].name] = this.$fields[index].value;
                        this.$fields[index].clear();
                    }
                });
                if (card.songName || card.autorName) {
                    currentList.push(card);
                    localStorage.setItem('playlist', JSON.stringify(currentList));
                    this.#renderList();
                }
                break;
            case 'clear-list':
                localStorage.removeItem('playlist');
                this.#renderList();
                break;
            case 'list-item-close':
                const itemId = event.target.parentNode.dataset.id;
                currentList.splice(itemId, 1);
                localStorage.setItem('playlist', JSON.stringify(currentList));
                this.#renderList();
                break;
        }
    }

    destroy() {
        this.$el.removeEventListener('click', this.handlerClick);
        this.$el.remove();
    }
}
