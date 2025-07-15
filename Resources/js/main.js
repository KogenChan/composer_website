$toggler = document.querySelector('.navbar-toggler');
$icon_1 = document.querySelector('.bi-list');
$icon_2 = document.querySelector('.bi-x');
$toggler.onclick = changeIcon;

function changeIcon() {
    $icon_1.classList.toggle('opacity');
    $icon_2.classList.toggle('opacity');
}