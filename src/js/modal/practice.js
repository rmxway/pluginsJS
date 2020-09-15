import Modal from './index';
import Confirm from './confirm';
import '../../img/fruit-1.jpg';
import '../../img/fruit-2.jpg';
import '../../img/fruit-3.jpg';

// Модальное окно на практике

const priceModal = new Modal({
    title: 'Цена на товар',
    closable: true,
    footerButtons: [
        {
            text: 'Ok',
            handleClick() {
                priceModal.close();
            },
        },
    ],
});

// Создание Cards из массива
let cardsArray = [
    { id: 1, title: 'Груша', price: 100, img: 'img/fruit-1.jpg' },
    { id: 2, title: 'Апельсин', price: 120, img: 'img/fruit-2.jpg' },
    { id: 3, title: 'Арбуз', price: 90, img: 'img/fruit-3.jpg' },
];

const toHTML = (card) => `
<div class="card" data-id="${card.id}">
    <div class="card__title">${card.title}</div>
    <div class="card__image"><img src="${card.img}" alt="${card.title}"></div>                    
    <div class="flex">
        <button class="btn btn-default" data-type="price" data-id="${card.id}">Цена</button>
        <button class="btn btn-default" data-type="delete" data-id="${card.id}">Удалить</button>
    </div>
</div>`;

const cards = document.querySelector('#cards');

const render = () => {
    const html = cardsArray.map(toHTML).join('');
    const cardsWrapper = document.createElement('div');
    cardsWrapper.classList.add('card__wrapper');
    cards.innerHTML = cardsWrapper.outerHTML;
    cards.querySelector('.card__wrapper').innerHTML = html;
};

render();

cards.addEventListener('click', (event) => {
    event.preventDefault();
    const { type, id } = event.target.dataset;
    const fruit = cardsArray.find((card) => card.id === +id);
    if (type === 'price') {
        priceModal.setContent(`<p>${fruit.title}: <span>${fruit.price} руб.</span></p>`);
        priceModal.open();
    } else if (type === 'delete') {
        Confirm({
            title: 'Вы уверены?',
            content: `<p>Вы удаляете фрукт: <span>${fruit.title}</span></p>`,
        })
            .then(() => {
                cardsArray = cardsArray.filter((item) => item.id !== +id);
                render();
            })
            .catch(() => {});
    }
});
