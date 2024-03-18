import { LightningElement, api, wire } from 'lwc';
import getEventDetails from '@salesforce/apex/EventController.getEventDetails';
import approveEvent from '@salesforce/apex/EventController.approveEvent';
// import { publish, MessageContext } from 'lightning/messageService';
// import MY_MESSAGE_CHANNEL from '@salesforce/messageChannel/MyMessageChannel__c';


export default class EventDetails extends LightningElement {
    @api eventId;
    @api refresh = false; // Property to trigger wire adapter reexecution
    eventDetails;
    error;

    // @wire(MessageContext)
    // messageContext;

    @wire(getEventDetails, { eventId: '$eventId' }) // Pass refresh as parameter
    wiredEventDetails({ error, data }) {
        if (data) {
            this.eventDetails = data;
            this.error = undefined;
        } else if (error) {
            this.error = error;
            this.eventDetails = undefined;
        }
    }
    handleApprove() {
        approveEvent({ eventId: this.eventId })
            .then(result => {
                // Handle success
                // Optionally, refresh event details or update UI
                this.refresh=true;
                // const refreshEvent = new CustomEvent('refreshevent',{ detail: this.refresh });
                // this.dispatchEvent(refreshEvent);
                const message = {
                    value: this.refresh
                };
             //   publish(this.messageContext, MY_MESSAGE_CHANNEL, message);
            })
            .catch(error => {
                // Handle error
            });
    }
}