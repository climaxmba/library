let myLibrary = [];

function Book(title, author, pages, read) {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.read = read;
  this.info = function () {
    return `${this.title} by ${this.author}, ${this.pages} pages, ${
      this.read ? "read" : "not read yet"
    }`;
  };
}

const defaultBook = new Book("The Hobbit", "J.R.R. Tolkien", 295, false);
const bookDisplay = document.getElementById("books");

function addBookToLibrary(Book) {
  myLibrary.push(Book);
}

addBookToLibrary(defaultBook);
updateDisplay();

function updateDisplay() {
  let arrLength = myLibrary.length;
  clearDisplay();

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

  addEvents(arrLength);
}

function addEvents(arrLength) {
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
      }
      return;
    };
  }
}

function clearDisplay() {
  for (let i = 0; i < bookDisplay.children.length; i++) {
    if (bookDisplay.children[i].getAttribute('data-index')) {
      bookDisplay.removeChild(bookDisplay.children[i]);
    }
  }
}