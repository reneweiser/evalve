# Evalve API Documentation

Base URL: `/api`

## Authentication

All endpoints under `/api/v1` require authentication using Laravel Sanctum tokens. Include the token in the `Authorization` header:

```
Authorization: Bearer {token}
```

---

## Authentication Endpoints

### POST /login

Authenticate a user and receive an API token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password"
}
```

**Success Response (200):**
```json
{
  "token": "1|abc123...",
  "email": "user@example.com"
}
```

**Error Response (401):**
```json
{
  "message": "Invalid login details."
}
```

---

### POST /logout

Revoke all tokens for the authenticated user.

**Authentication:** Required

**Success Response (200):**
```json
{
  "message": "Logged out."
}
```

---

### GET /user

Get the authenticated user's information.

**Authentication:** Required

**Success Response (200):**
```json
{
  "id": "...",
  "name": "John Doe",
  "email": "user@example.com",
  ...
}
```

---

## Teams

### GET /v1/teams

Get all teams for the authenticated user.

**Authentication:** Required

**Success Response (200):**
```json
[
  {
    "id": "...",
    "name": "Team Name",
    ...
  }
]
```

---

### GET /v1/teams/{team}/scene-objects

Get all scene objects for a specific team.

**Authentication:** Required

**Parameters:**
- `team` (path) - Team ID

**Success Response (200):**
```json
[
  {
    "id": "...",
    "team_id": "...",
    "name": "Object Name",
    ...
  }
]
```

---

### GET /v1/teams/{team}/asset-bundles

Get all asset bundles for a specific team.

**Authentication:** Required

**Parameters:**
- `team` (path) - Team ID

**Success Response (200):**
```json
[
  {
    "id": "...",
    "team_id": "...",
    "name": "Asset Name",
    "crc": "...",
    "unity_version": "2021.3.0",
    "url": "http://example.com/storage/...",
    "assets": [...]
  }
]
```

---

## Asset Bundles

### GET /v1/asset-bundles

Get all asset bundles.

**Authentication:** Required

**Success Response (200):**
```json
[
  {
    "id": "...",
    "team_id": "...",
    "name": "Asset Name",
    "crc": "...",
    "unity_version": "2021.3.0",
    "url": "http://example.com/storage/...",
    "assets": [...]
  }
]
```

---

### GET /v1/asset-bundles/{id}

Get a specific asset bundle by ID.

**Authentication:** Required

**Parameters:**
- `id` (path) - Asset Bundle ID

**Success Response (200):**
```json
{
  "id": "...",
  "team_id": "...",
  "name": "Asset Name",
  "crc": "...",
  "unity_version": "2021.3.0",
  "url": "http://example.com/storage/...",
  "assets": [...]
}
```

---

## Scene Objects

### GET /v1/scene-objects

Get all scene objects.

**Authentication:** Required

**Success Response (200):**
```json
[
  {
    "id": "...",
    "team_id": "...",
    "name": "Object Name",
    "imageUrl": "thumbnails/...",
    "transform": {...},
    "properties": [...]
  }
]
```

---

### GET /v1/scene-objects/{sceneObject}

Get a specific scene object by ID.

**Authentication:** Required

**Parameters:**
- `sceneObject` (path) - Scene Object ID

**Success Response (200):**
```json
{
  "id": "...",
  "team_id": "...",
  "name": "Object Name",
  "imageUrl": "thumbnails/...",
  "transform": {...},
  "properties": [...]
}
```

---

### POST /v1/scene-objects

Create a new scene object.

**Authentication:** Required

**Request Body:**
```json
{
  "team_id": "...",
  "name": "Object Name",
  "transform": {...},
  "properties": [...]
}
```

**Success Response (201):**
```json
{
  "id": "...",
  "team_id": "...",
  "name": "Object Name",
  ...
}
```

---

### PUT /v1/scene-objects/{sceneObject}

Update an existing scene object.

**Authentication:** Required

**Parameters:**
- `sceneObject` (path) - Scene Object ID

**Request Body:**
```json
{
  "name": "Updated Name",
  "transform": {...},
  "properties": [...]
}
```

**Success Response (200):**
```json
{
  "id": "...",
  "team_id": "...",
  "name": "Updated Name",
  ...
}
```

---

### DELETE /v1/scene-objects/{sceneObject}

Delete a scene object.

**Authentication:** Required

**Parameters:**
- `sceneObject` (path) - Scene Object ID

**Success Response (200):**
```json
{
  "message": "Deleted"
}
```

---

## Scene Object Thumbnails

### POST /v1/scene-objects/{sceneObject}/thumbnail

Upload a thumbnail for a scene object.

**Authentication:** Required

**Parameters:**
- `sceneObject` (path) - Scene Object ID

**Request Body (multipart/form-data):**
- `thumbnail` (file) - Image file (jpeg, png, jpg, gif - max 16MB)

**Success Response (200):**
```json
{
  "success": true,
  "message": "Thumbnail uploaded successfully",
  "data": {
    "id": "...",
    "imageUrl": "thumbnails/...",
    ...
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "No thumbnail file provided"
}
```

**Error Response (500):**
```json
{
  "success": false,
  "message": "Failed to upload thumbnail: ..."
}
```

---

### PATCH /v1/scene-objects/{sceneObject}/thumbnail

Update a thumbnail for a scene object (same as POST).

**Authentication:** Required

**Parameters:**
- `sceneObject` (path) - Scene Object ID

**Request Body (multipart/form-data):**
- `thumbnail` (file) - Image file (jpeg, png, jpg, gif - max 16MB)

**Success Response (200):**
```json
{
  "success": true,
  "message": "Thumbnail uploaded successfully",
  "data": {
    "id": "...",
    "imageUrl": "thumbnails/...",
    ...
  }
}
```

---

## Scene Object Transform

### PATCH /v1/scene-objects/{sceneObject}/transform

Update the transform (position/rotation) of a scene object.

**Authentication:** Required

**Parameters:**
- `sceneObject` (path) - Scene Object ID

**Request Body:**
```json
{
  "transform": {
    "position": {
      "x": 0.0,
      "y": 0.0,
      "z": 0.0
    },
    "rotation": {
      "x": 0.0,
      "y": 0.0,
      "z": 0.0
    }
  }
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Transform updated successfully",
  "data": {
    "id": "...",
    "transform": {...},
    ...
  }
}
```

**Error Response (500):**
```json
{
  "success": false,
  "message": "Failed to update transform: ..."
}
```

---

## Scene Object Poses

### GET /v1/scene-objects/{sceneObject}/poses

Get all poses for a scene object.

**Authentication:** Required

**Parameters:**
- `sceneObject` (path) - Scene Object ID

**Success Response (200):**
```json
{
  "success": true,
  "message": "Poses retrieved successfully",
  "data": [
    {
      "id": "uuid-here",
      "role": "Default",
      "position": {
        "x": 0.0,
        "y": 0.0,
        "z": 0.0
      },
      "rotation": {
        "x": 0.0,
        "y": 0.0,
        "z": 0.0
      }
    }
  ]
}
```

**Error Response (403):**
```json
{
  "success": false,
  "message": "Unauthorized access to scene object"
}
```

---

### POST /v1/scene-objects/{sceneObject}/poses

Add a new pose to a scene object.

**Authentication:** Required

**Parameters:**
- `sceneObject` (path) - Scene Object ID

**Request Body:**
```json
{
  "role": "Default",
  "position": {
    "x": 0.0,
    "y": 0.0,
    "z": 0.0
  },
  "rotation": {
    "x": 0.0,
    "y": 0.0,
    "z": 0.0
  }
}
```

**Validation:**
- `role`: Required, must be "Default" or "Default-HMD"
- `position`: Required object with numeric x, y, z values
- `rotation`: Required object with numeric x, y, z values

**Success Response (201):**
```json
{
  "success": true,
  "message": "Pose added successfully",
  "data": {
    "id": "uuid-here",
    "role": "Default",
    "position": {...},
    "rotation": {...}
  }
}
```

**Error Response (403):**
```json
{
  "success": false,
  "message": "Unauthorized access to scene object"
}
```

---

### PATCH /v1/scene-objects/{sceneObject}/poses/{uuid}

Update a specific pose by UUID.

**Authentication:** Required

**Parameters:**
- `sceneObject` (path) - Scene Object ID
- `uuid` (path) - Pose UUID

**Request Body (all fields optional):**
```json
{
  "role": "Default-HMD",
  "position": {
    "x": 1.0,
    "y": 2.0,
    "z": 3.0
  },
  "rotation": {
    "x": 0.0,
    "y": 90.0,
    "z": 0.0
  }
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Pose updated successfully",
  "data": {
    "id": "uuid-here",
    "role": "Default-HMD",
    "position": {...},
    "rotation": {...}
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Invalid UUID format"
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Pose not found with UUID ..."
}
```

---

### DELETE /v1/scene-objects/{sceneObject}/poses/{uuid}

Delete a specific pose by UUID.

**Authentication:** Required

**Parameters:**
- `sceneObject` (path) - Scene Object ID
- `uuid` (path) - Pose UUID

**Success Response (200):**
```json
{
  "success": true,
  "message": "Pose deleted successfully"
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Invalid UUID format"
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Pose not found with UUID ..."
}
```

---

## Error Responses

All endpoints may return the following error responses:

**401 Unauthorized:**
```json
{
  "message": "Unauthenticated."
}
```

**422 Validation Error:**
```json
{
  "message": "The given data was invalid.",
  "errors": {
    "field_name": [
      "Validation error message"
    ]
  }
}
```

**500 Internal Server Error:**
```json
{
  "success": false,
  "message": "Error details..."
}
```
