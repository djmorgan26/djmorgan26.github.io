# SETUP.md — Getting GitHub Pages Live

Step-by-step setup for `djmorgan26.github.io`. Follow in order.

## 1. Create the GitHub repo

Repo name must be **exactly** `djmorgan26.github.io` — that's what tells Pages to serve from the root.

- Visibility: **Public** (required for free Pages)
- Initialize with a README: skip (this bundle has its own files)

## 2. Initialize git locally and push

From inside the unzipped `djmorgan26.github.io/` directory:

```bash
git init
git add .
git commit -m "Initial site skeleton"
git branch -M main
git remote add origin https://github.com/djmorgan26/djmorgan26.github.io.git
git push -u origin main
```

## 3. Enable Pages

In the GitHub repo settings:
- Go to **Settings → Pages**
- Source: **Deploy from a branch**
- Branch: **main** / **/ (root)**
- Save

Within ~1–2 minutes the site will be live at `https://djmorgan26.github.io`. Refresh and confirm.

### Deploy trigger behavior (locked policy)

This setup means **the only thing that triggers a redeploy is a push or merged PR to `main`.** Specifically:

- Push to `main` → **redeploys**
- PR merged into `main` → **redeploys** (the merge commit triggers it)
- Push to any other branch (`stage`, `dev`, `feature/*`, etc.) → **does not deploy**
- Open PR (not yet merged) → **does not deploy**
- Manually re-running a previous deploy from the Actions tab → redeploys, but only useful if you need to retry a failed build

This is the desired behavior. The mental model is simple: **anything on `main` is live; nothing else is.** Use other branches freely for in-progress work.

If David ever wants preview deploys (e.g., a draft hosted at a temporary URL before merging), that requires migrating to "GitHub Actions" as the Pages source and adding a workflow. Don't do this without an explicit request — the current setup is intentionally minimal.

## 4. Local development (optional but recommended)

If David wants to preview before pushing:

```bash
# Install Jekyll if not already installed
gem install bundler jekyll

# Inside the project directory
bundle install
bundle exec jekyll serve

# Site previews at http://localhost:4000
```

If `bundle install` fails on Ruby version mismatch, install `rbenv` and use Ruby 3.1+.

## 5. Custom domain (deferred — staying on default for now)

**Default decision (May 2026): stick with `djmorgan26.github.io`.** It's free, immediately functional, and reads as legitimate on a resume. Frontier-lab recruiters click GitHub-hosted personal sites all the time. No reason to spend money or time on a custom domain before the site has shipped content.

If David ever wants to migrate to a custom domain later:

1. Buy the domain at Namecheap, Cloudflare Registrar, or similar (~$10-15/year)
2. In the repo settings → Pages → Custom domain → enter the domain
3. At the registrar, add a CNAME record pointing to `djmorgan26.github.io`
4. Wait for DNS propagation (~minutes to hours)
5. Enable HTTPS in Pages settings once cert provisions

The migration is one DNS change and one settings update. Nothing in the repo needs to change. So defer this decision until David actually wants it.

## 6. Shipping Post 1

When Post 1 is ready to publish:

```bash
# Rename and move the draft into _posts/
# Jekyll requires the format YYYY-MM-DD-slug.md
mv _drafts/post1-the-bottleneck-has-moved.md _posts/2026-05-25-the-bottleneck-has-moved.md

# Verify front matter is present at the top (it should already be there)
head -10 _posts/2026-05-25-the-bottleneck-has-moved.md

# Commit and push
git add .
git commit -m "Publish: The bottleneck has moved"
git push
```

The post will be live within ~1 minute at `https://djmorgan26.github.io/2026/05/25/the-bottleneck-has-moved.html`.

## 7. After Post 1 ships

- Update David's resume header URL to point to the blog
- Update his GitHub profile README to link the blog
- Begin drafting Post 2

## Notes

- **Don't auto-push the first commit.** Show David the local repo state, confirm he's happy, then push.
- **Don't enable Pages until the first commit is on `main`.** Pages won't have anything to deploy.
- **The Pages build can take 1–10 minutes the very first time.** Be patient.
- **If the site shows a 404 after pushing, check Pages settings.** Most common cause: branch or folder set wrong.
