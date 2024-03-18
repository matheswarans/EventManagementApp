import { LightningElement, wire, api } from 'lwc';
import getSubmittedEvents from '@salesforce/apex/EventController.getSubmittedEvents';
// import { subscribe, MessageContext } from 'lightning/messageService';
// import MY_MESSAGE_CHANNEL from '@salesforce/messageChannel/MyMessageChannel__c';


const columns = [
    { label: 'Event Name', fieldName: 'Name', type: 'text' },
    { label: 'Status', fieldName: 'Status__c', type: 'text' },
    // Add more columns as needed
];

export default class ApprovalEvent extends LightningElement {

    events;
    error;
    columns = columns;
    @api selectedEventId;
   
    // @wire(MessageContext)
    // messageContext;

    @wire(getSubmittedEvents)
    wiredEvents({ error, data }) {      
      //alert(1);
        if (data) {
            this.events = data;
            this.error = undefined;
        } else if (error) {
            this.error = error;
            this.events = undefined;
        }
    }

    // handleRowClick(event) {
    //     const eventId = event.detail.row.Id;
    //     // Dispatch custom event to notify parent component with selected event Id
    //     const selectEvent = new CustomEvent('eventselect', { detail: eventId });
    //     this.dispatchEvent(selectEvent);
    // }
    handleRowAction(event) {
        //const selectedEventId = event.detail.row.Id;
       // this.selectedEventId = selectedEventId;
    }
    // connectedCallback() {
    //     // Subscribe to receive the message
    //     this.subscription = subscribe(
    //         this.messageContext,
    //         MY_MESSAGE_CHANNEL,
    //         (message) => {
    //             // Handle the message
    //             console.log('Received message:', message.value);
    //         }            
    //     );
    //     handleRefreshEvent();
    // }

    // disconnectedCallback() {
    //     // Unsubscribe when the component is removed from the DOM
    //     unsubscribe(this.subscription);
    // }

    handleRefreshEvent() {
        // Set refreshApprovalEvent to false after the refresh is triggered in child component
        alert(3);
        //refreshApex(this.wiredEvents);
        getSubmittedEvents() 
        .then(result => {
            alert(result.data);
            if (result.data) {
                this.events = result.data;
                this.error = undefined;
            } else if (result.error) {
                this.error = result.error;
                this.events = undefined;
            }
        })
        .catch(error => {
            // Handle error
            alert(error);
        });
    }
    handleRowSelection(event) {
        const selectedRows = event.detail.selectedRows;
        if (selectedRows.length === 1) {
            this.selectedEventId = selectedRows[0].Id;
           // alert(this.selectedEventId);
            this.dispatchEvent(new CustomEvent('eventselect', { detail: this.selectedEventId }));
        } else {
           this.selectedEventId = null;
        }
        
    }
}
