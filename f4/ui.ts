type BootswatchThemes =
  | 'default'
  | 'cerulean'
  | 'cosmo'
  | 'cyborg'
  | 'darkly'
  | 'flatly'
  | 'journal'
  | 'litera'
  | 'lumen'
  | 'lux'
  | 'materia'
  | 'minty'
  | 'morph'
  | 'pulse'
  | 'quartz'
  | 'sandstone'
  | 'simplex'
  | 'sketchy'
  | 'slate'
  | 'solar'
  | 'spacelab'
  | 'superhero'
  | 'united'
  | 'vapor'
  | 'yeti'
  | 'zephyr'

const bootstrapDefault =
  '<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous">'
const getBootswatchTheme = (theme: BootswatchThemes) =>
  `<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bootswatch/5.3.2/${theme}/bootstrap.min.css" crossorigin="anonymous" referrerpolicy="no-referrer" />`

function Page(title: string, elements: string[], theme: BootswatchThemes = 'default'): string {
  return `
    <!DOCTYPE html>
    <html><head><title>${title}</title>${theme === 'default' ? bootstrapDefault : getBootswatchTheme(theme)}
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-C6RzsynM9kWDrMNeT87bh95OGNyZPhcTNXj1NW7RuBCsyN/o0jlpcV8Qyq46cDfL" crossorigin="anonymous"></script>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <h1 class="display-1" style="font-weight: 400; font-size: 4.5rem">${title}</h1>
    <body style="text-align: center;">${elements.join('\n')}</body></html>
    <style>
      body {
        text-align: center;
      }
    </style>
  `
}

function Button(text: string, link: string, style: Style = Style.normal): string {
  return `<a href="${link}" class="btn btn-lg btn-outline-primary">${text}</a>`
}

function Buttons(buttons: string[]) {
  return `
      <div class="btn-group" role="group">
      ${buttons.join('\n')}
      </div>
      `
}

function Text(text: string, style: Style = Style.normal): string {
  return `<p class="text-${style}">${text}</p>`
}

function Heading(text: string, style: Style = Style.normal): string {
  return `<h1 class="text-${style}" style="te">${text}</h1>`
}

function Space(size: number = 1): string {
  return '<br>'.repeat(size)
}

function Alert(text: string, style: Style = Style.normal): string {
  return `<div class="alert alert-success" role="alert">${text}</div>`
}

function Form(link: string, elements: string[], method: 'GET' | 'POST' = 'POST'): string {
  return `<form action="${link}" method="${method}">${elements.join('\n')}</form>`
}

function Input(
  name: string,
  options: { type?: 'text' | 'password' | 'email' | 'number'; value?: string; placeholder?: string; style?: Style },
): string {
  return `<input class="form-control-lg" type="${options.type ?? 'text'}" value="${
    options.value ?? ''
  }" name="${name}" style="text-align: center;" placeholder="${options.placeholder ?? ''}" />`
}

function Select(name: string, options: string[]): string {
  return `<select class="form-control-lg" name="${name}">${options.join('\n')}</select>`
}

function Option(text: string, value: string): string {
  return `<option value="${value}">${text}</option>`
}

function Submit(text: string, style: Style = Style.normal): string {
  return `<button class="btn btn-lg btn-outline-success" type="submit">${text}</button>`
}

enum Style {
  normal = 'normal',
  important = 'important',
  secondary = 'secondary',
}

export { Page, Button, Text, Space, Style, Heading, Buttons, Form, Input, Alert, Select, Option, Submit }
