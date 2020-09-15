import Modal from './index';

const Confirm = (options) => {
    return new Promise((resolve, reject) => {
        const modal = new Modal({
            title: options.title,
            width: options.width,
            closable: false,
            content: options.content,
            onClose() {
                modal.destroy();
            },
            footerButtons: [
                {
                    text: 'Отмена',
                    handleClick() {
                        reject();
                        modal.close();
                    },
                },
                {
                    text: 'Удалить',
                    handleClick() {
                        resolve();
                        modal.close();
                    },
                },
            ],
        });

        setTimeout(() => {
            modal.open();
        }, 10);
    });
};

export default Confirm;
