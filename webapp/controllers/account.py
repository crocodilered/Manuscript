import cherrypy
from webapp.controllers.abstract_controller import AbstractController
from webapp.libs.models.user import User


__all__ = ['Account']


class Account(AbstractController):

    @cherrypy.expose
    @cherrypy.tools.render(template='account/index.html')
    @cherrypy.tools.auth()
    def index(self):
        return self.wrap_template_params()

    @cherrypy.expose
    @cherrypy.tools.render(template='account/update.html')
    @cherrypy.tools.auth()
    def update(self, **params):
        """
        :param params: Query parameters
        :return: error_code:
                    0: everything is okay
                    1: no data given
                    2: new password repeated wrong
                    3: current password is wrong
        """
        error_code = 0
        if cherrypy.request.method == "POST":
            error_code = 1
            if "title" in params:
                # update title
                user = self.get_logged_in_user()
                user.title = params["title"]
                error_code = 0
            if "password_curr" in params and params["password_curr"] or \
               "password_1" in params and params["password_1"] or \
               "password_2" in params and params["password_2"]:
                if params["password_1"] == params["password_2"]:
                    user = self.get_logged_in_user()
                    if cherrypy.tools.auth.match_password(params["password_curr"], user.password):
                        user.password = cherrypy.tools.auth.encode_password(params["password_1"])
                        error_code = 0
                    else:
                        error_code = 3
                else:
                    error_code = 2
        return self.wrap_template_params({
            "error_code": error_code
        })

    @cherrypy.expose
    @cherrypy.tools.render(template='account/login.html')
    def login(self, **params):
        if self.get_logged_in_user():
            raise cherrypy.HTTPRedirect("/account/")
        error_code = 0
        if cherrypy.request.method == "POST":
            email = params["email"]
            password = params["password"]
            if email and password:
                # TODO: отсюда вываливается куча значений error_code, как-то не прозрачно. Нужно сделать прозрачно.
                user = cherrypy.tools.auth.start_session(email, password)
                if user:
                    raise cherrypy.HTTPRedirect(params["from"] if "from" in params else "/account/")
                else:
                    error_code = 2
            else:
                error_code = 1
        return self.wrap_template_params({
            "error_code": error_code
        })

    @cherrypy.expose
    @cherrypy.tools.auth()
    def logout(self):
        cherrypy.tools.auth.drop_session()
        raise cherrypy.HTTPRedirect("/")

    @cherrypy.expose
    @cherrypy.tools.render(template='account/create.html')
    def create(self, **params):
        """
        Creates new account. error_code is
            0 - no errors
            1 - no params (must be email and password)
            2 - email duplicated (account existed)
        """
        if self.get_logged_in_user():
            raise cherrypy.HTTPRedirect("/account/")
        error_code = None
        if cherrypy.request.method == "POST":
            # need to create new account
            email = params["email"] if '@' in params["email"] and '.' in params["email"] else None
            password = str(params["password"])
            if email and password:
                session = cherrypy.request.sa
                # lets test email unique
                if not User.get_by_email(session, email):
                    # Lets create account
                    encoded_password = cherrypy.tools.auth.encode_password(password)
                    user = User(email, encoded_password)
                    session.add(user)
                    cherrypy.tools.auth.start_session(email, password)
                    error_code = 0
                else:
                    error_code = 2
            else:
                error_code = 1
        return self.wrap_template_params({
            "error_code": error_code
        })
