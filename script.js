
// we are creating object of ShortUniqueId class 
var uid=new ShortUniqueId();
// console.log(uid());

//getting header and main-container
let header_container=document.querySelector(".header-container");
let main_container=document.querySelector(".main-container");

//getting the modal box
let modal=document.querySelector(".modal_box");

//this function will run as soon as the code will be loaded
//this function extracts data from loal-storage and then views it if its there
(function(){
let localString=localStorage.getItem("tasks");
let localArr=JSON.parse(localString)||[];
for(let i=0;i<localArr.length;i++)
{
    let id=localArr[i].id;
    let task=localArr[i].task;
    let color=localArr[i].color;

    createBox(id,task,false,color);
}

modal.style.display="none";

})();

let defColor="red";



let delState=false;
let lock=document.querySelector(".lock_box");
let unlock=document.querySelector(".unlock_box");
let del=document.querySelector(".mul_box");

del.addEventListener("click",function(){
delState= !delState;

if(delState==true)
{
   del.classList.add("active");
}
else
{
  del.classList.remove("active");
}


});

lock.addEventListener("click",function(){

    // getting the first div element of all task_main which is the text place 
    let taskTextArr=document.querySelectorAll(".task_main>div");

    for(let i=0;i<taskTextArr.length;i++)
    {  
        //making its content editable false
        taskTextArr[i].contentEditable=false;
    }

    //this is simply for giving it pressed look
    lock.classList.add("active");

    //if locked is pressed then we have to remove pressed look it from unlock also
    unlock.classList.remove("active");

});

unlock.addEventListener("click",function(){

    let taskTextArr=document.querySelectorAll(".task_main>div");

    for(let i=0;i<taskTextArr.length;i++)
    {
        taskTextArr[i].contentEditable=true;
    }

    unlock.classList.add("active");
    lock.classList.remove("active");

});



let defCol="";
let ncolor="";

let colors=["green","blue","pink","red"];

function createBox(id,task,flag,color)
{

    let mainCont=document.querySelector(".main-container");

    //now we have started to make the notes box
    let taskContainer=document.createElement("div");
 
    taskContainer.setAttribute("class",`task_container`);

    taskContainer.innerHTML=  `<div class="task_header ${color}"></div>
    <div class="task_main">
      <h4 class="id">
        #${id}
      </h4>
      <div class="text" contenteditable="true">
        ${task}
      </div>
    </div>` ;

    mainCont.appendChild(taskContainer);

    //adding event listener at the time of creation itself for change of color
    let header=taskContainer.querySelector(".task_header");

    header.addEventListener("click",function()
    {
        let colorClasses=header.classList;
        colorClasses=colorClasses[1];

        let idx=colors.indexOf(colorClasses);
        idx=(idx+1)%4;
        
        ncolor=colors[idx];
        // console.log(colorClasses);

        header.classList.remove(colorClasses);
        header.classList.add(ncolor);

        //again updating in localstorage
        let localString=localStorage.getItem("tasks");
        let localArr=JSON.parse(localString);
        for(let i=0;i<localArr.length;i++)
        {
            if(id==localArr[i].id)
            {
                localArr[i].color=ncolor;
                break;
            }
        }
        localStorage.setItem("tasks",JSON.stringify(localArr));
    })

    //adding it for deletion
    taskContainer.addEventListener("click",function(){
        if(delState==true)
        {
            taskContainer.remove();
            let localString=localStorage.getItem("tasks");
            let localArr=JSON.parse(localString);

            for(let i=0;i<localArr.length;i++)
            {
                if(id==localArr[i].id)
                {
                    //will delete it from local storage
                    localArr.splice(i,1);
                    break;
                }
            }

            localStorage.setItem("tasks",JSON.stringify(localArr));
            //here concept of closure id being used , because of which we are able to use 'id' directly
        }
    })


    //adding to local storage
    if(flag==true)
    {let localString=localStorage.getItem("tasks");
    let taskArr= JSON.parse(localString) || [];
    // console.log(taskArr);
    let sColor="";
    if(ncolor!="")
    {
      sColor=ncolor;
    }
    else{
        sColor=defColor;
    }
    let taskObj={
        id:id,
        task:task,
        color:sColor
    };

    taskArr.push(taskObj);
    localStorage.setItem("tasks",JSON.stringify(taskArr));
    }


    
    let notepad=taskContainer.children[1].children[1];
    //blur is hit when some text is changed
    notepad.addEventListener("blur",function()
    {
    //    updating the changed text content in local storage 
 
        let localString=localStorage.getItem("tasks");
        let localArr=JSON.parse(localString);
        for(let i=0;i<localArr.length;i++)
        {
            if(id==localArr[i].id)
            {
                localArr[i].task=notepad.textContent;
                break;
            }
        }
        localStorage.setItem("tasks",JSON.stringify(localArr));

    })

}


