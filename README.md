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
npm -w packages/console start
```

## Architecture

```
clean-architecture-template
├── core <--------------- Business Domain
│   ├── aggregates <----- Business objects
│   ├── commands <------- Creation, updates & deletions
│   ├── errors <--------- Business Errors
│   ├── facts <---------- Events
│   ├── queries <-------- Requests
│   ├── repositories <--- Interfaces for data persistence
│   └── services <------- Interfaces for side-effects
└── packages <----------- Implementations
    ├── adapters <------- Implementations for repositories & services
    └── console <-------- Example application in terminal
```