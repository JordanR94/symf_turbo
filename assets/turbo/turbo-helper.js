import { Modal } from 'bootstrap';
import button from "bootstrap/js/src/button";
import * as Turbo from "@hotwired/turbo";

const TurboHelper = class {
    constructor() {
        document.addEventListener('turbo:before-cache', (event) => {
            this.closeModal();
            this.closeSweetalert();
            this.reenableSubmitButtons();
        });

        document.addEventListener('turbo:visit', () => {
            //fade out the old body
            document.body.classList.add('turbo-loading');
        });

        document.addEventListener('turbo:submit-start', (event) => {
            const submitter = event.detail.formSubmission.submitter;
            submitter.toggleAttribute('disabled', true);
            submitter.classList.add('turbo-submit-disabled');
        });

        document.addEventListener('turbo:before-fetch-request', (event) => {
            this.beforeFetchRequest(event);
        })

        document.addEventListener('turbo:before-fetch-response', (event) => {
            this.beforeFetchResponse(event);
        })

        this.initializeTransitions();
    }

    closeModal(){
        if (document.body.classList.contains('modal-open')){
            const modalEl = document.querySelector('.modal');
            const modal = Modal.getInstance(modalEl);
            modalEl.classList.remove('fade');
            modal._backdrop._config.isAnimated = false;
            modal.hide();
            modal.dispose();
        }
    }

    closeSweetalert(){
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
    }

    isPreviewRendered() {
        return document.documentElement.hasAttribute('data-turbo-preview');
    }

    initializeTransitions(){
        document.addEventListener('turbo:before-render', (event) => {
            if (this.isPreviewRendered()) {
                // this is a preview that has been instantly swapped
                // remove .turbo-loading so the preview starts fully opaque
                event.detail.newBody.classList.remove('turbo-loading');
                // start fading out 1 frame later after opacity starts full
                requestAnimationFrame(() => {
                    document.body.classList.add('turbo-loading');
                });
            } else {
                const isRestoration = event.detail.newBody.classList.contains('turbo-loading');
                if (isRestoration) {
                    // this is a restoration (back button). Remove the class
                    // so it simply starts with full opacity
                    event.detail.newBody.classList.remove('turbo-loading');
                    return;
                }
                // when we are *about* to render a fresh page
                // we should already be faded out, so start us faded out
                event.detail.newBody.classList.add('turbo-loading');
            }
        });

        document.addEventListener('turbo:render', () => {
            // after rendering, we first allow the turbo-loading class to set the low opacity
            // THEN, one frame later, we remove the turbo-loading class, which allows the fade in
            requestAnimationFrame(() => {
                document.body.classList.remove('turbo-loading');
            });
        });
    }

    reenableSubmitButtons(){
        document.querySelectorAll('.turbo-submit-disabled').forEach((button) => {
            button.toggleAttribute('disabled', false);
            button.classList.remove('turbo-submit-disabled');
        });
    }

    beforeFetchRequest(event){
        console.log(event);
        const frameId = event.detail.fetchOptions.headers['Turbo-Frame'];
        if(!frameId){
            return;
        }

        const frame = document.querySelector(`#${frameId}`);

        if(!frame || !frame.dataset.turboFormRedirect){
            return;
        }

        event.detail.fetchOptions.headers['Turbo-frame-redirect'] = 1;
    }

    beforeFetchResponse(event){
        const fetchResponse = event.detail.fetchResponse;

        if(!fetchResponse.succeeded || !fetchResponse.redirected){
            return;
        }

        if(!this.getCurrentFrame() || !this.getCurrentFrame().dataset.turboFormRedirect){
            return;
        }


        event.preventDefault();
        Turbo.clearCache();
        Turbo.visit(fetchResponse.location);
    }

    getCurrentFrame(){
        return document.querySelector('turbo-frame[busy]');
    }
}

export default new TurboHelper();
