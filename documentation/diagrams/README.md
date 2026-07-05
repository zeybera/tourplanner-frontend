# TourPlanner PlantUML Diagrams

This folder contains the PlantUML diagrams used for the TourPlanner project documentation.

## Included Diagrams

- `architecture.puml`  
  Shows the overall system architecture with Angular frontend, Spring Boot backend, PostgreSQL database, and OpenRouteService integration.

- `use-case.puml`  
  Shows the main user interactions, including authentication, tour management, tour logs, import/export, and map usage.

- `sequence-create-tour.puml`  
  Shows the flow for creating a tour, including geocoding, route calculation, backend persistence, and OpenRouteService communication.

- `sequence-tour-log-photo.puml`  
  Shows the flow for creating a tour log with an optional photo upload.

- `sequence-import-export.puml`  
  Shows the JSON/XML import and export flow between frontend, backend, mapper, and database.

## Rendering

The diagrams can be rendered with the PlantUML plugin in IntelliJ IDEA or exported as PNG/SVG files for inclusion in the written project protocol.
