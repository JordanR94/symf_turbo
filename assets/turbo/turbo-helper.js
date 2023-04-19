import { Modal } from 'bootstrap';

const TurboHelper = class {
    constructor() {
        document.addEventListener('turbo:before-cache', (event) => {
            this.closeModal();
            this.closeSweetalert();
        });

        document.addEventListener('turbo:render', () => {
            this.initializeWeatherWidget();
        });

        document.addEventListener('turbo:visit', () => {
            //fade out the old body
            document.body.classList.add('turbo-loading');
        });

        document.addEventListener('turbo:before-render', () => {
            // when we are about to render, start us faded out
           event.detail.newBody.classList.add('turbo-loading');
        });

        document.addEventListener('turbo:render', () => {
            // after rendering, we first allow the turbo-loading class to set the low opacity
            // THEN, one frame later, we remove the turbo-loading class, which allows the fade in
            requestAnimationFrame(() => {
               document.body.classList.remove('turbo-loading');
            });
        });
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
    initializeWeatherWidget() {
        __weatherwidget_init();
    }
}

export default new TurboHelper();
