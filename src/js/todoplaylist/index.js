import Field from '../field/index.js';

const createTemplate = function (inputs) {
    const itemsTemplate = inputs
        .map((item, index) => {
            return `<div id="${item.id}" data-id="${index + 1}"></div>`;
        })
        .join('');
    return `
        <span class="todo-playlist__title">Добавить новый трек</span>
        <div class="field-block flex">
            ${itemsTemplate}
        </div>
        <button class="btn" data-type="button-add">Добавить</button>
        <span class="todo-playlist__title">Список треков</span>
        <ul class="todo-playlist__list">
            <li class="todo-playlist__item">
                <div class="todo-playlist__item__song">1. Это не любовь</div>
                <div class="todo-playlist__item__autor">Кино</div>
                <div class="todo-playlist__item__close"></div>
            </li>
            <li class="todo-playlist__item">
                <div class="todo-playlist__item__song">2. Call you back</div>
                <div class="todo-playlist__item__autor">Josh Butler</div>
                <div class="todo-playlist__item__close"></div>
            </li>
        </ul>
    `;
};

export default class TodoPlaylist {
    constructor(selectedId, inputs) {
        this.inputs = inputs;

        this.$el = document.querySelector(selectedId);

        this.#render();
        this.#setupInputs();
    }

    #render() {
        this.$el.innerHTML = createTemplate(this.inputs);
    }

    #setupInputs() {
        this.inputs.map((item) => new Field(item.id, item.placeholder));
    }
}
