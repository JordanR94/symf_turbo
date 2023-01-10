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

import $ from 'jquery';

//logs only once as this app.js script is loaded for each page
//turbo takes note of this and wont load for every new page
$(document).ready(() => {
    console.log("page is ready");
})

console.log("Script is done");