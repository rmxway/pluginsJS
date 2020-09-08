import Field from '../field/index.js';

// plugins of Field
// const songField = new Field('#song-name', {
//     placeholder: 'Название композиции',
// });

// const autorField = new Field('#autor-name', {
//     placeholder: 'Автор композиции',
// });

const createTemplate = function (inputs) {
    const itemsTemplate = inputs
        .map((item, index) => {
            return `<div id="${item.id}" data-id="${index + 1}"></div>`;
        })
        .join('');
    return `
        <div class="field-block flex">
            ${itemsTemplate}
        </div>
        <button class="btn" data-type="button-add">Добавить</button>
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
