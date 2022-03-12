import joplin from 'api';
import { SettingItemType, ContentScriptType } from 'api/types';

// Settings
const SETTINGS_SECTION_NAME = 'JIRA_KEY_AUTO_LINK';
const SETTINGS_SECTION_LABEL = 'JIRA Key Auto Link';
const SETTINGS_SECTION_ICON  = 'fas fa-link';

const SETTINGS_JIRA_URL_NAME =  'JIRA_SERVER_URL';
const SETTINGS_JIRA_URL_DEFAULT_VALUE =  'https://PLEASE_INPUT_JIRA_SERVER_URL';
const SETTINGS_JIRA_URL_LABEL =  'JIRA Server URL';
const SETTINGS_JIRA_URL_DESCRIPTION =  'Please input an URL of JIRA server.';

// Content Script
const CONTENT_SCRIPT_JIRAAUTOLINK = 'jirakeyautolink';
const CONTENT_SCRIPT_COMMAND_GET_JIRA_SERVER_URL = 'GET_JIRA_SERVER_URL';

joplin.plugins.register({
	onStart: async() => {

		await joplin.contentScripts.register(
			ContentScriptType.MarkdownItPlugin,
			CONTENT_SCRIPT_JIRAAUTOLINK,
			'./jirakeyautolink_contentscript.js'
		);

		await joplin.settings.registerSection(SETTINGS_SECTION_NAME, {
			label: SETTINGS_SECTION_LABEL,
			iconName: SETTINGS_SECTION_ICON,
		});

		await joplin.settings.registerSettings({
			[SETTINGS_JIRA_URL_NAME]: {
				value: SETTINGS_JIRA_URL_DEFAULT_VALUE,
				type: SettingItemType.String,
				section: SETTINGS_SECTION_NAME,
				public: true,
				label: SETTINGS_JIRA_URL_LABEL,
				description: SETTINGS_JIRA_URL_DESCRIPTION, 
			},
		});

		await joplin.contentScripts.onMessage(CONTENT_SCRIPT_JIRAAUTOLINK, async(message) => {
			if(message === CONTENT_SCRIPT_COMMAND_GET_JIRA_SERVER_URL)
			{
				return await joplin.settings.value(SETTINGS_JIRA_URL_NAME);
			}
			else
			{
				return 'Unsupported Command';
			}
		});
	},
});
