import cherrypy
from webapp.libs.models.user import User


@cherrypy.expose
class RootRest(object):

    @cherrypy.tools.json_out()
    def GET(self):
        return {}
