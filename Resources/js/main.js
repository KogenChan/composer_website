$toggler = document.querySelector('.navbar-toggler');
$icon_1 = document.querySelector('.bi-list');
$icon_2 = document.querySelector('.bi-x');
$toggler.onclick = changeIcon;

console.log($toggler, $icon_1, $icon_2)

function changeIcon() {
    $icon_1.classList.toggle('opacity');
    $icon_2.classList.toggle('opacity');
}