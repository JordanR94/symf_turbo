import { Controller } from 'stimulus'
import { useVisibility } from 'stimulus-use'

export default class extends Controller {
    connect() {
        useVisibility(this)
    }

    visible() {
        // triggered when the page is visible
    }

    invisible() {
        // triggered when the page is invisible
    }
}