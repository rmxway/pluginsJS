const createTemplate = function (placeholder, name) {
    return `
        <label for="${name}">${placeholder}</label>
        <input id="${name}" data-type="input" type="text" />
    `;
};

export default class Field {
    constructor(selectedId, options) {
        this.selectedId = selectedId;
        this.options = options;
        this.name = this.#camelize(selectedId);

        this.$el = document.querySelector(selectedId);
        this.$el.classList.add('field');

        this.#render();
    }

    #render() {
        const { placeholder } = this.options;
        this.$el.innerHTML = createTemplate(placeholder, this.name);
    }

    // делает из строчки #text-name > textName
    #camelize(kebabString) {
        let arr = kebabString.split('-');
        let capital = arr.map((item, index) =>
            index
                ? item.charAt(0).toUpperCase() + item.slice(1).toLowerCase()
                : item.slice(1)
        );
        let capitalString = capital.join('');
        return capitalString;
    }
}
