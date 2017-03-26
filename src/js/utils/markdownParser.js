export default class MarkdownParser {
  constructor(data) {
    this.data = data;
  }

  parse() {
    let markdown = '';
    markdown += this.parseOverviewInfo(this.data);
    markdown += this.parseTraceInfo(this.data);
    markdown += this.parseRequestInfo(this.data);
    markdown += this.parseClientInfo(this.data);

    return markdown;
  }

  title() {
    const { exception } = this.data.body.trace;
    return exception.description;
  }

  parseOverviewInfo(data) {

    const datetime = new Date(data.client.timestamp * 1000).toISOString();

    let result = '';
    result += `### Overview\n`;
    result += `- environment:\n`;
    result += `  - ${data.environment}\n`;
    result += `- level:\n`;
    result += `  - ${data.level}\n`;
    result += `- timestamp:\n`;
    result += `  - ${datetime}\n`;
    result += `- code version:\n`;
    result += `  - **${data.client.javascript.code_version}**\n`;
    result += `\n`;

    return result;
  }

  parseTraceInfo(data) {
    const { frames, exception } = data.body.trace;

    let result = '';
    result += `### Error trace\n`;
    result += '```\n';
    result += `${exception.description}\n`;

    frames.forEach((row, index) => {
      result += `    ${index}    File ${row.filename} line ${row.lineno} col ${row.colno} in ${row.method}\n`;
    });

    result += '```\n';
    result += `\n`;

    return result;
  }

  parseRequestInfo(data) {
    const { request } = data;

    let result = '';
    result += `### Request\n`;
    result += `- url:\n`;
    result += `  - ${request.url}\n`;
    result += `- query string:\n`;
    result += `  - ${request.query_string || 'none'}\n`;
    result += `\n`;

    return result;
  }

  parseClientInfo(data) {
    const { client } = data;

    let result = '';
    result += `### Client\n`;
    result += `- browser:\n`;
    result += `  - ${client.javascript.browser}\n`;
    result += `- language:\n`;
    result += `  - ${client.javascript.language}\n`;
    result += `- cookie enabled:\n`;
    result += `  - ${client.javascript.cookie_enabled}\n`;
    result += `- screen(width x height):\n`;
    result += `  - ${client.javascript.screen.width} x ${client.javascript.screen.height}\n`;
    result += `\n`;

    return result;
  }
}
