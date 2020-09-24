import Field from '../field';

const createTodolist = (data) => {
    const listTemplate = `${data
        .map((item, idx) => {
            return `<div class="todolist__item ${
                item.completed ? 'active' : ''
            }" data-type="todo-item" data-id="${idx}">
    <div class="todolist__complete"></div>
    <div class="todolist__number">${idx + 1}.</div>
    <div class="todolist__title">${item.title}</div>                
</div>
        `;
        })
        .join('')}`;

    return listTemplate;
};

export default class Todolist {
    constructor(selectid) {
        this.storageTodos = localStorage.getItem('todolist');
        this.data = this.storageTodos ? JSON.parse(this.storageTodos) : [];
        this.$el = document.getElementById(selectid);
        this.$el.classList.add('todolist');

        console.log(this.data);

        this.createField();
        this.createResetButton();
        this.createListBlock();

        this.render(this.data);

        this.#hasElements();

        this.$el.addEventListener('click', this.handlerClick.bind(this));
    }

    // Если задач нет, не выводить доп. элементы
    #hasElements() {
        this.$el.classList[this.data.length > 0 ? 'add' : 'remove']('hasElements');
        this.$listItems = this.$el.querySelectorAll('.todolist__item');
    }

    #toLocalStorage() {
        localStorage.setItem('todolist', JSON.stringify(this.data));
    }

    // Обновление списка задач
    render(data) {
        this.$listBlock.innerHTML = createTodolist(data);
    }

    // Создание кнопки сброса выполненных задач
    createResetButton() {
        this.$resetButton = document.createElement('button');
        this.$resetButton.classList.add('btn', 'btn-black', 'todolist__resetbtn');
        this.$resetButton.innerText = 'сбросить задачи';
        this.$resetButton.dataset.type = 'reset';
        this.$el.append(this.$resetButton);
    }

    // Создание поля для ввода
    createField() {
        this.$field = document.createElement('div');
        this.$field.id = 'todo-field';
        this.$el.append(this.$field);
        this.$field = new Field('todo-field', 'Введите новую задачу');
        this.$field.$input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.data.push({
                    completed: false,
                    title: this.$field.value,
                });
                this.$field.empty();
                this.render(this.data);
                this.#toLocalStorage();
                this.#hasElements();
            }
        });
    }

    // Создание блока для списка задач
    createListBlock() {
        this.$listBlock = document.createElement('div');
        this.$listBlock.classList.add('todolist__block');
        this.$el.append(this.$listBlock);
    }

    // Слушатель клика по всему элементу todolist
    handlerClick(e) {
        const { type } = e.target.dataset;
        const currentItem = e.target;
        const currentId = e.target.dataset.id;

        switch (type) {
            case 'reset':
                this.$listItems.forEach((item, idx) => {
                    item.classList.remove('active');
                    this.data[idx].completed = false;
                });
                this.#toLocalStorage();
                break;
            case 'todo-item':
                currentItem.classList.toggle('active');
                this.data[currentId].completed = currentItem.classList.contains('active');
                this.#toLocalStorage();
                break;
            default:
                break;
        }
    }

    // Удаление элемента
    destroy() {
        this.$el.removeEventListener('click', this.handleClick);
        this.$el.remove();
    }
}
