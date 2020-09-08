import Select from './select_plugin/index.js';
import Carousel from './carusel_plugin/index.js';
import styles from '../scss/style.scss';

// plugin of Select
const select = new Select({
    id: 'select',
    //selectedId: '2',
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

// plugin of Carousel
const slider = new Carousel('#slider', {
    speed: 500,
    auto: true,
    delay: 3000,
    //arrows: false,
    //first: 4,
    thumbnail: true,
    //thumbLines: true,
    mode: 'fade', //default 'slide
});

window.s = slider;
