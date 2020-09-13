import Select from './select';
import Carousel from './carusel';
import TodoPlaylist from './todoplaylist';
import Modal from './modal';
import './modal/practice';
import '../scss/style.scss';

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

if (document.getElementById('todo-playlist')) {
    const todoPlaylist = new TodoPlaylist('#todo-playlist', [
        {
            placeholder: 'Название композиции',
            id: 'song-name',
        },
        {
            placeholder: 'Автор композиции',
            id: 'autor-name',
        },
    ]);
    window.todoPlaylist = todoPlaylist;
}

// Todo block --------------------

// Modal Window
const myModal = Modal({
    speed: 200,
    description: 'Карточка товара',
    width: '500px',
    title: 'Помидоры',
    //closable: true,
    content: `
        <p>Цена: <i>500 р.</i></p>
        <p>Описание товара: Спелые помидоры, красного цвета.</p>`,
    footerButtons: [
        {
            text: 'Купить',
            type: 'default',
        },
        {
            text: 'Отмена',
            datatype: 'data-type="modal-close"',
        },
    ],
});

const buttonModal = document.querySelector('[data-type="modal-open"]');

window.modal = myModal;

buttonModal.addEventListener('click', () => {
    myModal.open();
});
