# Publishing Library to NPM

Publish a new patch or minor version of the library package to npm using npm scripts or GitHub Actions.

Alpha prerelease versions (e.g., 4.0.3-alpha.0) are created with prepatch or preminor, later updated to stable (e.g., 4.0.3 or 4.1.0).

## Version Increments

- **Patch:** 4.0.2 → 4.0.3-alpha.0 → 4.0.3 (bug fixes)
- **Minor:** 4.0.2 → 4.1.0-alpha.0 → 4.1.0 (new features)

## Local Publishing

Run from the monorepo root:

```bash
npm run publish:library:patch  # For patch (scripts/publish-library-patch.sh)
npm run publish:library:minor  # For minor (scripts/publish-library-minor.sh)
```

## GitHub Actions

Trigger the Publish Library Patch Version workflow (`.github/workflows/publish-library-patch.yml`) in GitHub Actions.

Same as local script but automated.

There is also workflow for minor version bump.

### Requirements

- **NPM_TOKEN** in repository secrets
- Currently temporarily classic token from npm is used

## Notes

- Alpha versions are for testing; update to stable after PR approval
- Make sure all tests pass before publishing
- Follow semantic versioning guidelines
