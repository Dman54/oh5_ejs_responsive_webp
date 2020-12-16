<h1>OptimizedHTML 5</h1>
Основано на https://github.com/agragregra/oh5
Добавлен ejs, json
ejs example
<% detesct = ['1',1,'3',false] %>
<% detesct.forEach( (d) => { -%>
  <p><%= d %></p>
<% }); -%>

Добавлена пакетная обработка картинок с конвертирвоанием в webp и сжатием в размеры.
image sizes:
[0, 1200, 992, 768, 576, 414]
Планируется добавить 2x качество картинок

<!-- add this! -->
<!-- examples/image-extralarge@2x.webp 2x -->

С WEBP могут быть проблемы, тогда
download and setup imagemagick for image resizing
https://imagemagick.org/script/download.php#windows

npm install webp-converter@2.2.3 --save-dev

Добавлены миксин и шаблон для адаптивных изображений

<!-- 
<ol>
	<li>Git clone or <a href="https://github.com/agragregra/OptimizedHTML-5/archive/master.zip">Download</a> <strong>OptimizedHTML 5</strong> from GitHub</li>
	<li>Install Node Modules: <strong>npm i</strong></li>
	<li>Run: <strong>gulp</strong></li>
</ol>

<h2>Main Gulp tasks:</h2>

<ul>
	<li><strong title="gulp task"><em>gulp</em></strong>: run default gulp task (browsersync, html, assets, styles, scripts, images, cleanimg, cleandist, deploy, default, build)</li>
	<li><strong title="cleanimg task"><em>cleanimg</em></strong>: Clean all compressed images</li>
	<li><strong title="deploy task"><em>rsync</em></strong>: project deployment via <strong>RSYNC</strong></li>
</ul>

<h2>Basic rules</h2>

<ol>
	<li>All custom <strong title="scripts task"><em>scripts</em></strong> located in <strong>app/js/app.js</strong></li>
	<li>All custom <strong title="styles task"><em>styles</em></strong> located in <strong>app/{preprocessor}/main.sass|scss|less|styl</strong></li>
	<li>All preprocessor <strong>configs</strong> placed in <strong>app/{preprocessor}/_config.sass|scss|less|styl</strong></li>
	<li>You can <strong>delete folders</strong> of other preprocessors before work.</li>
	<li>All <strong>images</strong> sources placed in <strong>app/images/src/</strong> folder.</li>
</ol>

<h2>Included features</h2>

<ol>
	<li><a href="https://getbootstrap.com/docs/4.0/content/reboot/">bootstrap-reboot</a> - Bootstrap Reboot CSS collection</li>
	<li>
		<a href="https://getbootstrap.com/docs/4.0/layout/overview/#responsive-breakpoints">_breakpoints.scss</a> - Bootstrap Breakpoints mixin (available only for sass and scss)</li>
		<li><a href="https://getbootstrap.com/docs/4.0/layout/grid/">bootstrap-grid</a> (optional) - Bootstrap Grid collection</li>
</ol>

<h2>Caching</h2>

<p>Rename <strong>ht.access</strong> to <strong>.htaccess</strong> before place it in your web server. This file contain rules for htaccess resources caching.</p>

<h2>Helpers</h2>

<h3>font-weight helper</h3>

<ul>
	<li><strong>100</strong> - Extra Light or Ultra Light</li>
	<li><strong>200</strong> - Light or Thin</li>
	<li><strong>300</strong> - Book or Demi</li>
	<li><strong>400</strong> - Regular or Normal</li>
	<li><strong>500</strong> - Medium</li>
	<li><strong>600</strong> - Semibold or Demibold</li>
	<li><strong>700</strong> - Bold</li>
	<li><strong>800</strong> - Black or Extra Bold or Heavy</li>
	<li><strong>900</strong> - Extra Black or Fat or Ultra Blac</li>
</ul>
 -->