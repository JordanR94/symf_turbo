import { Controller } from 'stimulus';
import { visit, renderStreamMessage } from '@hotwired/turbo';

export default class extends Controller {
    count = 0;
    static targets = ['count'];

    increment() {
        this.count++;
        this.countTarget.innerText = this.count;

        const streamMessage = `
<turbo-stream action="update" target="flash-container">
    <template>
        <div class="alert alert-success">
            Thanks for clicking ${this.count} times!
        </div>        
    </template>
<turbo-stream>
        `;
        renderStreamMessage(streamMessage);

        if (this.count === 10) {
            visit('/you-won');
        }
    }
}