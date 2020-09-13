import Modal from './index';

// Модальное окно на практике
// Создание Cards из массива
const cardsArray = [
    { id: 1, title: 'Груша', price: 100, img: 'img/fruit-1.jpg' },
    { id: 2, title: 'Апельсин', price: 120, img: 'img/fruit-2.jpg' },
    { id: 3, title: 'Арбуз', price: 90, img: 'img/fruit-3.jpg' },
];

const cardsBlock = document.querySelector('#cards');
const modals = [];

const createCardsTemplate = (arr) => {
    const cards = document.createElement('div');
    cards.classList.add('card__wrapper');
    if (arr.length > 0) {
        cards.innerHTML = arr
            .map((card) => {
                const template = `
<div class="card" data-id="${card.id}">
    <div class="card__title">${card.title}</div>
    <div class="card__image"><img src="${card.img}" alt="${card.title}"></div>                    
    <div class="flex">
        <button class="btn btn-default" data-type="modal-price">Цена</button>
        <button class="btn btn-default" data-type="modal-delete">Удалить</button>
    </div>
</div>`;
                return template;
            })
            .join('');
        const elements = cards.querySelectorAll('.card');
        elements.forEach((elem, index) => {
            modals[index] = new Modal({
                speed: 200,
                description: 'Карточка товара',
                width: '300px',
                title: arr[index].title,

                content: `<p>${arr[index].price} руб.</p>`,
                footerButtons: [
                    {
                        text: 'Ok',
                        type: 'default',
                        datatype: 'data-type="modal-close"',
                    },
                ],
            });
            elem.querySelector('[data-type="modal-price"]').addEventListener('click', () => {
                modals[index].open();
            });
        });
    }

    return cards;
};

cardsBlock.append(createCardsTemplate(cardsArray));
