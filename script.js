class Book {
  constructor(title, author, pages, read) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
  }

  get info() {
    return `${this.title} by ${this.author}, ${
      this.pages == 1 ? this.pages + " page" : this.pages + " pages"
    }, ${this.read ? "read." : "not read yet."}`;
  }
}

const bookDisplay = document.getElementById("books");
const bookActions = document.getElementById('book-actions-container');
const defaultContent = `<div id="action-btns-container">
    <h3>Actions</h3>
    <button class="btn-green add-btn" onclick="openForm()">Add new book</button>
    <button class="btn-red clear-btn" onclick="deleteBooks()">Clear all</button>
</div>`;
const formContent = `<form novalidate>
<fieldset>
    <legend>Add new</legend>
    <div>
        <label for="book-title">Title</label>
        <input type="text" id="book-title" required/>
        <span class="error-message">test</span>
    </div>
    <div>
        <label for="book-author">Author</label>
        <input type="text" id="book-author" required/>
        <span class="error-message"></span>
    </div>
    <div>
        <label for="book-pages">Number of pages</label>
        <input type="number" id="book-pages" min="1" required/>
        <span class="error-message"></span>
    </div>
    <button type="button" id="cancel-btn" class="btn-red" onclick="cancelForm()">Cancel</button>
    <button type="submit" id="submit-btn" class="btn-red">Add book</button>
</fieldset>
</form>`;

let myLibrary = parseData() || [];
updateDisplay();

bookDisplay.addEventListener("input", validateForm);
bookDisplay.addEventListener("click", saveBook);

function validateForm(e) {
  const elem = e.target,
    errorElem = elem.parentElement.querySelector(".error-message"),
    form = elem.form;

  form.querySelector("button[type='submit']").className = form.checkValidity()
    ? "btn-green"
    : "btn-red";

  if (!elem.checkValidity()) {
    errorElem.textContent = elem.validationMessage;
    errorElem.classList.add("active");
  } else {
    errorElem.classList.remove("active");
  }
}
function saveBook(e) {
  e.preventDefault();
  const elem = e.target;

  if (elem.getAttribute("type") === "submit") {
    const form = elem.form,
      index = form.getAttribute("data-index") || undefined;

    if (elem.id === "submit-btn" && elem.className === "btn-green") {
      // New book
      const book = new Book(
        document.getElementById("book-title").value,
        document.getElementById("book-author").value,
        parseInt(document.getElementById("book-pages").value),
        false
      );
      addBookToLibrary(book);
      saveData();
      updateDisplay();
      bookActions.innerHTML = defaultContent;
    } else if (index !== undefined && elem.className === "btn-green") {
      // Update book
      myLibrary[index].title = document.getElementById(
        `book-${index}-title`
      ).value;
      myLibrary[index].author = document.getElementById(
        `book-${index}-author`
      ).value;
      myLibrary[index].pages = parseInt(
        document.getElementById(`book-${index}-pages`).value
      );
      saveData();
      updateDisplay();
    }
  }
}

function addBookToLibrary(book) {
  myLibrary.push(book);
  saveData();
}

function saveData() {
  localStorage.setItem("myLibrary", JSON.stringify(myLibrary));
}

function parseData() {
  if (!localStorage.getItem("myLibrary")) return null;
  let library = [];

  JSON.parse(localStorage.getItem("myLibrary")).forEach((book) => {
    library.push(new Book(book.title, book.author, book.pages, book.read));
  });

  return library;
}

function openForm(index) {
  if (index !== undefined) {
    bookDisplay.children[index].innerHTML = `<form data-index="${index}" novalidate>
    <fieldset>
      <legend>Edit</legend>
      <div>
        <label for="book-${index}-title">Title</label>
        <input type="text" id="book-${index}-title" value="${myLibrary[index].title}" required/>
        <span class="error-message"></span>
      </div>
      <div>
        <label for="book-${index}-author">Author</label>
        <input type="text" id="book-${index}-author" value="${myLibrary[index].author}" required/>
        <span class="error-message"></span>
      </div>
      <div>
        <label for="book-${index}-pages">Number of pages</label>
        <input type="number" id="book-${index}-pages" min="1" value="${myLibrary[index].pages}" required/>
        <span class="error-message"></span>
      </div>
      <button type="button" id="cancel-${index}-btn" class="btn-red" onclick="revertToBook(${index})">Cancel</button>
      <button type="submit" id="submit-${index}-btn" class="btn-green">Save</button>
    </fieldset>
    </form>`;
  } else {
    bookActions.innerHTML = formContent;
  }
}

function deleteBooks() {
  myLibrary = [];
  saveData();
  updateDisplay();
}
function cancelForm() {
  bookActions.innerHTML = defaultContent;
}

function updateDisplay() {
  clearBooks();
  const arrLength = myLibrary.length;

  for (let i = 0; i < arrLength; i++) {
    const node = document.createElement("div");
    node.setAttribute('data-index', `${i}`);

    node.innerHTML = `<div class="book">
        <h3>${myLibrary[i].title}</h3>
        <p>${myLibrary[i].info}</p>
        <button class="read btn-green" onclick="toggleReadState(${i})">${(myLibrary[i].read) ? "Mark as unread" : "Mark as read"}</button>
        <button class="edit-btn btn-green" onclick="openForm(${i})">Edit</button>
        <button class="remove-btn btn-red" onclick="removeBook(${i})">Remove</button>
      </div>`;

    bookDisplay.insertBefore(node, bookDisplay.children[i]);
  }
}

function toggleReadState(index) {
  myLibrary[index].read = !myLibrary[index].read;
  saveData();
  updateDisplay();
}
function removeBook(index) {
  myLibrary.splice(index, 1);
  saveData();
  updateDisplay();
}
function revertToBook(index) {
  bookDisplay.children[index].innerHTML = `<div class="book">
      <h3>${myLibrary[index].title}</h3>
      <p>${myLibrary[index].info}</p>
      <button class="read btn-green" onclick="toggleReadState(${index})">${(myLibrary[index].read) ? "Mark as unread" : "Mark as read"}</button>
      <button class="edit-btn btn-green" onclick="openForm(${index})">Edit</button>
      <button class="remove-btn btn-red" onclick="removeBook(${index})">Remove</button>
    </div>`;
}

function clearBooks() {
  while (bookDisplay.children[0].hasAttribute('data-index')) {
    bookDisplay.children[0].remove();
  }
}