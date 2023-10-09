function Page(title: string, elements: string[]): string {
  return `
    <!DOCTYPE html>
    <html><head><title>${title}</title></head>
    <body>${elements.join("\n")}</body></html>
  `
}

function Button(text: string, link: string, style: Style = Style.normal): string {
  return `<a href="${link}" class="btn-${style}">${text}</a>`
}

function Text(text: string, style: Style = Style.normal): string {
  return `<p class="text-${style}">${text}</p>`
}

function Space(size: number): string {
  return "<br>".repeat(size)
}

enum Style {
  normal = "normal",
  important = "important",
  secondary = "secondary",
}

export {
  Page,
  Button,
  Text,
  Space,
  Style,
}
