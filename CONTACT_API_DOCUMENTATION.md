# Contact Form API Documentation

This document outlines the API endpoint for handling contact form submissions.

## Endpoint: `/api/contacts`

### Method: `POST`

This endpoint is used to submit a new contact form entry.

### Request Body

The request body should be a JSON object with the following fields:

| Field     | Type   | Required | Description                             |
| :-------- | :----- | :------- | :-------------------------------------- |
| `name`    | String | Yes      | The full name of the person submitting. |
| `email`   | String | Yes      | The email address of the person.        |
| `phone`   | String | Yes      | The phone number of the person.         |
| `message` | String | No       | The message content from the form.      |

**Example Request Body:**

```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "phone": "123-456-7890",
  "message": "I would like to inquire about your services."
}
```

### Responses

#### Success Response (Status 201)

If the submission is successful, the API will return a JSON object with a success message and the created contact object.

**Example Success Response Body:**

```json
{
  "message": "Contact submission received",
  "contact": {
    "id": 1678886400000,
    "name": "John Doe",
    "email": "john.doe@example.com",
    "phone": "123-456-7890",
    "message": "I would like to inquire about your services.",
    "submittedAt": "2023-03-15T12:00:00.000Z"
  }
}
```

#### Error Responses

-   **Status 400 (Bad Request):** Returned if any of the required fields (`name`, `email`, `phone`) are missing.
-   **Status 500 (Internal Server Error):** Returned if there is a server-side error while processing the request.

---

## Endpoint: `/api/admin/contacts`

### Method: `GET`

This endpoint is used by admins to retrieve a list of all contact form submissions. This route should be protected and only accessible by authenticated admin users.

### Responses

#### Success Response (Status 200)

If the request is successful, the API will return a JSON array of contact objects.

**Example Success Response Body:**

```json
[
  {
    "id": 1678886400000,
    "name": "John Doe",
    "email": "john.doe@example.com",
    "phone": "123-456-7890",
    "message": "I would like to inquire about your services.",
    "submittedAt": "2023-03-15T12:00:00.000Z"
  },
  {
    "id": 1678886400001,
    "name": "Jane Smith",
    "email": "jane.smith@example.com",
    "phone": "098-765-4321",
    "message": "Another inquiry.",
    "submittedAt": "2023-03-15T12:05:00.000Z"
  }
]
```

#### Error Responses

-   **Status 401 (Unauthorized):** Returned if the user is not authenticated as an admin.
-   **Status 500 (Internal Server Error):** Returned if there is a server-side error while processing the request.
