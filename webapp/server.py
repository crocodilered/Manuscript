import os
import cherrypy

# from webapp.libs.plugins.elastic_plugin import ElasticPlugin
from webapp.libs.plugins.saplugin import SaPlugin
from webapp.libs.plugins.makoplugin import MakoTemplatePlugin
from webapp.libs.tools.makotool import MakoTool
from webapp.libs.tools.authtool import AuthTool
from webapp.libs.tools.satool import SaTool


def error_page(status, message, traceback, version):
    # TODO: Use mako templates.
    if cherrypy.response.status == 401:
        s = open('templates/errors/401.html', 'r', encoding='UTF-8').read()
        return s % (cherrypy.request.path_info, cherrypy.request.query_string)
    elif cherrypy.response.status == 404:
        return open('templates/errors/404.html', 'rb')


curr_dir = os.path.abspath(os.path.dirname(__file__))

cherrypy.tools.sa = SaTool()
cherrypy.tools.render = MakoTool()
cherrypy.tools.auth = AuthTool()

from webapp.controllers.app import App
from webapp.controllers.account import Account
from webapp.controllers.admin import Admin
from webapp.controllers.rest.root import RootRest
from webapp.controllers.rest.book import BookRest
from webapp.controllers.rest.page import PageRest
from webapp.controllers.rest.part import PartRest
from webapp.controllers.rest.upload import UploadRest

app = App()
app.admin = Admin()
app.account = Account()
app.rest = RootRest()
app.rest.book = BookRest()
app.rest.page = PageRest()
app.rest.part = PartRest()
app.rest.upload = UploadRest()

cherrypy.tree.mount(app, '/', os.path.join(curr_dir, 'conf', 'server.conf'))
cherrypy.config.update({'error_page.401': error_page})
cherrypy.config.update({'error_page.404': error_page})

MakoTemplatePlugin(
    cherrypy.engine,
    os.path.join(curr_dir, 'templates'),
    os.path.join(curr_dir, 'templates', '.cache')
).subscribe()

# TODO: remove SQL-access creds from code.
cherrypy.engine.sa = SaPlugin(cherrypy.engine, 'mysql://user:pwd@localhost:3306/manuscript?charset=utf8')
cherrypy.engine.sa.subscribe()

# Not required yet
# ElasticPlugin(cherrypy.engine, 'http', '127.0.0.1', '9200', 'manuscript').subscribe()

if __name__ == '__main__':
    # For dev purpose
    cherrypy.engine.start()
