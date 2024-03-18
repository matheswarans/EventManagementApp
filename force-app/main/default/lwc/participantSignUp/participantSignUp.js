import { LightningElement, track } from 'lwc';
import registerParticipant from '@salesforce/apex/ParticipantController.registerParticipant';

export default class ParticipantSignUp extends LightningElement {
    @track eventRecord = {
        Name: '',       
        Email: null,
        Phone: null,
        Address: null,       
        DOB: ''
    }
    
    handlOnchange(event){
        let value = event.target.value;        
        let name = event.target.name;       
        this.eventRecord[name] = value;
        //alert(JSON.stringify(this.eventRecord));
    }

    handleSignUp() {
        const participantDetails = {
            Name: this.eventRecord.Name ,       
            Email: this.eventRecord.Email,
            Phone: this.eventRecord.Phone,
            Address: this.eventRecord.Address,       
            DOB: this.eventRecord.DOB
        };

        registerParticipant({ participantDetails })
            .then(result => {
                alert("Success");
                // Handle successful sign-up
                this.resetFields();
                // Optionally, show a success message
            })
            .catch(error => {
                alert(JSON.stringify(error));
                // Handle error
                // Optionally, show an error message
            });
    }

    resetFields() {
        eventRecord = {
            Name: '',       
            Email: null,
            Phone: null,
            Address: null,       
            DOB: ''
        }
    }
}
