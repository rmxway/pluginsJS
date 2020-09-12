const _createModal = function (options, speed) {
    const windowWidth = options.width || '300px';
    const description = options.description;
    const closable = options.closable !== undefined ? options.closable : true;
    const footerTemplate = options.footerButtons
        ? `<div class="modal__footer">${options.footerButtons
              .map((item) => {
                  return `<button class="btn ${item.type === 'default' ? `btn-default` : ``}">
                    ${item.text}
                    </button>`;
              })
              .join('')}
                </div>`
        : '';

    console.log(footerTemplate);

    const modal = document.createElement('div');
    modal.classList.add('modal');
    modal.insertAdjacentHTML(
        'afterbegin',
        `
        <div class="modal__overlay" style="transition-duration: ${
            speed / 1000
        }s" data-type="modal-close">
            <div class="modal__window" style="transition-duration: ${
                speed / 1000
            }s; width: ${windowWidth}">
                <div class="modal__header">
                    <div class="modal__title">
                        ${options.title || 'New Modal'}    
                        ${description ? `<span>${description}</span>` : ''}
                    </div>                    
                    ${
                        closable
                            ? `<div class="modal__close" data-type="modal-close">&times;</div>`
                            : ''
                    }
                </div>
                <div class="modal__body" data-type="content">
                    ${options.content || ''}
                </div>                
                ${footerTemplate}
            </div>
        </div>
        `
    );

    document.body.appendChild(modal);

    return modal;
};

/*
    destroy()
    Закрытие окна

    -------------

    setContent(html: string): void PUBLIC
    onClose(): void
    onOpen():void
    beforeClose(): boolean
    
*/

const Modal = function (options) {
    const ANIMATION_SPEED = options.speed || 300;
    const $modal = _createModal(options, ANIMATION_SPEED);
    let destroyed = false;

    const modal = {
        open() {
            if (destroyed) return console.log('Modal is destroyed');
            $modal.classList.add('open');
        },
        close() {
            $modal.classList.remove('open');
        },
    };

    const handleClick = (event) => {
        const { type } = event.target.dataset;
        switch (type) {
            case 'modal-close':
                modal.close();
        }
    };
    $modal.addEventListener('click', handleClick);

    return Object.assign(modal, {
        destroy() {
            $modal.parentNode.removeChild($modal);
            $modal.removeEventListener('click', handleClick);
            destroyed = true;
        },
        setContent(html) {
            $modal.querySelector('[data-type="content"]').innerHTML = html;
        },
        onClose() {},
        onOpen() {},
    });
};

export default Modal;
