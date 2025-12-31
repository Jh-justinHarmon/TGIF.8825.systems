# TGIF Hub Deployment Plan

## Goal
Deploy TGIF.8825.systems to Fly.io and verify it's accessible at production URL.

## Current State
- ✅ Code committed and pushed to GitHub
- ✅ Fly.toml configured (app: tgif-8825-systems)
- ✅ Dockerfile created
- ✅ GitHub Actions workflow ready
- ❌ Fly app not created yet
- ❌ GitHub secret FLY_API_TOKEN not set
- ❌ Not deployed

## Phases

### Phase 1: Create Fly App (automated)
**Tasks:**
1. Run `flyctl apps create tgif-8825-systems --org personal`
2. Verify app created with `flyctl apps list | grep tgif`

**Success Criteria:**
- App `tgif-8825-systems` appears in Fly.io dashboard
- No errors during creation

**Automation Level:** automated

### Phase 2: Deploy to Fly (automated)
**Tasks:**
1. Run `flyctl deploy --remote-only` from repo root
2. Wait for build to complete
3. Verify deployment succeeded

**Success Criteria:**
- Build completes without errors
- App shows as "deployed" in Fly.io
- Health check passes

**Automation Level:** automated

### Phase 3: Verify Production Access (assisted)
**Tasks:**
1. Check app URL: `https://tgif-8825-systems.fly.dev`
2. Verify dashboard loads
3. Check `/api/stats` endpoint returns data
4. Verify brain proxy endpoints respond (may 503 if brain not running, that's OK)

**Success Criteria:**
- Dashboard UI loads
- API endpoints respond
- No 500 errors

**Automation Level:** assisted

### Phase 4: Set GitHub Secret (manual)
**Tasks:**
1. Get Fly API token: `flyctl auth token`
2. Go to GitHub repo Settings → Secrets → Actions
3. Add secret: `FLY_API_TOKEN` = <token>
4. Trigger workflow by pushing a small change or manual trigger

**Success Criteria:**
- Secret added to GitHub
- Workflow runs successfully on next push

**Automation Level:** manual

## Notes
- Phase 4 is manual because we don't handle GitHub secrets programmatically
- Brain proxy endpoints will return 503 until tgif-brain is deployed (expected)
- DNS setup (tgif.8825.systems → Fly app) can be done later via Cloudflare
