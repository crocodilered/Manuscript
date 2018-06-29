from elasticsearch import Elasticsearch, RequestError


__all__ = ["Elastic"]


class Elastic(object):

    def __init__(self, protocol, host, port, index):
        self.index = index
        self.es = Elasticsearch("%s://%s:%s" % (protocol, host, port))

    def save(self, doc_type, id, body):
        """Add/update info in current index"""
        try:
            res = self.es.index(index=self.index, doc_type=doc_type, id=id, body=body)
        except RequestError:
            a = 1
            pass
        return res

    def drop(self, doc_type, id):
        """Delete info from current index"""
        res = self.es.delete(index=self.index, doc_type=doc_type, id=id)
        return res

    def search(self, doc_type, body):
        """Search info from current index"""
        # TODO: Доделать
        res = self.es.search(self.index, doc_type=doc_type, body=body)
        return res
