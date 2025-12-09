# Changelog

All notable changes to this project will be documented in this file.

## [v0.1.3] - 2025-10-22
### Added
- Frontend: Feature flag helper for dark mode (frontend/src/featureFlags.ts).
- Frontend: Public environment example files (e.g., frontend/.env.development.example).
- Backend: Updated environment example with required DATABASE_URL.
- Repository: Added/updated root and frontend .gitignore for security.

### Changed
- Updated package versions for both frontend and backend to v0.1.3.
- Renamed and moved frontend environment files to the secure *.example format.
- Frontend Dockerfile modified to avoid baking placeholder values into the image.

### Fixed
- CI: Resolved the critical local test failure by ensuring DATABASE_URL is available for backend tests.
- CI: Fixed Git tracking issue by adding exceptions to .gitignore rules for public example files.

### Removed
- (none)

## [v0.1.2] - 2025-10-21
### Added
- Changelog.md 
- Improved lint syntax

### Changed
- N/A

### Fixed
- N/A

### Removed
- N/A