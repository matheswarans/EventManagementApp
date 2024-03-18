public with sharing class ParticipantController {
    @AuraEnabled
    public static CustomEvent__c getEventDetails(Id eventId) {
        // Retrieve event details based on the eventId
        return [SELECT Id, Name, Description__c FROM CustomEvent__c WHERE Id = :eventId LIMIT 1];
    }

    @AuraEnabled
    public static void sendEmailNotification(Id participantId, Id eventId) {
        // Get participant's email address
        Participant__c participant = [SELECT Email__c FROM Participant__c WHERE Id = :participantId LIMIT 1];
        String participantEmail = participant.Email__c;

        // Get event details
        CustomEvent__c eventDetails = getEventDetails(eventId);

        // Compose email message
        String subject = 'Event Registration Confirmation';
        String body = 'Thank you for registering for the event. Please find attached event details.\n\n';
        body += 'Event Name: ' + eventDetails.Name + '\n';
        body += 'Event Description: ' + eventDetails.Description__c;

        // Send email
        Messaging.SingleEmailMessage email = new Messaging.SingleEmailMessage();
        email.setToAddresses(new String[] { participantEmail });
        email.setSubject(subject);
        email.setPlainTextBody(body);
        Messaging.sendEmail(new Messaging.SingleEmailMessage[] { email });
    }

    @AuraEnabled
    public static void registerParticipant(Map<String, Object> participantDetails) {
        // Validate participant details (e.g., required fields, email format)
         // Check if the email is unique
         String email = (String) participantDetails.get('Email');
         if (!isEmailUnique(email)) {
             throw new AuraHandledException('Email must be unique.');
         }
        // Insert participant record
        // You can customize this logic as per your requirements
        Participant__c participant = new Participant__c(
            Name = (String) participantDetails.get('Name'),
            Address__c = (String) participantDetails.get('Address'),
            Email__c = (String) participantDetails.get('Email'),
            Phone__c = (String) participantDetails.get('Phone'),
            DOB__c = Date.valueOf((String) participantDetails.get('DOB'))
        );
        insert participant;
    }

    @AuraEnabled
    public static void addParticipantToEvent(Id eventId, Id participantId) {
        // Check if a similar record already exists
        List<Event_Participant__c> existingRecords = [SELECT Id FROM Event_Participant__c 
                                                        WHERE CustomEvent__c = :eventId 
                                                        AND Participant__c = :participantId];
        if (!existingRecords.isEmpty()) {
            // If a similar record exists, throw an error
            throw new AuraHandledException('Participant is already registered for this event.');
        }

        // Create a new record in the Event_Participant__c junction object
        Event_Participant__c eventParticipant = new Event_Participant__c(
            CustomEvent__c = eventId,
            Participant__c = participantId
        );
        insert eventParticipant;

        sendEmailNotification(participantId, eventId);
    }

    @AuraEnabled(cacheable=true)
    public static Participant__c fetchParticipantByEmail(String email) {
        return [SELECT Id, Name, Email__c /* Add more fields as needed */
                FROM Participant__c
                WHERE Email__c = :email
                LIMIT 1];
    }

    private static Boolean isEmailUnique(String email) {
        Integer count = [SELECT COUNT() FROM Participant__c WHERE Email__c = :email];
        return count == 0;
    }
}