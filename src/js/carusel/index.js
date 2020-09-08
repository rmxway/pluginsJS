function createTemplate(images, first, arrows, thumbnail, thumbLines) {
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
    const thumbnailTamplate = `
            ${
                thumbnail
                    ? `<div class="carousel__thumbnails ${
                          thumbLines ? `carousel__thumbnails--lines` : ''
                      }">
                    ${images
                        .map((image, index) => {
                            return `
                            <div class="carousel__thumbnail ${
                                first && first === index + 1 ? 'current' : ''
                            }${
                                !first && index === 0 ? 'current' : ''
                            }" data-id="${index + 1}" data-type="thumbnail"
                                ${
                                    !thumbLines &&
                                    `style="background-image: url('${images[index].attributes.src.value}')"`
                                }>
                            </div>
                        `;
                        })
                        .join('')}
                </div>`
                    : ''
            }
    `;
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
        this.options.delay = options.delay || 4000;
        this.options.thumbnail = options.thumbnail || false;
        this.options.thumbLines = options.thumbLines || false;
        this.options.mode = options.mode || 'slide';

        this.autoplayInterval;
        this.inAnimation = false;
        this.currentId = 1;

        this.$el = document.querySelector(selectId);
        this.$el.classList.add('carousel');
        this.$images = Array.from(this.$el.querySelectorAll('img'));

        this.#render();

        //Thumbnails
        if (this.options.thumbnail) {
            this.$thumbnails = Array.from(
                this.$el.querySelectorAll('.carousel__thumbnail')
            );
            this.$thumbnailBlock = this.$el.querySelector(
                '.carousel__thumbnails'
            );
        }

        // Arrows of carousel
        if (this.options.arrows) {
            this.$next = this.$el.querySelector('.carousel__arrows-right');
            this.$prev = this.$el.querySelector('.carousel__arrows-left');
        }

        // Slides
        this.$slides = Array.from(
            this.$el.querySelectorAll('.carousel__slider')
        );

        // Block with images & styles
        this.$block = this.$el.querySelector('.carousel__block');
        //  принимаем все стили блока и слайда
        this.blockStyles = window.getComputedStyle(this.$block, null);
        this.slideStyles = window.getComputedStyle(
            this.$el.querySelector('.carousel__slider'),
            null
        );

        // First Position Carousel
        this.#firstPosition();

        //Fade mode
        if (this.options.mode === 'fade') {
            this.$block.classList.add('fade');
            setTimeout(() => {
                this.$block.style.width = this.slideStyles.width;
                this.$block.style.height = this.slideStyles.height;
                this.$slides.forEach(
                    (item) =>
                        (item.style.transitionDuration =
                            this.options.speed / 1000 + 's')
                );
            }, 0);
        }

        this.handleClick = this.handleClick.bind(this);

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
        const { arrows, first, thumbnail, thumbLines } = this.options;
        this.$el.innerHTML = createTemplate(
            this.$images,
            arrows,
            first,
            thumbnail,
            thumbLines
        );
    }

    #firstPosition() {
        if (this.options.first) this.currentId = this.options.first;

        // смещение слайдера в место первого слайда
        this.movePosition(this.currentId);
        // default speed: 0.3s
        if (this.options.mode === 'slide') {
            this.$block.style.transitionDuration =
                this.options.speed / 1000 + 's';
        }
    }

    #changeCurrentSlider() {
        this.$slides.forEach((item) => {
            item.classList.remove('current');
        });
        this.$slides
            .find((item) => parseInt(item.dataset.id, 10) === this.currentId)
            .classList.add('current');
        if (this.options.thumbnail) {
            this.$thumbnails.forEach((item) => {
                item.classList.remove('current');
            });
            this.$thumbnails
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
        const id = event.target.dataset.id;
        if (type === 'btn-next') {
            this.next();
        } else if (type === 'btn-prev') {
            this.prev();
        } else if (type === 'thumbnail') {
            this.movePosition(+id);
        }
    }

    movePosition(pos) {
        if (!this.inAnimation) {
            const t = setTimeout(() => {
                this.inAnimation = false;
                clearTimeout(t);
            }, this.options.speed);

            if (pos === 1 || pos > this.$images.length) {
                this.currentId = 1;
            } else if (pos < 1) {
                this.currentId = this.$images.length;
            } else {
                this.currentId = pos;
            }

            this.options.mode === 'slide'
                ? (this.$block.style.left = -this.#calculateMove() + 'px')
                : null;

            this.#moveThumbnail();

            this.inAnimation = true;
            this.#changeCurrentSlider();
        }
    }

    #moveThumbnail() {
        if (this.options.thumbnail && !this.options.thumbLines) {
            // Ширина миниатюры 100px
            const widthThumb = 100;
            const widthSlide = parseInt(this.slideStyles.width, 10);
            const maxId = Math.floor(widthSlide / widthThumb);
            const partThumb = widthThumb * (maxId + 1) - widthSlide + 17;

            if (this.currentId === maxId) {
                this.$thumbnailBlock.style.left = -partThumb + 'px';
            } else if (
                this.currentId > maxId &&
                !(this.currentId === this.$images.length)
            ) {
                this.$thumbnailBlock.style.left =
                    -partThumb - widthThumb * (this.currentId - maxId) + 'px';
            } else if (this.currentId === this.$images.length) {
                this.$thumbnailBlock.style.left =
                    -this.$thumbnailBlock.clientWidth + widthSlide + 'px';
            } else {
                this.$thumbnailBlock.style.left = '0px';
            }
        }
    }

    #calculateMove() {
        return parseInt(this.slideStyles.width, 10) * (this.currentId - 1);
    }

    next() {
        this.movePosition(this.currentId + 1);
    }

    prev() {
        this.movePosition(this.currentId - 1);
    }

    destroy() {
        this.$el.removeEventListener('click', this.handleClick);
        this.$el.removeEventListener('mouseenter', this.removeInterval);
        this.$el.removeEventListener('mouseleave', this.createInterval);
        clearInterval(this.autoplayInterval);
        this.$el.remove();
    }
}
