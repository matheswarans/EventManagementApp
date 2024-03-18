public with sharing class EventController {
    @AuraEnabled(cacheable=true)
    public static List<CustomEvent__c> getSubmittedEvents() {
        return [SELECT Id, EventId__C, Name, Status__c FROM CustomEvent__c WHERE Status__c = 'Submitted'];
    }

    @AuraEnabled(cacheable=true)
    public static CustomEvent__c getEventDetails(Id eventId) {
        return [SELECT Id, EventId__C, Name, Status__c FROM CustomEvent__c WHERE Id = :eventId LIMIT 1];
    }

    @AuraEnabled
    public static void approveEvent(Id eventId) {
        CustomEvent__c eventToUpdate = new CustomEvent__c(Id = eventId, Status__c = 'Approved');
        update eventToUpdate;
    }

    @AuraEnabled
    public static void registerParticipantsToEvent(Id eventId) {
        CustomEvent__c eventToUpdate = new CustomEvent__c(Id = eventId, Status__c = 'Approved');
        update eventToUpdate;
    }
}