import { Controller } from 'stimulus'
import { useIdle } from 'stimulus-use';

export default class extends Controller{
    connect() {
        useIdle(this, { ms: 3000, initialState: true, events: ['click'], dispatchEvent: false, eventPrefix: false });
    }

    away(event) {
        alert('Hey, wake up!')
    }

    back(event) {
        alert('Welcome back!')
    }

}