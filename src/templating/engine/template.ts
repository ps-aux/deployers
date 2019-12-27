import Handlebars from 'handlebars'

export const template = (templateContent: string, data: any) => {
    const tmpl = Handlebars.compile(templateContent, {
        strict: true
    })

    return tmpl(data)
}
