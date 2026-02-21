function addEventToGoogleCalendar(event) {
    const {summary, location, description, startTime, endTime} = event;

    const eventDetails = {
        summary: summary,
        location: location,
        description: description,
        start: {
            dateTime: startTime,
            timeZone: 'UTC',
        },
        end: {
            dateTime: endTime,
            timeZone: 'UTC',
        },
    };

    const request = gapi.client.calendar.events.insert({
        calendarId: 'primary',
        resource: eventDetails,
    });

    request.then(function(response) {
        console.log('Event created: ' + response.result.htmlLink);
    }, function(error) {
        console.error('Error creating event: ' + error);
    });
}