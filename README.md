# timmeier.io
personal website

## to dev:

get eleventy watching and serving:

`npx @11ty/eleventy --serve`


## to deploy:

server-side site location under nginx: `/var/www/timmeier.io/html`

make sure to clone repo to `/html` and not default directory (`/timmeier.io/`) (this is legacy from being lazy to take out bits of previous site)

nginx site config location: `/etc/nginx/sites-available/timmeier.io`
