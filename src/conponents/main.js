const formAdd = document.querySelector('[data-form]');
const formInput = document.querySelector('[data-form-input]');
const template = document.querySelector('[data-todo]');
const list = document.querySelector('[data-list]');
const listCount = document.querySelectorAll('[data-list-count]');
const listComplete = document.querySelector('[data-list-complete]');
const deleteAllButton = document.querySelectorAll('[data-list-container-button]')[0];

import {v4} from "uuid";

const date = new Date();
let LOCAL_STORAGE=`${date.getFullYear()}, ${date.getMonth()}, ${date.getDate()}`;

let todoList = createtodoList();
todoList.forEach(showTodo);

listCount[1].innerHTML=todoList.length;

let checkCount = todoList.filter(todo=>todo.check===true)
listCount[0].innerHTML=checkCount.length;

/* ---------------------------------------------------------------------------------------------------------------- */

firstCheckable();
checkable();
checkoutComplete();

/* ---------------------------------------------------------------------------------------------------------------- */

function createtodoList()
{
    const todo = localStorage.getItem(LOCAL_STORAGE);
    return JSON.parse(todo) || []
}

function createTodo()
{
    localStorage.setItem(LOCAL_STORAGE,JSON.stringify(todoList))
}

function firstCheckable()
{
    if(todoList.length===0)return 
    const listItem = document.querySelectorAll('[data-todo-item]');
    const itemOrdersArr = Array.from(listItem).map(item=>Number(item.dataset.order));
    const itemFirstOrder = Math.min(...itemOrdersArr);
    let itemFirst = Array.from(listItem).find(item=>Number(item.dataset.order)==itemFirstOrder);
    
    const todoFirst =todoList.find(todo=>todo.id===itemFirst.dataset.id)
    itemFirst.dataset.checkable=todoFirst.check;
    todoFirst.checkable=true;
}

function checkable()
{
    const itemList = document.querySelectorAll('[data-todo-item]');
    let cont=0;
    todoList.forEach(todo=>
    {
        cont++
        if(cont===todoList.length)return
        let next =Number(todo.order);
        next++;
        let nextTodo =todoList.find(todo=>Number(todo.order)===next);
        nextTodo.checkable=todo.check;

        let todoCheck = todo.check;
        if(!todoCheck)
        {
            let nextOrder = Number(todo.order);
            
            todoList.forEach(todo=>
            {
               if(Number(todo.order)>nextOrder)
               {
                   todo.checkable=false;
                   todo.check=todoCheck;
               }        
            })
        }
    })
    itemList.forEach(item=>
    {
        const todo = todoList.find(todo=>todo.id===item.dataset.id);
        item.children[0].children[0].checked=todo.check;
        item.dataset.check=todo.check;
    })
    itemList.forEach(item=>
    {
        let actualTodo =todoList.find(todo=>todo.id===item.dataset.id)
        item.dataset.checkable=actualTodo.checkable;
    })
}

function showTodo(todo)
{
   const showTodo = template.content.cloneNode(true);
   const todoItem = showTodo.querySelector('[data-todo-item]');
   todoItem.setAttribute('data-id',todo.id);
   todoItem.setAttribute('data-order',todo.order);
   todoItem.setAttribute('data-checkable',todo.checkable);
   todoItem.style.order=`${todo.order}`
   const todoOrder = showTodo.querySelector('[data-todo-order]');
   todoOrder.innerHTML= todo.order;
   const todoCheck = showTodo.querySelector('[data-todo-checkbox]');
   todoCheck.checked=todo.check;
   todoItem.setAttribute('data-check',todoCheck.checked);
   const todoSpan = showTodo.querySelector('[data-todo-span]');
   todoSpan.innerHTML= todo.name;
   list.appendChild(showTodo);
}

function defineOrder()
{
    todoList.forEach((todo,pos)=>
    {
        todo.order=pos+1;
    })
}

function updateCheckCount()
{
    checkCount = todoList.filter(todo=>todo.check===true)
    listCount[0].innerHTML=checkCount.length;
}

function checkoutComplete()
{
   if(checkCount.length===todoList.length && checkCount.length!==0)
   {
      listComplete.classList.add('active')
   }
   else
   {
      listComplete.classList.remove('active')
   } 
}
//last modification
function updateOrder()
{
    const todoOrder = document.querySelectorAll('[data-todo-item]');
    todoOrder.forEach((todo,pos)=>
    {
        todo.dataset.order= todoList[pos].order;
        todo.style.order=`${todo.dataset.order}`;
        todo.children[1].children[0].innerHTML=`${todo.dataset.order}`;
    })
}

/* ------------------------------------------------------------------------- */

formAdd.addEventListener('submit',(e)=>
{
    e.preventDefault(); 
    const idUuid=v4();
    if(formInput.value === '')return
    const newTodo=
    {
       name: formInput.value,
       check: false,
       order: 0,
       checkable:false,
       id: idUuid 
    }
    console.log(newTodo)
    todoList.push(newTodo);

    if(todoList.length===1)
    {
        newTodo.order++;
    }

    defineOrder();
    listCount[1].innerHTML=todoList.length;
    showTodo(newTodo);
    checkoutComplete();
    formInput.value='';
    firstCheckable();
    checkable();
    createTodo();
})

list.addEventListener('click',(e)=>
{
    if(!e.target.matches('[data-todo-icon]'))return 
    const list = e.target.closest('[data-todo-item]');
    const todoId = list.dataset.id;

    todoList=todoList.filter(todo=>todo.id!==todoId);
    
    defineOrder();
    list.remove();

    updateCheckCount();
    checkoutComplete();
    updateOrder();
    createTodo();
    listCount[1].innerHTML=todoList.length;
})

list.addEventListener('change',(e)=>
{
    if(!e.target.matches('[data-todo-checkbox]'))return
    
    const item = e.target.closest('[data-todo-item]');
    const todoId = item.dataset.id;

    const todoChecked=todoList.find(todo=>todo.id===todoId);
    todoChecked.check=e.target.checked;
    item.dataset.check=todoChecked.check;
    /* checkbox.dataset.check=todoChecked.check; */
 
    updateCheckCount();
    checkoutComplete();
    firstCheckable();
    checkable();
    createTodo();
})

deleteAllButton.addEventListener('click',()=>
{
    Array.from(list.children).forEach(child=>
    {
        child.remove();
    })
    todoList=[];
    createTodo();
    listCount[0].innerHTML=0;
    listCount[1].innerHTML=0;
    updateCheckCount();
    checkoutComplete();
})










