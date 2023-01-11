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

document.addEventListener('turbo:before-cache', (event) => {
    if (document.body.classList.contains('modal-open')){
        const modalEl = document.querySelector('.modal');
        const modal = Modal.getInstance(modalEl);
        modalEl.classList.remove('fade');
        modal._backdrop._config.isAnimated = false;
        modal.hide();
        modal.dispose();
    }

    //internal way to see if sweetalert2 has been imported yet
    if(__webpack_modules__[require.resolveWeak('sweetalert2')]){
        //because we know its been imported, this will run synchronously
        import(/* webpackMode: 'weak' */'sweetalert2').then((Swal) => {
            if(Swal.default.isVisible()){
                Swal.default.getPopup().style.animationDuration = '0ms';
                Swal.default.close();
            }
        });
    }
});

import $ from 'jquery';

//logs only once as this app.js script is loaded for each page
//turbo takes note of this and wont load for every new page
$(document).ready(() => {
    console.log("page is ready");
})

console.log("Script is done");