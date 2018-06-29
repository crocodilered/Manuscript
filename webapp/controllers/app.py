import cherrypy
from webapp.controllers.abstract_controller import AbstractController
from webapp.libs.models.book import Book, Page, Part


__all__ = ['App']


class App(AbstractController):

    @cherrypy.expose
    @cherrypy.tools.render(template='app/index.html')
    def index(self):
        session = cherrypy.request.sa
        books = Book.list(session, enabled=True)
        return self.wrap_template_params({
            "books": books
        })

    @cherrypy.expose
    @cherrypy.tools.render(template="app/book.html")
    def book(self, book_id, page_id=0):
        """
        Обрабатываем и @book и @page, т.к. см. выше
        """
        session = cherrypy.request.sa
        book = Book.get(session, book_id)
        page = Page.get(session, page_id) if page_id else None
        # parts = Part.get(session, page_id) if page else None
        # parts передаются через REST, поскольку координаты, являющиеся частью
        # этих записей, зависимы от мастаба окна клиента.
        return self.wrap_template_params({
            "book": book,
            "page": page
        })
