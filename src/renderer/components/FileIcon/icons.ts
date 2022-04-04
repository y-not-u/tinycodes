const maps = [
  {
    label: 'ABAP',
    value: 'abap',
    icon: 'file',
  },
  {
    label: 'Apex',
    value: 'apex',
    icon: 'file',
  },
  {
    label: 'Azure CLI',
    value: 'azcli',
  },
  {
    label: 'Batch',
    value: 'bat',
    icon: 'console',
  },
  {
    label: 'Cameligo',
    value: 'cameligo',
    icon: 'file',
  },
  {
    label: 'Clojure',
    value: 'clojure',
  },
  {
    label: 'CoffeeScript',
    value: 'coffeescript',
  },
  {
    label: 'C++',
    value: 'c',
  },
  {
    label: 'C#',
    value: 'csharp',
  },
  {
    label: 'CSP',
    value: 'csp',
  },
  {
    label: 'CSS',
    value: 'css',
  },
  {
    label: 'Dart',
    value: 'dart',
  },
  {
    label: 'Dockerfile',
    value: 'dockerfile',
    icon: 'docker',
  },
  {
    label: 'F#',
    value: 'fsharp',
  },
  {
    label: 'Go',
    value: 'go',
  },
  {
    label: 'GraphQL',
    value: 'graphql',
  },
  {
    label: 'Handlebars',
    value: 'handlebars',
  },
  {
    label: 'HTML',
    value: 'html',
  },
  {
    label: 'Ini',
    value: 'ini',
    icon: 'file',
  },
  {
    label: 'Java',
    value: 'java',
  },
  {
    label: 'JavaScript',
    value: 'javascript',
  },
  {
    label: 'JSON',
    value: 'json',
  },
  {
    label: 'Kotlin',
    value: 'kotlin',
  },
  {
    label: 'Less',
    value: 'less',
  },
  {
    label: 'Lua',
    value: 'lua',
  },
  {
    label: 'Markdown',
    value: 'markdown',
  },
  {
    label: 'MIPS',
    value: 'mips',
    icon: 'file',
  },
  {
    label: 'MSDAX',
    value: 'msdax',
    icon: 'file',
  },
  {
    label: 'MySQL',
    value: 'mysql',
  },
  {
    label: 'Objective-C',
    value: 'objective-c',
    icon: 'applescript',
  },
  {
    label: 'Pascal',
    value: 'pascal',
    icon: 'file',
  },
  {
    label: 'Pascaligo',
    value: 'pascaligo',
    icon: 'file',
  },
  {
    label: 'Perl',
    value: 'perl',
  },
  {
    label: 'PostgreSQL',
    value: 'pgsql',
    icon: 'database',
  },
  {
    label: 'PHP',
    value: 'php',
  },
  {
    label: 'ATS/Postiats',
    value: 'postiats',
    icon: 'file',
  },
  {
    label: 'Plain text',
    value: 'text',
    icon: 'document',
  },
  {
    label: 'Power Query',
    value: 'powerquery',
    icon: 'file',
  },
  {
    label: 'PowerShell',
    value: 'powershell',
  },
  {
    label: 'Pug',
    value: 'pug',
  },
  {
    label: 'Python',
    value: 'python',
  },
  {
    label: 'R',
    value: 'r',
  },
  {
    label: 'Razor',
    value: 'razor',
  },
  {
    label: 'Redis',
    value: 'redis',
    icon: 'database',
  },
  {
    label: 'Redshift',
    value: 'redshift',
    icon: 'file',
  },
  {
    label: 'Ruby',
    value: 'ruby',
  },
  {
    label: 'Rust',
    value: 'rust',
  },
  {
    label: 'Small Basic',
    value: 'sb',
    icon: 'console',
  },
  {
    label: 'Scheme',
    value: 'scheme',
    icon: 'file',
  },
  {
    label: 'Sass',
    value: 'scss',
  },
  {
    label: 'Shell',
    value: 'shell',
    icon: 'console',
  },
  {
    label: 'Solidity',
    value: 'sol',
    icon: 'file',
  },
  {
    label: 'Sophia',
    value: 'aes',
    icon: 'file',
  },
  {
    label: 'SQL',
    value: 'sql',
    icon: 'database',
  },
  {
    label: 'StructuredText',
    value: 'st',
    icon: 'file',
  },
  {
    label: 'Swift',
    value: 'swift',
  },
  {
    label: 'Tcl',
    value: 'tcl',
    icon: 'file',
  },
  {
    label: 'Twig',
    value: 'twig',
  },
  {
    label: 'TypeScript',
    value: 'typescript',
  },
  {
    label: 'Visual Basic',
    value: 'vb',
    icon: 'console',
  },
  {
    label: 'XML',
    value: 'xml',
  },
  {
    label: 'YAML',
    value: 'yaml',
  },
];

const mapLanguage = (lang: string) => {
  const found = maps.find((i) => i.value === lang);
  if (found) {
    return found.icon || found.value;
  }
  return lang;
};

export { mapLanguage };
export default maps;
