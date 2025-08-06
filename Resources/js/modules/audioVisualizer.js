import WaveSurfer from '../../../node_modules/wavesurfer.js/dist/wavesurfer.js';

window.wavesurfer = WaveSurfer.create({
    container: '#waveform',
    waveColor: '#0c587eff',
    progressColor: '#fff6c8',
    normalize: true,
    responsive: true
    //   url: "Resources/media/portfolio/danger.wav"
});

const hover = document.querySelector('#hover')
const waveform = document.querySelector('#waveform')
waveform.addEventListener('pointermove', (e) => (hover.style.width = `${e.offsetX}px`))