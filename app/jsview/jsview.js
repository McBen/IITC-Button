function escapeHtml(text) {
  let map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };

  return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}

document.addEventListener('DOMContentLoaded', async function(){
  document.title = _('extName');
  document.getElementById('clickInstallPlugin').innerText = _('clickInstallPlugin');
  document.getElementById('install').innerText = _('install');
  document.getElementById('code').innerText = _('loading');

  let url = new URL(window.location.href).searchParams.get("url");

  let code = await ajaxGet(url);
  if (code) {
    let codeblock = document.getElementById("code");
		codeblock.innerHTML = escapeHtml(code);
    hljs.highlightBlock(codeblock);

    const meta = parse_meta(code);
    if (meta['id'] !== undefined && meta['name'] !== undefined) {

    	document.getElementById("addUserScript").classList.remove('hide');
    	document.getElementById("addUserScript-title").innerText = meta['name'];
    	const filename = url.substr(url.lastIndexOf("/") + 1);
			const btn_install = document.getElementById("install");
			btn_install.addEventListener("click", function () {

				let message = _("addedUserScript", filename)+"\n";
				meta['filename'] = filename;
				let script = [{'meta': meta, 'code': code}];

				alert(message);
				chrome.runtime.sendMessage({'type': "addUserScripts", 'scripts': script});
				document.getElementById("addUserScript").classList.add('hide');
			}, false)
		}

  } else {
    document.getElementById('code').innerText = _('addressNotAvailable');
  }
});