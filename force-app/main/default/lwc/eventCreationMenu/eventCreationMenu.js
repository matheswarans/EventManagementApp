import { LightningElement } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';

export default class EventCreationMenu extends NavigationMixin(LightningElement) {
    navigateToEventCreation() {
        this[NavigationMixin.Navigate]({
            type: 'standard__webPage',
            attributes: {
                url: '/event-creation'
            }
        });
    }
}