let colorContainer=document.querySelector(".color_group_container");

colorContainer.addEventListener("mouseover",function(e)
{
    //ye bubbling se upar pahuch rha parent tak
    let tar=e.target;
    if(tar!=colorContainer)
    {
        tar.classList.add("select");
    }
})
colorContainer.addEventListener("mouseout",function(e)
{
    let tar=e.target;
    if(tar!=colorContainer)
    {
        tar.classList.remove("select");
    }
})




colorContainer.addEventListener("click",function(e)
{
    if(e.target!=colorContainer)
    {
        let tar=e.target;
        let col=tar.classList;
        col=col[1];
        
         let colors=colorContainer.querySelectorAll(".color");
         for(let i=0;i<colors.length;i++)
         {
             colors[i].classList.remove("butt_border");
         }
        
        //  tar.classList.add("select");
        filterColor(col,colorContainer,tar);
    }
})

function filterColor(color,color_group_container,tar)
{

    let allColors=color_group_container.querySelectorAll(".color");
    // console.log(allColors);
    let tasks=document.querySelectorAll(".task_container")
    // console.log("number of containers "+tasks.length);

    if(defCol!=color)
    {

        for(let i=0;i<tasks.length;i++)
        {
            let headerItems=tasks[i].querySelector(".task_header");
            // console.log(headerItems);
            let elemColor=headerItems.classList;
             elemColor=elemColor[1];
            // console.log(elemColor);
            if(elemColor==color)
            {

                tasks[i].style.display="block";

            }
            else
            {

                tasks[i].style.display="none";
            }
        }
        
        defCol=color;
        tar.classList.add("butt_border");
    }
    else
    {
        for(let i=0;i<tasks.length;i++)
        {
            tasks[i].style.display="block";
        }

        defCol="";
    }
}


let right_color_box=modal.querySelector(".right_modal_box");

right_color_box.addEventListener("click",function(element){

    // console.log(element);
    element=element.target;
    if(element != right_color_box)
    {
        //   console.log(element);
          let items=element.classList;
          defColor=items[1];
    }
    
    let color_box=right_color_box.querySelectorAll(".color_right");
    // console.log(color_box);
    
    for(let i=0;i<color_box.length;i++)
    {
        color_box[i].classList.remove("select");
    }
    
    element.classList.add("select");
    box.focus();
    
});

let box=document.querySelector(".inputText");
box.addEventListener("keydown",function(e)
{
    // console.log(box.value);
    if(e.code=='Enter' && box.value)
    {
        let id=uid();
        let task=box.value;
      createBox(id,task,true,defColor);
      box.value="";
      defColor="red";
      modal.style.display="none";
      header_container.classList.remove("blur");
      main_container.classList.remove("blur");
    }
})


let plus=document.querySelector(".add_box");

plus.addEventListener("click",function()
{
    modal.style.display="flex";
    header_container.classList.add("blur");
    main_container.classList.add("blur");
    
    plus.classList.add("active");
    setTimeout(function()
    {
       plus.classList.remove("active");
    },100)
})

