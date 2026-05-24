# djmorgan26.github.io

Personal site for David Morgan. Live at [djmorgan26.github.io](https://djmorgan26.github.io).

Built with Jekyll. Posts live in `_posts/`, drafts in `_drafts/`.

## Local preview

```bash
bundle install
bundle exec jekyll serve
# Site at http://localhost:4000
```

## Publishing a post

Move from `_drafts/` to `_posts/` with the filename format `YYYY-MM-DD-slug.md`:

```bash
mv _drafts/some-post.md _posts/2026-05-25-some-post.md
git add . && git commit -m "Publish: some post" && git push
```

Pages rebuilds automatically within ~1 minute.
