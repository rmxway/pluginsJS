const demoArray = [
    {
        question: 'Сколько ответов я могу получить?',
        answer: `Ex non aute ad sint qui cupidatat enim magna duis minim cupidatat. Qui elit sunt ipsum et mollit. Dolor veniam velit do commodo aliquip incididunt quis ipsum.
Nisi nulla eiusmod fugiat labore ex enim culpa id dolor Lorem ipsum. Sit amet sint eiusmod magna ad velit sint consectetur esse nisi commodo minim ipsum tempor. Ullamco voluptate enim enim amet.
Et amet occaecat Lorem voluptate laboris qui quis fugiat nulla elit magna aliqua ex. Fugiat qui do et esse ullamco nostrud est culpa nisi adipisicing occaecat sunt consectetur. Tempor proident magna deserunt proident labore amet aliqua pariatur esse et anim sint enim excepteur. Commodo ex cillum fugiat magna ut commodo.`,
    },
    {
        question: 'Сколько вопросов могу задать?',
        answer: `Mollit voluptate mollit do ut aliquip deserunt velit Lorem occaecat duis. Do incididunt exercitation deserunt dolor occaecat magna veniam laboris pariatur cillum cupidatat enim culpa id. Elit nostrud laborum labore sit irure qui velit ad laborum laboris adipisicing elit laboris laborum. Duis laboris dolor nulla aute esse officia anim sunt. Qui nisi reprehenderit voluptate nisi non dolor do officia commodo labore Lorem. Irure tempor proident sit veniam commodo nulla est non irure ut excepteur occaecat minim. Pariatur labore aute pariatur sunt elit ut ullamco ex esse est.
Laboris pariatur irure velit consectetur minim occaecat minim aliqua elit deserunt velit. Consequat elit commodo ea fugiat. Est duis quis commodo incididunt velit. Excepteur occaecat anim adipisicing nulla est enim. Et minim labore ea culpa ad ea esse. Tempor officia duis consequat duis ullamco consectetur dolore veniam cupidatat. Irure elit duis Lorem commodo eu sint veniam consequat voluptate.`,
    },
];

const createAccordeonItems = (items) => {
    return items
        .map((item) => {
            return `<div class="accordeon__item">
        <span class="accordeon__question">${item.question}</span>
        <span class="accordeon__answer">${item.answer}</span>
        </div>`;
        })
        .join('');
};

export default class Accordeon {
    constructor(selectid, options) {
        this.selectid = selectid;
        this.options = options;

        this.$el = document.getElementById(selectid);
        this.$el.classList.add('accordeon');

        this.items = !options.items || options.items.length === 0 ? demoArray : options.items;

        this.#render();
    }

    #render() {
        this.$el.innerHTML = createAccordeonItems(this.items);
    }
}
