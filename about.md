---
permalink: /about/
sitemap: false
---
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Redirecting to /</title>
  <meta name="robots" content="noindex">
  <link rel="canonical" href="{{ site.url }}{{ site.baseurl }}/">
  <meta http-equiv="refresh" content="0; url={{ site.baseurl }}/">
</head>
<body>
  <p>This page moved. Continuing to <a href="{{ site.baseurl }}/">/</a>.</p>
  <script>location.replace('{{ site.baseurl }}/');</script>
</body>
</html>
