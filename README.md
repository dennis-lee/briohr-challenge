# briohr-challenge

## Installation

Pre-requisites:

- `node`: `>=20.15 <21`

```bash
$ npm ci
$ docker compose up mongodb
$ npm run start
```

## Design

### Use cases

- Send email notification (with attachment) to employee when their payslip is ready
- Send UI notification to employees to book their leaves on the last day of the year
- Send email and UI notification to with employees a happy birthday on their birthdays

### Requirements

- Accept a HTTP request to send a notification to channels:
  - Email
  - UI
- Accept a HTTP request to retrieve all UI notifications sent to a specific user
- UI channel notifications:
  - Leave balance reminder
  - Happy birthday
- Email channel notifications:
  - Monthly payslip
  - Happy birthday

### APIs

#### Sending a Notification

```
POST /notifications
Content-Type: application/json

{
  "company_id": <string>,
  "user_id": <string>,
  "notification_type": <string>
}
```

\*Only the following values for `notification_type` are accepted:

- leave-balance-reminder
- monthly-payslip
- happy-birthday

The identity service responds to magic values to return companies and users that have different notification channel subscriptions.

| Type                            | Value |
| ------------------------------- | ----- |
| Invalid company ID              | @1000 |
| Company email notification only | @1001 |
| Company UI notification only    | @1002 |
| Invalid user ID                 | @2000 |
| User email notification only    | @2001 |
| User UI notification only       | @2002 |

All other values defaults to all notification channels enabled.

---

#### Getting all UI notifications for a user

```
GET /notifications/{user_id}
```

### System

- Each channel is a service on its own. More channels can be added as needed and injected into the Notification controller.
- Before a notification is sent, the Notification controller gets the company and user settings from the identity service.
- The email service only logs a message when called.
- The inbox service is responsible for the UI channel. In a way, the UI channel is the internal storage for Notifications.

```
Client  -->  Service  -->  NotificationsController -->  IdentityService
                                    |           ^              |
                                    |           |              |
                                    |           +--------------+
                                    |
                                    |
                                    +--> EmailService
                                    |
                                    |
                                    +--> InboxService --> InboxRepository
                                                ^               |
                                                |               |
                                                +---------------+
```
