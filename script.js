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
    <button class="btn-red clear-btn">Clear all</button>
</div>`;
const formContent = `<form>
<fieldset>
    <legend>Add new</legend>
    <div>
        <label for="book-title">Title</label>
        <input type="text" id="book-title" required/>
    </div>
    <div>
        <label for="book-author">Author</label>
        <input type="text" id="book-author" required/>
    </div>
    <div>
        <label for="book-pages">Number of pages</label>
        <input type="number" id="book-pages" required/>
    </div>
    <button type="button" id="cancel-btn" class="btn-red" onclick="cancelForm()">Cancel</button>
    <button type="submit" class="btn-red" onclick="submitForm()">Add book</button>
</fieldset>
</form>`;

function addBookToLibrary(Book) {
  myLibrary.push(Book);
}

function openForm() {
  bookActions.innerHTML = formContent;
  bookActions.querySelector('form').onsubmit = (e) => {
    e.preventDefault();
  }
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
  const arrLength = myLibrary.length;
  clearBooks();

  for (let i = 0; i < arrLength; i++) {
    let node = document.createElement("div");
    node.setAttribute('data-index', `${i}`);

    node.innerHTML = `<div class="book">
                        <h3>${myLibrary[i].title}</h3>
                        <p>${myLibrary[i].info()}</p>
                        <button class="read btn-green">${(myLibrary[i].read) ? "Mark as unread" : "Mark as read"}</button>
                        <button class="edit-btn btn-green">Edit</button>
                        <button class="remove-btn btn-red">Remove</button>
                      </div>`;

    bookDisplay.insertBefore(node, bookDisplay.children[i]);
  }

  addEvents();
}

function addEvents() {
  const arrLength = myLibrary.length;

  for (let i = 0; i < arrLength; i++) {
    let node = bookDisplay.children[i];

    node.querySelector('.read').onclick = () => {
      myLibrary[node.getAttribute("data-index")].read =
        !myLibrary[node.getAttribute("data-index")].read;
      updateDisplay();
    };
    node.querySelector('.remove-btn').onclick = () => {
      myLibrary.splice(node.getAttribute('data-index'), 1);
      updateDisplay();
    };
    node.querySelector(".edit-btn").onclick = () => {
      node.innerHTML = `<form>
      <fieldset>
        <legend>Edit</legend>
        <div>
          <label for="book-${i}-title">Title</label>
          <input type="text" id="book-${i}-title" value="${myLibrary[i].title}" required/>
        </div>
        <div>
          <label for="book-${i}-author">Author</label>
          <input type="text" id="book-${i}-author" value="${myLibrary[i].author}" required/>
        </div>
        <div>
          <label for="book-${i}-pages">Number of pages</label>
          <input type="number" id="book-${i}-pages" value="${myLibrary[i].pages}" required/>
        </div>
        <button type="button" id="cancel-${i}-btn" class="btn-red">Cancel</button>
        <button type="submit" id="submit-${i}-button" class="btn-red">Save</button>
      </fieldset>
      </form>`;
      document.getElementById(`submit-${i}-button`).onclick = (e) => {
        e.preventDefault();
        if (
          document.getElementById(`book-${i}-title`).value &&
          document.getElementById(`book-${i}-author`).value &&
          document.getElementById(`book-${i}-pages`).value
        ) {
          myLibrary[i].title = document.getElementById(`book-${i}-title`).value;
          myLibrary[i].author = document.getElementById(`book-${i}-author`).value;
          myLibrary[i].pages = document.getElementById(`book-${i}-pages`).value;
          updateDisplay();
        } else {
          alert('Fill in the fields correctly');
        }
      };
      document.getElementById(`cancel-${i}-btn`).onclick = () => {
        updateDisplay();
      };
    };
  }
}

function clearBooks() {
  for (let i = 0; i < bookDisplay.children.length; i++) {
    if (bookDisplay.children[i].getAttribute('data-index')) {
      bookDisplay.removeChild(bookDisplay.children[i]);
    }
  }
}