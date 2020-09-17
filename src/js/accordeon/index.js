const demoArray = [
    {
        question: 'Сколько ответов я могу получить?',
        answer: `Ex non aute ad sint qui cupidatat enim magna duis minim cupidatat. Qui elit sunt ipsum et mollit. Dolor veniam velit do commodo aliquip incididunt quis ipsum.
Nisi nulla eiusmod fugiat labore ex enim culpa id dolor Lorem ipsum. <strong>Sit amet sint</strong> eiusmod magna ad velit sint consectetur esse nisi commodo minim ipsum tempor. Ullamco voluptate enim enim amet.
Et amet occaecat Lorem voluptate laboris qui quis fugiat nulla elit magna aliqua ex. Fugiat qui do et esse ullamco nostrud est culpa nisi adipisicing occaecat sunt consectetur. Tempor proident magna deserunt proident labore amet aliqua pariatur esse et anim sint enim excepteur. Commodo ex cillum fugiat magna ut commodo.`,
    },
    {
        question: 'Сколько вопросов могу задать?',
        answer: `Mollit voluptate mollit do ut aliquip deserunt velit Lorem occaecat duis. Do incididunt exercitation deserunt dolor occaecat magna veniam laboris pariatur cillum cupidatat enim culpa id. Elit nostrud laborum labore sit irure qui velit ad laborum laboris adipisicing elit laboris laborum. Duis laboris dolor nulla aute esse officia anim sunt.`,
    },
    {
        question: 'На чем был сделан плагин?',
        answer: `Ex non aute ad sint qui cupidatat enim magna duis minim cupidatat. Qui elit sunt ipsum et mollit. Dolor veniam velit do commodo aliquip incididunt quis ipsum.
Nisi nulla eiusmod fugiat...`,
    },
    {
        question: 'Как подбирается дизайн в проекте?',
        answer: `Do incididunt exercitation deserunt dolor occaecat magna veniam laboris pariatur cillum cupidatat enim culpa id. Elit nostrud laborum labore sit irure qui velit ad laborum laboris adipisicing elit laboris laborum. Duis laboris dolor nulla aute esse officia anim sunt.`,
    },
];

const createAccordeonItems = (items) => {
    return items
        .map((item) => {
            return `<div class="accordeon__item" data-type="item">
        <span class="accordeon__question" data-type="question">${item.question}<span class="fa fa-chevron-down"></span></span>
        <span class="accordeon__answer">${item.answer}</span>
        </div>`;
        })
        .join('');
};

export default class Accordeon {
    constructor(selectid, options) {
        this.selectid = selectid;
        this.options = options;
        this.speed = options.speed || 100;
        this.independent = options.independent || false;

        this.$el = document.getElementById(selectid);
        this.$el.classList.add('accordeon');

        this.$currentItem;

        this.items = !options.items || options.items.length === 0 ? demoArray : options.items;

        this.handleClick = this.handleClick.bind(this);

        this.$el.addEventListener('click', this.handleClick);

        this.#render();

        this.$elItems = Array.from(this.$el.querySelectorAll('.accordeon__item'));
        this.$elAnswers = Array.from(this.$el.querySelectorAll('.accordeon__answer'));

        // speed

        this.$elAnswers.forEach(
            (item) => (item.style.transitionDuration = this.speed / 1000 + 's')
        );
    }

    #render() {
        this.$el.innerHTML = createAccordeonItems(this.items);
    }

    open() {
        this.$currentItem.classList.add('open');
    }
    close() {
        this.independent
            ? this.$currentItem.classList.remove('open')
            : this.$elItems.forEach((item) => item.classList.remove('open'));
    }

    get isOpen() {
        return this.$currentItem.classList.contains('open');
    }

    toggle() {
        if (this.independent) {
            this.isOpen ? this.close() : this.open();
        } else {
            if (this.isOpen) {
                this.close();
            } else {
                this.close();
                this.open();
            }
        }
    }

    handleClick(event) {
        if (!this.animated) {
            this.animated = true;

            const timer = setTimeout(() => {
                clearTimeout(timer);
                this.animated = false;
            }, this.speed);

            const { type } = event.target.dataset;
            this.$currentItem = event.target.parentNode;
            if (type === 'question') {
                this.toggle();
            }
        }
    }
}
