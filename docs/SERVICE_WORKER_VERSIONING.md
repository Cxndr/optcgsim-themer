# Automatic Service Worker Versioning

This project uses an automatic service worker versioning system to ensure users always receive the latest updates without manual cache busting.

## How It Works

### Build-Time Generation
- Service worker is generated automatically during build via `prebuild` script
- Uses Vercel's `VERCEL_GIT_COMMIT_SHA` for unique versioning in production
- Falls back to timestamp-based versioning in development

### Cache Names
Each deployment gets unique cache names:
```
optcg-themer-{version}
optcg-static-{version}
optcg-images-{version}
optcg-api-{version}
```

### Version Sources
1. **Production (Vercel)**: Uses first 8 characters of Git commit SHA
2. **Development**: Uses timestamp converted to base36

## Scripts

### `npm run generate-sw`
Manually generate service worker with current version

### `npm run prebuild` (automatic)
Runs before `npm run build` to ensure fresh service worker

## Files

- `scripts/generate-sw.js` - Generator script
- `public/sw.js` - Generated service worker (auto-generated, commit to repo)

## Deployment Process

1. Make code changes
2. Commit to Git
3. Deploy to Vercel
4. Vercel automatically:
   - Runs `prebuild` script
   - Generates service worker with commit SHA
   - Builds and deploys with unique cache names

## Benefits

- ✅ **Zero manual work** - No more version bumping
- ✅ **Guaranteed cache busting** - Every deploy gets unique caches
- ✅ **Automatic cleanup** - Old caches are automatically purged
- ✅ **Git-based versioning** - Version tied to actual code changes

## Environment Variables Used

- `VERCEL_GIT_COMMIT_SHA` - Provided automatically by Vercel
- Fallback: `Date.now().toString(36)` for local development

## Example Generated Cache Names

### Production
```
optcg-themer-a1b2c3d4
optcg-static-a1b2c3d4
optcg-images-a1b2c3d4
optcg-api-a1b2c3d4
```

### Development
```
optcg-themer-l8k2m9n1
optcg-static-l8k2m9n1
optcg-images-l8k2m9n1
optcg-api-l8k2m9n1
``` 