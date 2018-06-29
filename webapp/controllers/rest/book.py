import cherrypy
from webapp.libs.model_serializer import ModelSerializer
from webapp.libs.models.book import Book


__all__ = ["BookRest"]


@cherrypy.expose
class BookRest(object):

    @cherrypy.tools.json_out()
    def GET(self, book_id, has_to_be_enabled=True, **params):
        r = {}
        if book_id:
            if has_to_be_enabled:
                # load only enabled data
                book = Book.get(cherrypy.request.sa, book_id)
                if book.enabled:
                    r = ModelSerializer.dict(book)
                    if "load_complete" in params and book.pages:
                        r["pages"] = []
                        for i in book.pages:
                            if i.enabled:
                                r["pages"].append(ModelSerializer.dict(i))
            else:
                # load everything
                book = Book.get(cherrypy.request.sa, book_id)
                r = ModelSerializer.dict(book)
                if "load_complete" in params and book.pages:
                    r["pages"] = []
                    for i in book.pages:
                        r["pages"].append(ModelSerializer.dict(i))
        return r
