let myLibrary = [];

function Book(title, author, pages, read) {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.read = read;
  this.info = function () {
    return `${this.title} by ${this.author}, ${this.pages} pages, ${
      this.read ? "read." : "not read yet."
    }`;
  };
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
        <input type="number" id="book-pages" onkeyup="validateForm()" required/>
    </div>
    <button type="button" id="cancel-btn" class="btn-red" onclick="cancelForm()">Cancel</button>
    <button type="submit" id="submit-btn" class="btn-red" onclick="submitForm()">Add book</button>
</fieldset>
</form>`;

function addBookToLibrary(book) {
  myLibrary.push(book);
}

function validateForm(index) {
  if (index !== undefined) {
    const btn = document.getElementById(`submit-${index}-btn`);
    btn.addEventListener('click', (e) => e.preventDefault());
    if (
      document.getElementById(`book-${index}-title`).value &&
      document.getElementById(`book-${index}-author`).value &&
      document.getElementById(`book-${index}-pages`).value
    ) {
      btn.className = 'btn-green';
    } else {
      btn.className = 'btn-red';
    }
  } else {
    if (
      document.getElementById('book-title').value &&
      document.getElementById('book-author').value &&
      document.getElementById('book-pages').value
    ) {
      document.getElementById('submit-btn').className = 'btn-green';
    } else {
      document.getElementById('submit-btn').className = 'btn-red';
    }
  }
}
function openForm() {
  bookActions.innerHTML = formContent;
  document.getElementById('submit-btn').addEventListener('click', (e) => e.preventDefault());
}
function deleteBooks() {
  myLibrary = [];
  updateDisplay();
}
function cancelForm() {
  bookActions.innerHTML = defaultContent;
}
function submitForm() {
  if (
    document.getElementById('book-title').value &&
    document.getElementById('book-author').value &&
    document.getElementById('book-pages').value
  ) {
    const book = new Book(
      document.getElementById("book-title").value,
      document.getElementById("book-author").value,
      document.getElementById("book-pages").value,
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
  clearBooks();
  const arrLength = myLibrary.length;

  for (let i = 0; i < arrLength; i++) {
    const node = document.createElement("div");
    node.setAttribute('data-index', `${i}`);

    node.innerHTML = `<div class="book">
        <h3>${myLibrary[i].title}</h3>
        <p>${myLibrary[i].info()}</p>
        <button class="read btn-green" onclick="toggleReadState(${i})">${(myLibrary[i].read) ? "Mark as unread" : "Mark as read"}</button>
        <button class="edit-btn btn-green" onclick="changeToForm(${i})">Edit</button>
        <button class="remove-btn btn-red" onclick="removeBook(${i})">Remove</button>
      </div>`;

    bookDisplay.insertBefore(node, bookDisplay.children[i]);
  }
}

function toggleReadState(index) {
  myLibrary[index].read = !myLibrary[index].read;
  updateDisplay();
}
function changeToForm(index) {
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
        <input type="number" id="book-${index}-pages" value="${myLibrary[index].pages}" onkeyup="validateForm(${index})" required/>
      </div>
      <button type="button" id="cancel-${index}-btn" class="btn-red" onclick="revertToBook(${index})">Cancel</button>
      <button type="submit" id="submit-${index}-btn" class="btn-green" onclick="saveChanges(${index})">Save</button>
    </fieldset>
    </form>`;
}
function removeBook(index) {
  myLibrary.splice(index, 1);
  updateDisplay();
}
function revertToBook(index) {
  bookDisplay.children[index].innerHTML = `<div class="book">
      <h3>${myLibrary[index].title}</h3>
      <p>${myLibrary[index].info()}</p>
      <button class="read btn-green" onclick="toggleReadState(${index})">${(myLibrary[index].read) ? "Mark as unread" : "Mark as read"}</button>
      <button class="edit-btn btn-green" onclick="changeToForm(${index})">Edit</button>
      <button class="remove-btn btn-red" onclick="removeBook(${index})">Remove</button>
    </div>`;
}
function saveChanges(index) {
  if (document.getElementById(`submit-${index}-btn`).className === 'btn-green') {
    myLibrary[index].title = document.getElementById(`book-${index}-title`).value;
    myLibrary[index].author = document.getElementById(`book-${index}-author`).value;
    myLibrary[index].pages = document.getElementById(`book-${index}-pages`).value;
    updateDisplay();
  } else {
    alert('No empty fields allowed!');
  }

}

function clearBooks() {;
  for (let i = 0; bookDisplay.children[i].hasAttribute('data-index'); i = i) {
    bookDisplay.children[i].remove();
  }
}