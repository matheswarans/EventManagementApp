import { LightningElement, wire, track } from "lwc";
import upcomingEvents from "@salesforce/apex/EventDetailsService.upcomingEvents";
import addParticipantToEvent from '@salesforce/apex/ParticipantController.addParticipantToEvent';
import fetchParticipantByEmail from '@salesforce/apex/ParticipantController.fetchParticipantByEmail';
// import getEventDetails from '@salesforce/apex/ParticipantController.getEventDetails';
// import sendEmailNotification from '@salesforce/apex/ParticipantController.sendEmailNotification';

// const columns = [
//   {
//     label: "View",
//     fieldName: "detailsPage",
//     type: "url",
//     wrapText: "true",
//     typeAttributes: {
//       label: {
//         fieldName: "Name__c"
//       },
//       target: "_self"
//     }
//   },
//   {
//     label: "Name",
//     fieldName: "Name__c",
//     wrapText: "true",
//     cellAttributes: {
//       iconName: "standard:event",
//       iconPosition: "left"
//     }
//   },
//   {
//     label: "Name",
//     fieldName: "EVNT_ORG",
//     wrapText: "true",
//     cellAttributes: {
//       iconName: "standard:user",
//       iconPosition: "left"
//     }
//   },
//   {
//     label: "Location",
//     fieldName: "Location",
//     wrapText: "true",
//     type: "text",
//     cellAttributes: {
//       iconName: "utility:location",
//       iconPosition: "left"
//     }
//   }
// ];

const columns = [
    { label: 'Event Name', fieldName: 'Name', type: 'text' },
    { label: 'Status', fieldName: 'Status__c', type: 'text' },    
    // Add more columns as needed
];


export default class EventList extends LightningElement {
  columnsList = columns;
  error;
  startdattime;
  buttonEnable = false;
  selectedEventId;
  @track result;
  @track recordsToDisplay;
//   @track isLoggedIn = false;
//   @track loggedInEmail;
  @track email;
  @track participantRecord = {
        Id:'',
        Name: '',       
        Email: null,
        Phone: null,
        Address: null,       
        DOB: '',
        isLoggedIn : false
    }
  @wire(upcomingEvents)
  wiredEvents({ error, data }) {      
      if (data) {
        //alert(data);
        this.result = data;
          this.recordsToDisplay = data;
          this.error = undefined;
      } else if (error) {
        //alert("Err:"+JSON.stringify(error));
          this.error = JSON.stringify(error);
          this.recordsToDisplay = undefined;
      }
  }

  connectedCallback() {
    this.upcomingEventsFromApex();
  }

  upcomingEventsFromApex() {
    upcomingEvents()
      .then((data) => {
        window.console.log(" event list ", data);
        data.forEach((record) => {
          record.detailsPage =
            "https://" + window.location.host + "/" + record.Id;
          //record.EVNT_ORG = record.Event_Organizer__r.Name;
        //   if (record.Location__c) {
        //     record.Location = record.Location__r.Name;
        //   } else {
        //     record.Location = "This is Virtual Event";
        //   }
        });

        this.result = data;
        this.recordsToDisplay = data;
        this.error = undefined;
      })
      .catch((err) => {
        window.console.log(err);
        this.error = JSON.stringify(err);
        this.result = undefined;
      });
  }

  handleSearch(event) {
    let keyword = event.detail.value;
    //alert("keyword:"+keyword);
    let filteredEvents = this.result.filter((record, index, arrayobject) => {
        //alert(record.Name);
      return record.Name.toLowerCase().includes(keyword.toLowerCase()); // Event - event
      // Tst - tst
    });
    if (keyword && keyword.length >= 2) {
      this.recordsToDisplay = filteredEvents;
    } else {
      this.recordsToDisplay = this.result;
    }
    /*
        let filteredEvents = [];
        for(let i=0 to result size){
            if(event.Name.includes(keyword)){
                filteredEvents.push(event)
            }
        }
      */
  }

  handleStartDate(event) {
    let valuedatetime = event.target.value;

    let filteredEvents = this.result.filter((record, index, arrayobject) => {
      return record.StartDate__c >= valuedatetime;
    });
    this.recordsToDisplay = filteredEvents;
  }
//   handleLocationSearch(event) {
//     let keyword = event.detail.value;

//     let filteredEvents = this.result.filter((record, index, arrayobject) => {
//       return record.Location.toLowerCase().includes(keyword.toLowerCase());
//     });
//     if (keyword && keyword.length >= 2) {
//       this.recordsToDisplay = filteredEvents;
//     } else {
//       this.recordsToDisplay = this.result;
//     }
//   }

handleRowSelection(event) {
    //alert(JSON.stringify(event));
    const selectedRows = event.detail.selectedRows;
    //alert(JSON.stringify(event.detail.selectedRows));
    if (selectedRows.length === 1) {
        this.selectedEventId = selectedRows[0].Id;
        //alert(this.selectedEventId);
        this.buttonEnable=true;
       // alert(this.selectedEventId);
       // this.dispatchEvent(new CustomEvent('eventselect', { detail: this.selectedEventId }));
    } else {
       this.selectedEventId = null;
       this.buttonEnable=false;
    }
    
}
handleRegister(event)
{
 alert("Selected Event:"+ this.selectedEventId +' ParticipantId:'+this.participantRecord.Id);
 if(this.participantRecord.Id=='')
 {
    this.error='You must login to Register the Event.';
    return;
 }
 addParticipantToEvent({ eventId: this.selectedEventId, participantId:this.participantRecord.Id})
 .then((data) => {
    window.console.log(" data ", data);
    alert("Success Resistration:"+ data);
    // this.sendEmail();
    // this.downloadEventDetails();
  })
  .catch((err) => {
    window.console.log(err);
    alert(JSON.stringify(err));
    this.error = JSON.stringify(err);
    this.result = undefined;
  });
}

handleEmailChange(event) {
    this.email = event.target.value;
}

handleLogin() {
    //const email = prompt('Enter your email:');
    if (this.email) {
        // Call Apex method to fetch participant details by email
        fetchParticipantByEmail({ email: this.email })
            .then(result => {
                alert(JSON.stringify(result));
                // Participant found, set logged in status
                // this.isLoggedIn = true;
                // this.loggedInEmail = email;
                this.participantRecord = {
                    Id:result.Id,
                    Name: '',       
                    Email: this.email,                    
                    isLoggedIn : true
                }
                alert(JSON.stringify(this.participantRecord));
                // Optionally, store participant details in JavaScript object
            })
            .catch(error => {
                // Participant not found, show error message
                alert('Participant not found for provided email.');
            });
    }
}

// sendEmail() {
//     // Send email notification to the participant
//     sendEmailNotification({ participantId: this.participantId, eventId: this.eventId })
//         .then(result => {
//             // Handle success
//         })
//         .catch(error => {
//             // Handle error
//         });
// }

// downloadEventDetails() {
//     // Download event details
//     getEventDetails({ eventId: this.eventId })
//         .then(result => {
//             // Handle success
//             // Use result to download event details
//         })
//         .catch(error => {
//             // Handle error
//         });
// }

}