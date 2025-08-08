import WaveSurfer from '../../../node_modules/wavesurfer.js/dist/wavesurfer_test.js';

const wavesurfer = WaveSurfer.create({
    container: '#waveform',
    waveColor: '#0c587eff',
    progressColor: '#fff6c8',
    normalize: true,
    responsive: true,
});

window.wavesurfer = wavesurfer;

const hover = document.querySelector('#hover')
const waveform = document.querySelector('#waveform')

if (waveform && hover) {
    waveform.addEventListener('pointermove', (e) => {
        hover.style.width = `${e.offsetX}px`;
    });
}

export default wavesurfer;