"""
Plugin to manage Elastic Search data index.
"""


from cherrypy.process import plugins
from webapp.libs.elastic import Elastic
from webapp.libs.models.book import Book, Page


__all__ = ["ElasticPlugin"]


class ElasticPlugin(plugins.SimplePlugin):

    def __init__(self, bus, protocol, host, port, index):
        self.es = Elastic(protocol, host, port, index)
        plugins.SimplePlugin.__init__(self, bus)

    def start(self):
        self.bus.log("Elastic search plugin started.")
        self.bus.subscribe("elastic-save", self.save)
        self.bus.subscribe("elastic-drop", self.drop)

    def stop(self):
        self.bus.log("Elastic search plugin stopped.")
        self.bus.unsubscribe("elastic-save", self.save)
        self.bus.unsubscribe("elastic-drop", self.drop)
        self.es.dispose()
        self.es = None

    def save(self, model):
        doc_type = doc_id = None
        r = 0
        if isinstance(model, Book):
            doc_type = "book"
            doc_id = model.book_id
        if doc_type and doc_id:
            if hasattr(model, "enabled") and not model.enabled:
                res = self.es.drop(doc_type, doc_id)
            else:
                res = self.es.save(doc_type, doc_id, "{}")

    def drop(self, model):
        doc_type = doc_id = None
        if isinstance(model, Book):
            doc_type = "book"
            doc_id = model.book_id
        if doc_type and doc_id:
            self.es.drop(doc_type, model.book_id)
