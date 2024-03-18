import { LightningElement } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';

export default class ParticipantMenu extends NavigationMixin(LightningElement) {
    navigateToParticipant() {
        this[NavigationMixin.Navigate]({
            type: 'standard__webPage',
            attributes: {
                url: '/participant-signup'
            }
        });
    }
}