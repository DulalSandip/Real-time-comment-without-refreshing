let socket = io()
let username
do{
    username= prompt("Enter your username:")
}while(!username)

const textArea = document.querySelector("#textArea");
const submitBtn = document.querySelector("#submitBtn");
const commentBox = document.querySelector(".comment_box");
const typing = document.querySelector(".typing")

//listening while clicking button

submitBtn.addEventListener('click',(e)=>{
    e.preventDefault()
    let comment = textArea.value
    if(!comment){
        return
    }
    postComment(comment)

})

function postComment(comment){
    //Append to DOM
    let data = {
        username : username,
        comment:comment
    }
    appendToDom(data)
    textArea.value = ''
    
    //Broadcast
    boradcastComment(data)
    //sync with mongo database
}

function appendToDom(data){
    let lTag = document.createElement('li');
    lTag.classList.add('comment','mt-1')

    let markup= `
    
    
      <div class="card border-light ">
            <div class="card-body ">
                <h6>${data.username}</h6>
                <p>${data.comment}</p>
                <div>
                    <img src="img/clock.png" alt="clock reloading...">
                        <small>${moment(data.time).format('LT')}</small>
                                        </div>
                </div>
            </div>
    
    `
    
   lTag.innerHTML = markup
   commentBox.prepend(lTag)
   
    
}

function boradcastComment(data){

    socket.emit('comment',data); // sending the data

}
// again receive from server to different browser
socket.on('comment',(data)=>{
    appendToDom(data);
})

// Real time typing checker
let timerId = null;
function debounce(func, timer) {
  if (timerId) {
    clearTimeout(timerId);
  }
  timerId = setTimeout(() => {
    func();
  }, timer);
}
socket.on("typing", (data) => {
  typing.innerText = `${data.username} is typing...`;
  debounce(function () {
    typing.innerText = "";
  }, 1000);
});



textArea.addEventListener('keyup',(e)=>{
    socket.emit('typing', {username}) // we can also {username:username}


})

