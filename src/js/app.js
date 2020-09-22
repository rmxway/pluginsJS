'use-strict';

import Select from './select';
import Carousel from './carusel';
import Playlist from './playlist';
import Modal from './modal';
import Accordeon from './accordeon';
import './modal/practice';
import '../scss/style.scss';
import './todolist';

// plugin of Select
const select = new Select({
    id: 'select',
    /*selectedId: '2',*/
    placeholder: 'Выберите ваше направление',
    data: [
        { value: 'React' },
        { value: 'Angular' },
        { value: 'Native JS' },
        { value: 'Vue' },
        { value: 'Webpack' },
        { value: 'Next' },
        { value: 'SingleTone' },
    ],
});

window.select = select;

// plugin of Carousel
if (document.getElementById('slider')) {
    const slider = new Carousel('#slider', {
        speed: 500,
        auto: true,
        delay: 3000,
        //arrows: false,
        //first: 4,
        thumbnail: true,
        thumbLines: true,
        mode: 'fade', //default 'slide
    });

    window.slider = slider;
}

// Playlist block --------------------

if (document.getElementById('playlist')) {
    const playlist = new Playlist('#playlist', [
        {
            placeholder: 'Название композиции',
            id: 'song-name',
        },
        {
            placeholder: 'Автор композиции',
            id: 'autor-name',
        },
    ]);
    window.playlist = playlist;
}

// Modal Window
const myModal = Modal({
    speed: 200,
    description: 'Карточка товара',
    width: '500px',
    title: 'Помидоры',
    closable: true,
    content: `
        <p>Цена: <i>500 р.</i></p>
        <p>Описание товара: Спелые помидоры, красного цвета.</p>`,
    footerButtons: [
        {
            text: 'Купить',
            type: 'default',
            handleClick() {
                myModal.close();
            },
        },
        {
            text: 'Отмена',
            handleClick() {
                myModal.close();
            },
        },
    ],
});

const buttonModal = document.querySelector('[data-type="modal-open"]');

window.modal = myModal;

buttonModal.addEventListener('click', () => {
    myModal.open();
});

// Accordeon --------------------

if (document.getElementById('accordeon')) {
    const acc = new Accordeon('accordeon', {
        //items: [{ question: 'My Question', answer: 'Answer' }],
        //speed: 300,
        //independent: true, // открывать каждый блок отдельно
    });

    window.acc = acc;
}
