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
const formContent = `<form>
<fieldset>
    <legend>Add new</legend>
    <div>
        <label for="book-title">Title</label>
        <input type="text" id="book-title" onkeyup="validateForm()" required/>
    </div>
    <div>
        <label for="book-author">Author</label>
        <input type="text" id="book-author" onkeyup="validateForm()" required/>
    </div>
    <div>
        <label for="book-pages">Number of pages</label>
        <input type="number" id="book-pages" min="1" onkeyup="validateForm()" required/>
    </div>
    <button type="button" id="cancel-btn" class="btn-red" onclick="cancelForm()">Cancel</button>
    <button type="submit" id="submit-btn" class="btn-red" onclick="submitForm()">Add book</button>
</fieldset>
</form>`;

let myLibrary = parseData() || [];
updateDisplay();

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

function validateForm(index) {
  if (index !== undefined) {
    const btn = document.getElementById(`submit-${index}-btn`);
    btn.addEventListener('click', (e) => e.preventDefault());
    if (
      document.getElementById(`book-${index}-title`).value &&
      document.getElementById(`book-${index}-author`).value &&
      parseInt(document.getElementById(`book-${index}-pages`).value) >= 1
    ) {
      btn.className = 'btn-green';
    } else {
      btn.className = 'btn-red';
    }
  } else {
    if (
      document.getElementById('book-title').value &&
      document.getElementById('book-author').value &&
      parseInt(document.getElementById('book-pages').value) >= 1
    ) {
      document.getElementById('submit-btn').className = 'btn-green';
    } else {
      document.getElementById('submit-btn').className = 'btn-red';
    }
  }
}
function openForm(index) {
  if (index !== undefined) {
    bookDisplay.children[index].innerHTML = `<form>
    <fieldset>
      <legend>Edit</legend>
      <div>
        <label for="book-${index}-title">Title</label>
        <input type="text" id="book-${index}-title" value="${myLibrary[index].title}" onkeyup="validateForm(${index})" required/>
      </div>
      <div>
        <label for="book-${index}-author">Author</label>
        <input type="text" id="book-${index}-author" value="${myLibrary[index].author}" onkeyup="validateForm(${index})" required/>
      </div>
      <div>
        <label for="book-${index}-pages">Number of pages</label>
        <input type="number" id="book-${index}-pages" min="1" value="${myLibrary[index].pages}" onkeyup="validateForm(${index})" required/>
      </div>
      <button type="button" id="cancel-${index}-btn" class="btn-red" onclick="revertToBook(${index})">Cancel</button>
      <button type="submit" id="submit-${index}-btn" class="btn-green" onclick="saveChanges(${index})">Save</button>
    </fieldset>
    </form>`;
  } else {
    bookActions.innerHTML = formContent;
    document
      .getElementById("submit-btn")
      .addEventListener("click", (e) => e.preventDefault());
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
function submitForm() {
  if (
    document.getElementById('book-title').value &&
    document.getElementById('book-author').value &&
    parseInt(document.getElementById('book-pages').value) >= 1
  ) {
    const book = new Book(
      document.getElementById("book-title").value,
      document.getElementById("book-author").value,
      parseInt(document.getElementById("book-pages").value),
      false
    );
    addBookToLibrary(book);
    updateDisplay();
    bookActions.innerHTML = defaultContent;
  } else {
    alert('Fill in the fields correctly');
  }
}

function updateDisplay() {
  clearBooksOnDisplay();
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
function saveChanges(index) {
  if (document.getElementById(`submit-${index}-btn`).className === 'btn-green') {
    myLibrary[index].title = document.getElementById(`book-${index}-title`).value;
    myLibrary[index].author = document.getElementById(`book-${index}-author`).value;
    myLibrary[index].pages = parseInt(document.getElementById(`book-${index}-pages`).value);
    saveData();
    updateDisplay();
  } else {
    alert('Fill all fields correctly!');
  }
}

function clearBooksOnDisplay() {
  while (bookDisplay.children[0].hasAttribute('data-index')) {
    bookDisplay.children[0].remove();
  }
}