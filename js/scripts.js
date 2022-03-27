const randomUserURL = 'https://randomuser.me/api/?results=12&nat=US';
const gallery = document.getElementById('gallery');

// fetch 12 random people from api
fetch(randomUserURL)

    // parse the response to json
    .then(response => response.json())

    // select the results data from response
    .then(json => json.results)

    // send results data to display employee function
    .then(data => displayEmployees(data))

    // in case of any errors, log them to the console
    .catch(error => console.error(error));

// function to iterate api response, generate html & display people
function displayEmployees(employees) {

    // iterate through each returned user object in array
    employees.forEach((employee, index) => {
        
        // employee image
        const image = employee.picture.large;
        const name = `${employee.name.first} ${employee.name.last}`;
        const email = employee.email;
        const location = `${employee.location.city}, ${employee.location.state}`;

        gallery.insertAdjacentHTML('beforeend', `
            <div class='card'>
                <div class='card-img-container'>
                    <img class='card-img' src='${image}' alt='profile picture'>
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
