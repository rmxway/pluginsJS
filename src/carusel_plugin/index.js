function createTemplate(images, first, arrows, thumbnail) {
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
    const imagesObj = (Object.from = images);
    const thumbnailTamplate = thumbnail
        ? `
        <div class="carousel__thumbnails">
            ${images
                .map((image, index) => {
                    return `
                    <div class="carousel__thumbnail ${
                        first && first === index + 1 ? 'current' : ''
                    }${!first && index === 0 ? 'current' : ''}" data-id="${
                        index + 1
                    }" 
                        style="background-image: url('${
                            imagesObj[index].attributes.src.value
                        }')">
                    </div>
                `;
                })
                .join('')}
        </div>
    `
        : '';
    return `
        <div class="carousel__wrapper">
            ${arrowsTemplate}
            ${thumbnailTamplate}    
            <div class="carousel__block">
                ${imagesTemplate}
            </div>
        </div>
    `;
}

export default class Carousel {
    constructor(selectId, options) {
        this.options = options;
        this.options.speed = options.speed || 300;
        this.options.auto = options.auto || false;
        this.options.delay = options.delay || 3000;
        this.options.thumbnail = options.thumbnail || false;

        this.autoplayInterval;
        this.inAnimation = false;
        this.currentId = 1;

        this.$el = document.querySelector(selectId);
        this.$el.classList.add('carousel');
        this.$images = Array.from(this.$el.querySelectorAll('img'));

        this.#render();

        // Arrows of carousel
        if (this.options.arrows) {
            this.$next = this.$el.querySelector('.carousel__arrows-right');
            this.$prev = this.$el.querySelector('.carousel__arrows-left');
        }

        // Block with images & styles
        this.$block = this.$el.querySelector('.carousel__block');
        //  принимаем все стили блока и слайда
        this.blockStyles = window.getComputedStyle(this.$block, null);
        this.slideStyles = window.getComputedStyle(
            this.$el.querySelector('.carousel__slider'),
            null
        );

        this.handleClick = this.handleClick.bind(this);

        // First Position Carousel
        this.#firstPosition();

        // Autoplay
        if (this.options.auto) {
            this.createInterval();
            this.createInterval = this.createInterval.bind(this);
            this.removeInterval = this.removeInterval.bind(this);
            this.$el.addEventListener('mouseenter', this.removeInterval);
            this.$el.addEventListener('mouseleave', this.createInterval);
        }

        // Event Click
        this.$el.addEventListener('click', this.handleClick);
    }

    #render() {
        const { arrows, first, thumbnail } = this.options;
        this.$el.innerHTML = createTemplate(
            this.$images,
            arrows,
            first,
            thumbnail
        );
    }

    #firstPosition() {
        this.$block.style.left = '0px';
        // default speed: 0.3s
        this.$block.style.transitionDuration = this.options.speed / 1000 + 's';
        if (this.options.first) {
            this.currentId = this.$block.querySelector('.current').dataset.id;
        }

        // смещение слайдера в место первого слайда
        this.$block.style.left =
            parseInt(this.blockStyles.left, 10) -
            parseInt(this.slideStyles.width, 10) * (this.currentId - 1) +
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
        if (this.options.thumbnail) {
            const thumbnails = Array.from(
                this.$el.querySelectorAll('.carousel__thumbnail')
            );
            thumbnails.forEach((item) => {
                item.classList.remove('current');
            });
            thumbnails
                .find(
                    (item) => parseInt(item.dataset.id, 10) === this.currentId
                )
                .classList.add('current');
        }
    }

    createInterval() {
        this.autoplayInterval = setInterval(() => {
            this.next();
            this.#changeCurrentSlider();
        }, this.options.delay);
    }

    removeInterval() {
        clearInterval(this.autoplayInterval);
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
        if (!this.inAnimation) {
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
                    parseInt(this.blockStyles.left, 10) -
                    parseInt(this.slideStyles.width, 10) +
                    'px'
                );
            }
        } else if (dir === 'prev') {
            if (this.currentId === 1) {
                this.currentId = this.$images.length;
                return (
                    parseInt(this.blockStyles.left, 10) -
                    parseInt(this.slideStyles.width, 10) *
                        (this.currentId - 1) +
                    'px'
                );
            } else {
                --this.currentId;
                return (
                    parseInt(this.blockStyles.left, 10) +
                    parseInt(this.slideStyles.width, 10) +
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
        this.$el.removeEventListener('mouseenter', this.removeInterval);
        this.$el.removeEventListener('mouseleave', this.createInterval);
        clearInterval(this.autoplayInterval);
        this.$el.remove();
    }
}
