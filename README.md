# Med Image Scanner App

[![Backend CI](https://github.com/suxrobgm/med-image-scanner/actions/workflows/backend-ci.yml/badge.svg)](https://github.com/suxrobgm/med-image-scanner/actions/workflows/backend-ci.yml)

Med Image Scanner is a web-based platform that allows healthcare providers to view and analyze medical images such as X-rays, CT scans, and MRIs. The platform provides tools to view images, annotate them, and perform image analysis using machine learning models. The platform is designed as a companion tool for radiologists and other healthcare providers to help them diagnose diseases. It uses the DICOM standard to retrieve and display medical images from healthcare providers’ Picture Archiving and Communication System (PACS) servers.

The monorepo for the Med Image Scanner app. It contains the following apps/services:

- [Frontend](./frontend/)
- [Backend](./backend/)
- [OHIF Viewer](./viewer/)
- [AI App](./ai/)


## How to run containers

1. Install Docker and Docker Compose. Follow the instructions [here](https://docs.docker.com/get-docker/) and [here](https://docs.docker.com/compose/install/).

2. Run the containers:

```bash
docker compose up
```

## Documentation

- Read about the project architecture here: [Architecture](./docs/architecture.md)
- Read on how to use the app here: [User Guide](./docs/user-guide.md)

## Sample Screenshots

![Dashboard](./docs/images/dashboard.jpg)
![Patient Page](./docs/images/patient-page-1.jpg)
![Viewer](./docs/images/patient-page-2.jpg)
![Report](./docs/images/report-page.jpg)
