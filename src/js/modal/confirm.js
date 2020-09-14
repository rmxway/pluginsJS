//import Modal from './index';

const Confirm = (options) => {
    return new Promise((resolve, reject) => {
        const modal = new Modal({
            title: options.title,
            closable: false,
            content: options.content,
            footerButtons: [
                {
                    text: 'Отмена',
                    datatype: 'data-type="modal-close"', // 'data-type="modal-close"'
                },
                {
                    text: 'Удалить',
                    datatype: 'data-type="modal-close"', // 'data-type="modal-close"'
                },
            ],
        });
    });
};

export default Confirm;
