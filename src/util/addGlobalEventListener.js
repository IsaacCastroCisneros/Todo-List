export default function addGlobalEventListener(type,selector,callBack)
{
   document.addEventListener(type, e=>
   {
      if(e.target.closest(selector)!==null)
      {
          callBack(e)
      }
   })
}