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
                    first && first === index + 1
                        ? 'carousel__slider--current'
                        : ''
                }${
                    !first && index === 0 ? 'carousel__slider--current' : ''
                }" data-id="${index + 1}">${image.outerHTML}</div>`;
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
        this.#firstPosition();

        this.$el.addEventListener('click', this.handleClick);
    }

    #render() {
        const { arrows, first } = this.options;
        this.$el.innerHTML = createTemplate(this.$images, arrows, first);
        if (arrows) {
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
    }

    #firstPosition() {
        this.$block.style.left = '0px';
        // default speed: 0.3s
        this.$block.style.transitionDuration = this.options.speed
            ? this.options.speed.toString() / 1000 + 's'
            : '0.3s';
        if (this.options.first) {
            this.currentId = this.$block.querySelector(
                '.carousel__slider--current'
            ).dataset.id;
        }
    }

    handleClick(event) {
        const { type } = event.target.dataset;
        if (type === 'btn-next') {
            this.next();
        } else if (type === 'btn-prev') {
            this.prev();
        }
    }

    next() {
        this.$block.style.left =
            parseInt(this.$blockStyles.left, 10) -
            parseInt(this.$sliderStyles.width, 10) +
            'px';
    }

    prev() {
        this.$block.style.left =
            parseInt(this.$blockStyles.left, 10) +
            parseInt(this.$sliderStyles.width, 10) +
            'px';
    }

    destroy() {
        this.$el.removeEventListener('click', this.handleClick);
        this.$el.remove();
    }
}
