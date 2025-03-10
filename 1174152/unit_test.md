Here is what we are looking for:
 	- The code review should point out improper use of function closures in loops in both inviteUser() and sendReminder(), asynchronous callbacks (via setTimeout) are used inside loops without proper binding of the loop variable.

	- The code review should point out ignoring promise rejection in async functions - the acceptInvitation() method calls logAttendance() without awaiting its result.

	- The code review should point out concurrency issues with global state - the updateEvent() method directly mutates the event object.

	- The code review should point out direct object mutation without cloning - directly modifying the event object in updateEvent().

	- The code review should point out unchecked duplicates and data inconsistencies in inviteUser(), the check for duplicate invitations is minimal (only using indexOf).

	- The code review should point out weak error handling and silent failures

	- The code review should point out race condition in send Reminder

Each of these is worth a maximum of 2 points, for a total of 14 points. Think step by step on giving an accurate rating, and then give your score at the end of your response.

