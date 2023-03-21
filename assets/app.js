/*
 * Welcome to your app's main JavaScript file!
 *
 * We recommend including the built version of this JavaScript file
 * (and its CSS file) in your base layout (base.html.twig).
 */

// any CSS you import will output into a single css file (app.css in this case)
import './styles/app.css';

// start the Stimulus application
import './bootstrap';

import { Modal } from 'bootstrap';

//vanilla js
// document.addEventListener('turbo:before-cache', (event) => {
//     if (document.body.classList.contains('modal-open')){
//         const modalEl = document.querySelector('.modal');
//         const modal = Modal.getInstance(modalEl);
//         modalEl.classList.remove('fade');
//         modal._backdrop._config.isAnimated = false;
//         modal.hide();
//         modal.dispose();
//     }
// })

import $ from 'jquery';

//jquery
$(document).on('turbo:before-cache', function() {
    if (document.body.classList.contains('modal-open')){
        const modalEl = document.querySelector('.modal');
        const modal = Modal.getInstance(modalEl);
        modalEl.classList.remove('fade');
        modal._backdrop._config.isAnimated = false;
        modal.hide();
        modal.dispose();
    }
});

//turbo click event
document.addEventListener('turbo:click', (event) => {
   console.log('turbo click');
   console.log(event.detail.url);
});

//turbo before visit event
document.addEventListener('turbo:before-visit', (event) => {
    console.log('before visit');
    console.log(event.detail.url);
});

//turbo visit event
document.addEventListener('turbo:visit', (event) => {
    console.log('turbo visit');
    console.log(event.detail.url);
});

//turbo load
document.addEventListener('turbo:load', (event) => {
    console.log('turbo click');
    console.log(event.detail.timing);
});

//logs only once as this app.js script is loaded for each page
//turbo takes note of this and wont load for every new page
$(document).ready(() => {
    console.log("page is ready");
})

console.log("Script is done");