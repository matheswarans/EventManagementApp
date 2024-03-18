// import { LightningElement, track } from 'lwc';

// export default class AddEvent extends LightningElement {
    
//     @track eventName;
//     @track eventDate;

//     handleEventNameChange(event) {
//         this.eventName = event.target.value;
//     }

//     handleEventDateChange(event) {
//         this.eventDate = event.target.value;
//     }

//     handleSave() {
//         // Implement save logic here (e.g., use wire service to call Apex method to save the event)
//     }

//     handleSubmit() {
//         // Implement submit logic here (e.g., use wire service to call Apex method to save and submit the event)
//     }
// }

import { LightningElement, track } from 'lwc';
import { createRecord } from 'lightning/uiRecordApi';
import EVT_OBJECT from '@salesforce/schema/CustomEvent__c';
import Name from '@salesforce/schema/CustomEvent__c.Name';
//import Event_Organizer__c from '@salesforce/schema/CustomEvent__c.Event_Organizer__c';
import StartDate__c from '@salesforce/schema/CustomEvent__c.StartDate__c';
import EndDate__c from '@salesforce/schema/CustomEvent__c.EndDate__c';
import MaxParticipantAllowed__c from '@salesforce/schema/CustomEvent__c.MaxParticipantAllowed__c';
//import Location__c from '@salesforce/schema/CustomEvent__c.Location__c';
import Description__c from '@salesforce/schema/CustomEvent__c.Description__c';
import Status__c from '@salesforce/schema/CustomEvent__c.Status__c';

import { NavigationMixin } from 'lightning/navigation';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class AddEvent extends NavigationMixin(LightningElement) {
// Event_Organizer__c: '',
 //Location__c: '',
    @track eventRecord = {
        Name: '',       
        StartDate__c: null,
        EndDate__c: null,
        MaxParticipantAllowed__c: null,       
        Description__c: ''
    }
    @track errors;

handleChange(event){
    let value = event.target.value;
    let name = event.target.name;
    this.eventRecord[name] = value;
}
handleLookup(event){
    let selectedRecId = event.detail.selectedRecordId;
    let parentField = event.detail.parentfield;
    this.eventRecord[parentField] = selectedRecId;
}
handleClick(){
    alert(JSON.stringify(this.eventRecord));
    const fields = {};
    fields[Name.fieldApiName] = this.eventRecord.Name;
    //fields[Event_Organizer__c.fieldApiName] = this.eventRecord.Event_Organizer__c;
    fields[StartDate__c.fieldApiName] = this.eventRecord.StartDate__c;
    fields[EndDate__c.fieldApiName] = this.eventRecord.EndDate__c;
    fields[MaxParticipantAllowed__c.fieldApiName] = this.eventRecord.MaxParticipantAllowed__c;
    //fields[Location__c.fieldApiName] = this.eventRecord.Location__c;
    fields[Description__c.fieldApiName] = this.eventRecord.Description__c;
    fields[Status__c.fieldApiName] ='Submitted';
    alert(2);
    alert(JSON.stringify(fields));
const eventRecord = {apiName: EVT_OBJECT.objectApiName, fields};
alert(JSON.stringify(eventRecord));
createRecord(eventRecord)
.then((eventRec) => {
//     this.dispatchEvent(new ShowToastEvent({
//         title: 'Record saved',
//         message: 'Event Draft is ready',
//         variant: 'success'
//     }));
//   this[NavigationMixin.Navigate]({
//      // type: 'standard__recordPage',
//      type: 'standard__objectPage',
//       attributes: {
//           //actionName: "view",
//           actionName: "home",
//           objectApiName: "CustomEvent__c",
//           recordId: eventRec.id
//       }
//   });
      alert('Record Saved ' + eventRec.id)

}).catch((err) => {
    this.errors = JSON.stringify(err);
alert(this.errors);
    this.dispatchEvent(new ShowToastEvent({
        title: 'Error Occured',
        message: this.errors,
        variant: 'error'
    }));
});

}

handleCancel(){
    this[NavigationMixin.Navigate]({
        type: 'standard__objectPage',
        attributes: {
            actionName: "home",
            objectApiName: "CustomEvent__c"
        }
    });
}

}