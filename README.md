# clean-architecture-template

Clean Architecture, Event Sourcing & CQRS implementation using TypeScript for Node.js

## Requirements

- Node.js

## Installation

```bash
npm i
```

## Usage

### Console

```bash
npm -w apps/console start
```

## Architecture

```
.
├── apps <----------------- Applications
│   └── console <---------- Example application in terminal
└── packages
    ├── adapters <--------- Implementations for repositories & services
    │   ├── repositories <--- Data persistence implementations
    │   │   └── memory <----- In-memory persistence
    │   └── services <------- Side-effects implementations
    │       ├── bcrypt <----- Password hashing service
    │       └── console <---- Notification service for terminal
    ├── core <--------------- Business Domain
    │   ├── aggregates <----- Business objects
    │   ├── commands <------- Creation, updates & deletions
    │   ├── errors <--------- Business Errors
    │   ├── facts <---------- Events
    │   ├── queries <-------- Requests
    │   ├── repositories <--- Interfaces for data persistence
    │   ├── request <-------- Request DTOs
    │   ├── response <------- Response DTOs
    │   └── services <------- Interfaces for side-effects
    └── library <------------ Shared code
```