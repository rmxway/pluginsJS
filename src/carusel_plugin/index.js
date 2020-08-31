function createTemplate(images, arrows, first) {
    const arrowsTemplate =
        arrows || arrows === undefined
            ? `
            <div class="carousel__arrows">
                <div class="carousel__arrows-left" data-type="btn-prev">
                    <div class="fa fa-chevron-left"></div>
                </div>
                <div class="carousel__arrows-right" data-type="btn-next">
                    <div class="fa fa-chevron-right"></div>
                </div>
            </div>
        `
            : '';

    const imagesTemplate = `
        ${images
            .map((image, index) => {
                return `
                <div class="carousel__slider ${
                    first && first === index + 1 ? 'current' : ''
                }${!first && index === 0 ? 'current' : ''}" data-id="${
                    index + 1
                }">${image.outerHTML}</div>`;
            })
            .join('')}
    `;
    return `
        <div class="carousel__wrapper">
            ${arrowsTemplate}
            <div class="carousel__block">
                ${imagesTemplate}
            </div>    
        </div>
    `;
}

export default class Carousel {
    constructor(selectId, options) {
        this.options = options;
        this.inAnimation = false;
        this.currentId = 1;
        this.$el = document.querySelector(selectId);
        this.$el.classList.add('carousel');
        this.$images = Array.from(this.$el.querySelectorAll('img'));

        this.#render();

        if (this.options.arrows) {
            this.$next = this.$el.querySelector('.carousel__arrows-right');
            this.$prev = this.$el.querySelector('.carousel__arrows-left');
        }

        this.$block = this.$el.querySelector('.carousel__block');
        //  принимаем все стили этих элементов
        this.$blockStyles = window.getComputedStyle(this.$block, null);
        this.$sliderStyles = window.getComputedStyle(
            this.$el.querySelector('.carousel__slider'),
            null
        );

        this.handleClick = this.handleClick.bind(this);

        this.#firstPosition();

        this.options.auto ? this.#auto() : null;

        this.$el.addEventListener('click', this.handleClick);
    }

    #render() {
        const { arrows, first } = this.options;
        this.$el.innerHTML = createTemplate(this.$images, arrows, first);
    }

    #firstPosition() {
        this.$block.style.left = '0px';
        // default speed: 0.3s
        this.$block.style.transitionDuration = this.options.speed
            ? this.options.speed.toString() / 1000 + 's'
            : '0.3s';
        if (this.options.first) {
            this.currentId = this.$block.querySelector('.current').dataset.id;
        }

        // смещение слайдера в место первого слайда
        this.$block.style.left =
            parseInt(this.$blockStyles.left, 10) -
            parseInt(this.$sliderStyles.width, 10) * (this.currentId - 1) +
            'px';
    }

    #changeCurrentSlider() {
        const slides = Array.from(
            this.$el.querySelectorAll('.carousel__slider')
        );
        slides.forEach((item) => {
            item.classList.remove('current');
        });
        slides
            .find((item) => parseInt(item.dataset.id, 10) === this.currentId)
            .classList.add('current');
    }

    #auto() {
        const interval = setInterval(() => {
            this.next();
            this.#changeCurrentSlider();
        }, this.options.delay);
    }

    handleClick(event) {
        const { type } = event.target.dataset;
        if (type === 'btn-next') {
            this.next();
        } else if (type === 'btn-prev') {
            this.prev();
        }
        this.#changeCurrentSlider();
    }

    animation(direction) {
        if (this.inAnimation === false) {
            const t = setTimeout(() => {
                this.inAnimation = false;
                clearTimeout(t);
            }, this.options.speed);
            this.$block.style.left = this.#calculateMove(direction);
            this.inAnimation = true;
        }
    }

    #calculateMove(dir) {
        if (dir === 'next') {
            if (this.$images.length === this.currentId) {
                this.currentId = 1;
                return '0px';
            } else {
                ++this.currentId;
                return (
                    parseInt(this.$blockStyles.left, 10) -
                    parseInt(this.$sliderStyles.width, 10) +
                    'px'
                );
            }
        } else if (dir === 'prev') {
            if (this.currentId === 1) {
                this.currentId = this.$images.length;
                return (
                    parseInt(this.$blockStyles.left, 10) -
                    parseInt(this.$sliderStyles.width, 10) *
                        (this.currentId - 1) +
                    'px'
                );
            } else {
                --this.currentId;
                return (
                    parseInt(this.$blockStyles.left, 10) +
                    parseInt(this.$sliderStyles.width, 10) +
                    'px'
                );
            }
        }
    }

    next() {
        this.animation('next');
    }

    prev() {
        this.animation('prev');
    }

    destroy() {
        this.$el.removeEventListener('click', this.handleClick);
        this.$el.remove();
    }
}
