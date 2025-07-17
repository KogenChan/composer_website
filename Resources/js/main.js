// # NAVBAR TOGGLER BUTTON

const toggler = document.querySelector('.navbar-toggler');
const icon_1 = document.querySelector('.bi-list');
const icon_2 = document.querySelector('.bi-x');
toggler.onclick = changeIcon;

function changeIcon() {
    $icon_1.classList.toggle('opacity');
    $icon_2.classList.toggle('opacity');
}

// ! NAVBAR TOGGLER BUTTON


// # CREDITS SECTION

const credits_section = document.getElementById('credits');
let delay = 0;

async function getCredits() {
    try {
        const response = await fetch('../../credits.json');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const credits = await response.json();

        credits.forEach(credit => {
            credits_section.innerHTML += `
                <div class="col-6 col-lg-4 col-xl-3 pb-5" 
                    data-aos="fade-left" 
                    data-aos-duration="1500" 
                    data-aos-delay="${delay}">
                    <img class="credit-img" src="${credit.img}" alt="${credit.name}">
                    <p class="text-white pt-1">${credit.role}</p>
                </div>
            `;
            delay = Math.round(((delay + 250) * 0.9) / 50) * 50;
        });

    } catch (error) {
        console.error('Failed to fetch data:', error);
    }
}

getCredits();

// ! CREDITS SECTION