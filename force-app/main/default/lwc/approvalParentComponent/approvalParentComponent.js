import { LightningElement, track } from 'lwc';

export default class ApprovalParentComponent extends LightningElement {
    @track eventId;   
   // @api refreshApprovalEvent = false;

    handleEventSelect(event) {
        this.eventId = event.detail;
        //this.refreshApprovalEvent = true; // Toggle refresh property for EventDetails child component
    }

    // handleRefreshApprovalEvent(event) {
    //     // Set refreshApprovalEvent to false after the refresh is triggered in child component
    //     alert(1);
    //     //this.refreshApprovalEvent = event.detail;
    //     // Find the child component containing the lightning-datatable
    //     // const listComponent = this.template.querySelector('c-approval-event');
    //     // alert(listComponent);
    //     // if (listComponent) {
    //     //     alert(listComponent.innerHTML);
    //     //     // Call the method in the child component to trigger refresh of the datatable
    //     //     listComponent.handleRefreshEvent();
    //     // }
    // }
}