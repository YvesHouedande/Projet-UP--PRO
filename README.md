# API Documentation

## Migrations order: core_author, core_content, core_center

## Overview

This document provides a reference documentation for the API of our application. The API allows users to access and manipulate data related to students, professors, staff, and schools.

## Endpoints

### Content Management

- **General Posts:** `/api/general_post/` (GET, POST) with all specific informations
- **Filtered General Posts:** `/api/general_post/filter/` (GET, POST) ->administration or popular
- **Post Users:** `/api/post_user/` (GET, POST)
- **Post Services:** `/api/post_service/` (GET, POST)
- **Post Peers:** `/api/post_peer/` (GET, POST)
- **Events:** `/api/event/` (GET, POST)
- **Comments on General Posts:** `/api/general_post/{post_id}/comment/` (GET, POST)

### Author Management

- **Users:** `/api/user/` (GET, POST)
- **Students:** `/api/student/` (GET, POST)
- **Professors:** `/api/professor/` (GET, POST)
- **Personnel:** `/api/personnel/` (GET, POST)
- **Peers:** `/api/peer/` (GET, POST)
  - **Peer Positions:** `/api/peer/{peer_id}/position/` (GET, POST)
  - **Peer Students:** `/api/peer/{peer_id}/student/` (GET, POST)

### Service Data

- **Services:** `/api/service/` (GET, POST)
  - **Service Events:** `/api/service/{service_id}/event/` (GET, POST)

### Center Management

- **Schools:** `/api/school/` (GET, POST)
  - **School Students:** `/api/school/{school_id}/student/` (GET, POST)
  - **School Professors:** `/api/school/{school_id}/professor/` (GET, POST)
  - **School Personnel:** `/api/school/{school_id}/personnel/` (GET, POST)
  - **School Services:** `/api/school/{school_id}/service/` (GET, POST)
- **Studies:** `/api/study/` (GET, POST)
  - **Study Students:** `/api/study/{study_id}/student/` (GET, POST)
  - **Study Professors:** `/api/study/{study_id}/professor/` (GET, POST)
  - **Study Personnel:** `/api/study/{study_id}/personnel/` (GET, POST)

### search_management Management

- **search peerposition(firname, lastname, position):** `api/{peer_id}/position/?search={value} `
- **search user(firname, lastname):** `api/user/?search={value}`
- **search post(title, service\_\_label so...):** `api/general_post/?search={value}`

## Installation and Configuration

To install and run the API locally, follow these steps:

1. Clone this repository to your local machine.
2. Install the required dependencies by running `pip install -r requirements.txt`.
3. Start the server by running `python manage.py runserver`.

## Contributions

Contributions are welcome! To contribute to this project, please follow these steps:

1. Fork this repository.
2. Create a branch for your feature (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add an amazing feature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a pull request.

## Support

If you encounter any issues or have questions, please open a ticket in the [Issues](https://github.com/yourusername/yourproject/issues) section.
