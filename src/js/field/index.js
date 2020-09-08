const createTemplate = function (placeholder, name) {
    return `
        <label for="${name}">${placeholder}</label>
        <input id="${name}" data-type="input" type="text" />
    `;
};

export default class Field {
    constructor(selectedId, placeholder) {
        this.selectedId = selectedId;
        this.placeholder = placeholder;
        this.name = this.#camelize(selectedId);
        this.value = '';

        this.$el = document.getElementById(selectedId);
        this.$el.classList.add('field');

        this.#render();

        // добавление анимации при фокусе
        this.$input = this.$el.querySelector('#' + this.name);

        this.$input.onfocus = () => {
            this.$el.classList.add('focus');
        };
        this.$input.onblur = () => {
            if (this.value.length === 0) this.$el.classList.remove('focus');
        };

        this.$input.oninput = (e) => {
            this.value = e.target.value;
        };
    }

    #render() {
        this.$el.innerHTML = createTemplate(this.placeholder, this.name);
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
