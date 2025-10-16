# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Start development server**: `npm start` or `ng serve` - Runs at http://localhost:4200
- **Build for production**: `npm run build` or `ng build`
- **Build for development**: `npm run watch` or `ng build --watch --configuration development`
- **Run tests**: `npm test` or `ng test`
- **Generate components**: `ng generate component component-name`
- **Generate services/pipes/etc**: `ng generate directive|pipe|service|class|guard|interface|enum|module`

## Project Architecture

### Technology Stack
- **Angular 13.3.0** - Primary framework
- **CoreUI 4.0.2** - UI component library and admin template
- **SCSS** - Styling with CoreUI theming
- **Node.js 14.15+ or 16.10+** - Runtime requirement

### Application Structure

This is a lottery management system (Lottery System v4.0.2) built on the CoreUI Angular admin template. The application follows a modular architecture with role-based access control.

#### Directory Structure
- `src/app/views/` - Main application views organized by functional areas:
  - `Companies/` - Company management (groups, branches, users, vendors)
  - `G-Lottery/` - Lottery operations (tickets, void management, limits)
  - `G-Recharges/` - Recharge and invoice management
  - `G-Office/` - Office operations (payments, collections, limits)
  - `R-Lottery/`, `R-Others/`, `R-Office/` - Various reporting modules
  - `Master/` - System master data (lotteries, roles, positions)
  - `supervision/` - Monitoring and supervision tools
  - `login/` - Authentication
  - `default/` - Layout components

- `src/_nav.ts` - Dynamic navigation configuration based on user roles
- `src/app/services/` - Business logic and API communication
- `src/environments/` - Environment configurations

#### Key Services
- **MasterService** (`src/app/services/master.service.ts`) - Central service for:
  - API communication with backend
  - Master data management (groups, branches, users, vendors, lotteries)
  - Authentication and authorization
  - Date utilities and business logic
  - Role-based access control

#### Role-Based Access Control
The application implements a sophisticated role system:
- **Admin** (`aiDMimesN`) - Full system access
- **Office** (`oberFimesCimesNai`) - Office operations access  
- **Supervisor** (`SufatPenterRVimesSoberR`) - Supervision access

Navigation and features are dynamically shown/hidden based on user roles through localStorage.

#### Authentication Flow
- Login redirects to `/login` component
- Successful authentication stores session data in localStorage
- `MasterService.canActivate()` guards protected routes
- Session token stored as `AUTH_TOKEN` in request headers

#### API Integration
- Backend API integration through `UrlApiService`
- Default development API: `http://localhost:3000/`
- Uses HTTP interceptors with retry logic and error handling
- Master data is cached in service for performance

#### Styling & UI
- Built on CoreUI Angular components
- SCSS compilation from `src/scss/styles.scss`
- Hash-based routing strategy
- Responsive design with mobile support

### Development Guidelines

#### Component Patterns
- Components follow CoreUI patterns and styling
- Use `MasterService` for data access and business logic
- Implement proper error handling with retry mechanisms
- Follow existing naming conventions (kebab-case for components)

#### Data Management
- Master data is loaded and cached in `MasterService` constructor
- Use service methods like `theGroup()`, `theBranch()`, `theUser()` for lookups
- Refresh cached data using reset methods (`theGroupReset()`, etc.)

#### Routing
- All routes are defined in `app-routing.module.ts`
- Protected routes use default layout with navigation
- Role-based route guards implemented in navigation logic

#### Exports & Reporting
- Excel export functionality via `ExcelService`
- PDF generation support with jsPDF and jsPDF-autotable
- CSV export capabilities with ngx-csv
- Date handling with Moment.js

## Environment Configuration

Development environment connects to `http://localhost:3000/`. Update `src/environments/environment.ts` for different backend endpoints.

Production builds use `environment.prod.ts` via Angular file replacement configuration.