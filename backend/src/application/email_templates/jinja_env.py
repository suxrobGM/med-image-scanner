from jinja2 import Environment, FileSystemLoader, select_autoescape

JINJA_ENV = Environment(
    loader=FileSystemLoader("src/application/email_templates"),
    autoescape=select_autoescape(["html", "xml"])
)
