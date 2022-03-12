const JIRA_KEY_REGEX = /([A-Z][A-Z0-9]+-[0-9]+)/g;
const CONTENT_SCRIPT_COMMAND_GET_JIRA_SERVER_URL = 'GET_JIRA_SERVER_URL';
const REPLACED_MARKER_ATTRIBUTE = 'jira_key_auto_link_replaced_marker'

export default (context) => { 
	return {
		plugin: (markdownIt, _options) => {
			const defaultRender = markdownIt.renderer.rules.text || ((tokens, idx, options, env, self) => {
				return self.renderToken(tokens, idx, options, env, self);
			});

			markdownIt.renderer.rules.text = (tokens, idx, options, env, self) => {
                const embeddedScript = `
                    (async() => {
                        const jiraServerUrl = await webviewApi.postMessage('${context.contentScriptId}', '${CONTENT_SCRIPT_COMMAND_GET_JIRA_SERVER_URL}');
                        this.href = jiraServerUrl + '/' + '$&';
                        if(!this.hasAttribute('${REPLACED_MARKER_ATTRIBUTE}'))
                        {
                            this.setAttribute('${REPLACED_MARKER_ATTRIBUTE}', '');
                            this.click();
                        }
                    })();
                `.replace(/\n/g, ' ');

                const replaceText = `<a href="#" onclick="${embeddedScript}">$&</a>`

                return defaultRender(tokens, idx, options, env, self)
                    .replaceAll(
                        JIRA_KEY_REGEX,
                        replaceText);
			};
		},

		assets: () => [],
	}
}
