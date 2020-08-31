import Select from './select_plugin/index.js';
import Carousel from './carusel_plugin/index.js';
import styles from './scss/style.scss';

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

const slider = new Carousel('#slider', {
    speed: 500,
    //auto: true,
    //arrows: false,
    first: 3,
    //thumbnail: true,
    //mode: 'slide'; //opt: fade
    //orientation: 'horizontal' //opt: vertical
});
