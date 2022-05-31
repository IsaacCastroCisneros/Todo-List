const formAdd = document.querySelector('[data-form]');
const formInput = document.querySelector('[data-form-input]');
const template = document.querySelector('[data-todo]');
const list = document.querySelector('[data-list]');
const listCount = document.querySelectorAll('[data-list-count]');
const listComplete = document.querySelector('[data-list-complete]');


import { v4 } from "uuid";
import addGlobalEventListener from "../util/addGlobalEventListener";

const date = new Date();

let LOCAL_STORAGE = `${date.getFullYear()}, ${date.getMonth()}, ${date.getDate()}`;

let todoList = createtodoList();
todoList.forEach(showTodo);

listCount[1].innerHTML = todoList.length;

let checkCount = todoList.filter(todo => todo.check === true)
listCount[0].innerHTML = checkCount.length;


function createtodoList() 
{
    const todo = localStorage.getItem(LOCAL_STORAGE);
    return JSON.parse(todo) || []
}

function createTodo() 
{
    localStorage.setItem(LOCAL_STORAGE, JSON.stringify(todoList))
}

function firstCheckable() 
{
    if (todoList.length === 0) return
    const listItem = list.querySelectorAll('[data-todo-item]');
    const itemOrdersArr = Array.from(listItem).map(item => Number(item.dataset.order));
    const itemFirstOrder = Math.min(...itemOrdersArr);
    let itemFirst = Array.from(listItem).find(item => Number(item.dataset.order) == itemFirstOrder);

    const todoFirst = todoList.find(todo => todo.id === itemFirst.dataset.id)
    itemFirst.dataset.checkable = todoFirst.check;
    todoFirst.checkable = true;
}

function checkable() 
{
    const listItem = list.querySelectorAll('[data-todo-item]');
    let cont = 0;
    todoList.forEach(todo => 
    {
        cont++
        if (cont === todoList.length) return
        let next = Number(todo.order);
        next++;
        let nextTodo = todoList.find(todo => Number(todo.order) === next);
        nextTodo.checkable = todo.check;

        let todoCheck = todo.check;
        if (!todoCheck) 
        {
            let nextOrder = Number(todo.order);

            todoList.forEach(todo => 
            {
                if (Number(todo.order) > nextOrder) 
                {
                    todo.checkable = false;
                    todo.check = todoCheck;
                }
            })
        }
    })
    listItem.forEach(item => 
    {
        const todo = todoList.find(todo => todo.id === item.dataset.id);
        item.children[0].children[0].checked = todo.check;
        item.dataset.check = todo.check;
    })
    listItem.forEach(item => 
    {
        let actualTodo = todoList.find(todo => todo.id === item.dataset.id)
        item.dataset.checkable = actualTodo.checkable;
    })
}

function showTodo(todo) 
{
    const showTodo = template.content.cloneNode(true);
    const todoItem = showTodo.querySelector('[data-todo-item]');
    todoItem.setAttribute('data-id', todo.id);
    todoItem.setAttribute('data-order', todo.order);
    todoItem.setAttribute('data-checkable', todo.checkable);
    todoItem.setAttribute('draggable', true);
    todoItem.style.order = `${todo.order}`
    const todoOrder = showTodo.querySelector('[data-todo-order]');
    todoOrder.innerHTML = todo.order;
    const todoCheck = showTodo.querySelector('[data-todo-checkbox]');
    todoCheck.checked = todo.check;
    todoItem.setAttribute('data-check', todoCheck.checked);
    const todoSpan = showTodo.querySelector('[data-todo-span]');
    todoSpan.innerHTML = todo.name;
    list.appendChild(showTodo);
}

function defineOrder() 
{
    todoList.forEach((todo, pos) => 
    {
        todo.order = pos + 1;
    })
}

function updateCheckCount() 
{
    checkCount = todoList.filter(todo => todo.check === true)
    listCount[0].innerHTML = checkCount.length;
}

function checkoutComplete() 
{
    if (checkCount.length === todoList.length && checkCount.length !== 0) 
    {
        listComplete.classList.add('active')
    }
    else 
    {
        listComplete.classList.remove('active')
    }
}

