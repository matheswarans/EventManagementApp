public with sharing class AttendeeEventsService {
    @AuraEnabled(cacheable=true)
    public static List<Event_Participant__c> upcomingEvets(String attendeeId) {
      List<Event_Participant__c> eventLists = [
        SELECT
          Id,
          Name,
          CustomEvent__c,
        //   CustomEvent__c.Location__c,
        //   CustomEvent__c.Location__r.Name,
        //   CustomEvent__c.Event_Organizer__c,
        //   CustomEvent__c.Event_Organizer__r.Name,
          CustomEvent__r.Name,
          CustomEvent__r.StartDate__c
        FROM Event_Participant__c
        WHERE
        Participant__c = :attendeeId
          AND CustomEvent__r.StartDate__c >= today
         // AND CustomEvent__r.Live__c = true
        WITH SECURITY_ENFORCED
      ];
      return eventLists;
    }
}