import todo from "./todo";

todo()

/* list.addEventListener('change', (e) => 
{
    if (!e.target.matches('[data-todo-checkbox]')) return

   
}) */

/* deleteAllButton.addEventListener('click', () => 
{
   
}) */



/* list.addEventListener('dragstart',(e)=>
{
    if(e.target.closest('[data-todo-item]')===null)return

    e.dataTransfer.effectAllowed = "copyMove"; 
    const todoDrag = todoList.find(todo => todo.id === e.target.closest('[data-todo-item]').dataset.id);
    dragId = todoDrag.id; 
    dragged=e.target;
}) */

  /*    list.addEventListener('dragover',(e)=>
    {
        if(e.target.closest('[data-todo-item]')===null)return
    
        e.preventDefault();
        e.target.closest('[data-todo-item]').style.borderColor='rgb(54, 54, 233)';
    }) */

/* let dragId=0;
let dragged; */
/* list.addEventListener('dragenter',(e)=>
{
    if(e.target.closest('[data-todo-item]')===null)return

    e.dataTransfer.dropEffect = "copy";
}) */

 /* list.addEventListener('dragleave',(e)=>
    {
        if(e.target.closest('[data-todo-item]')===null)return
     
        
    }) */

/* list.addEventListener('drop',(e)=>
{
    if(e.target.closest('[data-todo-item]')===null)return

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
}) */








