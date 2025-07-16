$toggler = document.querySelector('.navbar-toggler');
$icon_1 = document.querySelector('.bi-list');
$icon_2 = document.querySelector('.bi-x');
$toggler.onclick = changeIcon;

function changeIcon() {
    $icon_1.classList.toggle('opacity');
    $icon_2.classList.toggle('opacity');
}

$credits_section = document.getElementById('credits');
$credits = [
    { 
        "name": "The Ferryman",
        "img": "/Resources/media/ferryman.jpg",
        "role": "Composer"
    },
    { 
        "name": "Threaded Memories",
        "img": "/Resources/media/memories.png",
        "role": "Composer/Sound Designer"
    },
    { 
        "name": "The Sleeper Beneath",
        "img": "/Resources/media/sleeper.png",
        "role": "Composer/Sound Designer"
    },
    { 
        "name": "Mediapep",
        "img": "/Resources/media/mediapep.png",
        "role": "Composer"
    }
];


$credits.forEach(credit => {
    $credits_section.innerHTML += '<div class="col-6 col-lg-4 col-xl-3 pb-5"><img class="credit-img"' + 'src="' + credit.img + '" alt="' + credit.name + '"><p class="text-white pt-1">' + credit.role + '</div>'
});
