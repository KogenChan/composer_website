// # NAVBAR TOGGLER BUTTON

const toggler = document.querySelector('.navbar-toggler');
const togglerIcon = document.querySelector('.toggler-icon');
toggler.onclick = changeIcon;

function changeIcon() {
    togglerIcon.classList.toggle('bi-list');
    togglerIcon.classList.toggle('bi-x');
}; 

// ! NAVBAR TOGGLER BUTTON


// # CREDITS SECTION

const credits_section = document.getElementById('credits');
let delay = 0;

async function getCredits() {
    try {
        const response = await fetch('https://kogensan.github.io/composer_website/credits.json');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const credits = await response.json();
        
        credits.forEach(credit => {
            credits_section.innerHTML += `
                <div class="col-6 col-lg-4 col-xl-3 pb-2 pb-md-4 px-1 d-flex flex-column align-items-center" 
                    data-aos="fade-left" 
                    data-aos-duration="1500" 
                    data-aos-delay="${delay}">
                    <img class="credit-img" src="${credit.img}" alt="${credit.name}">
                    <small class="text-white credits-role text-center wix-text pt-1 pt-md-2">${credit.role}</small>
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


// # PORTFOLIO

const playlist_section = document.getElementById('playlist');

async function getPlaylist () {
    try {
        const response = await fetch('https://kogensan.github.io/composer_website/playlist.json');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const playlist = await response.json();
        let index = 0;
        
        playlist.forEach (track => {
            index ++;
            playlist_section.innerHTML += `
                <li>
                    <div class="portfolio-item d-flex align-items-center justify-content-between px-4 wix-display fs-18" data-src="${track.file}" data-title="${track.name}">
                        <span style="width:40px;">${index}</span>
                        <div class="d-flex flex-column flex-sm-row w-100">
                            <span id="trackName">${track.name}</span>
                            <span class="ps-sm-2">(${track.genre})</span>
                        </div>
                    </div>
                </li>
            `;
        });
        
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                setTimeout(() => player.init(), 100);
            });
        } else {
            setTimeout(() => player.init(), 100);
        }
        
    } catch (error) {
        console.error('Failed to fetch data:', error);
    }
}

getPlaylist();

// * PLAYER

let player = {
    // PROPERTIES
    // HTML ELEMENTS
    hName : null, // song name
    hTimeR : null, // song time slider
    hTimeN : null, // song current time
    hTimeT : null, // song time
    hTog : null, // toggle play/pause
    hVolI : null, // volume icon/toggle
    hVolR : null, // volume slider
    
    // AUDIO & PLAYLIST
    pAud : null, // audio player
    pList : null, // playlist
    pSeek : false, // user seeking time slider
    pNow : 0, // currently playing
    
    // HELPER - FORMAT "NICE TIME"
    nicetime : secs => {
        let m = Math.floor(secs/60),
        s = secs - (m * 60);
        if (s<10) { s = "0" + s; }
        return `${m}:${s}`;
    },
    
    // INITIALIZE
    init : () => {
        
        if (typeof window.wavesurfer === 'undefined') {
            console.warn('WaveSurfer not yet initialized, retrying in 100ms...');
            setTimeout(() => player.init(), 100);
            return;
        }
        
        // GET HTML ELEMENTS
        player.hName = document.getElementById("playName");
        player.hTimeR = document.getElementById("playTimeR");
        player.hTimeN = document.getElementById("playTimeN");
        player.hTimeT = document.getElementById("playTimeT");
        player.hTog = document.getElementById("playTog");
        player.hVolI = document.getElementById("playVolI");
        player.hVolR = document.getElementById("playVolR");
        
        // AUDIO OBJECT & PLAYLIST
        player.pAud = document.getElementById("playerAudio");
        player.pList = document.querySelectorAll("#playlist .portfolio-item");
        
        player.pList.forEach((songDiv) => {
            const src = songDiv.dataset.src;
            const audio = new Audio(src);
            
            audio.addEventListener("loadedmetadata", () => {
                const duration = player.nicetime(Math.floor(audio.duration));
                if (!songDiv.querySelector(".song-duration")) {
                    const span = document.createElement("span");
                    span.className = "song-duration text-white";
                    span.textContent = `${duration}`;
                    songDiv.append(span);
                }
            });
        });
        
        // AUTO SWITCH PLAY/PAUSE ICON
        let pp = () => {
            if ( player.pAud.paused == 0 ) {
                player.hTog.classList.add("bi-pause-circle-fill"),
                player.hTog.classList.remove("bi-play-circle-fill")                    
            } else {
                player.hTog.classList.remove("bi-pause-circle-fill"),
                player.hTog.classList.add("bi-play-circle-fill") 
            };
        };
        player.pAud.onplay = pp;
        player.pAud.onpause = pp;
        
        // AUTO PLAY NEXT SONG
        player.pAud.onended = () => player.load(true);
        
        
        
        // TIME SLIDER
        player.hTimeR.oninput = () => player.pSeek = true;
        player.hTimeR.onchange = () => {
            player.pAud.currentTime = player.hTimeR.value;
            player.pSeek = false;
            if (player.pAud.paused) { player.pAud.play(); }
        }
        
        // CLICK TO PLAY SONG
        player.pList.forEach((song, i) => {
            song.onclick = () => player.load(i);
        });
        
        // INIT - PRELOAD FIRST SONG
        player.load(0, true);
        let selected = player.pList[player.pNow];
        const src = selected.dataset.src;
    },
    
    // LOAD SELECTED SONG
    load : (song, preload) => {
        
        // STOP PLAYING CURRENT SONG
        if (!player.pAud.paused) {
            player.pAud.pause();
        }
        
        // LOCK INTERFACE
        player.hName.innerHTML = "Loading";
        player.hTimeR.disabled = true;
        player.pSeek = false;
        player.hTog.onclick = "";
        player.hVolI.onclick = "";
        player.hVolR.disabled = true;
        
        // NEXT SONG TO PLAY
        if (song === true) {
            player.pNow++;
        }
        else if (song === false) {
            player.pNow--;
        }
        else {
            player.pNow = song;
        }
        if (player.pNow >= player.pList.length) {
            player.pNow = 0;
        }
        if (player.pNow < 0) {
            player.pNow = player.pList.length - 1;
        }
        
        // SET SELECTED SONG
        for (let song of player.pList) {
            song.classList.remove("current");
        }
        let selected = player.pList[player.pNow];
        selected.classList.add("current");
        
        // LOAD SELECTED SONG
        const src = selected.dataset.src;
        
        if (!src) {
            console.error("Missing audio source for song at index:", player.pNow);
            return;
        }
        
        // SYNC WAVEFORM
        player.pAud.onloadedmetadata = () => {
            
            if (window.wavesurfer) {       
                wavesurfer.load(src);
                wavesurfer.seekTo(0);
            }
            
            // AUTO UPDATE CURRENT TIME
            player.pAud.ontimeupdate = () => {
                if (!player.pSeek && isFinite(player.pAud.duration) && player.pAud.duration > 0) {
                    let cur = player.pAud.currentTime;
                    let dur = player.pAud.duration;
                    player.hTimeR.value = Math.floor(cur);
                    let seek = ((100 / dur) * cur) / 100;
                    if (window.wavesurfer) {
                        window.wavesurfer.seekTo(seek);
                    }
                }
                player.hTimeN.innerHTML = player.nicetime(Math.floor(player.pAud.currentTime));
            };
            
            // SET SONG NAME
            player.hName.innerHTML = selected.dataset.title;
            
            // SET SONG TIME
            player.hTimeN.innerHTML = "0:00";
            player.hTimeT.innerHTML = player.nicetime(Math.floor(player.pAud.duration));
            player.hTimeR.value = 0;
            player.hTimeR.max = Math.floor(player.pAud.duration);
            
            // ENABLE CONTROLS
            player.hTog.onclick = () => {
                if (player.pAud.paused) {
                    player.pAud.play();
                }
                else {
                    player.pAud.pause();
                }
            };
            player.hVolI.onclick = () => {
                player.pAud.volume = player.pAud.volume==0 ? 1 : 0 ;
                player.hVolR.value = player.pAud.volume;
                if ( player.pAud.volume == 0 ) {
                    player.hVolI.classList.add("bi-volume-mute-fill"),
                    player.hVolI.classList.remove("bi-volume-up-fill")                    
                } else {
                    player.hVolI.classList.remove("bi-volume-mute-fill"),
                    player.hVolI.classList.add("bi-volume-up-fill")  
                }
            };
            player.hVolR.onchange = () => {
                player.pAud.volume = player.hVolR.value;
                if ( player.pAud.volume == 0 ) {
                    player.hVolI.classList.add("bi-volume-mute-fill"),
                    player.hVolI.classList.remove("bi-volume-up-fill")                    
                } else {
                    player.hVolI.classList.remove("bi-volume-mute-fill"),
                    player.hVolI.classList.add("bi-volume-up-fill")  
                }
            };
            
            // START PLAYING SONG
            if (window.wavesurfer) {
                window.wavesurfer.once('ready', () => {
                    player.hTimeR.disabled = false;
                    player.hVolR.disabled = false;
                    if (!preload) {
                        player.pAud.play();
                    }
                });
            } else {
                player.hTimeR.disabled = false;
                player.hVolR.disabled = false;
                if (!preload) {
                    player.pAud.play();
                }
            }
        };
        
        player.pAud.src = src;        
        player.pAud.load(); 
    }
};

// ! PORTFOLIO



// ! COOKIE BANNER

const consent = document.getElementById('cookieConsent');
// Show cookie consent banner
function showCookieConsent() {   
    consent.classList.add('show');
}

// Check if cookie consent was previously given
let checkCookie = document.cookie.indexOf("CookieBy=LucaSimone");
console.log(checkCookie);
if (checkCookie == -1) {
    // Show banner after a short delay
    setTimeout(showCookieConsent, 1000);
}


function acceptAll() {
    const analyticsCookies = document.getElementById('analyticsCookies');
    
    analyticsCookies.checked = true;
    
    saveCookiePreferences();
    
    consent.classList.remove('show');
}

function acceptNecessary() {
    const analyticsCookies = document.getElementById('analyticsCookies');
    
    analyticsCookies.checked = false;
    
    saveCookiePreferences();
    
    consent.classList.remove('show');
}

function saveCookiePreferences() {
    const consent = document.getElementById('cookieConsent');
    const analyticsCookies = document.getElementById('analyticsCookies').checked;
    document.cookie = "CookieBy=LucaSimone; max-age=" + 60 * 60 * 24 * 180;
    
    localStorage.setItem('cookieConsent', 'true');
    localStorage.setItem('analyticsCookies', analyticsCookies);
    
    consent.classList.add('hiding');
    setTimeout(() => {
        consent.classList.remove('show', 'hiding');
    }, 300);
    
    console.log('Preferences saved:', {
        analytics: analyticsCookies
    });
}


// ! Back to top BTN

let mybutton = document.getElementById("myBtn");

window.onscroll = function() {scrollFunction()};

function scrollFunction() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        mybutton.style.opacity = "1";
    } else {
        mybutton.style.opacity = "0";
    }
}

function topFunction() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}