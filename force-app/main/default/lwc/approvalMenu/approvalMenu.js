import { LightningElement } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';

export default class ApprovalMenu extends NavigationMixin(LightningElement) {
    navigateToApproval() {
        this[NavigationMixin.Navigate]({
            type: 'standard__webPage',
            attributes: {
                url: '/approval-process'
            }
        });
    }
}