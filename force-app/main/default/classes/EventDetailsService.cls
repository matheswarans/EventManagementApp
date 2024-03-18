public with sharing class EventDetailsService {
    @AuraEnabled(cacheable=true)
    public static List<CustomEvent__c> upcomingEvents(){
        List<CustomEvent__c> eventList = [SELECT Id, EventId__C, Name, Status__c 
            FROM CustomEvent__c WHERE Status__c = 'Approved'
               AND StartDate__c >= Today WITH SECURITY_ENFORCED ];
         return eventList; //AND Live__c = true
    }
}

   