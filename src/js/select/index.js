const createTemplateSelect = function (placeholder, data = [], selectedId) {
    let textPlaceholder = placeholder ? placeholder : 'По умолчанию';
    const items = `
        ${data
            .map((item, index) => {
                let classItem = '';
                if (index + 1 === +selectedId) {
                    textPlaceholder = item.value;
                    classItem = 'active';
                }
                return `<li data-id="${
                    index + 1
                }" class="${classItem}" data-type="item">${item.value}</li>`;
            })
            .join('')}
    `;
    return `
        <div class="select__overlay" data-type="overlay"></div> 
        <div class="select__input" data-type="input">
            <div>${textPlaceholder}</div>
            <span class="fa fa-chevron-down"></span>
        </div>
        <div class="select__dropdown">
            <ul>
                ${items}
            </ul>
        </div>
    `;
};

export default class Select {
    constructor(options) {
        this.options = options;
        this.$el = document.getElementById(options.id);
        this.$el.classList.add('select');
        this.selectedId = options.selectedId;
        this.#render(options);
        this.#setup();
    }

    #render(options) {
        const { placeholder, data } = options;
        this.$el.innerHTML = createTemplateSelect(
            placeholder,
            data,
            this.selectedId
        );
    }

    #setup() {
        this.handleClick = this.handleClick.bind(this);
        this.$el.addEventListener('click', this.handleClick);
    }

    handleClick(event) {
        const { type } = event.target.dataset;
        if (type === 'input') {
            this.toggle();
        } else if (type === 'item') {
            const id = event.target.dataset.id;
            this.$el.querySelectorAll('li').forEach((item) => {
                item.classList.remove('active');
            });
            event.target.classList.add('active');
            const innerText = event.target.innerText;
            const placeholder = this.$el.querySelector(
                '[data-type="input"] div'
            );
            placeholder.innerHTML = innerText;
            this.select(id);
            this.toggle();
        } else if (type === 'overlay') this.toggle();
    }

    select(id) {
        this.selectedId = id;
        console.log(this.selectedId, this.current);
    }

    get current() {
        return this.options.data.find(
            (item, index) => index + 1 === +this.selectedId
        );
    }

    get isOpen() {
        return this.$el.classList.contains('open');
    }

    toggle() {
        this.isOpen ? this.close() : this.open();
    }

    open() {
        this.$el.classList.add('open');
    }
    close() {
        this.$el.classList.remove('open');
    }

    destroy() {
        this.$el.removeEventListener('click', this.handleClick);
        this.$el.remove();
    }
}
