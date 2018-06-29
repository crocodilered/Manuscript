import cherrypy
from webapp.controllers.abstract_controller import AbstractController
from webapp.libs.models.book import Book, Page


class Admin(AbstractController):

    @cherrypy.expose
    @cherrypy.tools.auth()
    @cherrypy.tools.render(template="admin/index.html")
    def index(self):
        """
        Show users"s books
        """
        books = Book.list(cherrypy.request.sa, self.get_logged_in_user().user_id)
        return self.wrap_template_params({"books": books})

    @cherrypy.expose
    @cherrypy.tools.auth()
    @cherrypy.tools.render(template="admin/book.html")
    def book(self, book_id=0, **params):
        """
        CRUD for Book model
        """
        account = self.get_logged_in_user()
        session = cherrypy.request.sa

        if book_id:
            book = Book.get(session, book_id)
            if book.user_id != account.user_id:
                raise cherrypy.HTTPError(401, "Unauthorized")
        else:
            book = Book(account.user_id)

        if cherrypy.request.method == "POST" and "cmd_delete" not in params:
            # Create or update the Book
            book.title = params["title"]
            book.author = params["author"]
            book.description = params["description"]
            book.enabled = ("enabled" in params)
            if not book.book_id:
                session.add(book)
                session.flush()
            cherrypy.engine.publish("elastic-save", book)
            raise cherrypy.HTTPRedirect("?book_id=%s" % book.book_id)

        if cherrypy.request.method == "POST" and "cmd_delete" in params:
            # delete the Book
            # TODO Delete parts, images etc.
            session.delete(book)
            cherrypy.engine.publish("elastic-drop", book)
            raise cherrypy.HTTPRedirect(".")

        return self.wrap_template_params({"book": book})

    @cherrypy.expose
    @cherrypy.tools.auth()
    @cherrypy.tools.render(template="admin/pages.html")
    def pages(self, book_id):
        """
        Pages of given book
        :param book_id:
        :return:
        """
        book = Book.get(cherrypy.request.sa, book_id) if book_id else None
        return self.wrap_template_params({
            "book": book
        })

    @cherrypy.expose
    @cherrypy.tools.auth()
    @cherrypy.tools.render(template="admin/page.html")
    def page(self, page_id):
        """
        Фрагменты страницы
        :param page_id:
        :return:
        """
        session = cherrypy.request.sa
        page = Page.get(session, page_id)
        book = Book.get(session, page.book_id)
        return self.wrap_template_params({
            "book": book,
            "page": page
        })

    @cherrypy.expose
    @cherrypy.tools.auth()
    @cherrypy.tools.render(template="admin/upload.html")
    def upload(self, book_id):
        book = Book.get(cherrypy.request.sa, book_id) if book_id else None
        return self.wrap_template_params({"book": book})
