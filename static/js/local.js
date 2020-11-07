window.addEventListener("load", () => {
  // preventing the right-click default option -> like copy, paste, reload
  window.oncontextmenu = function (e) {
    e.preventDefault();
  };

  // initiate local storage
  if (localStorage.length === 0) {
    initiateLocalStorage();
  }

  // populating data into body from localstorage
  // let local = JSON.parse(localStorage.getItem('mytodo'))
  updateFromlocalToBody();

  // storing data to localstorage
  let btn = document.getElementById("new-todo");
  btn.addEventListener("click", () => {
    showForm();
  });

  // back button
  let backButton = document.getElementById("backButton");
  backButton.addEventListener("click", backButtonFunction);

  // popstate
  window.addEventListener("popstate", (e) => {
    e.preventDefault();
    backButtonFunction();
  });

  // card click
  let card = document.querySelector(".card-deck .row");
  card.addEventListener("click", (e) => {
    if (e.target !== e.currentTarget) {
      let clickedCard = e.target.closest(".card");
      let formInput = document.querySelector("form input");
      let formTextarea = document.querySelector("form textarea");
      let card_Dataset_id = e.target.closest(".card-body").dataset.id;
      let template = document
        .querySelector("template")
        .content.querySelector("div");

      // populating  the form with card values
      formInput.value = clickedCard.querySelector(".card-title").textContent;
      formTextarea.value = clickedCard.querySelector(".card-text").textContent;
      // for data-id
      template.textContent = card_Dataset_id;

      showForm();

      // setting scroll to initial stage
      scrollTo(0, 0);
    }
  });
});

function backButtonFunction() {
  let btn = document.getElementById("new-todo");

  let formBtn = document.querySelector(".full_todo_section");
  formBtn.classList.remove("d-block");
  formBtn.classList.add("d-none");

  let header = document.querySelector("header");
  let upperSection = document.querySelector(".body");

  header.classList.remove("d-none");
  upperSection.classList.remove("d-none");
  btn.classList.remove("d-none");

  // localstorage
  // checking if it already exists or not if so then update
  // otherwise make a new todo entry.
  saveChanges();

  // clearing inputs
  document.querySelector("form input").value = "";
  document.querySelector("form textarea").value = "";

  // clearing the template tag containing dataset-id
  document.querySelector("template").content.querySelector("div").innerHTML =
    "";

  // updating the Cards-deck from localStorage
  updateFromlocalToBody();
}

function showForm() {
  // now main
  let btn = document.getElementById("new-todo");

  let formBtn = document.querySelector(".full_todo_section");
  formBtn.classList.remove("d-none");
  formBtn.classList.add("d-block");

  let header = document.querySelector("header");
  let upperSection = document.querySelector(".body");
  header.classList.add("d-none");
  upperSection.classList.add("d-none");

  btn.classList.add("d-none");

  // history api
  history.pushState(null, null, window.location.pathname);
}

function saveChanges() {
  // checking if it already exists or not if so then update
  // otherwise make a new todo entry.
  let storage = JSON.parse(localStorage.getItem("mytodo"));
  let newArray = [...storage];
  let obj = {};

  // fetching current clicked card dataset-id
  let dataset_id = document
    .querySelector("template")
    .content.querySelector("div").textContent;

  // fetching inputs from form
  let formInput = document.querySelector("form input").value;
  let formTextarea = document.querySelector("form textarea").value;

  // looking for a position of element in DOM and
  // comparing it to localstorage keys
  let dataId = document.querySelector(".card-deck .row").children.length;
  if (
    storage &&
    formInput.trim().length !== 0 &&
    formTextarea.trim().length !== 0 &&
    dataset_id === ""
  ) {
    obj = {
      title: formInput,
      content: formTextarea,
      time: Date.now(),
      dataId: dataId,
    };

    newArray.push(obj);
  } else {
    obj = {
      title: formInput,
      content: formTextarea,
      time: Date.now(),
      dataId: Number(dataset_id),
    };

    newArray[Number(dataset_id)] = obj;
  }

  // upating localstorage
  localStorage.setItem("mytodo", JSON.stringify(newArray));

  // appending into body
  updateBody(obj.title, obj.content, obj.time, dataId);
}

function initiateLocalStorage() {
  // first time setting localstorage
  context = [
    // {
    //   title: title,
    //   content: content,
    //   lastUpdated: time,
    // },
  ];
  localStorage.setItem("mytodo", JSON.stringify(context));
}

function updateBody(title, content, time, dataId) {
  let main = document.createElement("div");
  main.setAttribute("class", "col-12 col-md-4 p-1 m-0");

  let card = document.createElement("div");
  card.setAttribute("class", "card w-100 h-100 shadow");

  let card_body = document.createElement("div");
  card_body.setAttribute("class", "card-body");
  card_body.setAttribute("data-id", dataId);

  let card_title = document.createElement("h5");
  card_title.setAttribute("class", "card-title");
  card_title.textContent = title;

  let card_text = document.createElement("p");
  card_text.setAttribute("class", "card-text");
  card_text.textContent = content;

  let card_time = document.createElement("p");
  card_time.setAttribute("class", "card-text text-muted");

  let small = document.createElement("small");
  small.setAttribute("class", "text-muted float-right");
  small.textContent = "Last updated `" + time + " mins ago";

  // appending
  main.appendChild(card);
  card.appendChild(card_body);
  card_body.appendChild(card_title);
  card_body.appendChild(card_text);
  card_body.appendChild(card_time);
  card_time.appendChild(small);
  // now appending div to body

  let docBody = document.querySelector(".card-deck .row");
  docBody.appendChild(main);

  //   `<div class="col-12 col-md-4 col-lg-3 p-1 m-0">

  //   <div class="card w-100 h-100">
  //     <!-- <img class="card-img-top" src="..." alt="Card image cap"> -->

  //   <div class="card-body" data-id="0">
  //       <h5 class="card-title">hey everyone</h5>
  //       <p class="card-text">testing the card functionality additional content. This content is a little bit longer.</p>
  //       <p class="card-text"><small class="text-muted">Last updated 3 mins ago</small></p>
  //     </div>
  //   </div>

  // </div>
  //   `;
}

function updateFromlocalToBody() {
  // clearinng the card decks
  document.querySelector(".card-deck .row").innerHTML = "";

  // now appending from localStorage
  let local = JSON.parse(localStorage.getItem("mytodo"));
  // local.reverse();
  let id = 0;
  if (local) {
    local.forEach((e) => {
      if (
        e.title !== undefined &&
        e.content !== undefined &&
        e.time !== undefined
      ) {
        updateBody(e.title, e.content, e.time, id);
        id++;
      }
    });
  }
}