function updateOrder() 
{
    const todoOrder = document.querySelectorAll('[data-todo-item]');
    todoOrder.forEach((todo, pos) => 
    {
        todo.dataset.order = todoList[pos].order;
        todo.style.order = `${todo.dataset.order}`;
        todo.children[1].children[0].innerHTML = `${todo.dataset.order}`;
    })
}


export default function todo()
{
    firstCheckable();
    checkable();
    checkoutComplete();

    let dragId=0;
    let dragged;

    window.addEventListener('click',e=>
    {
        if(e.target.closest(['data-list'])===null)return
    })

    addGlobalEventListener('submit','[data-form]',(e)=>
    {
        e.preventDefault();

        const idUuid = v4();
    
        if (formInput.value === '') return
        const newTodo =
        {
            name: formInput.value,
            check: false,
            order: 0,
            checkable: false,
            id: idUuid
        }
        todoList.push(newTodo);
    
        if (todoList.length === 1) 
        {
            newTodo.order++;
        }
    
        defineOrder();
        listCount[1].innerHTML = todoList.length;
        showTodo(newTodo);
        checkoutComplete();
        formInput.value = '';
        firstCheckable();
        checkable();
        createTodo();
    })

    addGlobalEventListener('click','[data-todo-icon]',(e)=>
    {
        const listItem = e.target.closest('[data-todo-item]');
        const todoId = listItem.dataset.id;
    
        todoList = todoList.filter(todo => todo.id !== todoId);
    
        defineOrder();
        listItem.remove();
    
        updateCheckCount();
        checkoutComplete();
        updateOrder();
        firstCheckable();
        checkable();
        createTodo();
        listCount[1].innerHTML = todoList.length;
    })

    addGlobalEventListener('change','[data-todo-checkbox]',(e)=>
    {
        const listItem = e.target.closest('[data-todo-item]');
        const todoId = listItem.dataset.id;
    
        const todoChecked = todoList.find(todo => todo.id === todoId);
        todoChecked.check = e.target.checked;
        listItem.dataset.check = todoChecked.check;
    
        firstCheckable();
        checkable();
        updateCheckCount();
        checkoutComplete();
        createTodo();
    })

    addGlobalEventListener('click','[data-list-container-button]',(e)=>
    {
        Array.from(list.children).forEach(child => 
            {
            child.remove();
        })
        todoList = [];
        createTodo();
        listCount[0].innerHTML = 0;
        listCount[1].innerHTML = 0;
        updateCheckCount();
        checkoutComplete();
    })

    addGlobalEventListener('dragstart','[data-todo-item]',e=>
    {
        /* if(e.target.closest('[data-todo-item]') === null) return */

        e.dataTransfer.effectAllowed = "copyMove"; 
        console.log(e.target)
        const todoDrag = todoList.find(todo => todo.id === e.target.closest('[data-todo-item]').dataset.id);
        dragId = todoDrag.id; 
        dragged=e.target;
    })
    
    addGlobalEventListener('dragover','[data-todo-item]',(e)=>
    {
        e.preventDefault();
        e.target.closest('[data-todo-item]').style.borderColor='rgb(54, 54, 233)';
    })

    addGlobalEventListener('dragleave','[data-todo-item]',e=>
    {
        e.target.closest('[data-todo-item]').style.borderColor='transparent';
    })

    addGlobalEventListener('drop','[data-todo-item]',e=>
    {
        e.target.closest('[data-todo-item]').style.borderColor='transparent';
        const todoDrop = todoList.find(todo => todo.id === e.target.closest('[data-todo-item]').dataset.id);
        const todoDrag = todoList.find(todo => todo.id === dragId);
    
        const todoDragName = todoDrag.name;
        const todoDropName = todoDrop.name;
    
        e.target.closest('[data-todo-item]').querySelector('[data-todo-span]').textContent=todoDrag.name;
        dragged.querySelector('[data-todo-span]').textContent=todoDrop.name;
        
        todoDrag.name = todoDropName;
        todoDrop.name = todoDragName;
    
        createTodo();
    })

}
