# Loggy V909 full source bundle

This bundle restores the project code state from the V909 recorder point in this conversation, rather than the later V910-V915 recorder experiments.

The recorder files are the V909 versions:
- loggy-screen-recorder.js
- loggy-recorder-host.html
- template.html

`loggy-screen-recorder.css` is the active CSS inherited by V909 from the preceding recorder build because V909 did not change that file.

The bundle also includes the surrounding Loggy source available in this session: dashboard/server, template core and extras, numbered-layout hotfix, graph, mentions, template catalog, widgets runtime/loader, and YouTube setup documentation.

It intentionally excludes personal databases, recordings, OAuth secrets, `.env`, `.loggy-private`, and user data.
