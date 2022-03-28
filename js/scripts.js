const randomUserURL = 'https://randomuser.me/api/?results=12&nat=US&exc=login, registered, gender, id';
const gallery = document.getElementById('gallery');
const modalContainer = document.querySelector('.modal-container');
const searchBarDiv = document.querySelector('.search-container');
let employees = []; // will fill array with random people
let openModal; // will store index of currently open modal

// ===========================================================================
// FETCH DATA
// ===========================================================================

// fetch 12 random people from api
fetch(randomUserURL)

    // parse the response to json
    .then(response => response.json())

    // select the results data from response
    .then(json => json.results)

    // send results data to display employee function
    .then(data => {console.log(data); displayEmployees(data)})

    // in case of any errors, log them to the console
    .catch(error => console.error(error));

// ===========================================================================
// DISPLAY GALLERY
// ===========================================================================

// function to iterate api response, generate html & display people
function displayEmployees(employeeData) {

    // fill empty array with new array of people
    employees = employeeData;

    // iterate through each user object in array
    employees.forEach((employee, index) => {
        
        const image = employee.picture.large;
        const name = `${employee.name.first} ${employee.name.last}`;
        const email = employee.email;
        const location = `${employee.location.city}, ${employee.location.state}`;

        // each person in array will return this html to #gallery div
        gallery.insertAdjacentHTML('beforeend', `
            <div class='card' data-index='${index}'>
                <div class='card-img-container'>
                    <img class='card-img' src='${image}' alt='${employee.name.first}s profile picture'>
                </div>
                <div class='card-info-container'>
                    <h3 id='name' class='card-name cap'>${name}</h3>
                    <p class='card-text'>${email}</p>
                    <p class='card-text cap'>${location}</p>
                </div>
            </div>
        `);
    });
}

// ===========================================================================
// DISPLAY MODAL
// ===========================================================================

function displayModal(index) {

    // vars for clicked person
    const selected = employees[index];
    const image = selected.picture.large;
    const name = `${selected.name.first} ${selected.name.last}`;
    const email = selected.email;
    const city = selected.location.city;
    const phone = selected.phone;
    const location = selected.location;
    const dobDefault = selected.dob.date;
    const dob = `${dobDefault.substr(5, 2)}/${dobDefault.substr(8, 2)}/${dobDefault.substr(0, 4)}`;

    // remove class hidden
    toggleModalHidden();

    // instert following html into the modal container div
    modalContainer.insertAdjacentHTML('beforeend', `
        <div class='modal'>
            <button type='button' id='modal-close-btn' class='modal-close-btn'><strong>X</strong></button>
            <div class='modal-info-container'>
                <img class='modal-img' src='${image}' alt='${name}s profile picture'>
                <h3 id='name' class='modal-name cap'>${name}</h3>
                <p class='modal-text'>${email}</p>
                <p class='modal-text cap'>${city}</p>
                <hr>
                <p class='modal-text'>${phone}</p>
                <p class='modal-text'>${location.street.number} ${location.street.name}, ${location.city}, ${location.state} ${location.postcode}</p>
                <p class='modal-text'>Birthday: ${dob}</p>
            </div>
        </div>
        <div class='modal-btn-container'>
            <button type='button' id='modal-prev' class='modal-prev btn'>Prev</button>
            <button type='button' id='modal-next' class='modal-next btn'>Next</button>
        </div>
    `);
}

function clearModal() {
    modalContainer.innerHTML = '';
}

function toggleModalHidden() {
    modalContainer.classList.toggle('hidden');
}

// ===========================================================================
// Search Bar
// ===========================================================================

// add search bar html to page
searchBarDiv.innerHTML = `
    <form action="#" method="get">
        <input type="search" id="search-input" class="search-input" placeholder="Search...">
        <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
    </form>
`;

// select input element
const searchBar = document.getElementById('search-input');

// ===========================================================================
// EVENT LISTENERS
// ===========================================================================

// listen for clicks inside gallery div
gallery.addEventListener('click', (e) => {

    // if (a card) is clicked
    if (e.target !== gallery) {

        // var for clicked card
        const card = e.target.closest('.card');

        // var for index of card
        const index = card.getAttribute('data-index');

        // call function to display cards modal
        displayModal(index);

        // set openModal var to clicked card's index
        openModal = index;
    }
});

// listen for clicks on page (because modal close button may not exist yet)
document.addEventListener('click', (e) => {

    const el = e.target;

    // if target is modal close button (or its text)
    if (el.classList.contains('modal-close-btn') || el.tagName == 'STRONG') {

        // add hidden class to modal container
        toggleModalHidden();

        // erase all html from modal container
        clearModal();
    }

    // if left arrow clicked
    else if (el.classList.contains('modal-prev')) {

        // add hidden class
        toggleModalHidden();

        // clear modal html
        clearModal();

        // adjust openModal & allow looping
        openModal--;
        if (openModal < 0)
        {
            openModal = employees.length -1;
        }

        // display new modal
        displayModal(openModal);
    }

    else if (el.classList.contains('modal-next')) {
        toggleModalHidden();
        clearModal();
        openModal++;
        if (openModal > employees.length -1) {
            openModal = 0;
        }
        displayModal(openModal);
    }
})

searchBar.addEventListener('input', () => {
    let input = searchBar.value.toUpperCase();
    let cards = document.querySelectorAll('.card');

    cards.forEach(card => {
        let nameH3 = card.querySelector('h3');
        let employeeName = nameH3.innerHTML.toUpperCase();

        if (!employeeName.includes(input)) {
            card.classList.add('hidden');
        } else {
            card.classList.remove('hidden');
        }
    });
});