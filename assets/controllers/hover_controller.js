import { Controller } from 'stimulus'
import { useHover } from 'stimulus-use'

export default class extends Controller {

    connect() {
        useHover(this, { element: this.element });
    }

    mouseEnter() {
        console.log("Mouse Entered");
    }

    mouseLeave() {
        console.log("Mouse Left");
    }
}