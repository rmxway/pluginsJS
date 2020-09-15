/**
 * Options in Modal
 * speed: Number,
   description: String,
   width: String,
   title: String,
   closable: Boolean,
   content: String,
   footerButtons: [
        {
            text: String,
            type: String,  // 'default',
            datatype: String,  // 'data-type="modal-close"'
            handler() {},
        }
    ],
 */

function noop() {}

const createModalFooter = (buttons) => {
    const wrap = document.createElement('div');
    wrap.classList.add('modal__footer');

    buttons.forEach((item) => {
        const $btn = document.createElement('button');
        $btn.textContent = item.text;
        $btn.classList.add('btn');
        if (item.type === 'default') $btn.classList.add('btn-default');
        $btn.onclick = item.handleClick || noop;
        wrap.appendChild($btn);
    });

    return wrap;
};

const createModal = (options, speed) => {
    const windowWidth = options.width || '300px';
    const { description } = options;
    const closable = options.closable !== undefined ? options.closable : true;
    const footerTemplate =
        options.footerButtons.length > 0 ? createModalFooter(options.footerButtons) : null;
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
            </div>
        </div>
        `
    );

    modal.querySelector('.modal__window').append(footerTemplate);

    document.body.appendChild(modal);

    return modal;
};

const Modal = (options) => {
    const ANIMATION_SPEED = options.speed || 300;
    const $modal = createModal(options, ANIMATION_SPEED);
    let destroyed = false;

    const modal = {
        open() {
            if (destroyed) return;
            $modal.classList.add('open');
        },
        close() {
            $modal.classList.remove('open');
            const t = setTimeout(() => {
                if (typeof options.onClose === 'function') {
                    options.onClose();
                }
                clearTimeout(t);
            }, ANIMATION_SPEED);
        },
    };

    const handleClick = (event) => {
        const { type } = event.target.dataset;
        switch (type) {
            case 'modal-close':
                modal.close();
                break;
            default:
                break;
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
    });
};

export default Modal;
