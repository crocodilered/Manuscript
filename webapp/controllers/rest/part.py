import json
import cherrypy
from webapp.libs.models.book import Part
from webapp.libs.model_serializer import ModelSerializer


@cherrypy.expose
class PartRest(object):

    @cherrypy.tools.json_out()
    def POST(self, page_id, **params):
        """
        Create new part with given page_id .
        :param page_id: page_id for new part.
        :param params: Data dict for new part.
        :return: Error code + data of new part.
        """
        r = {'error': 1}
        if page_id:
            session = cherrypy.request.sa
            part = Part()
            part.page_id = page_id
            session.add(part)
            session.flush()
            part.order_key = part.part_id
            r["data"] = ModelSerializer.dict(part)
            r["error"] = 0
        return r

    @cherrypy.tools.json_out()
    def PUT(self, **params):
        """
        Сохранение данных в БД. Исходим из предположения, что page_id записи всегда остается неизменным, соотв. если в 
        data приезжает значение [{page_id:5, title:'TITLE'}], действуем по схеме UPDATE title = 'TITLE' WHERE page_id=5
        :param params: - dict с переданными параметрами 
        :return: возвращается код ошибки (0, если все хорошо)
        """
        r = {"error": 1}
        if "data" in params:
            data = json.loads(params["data"])
            if isinstance(data, list):
                session = cherrypy.request.sa
                for line in data:
                    if "part_id" in line:
                        part = Part.get(session, line["part_id"])
                        for col in part.__table__.columns:
                            if col.name != "part_id" and col.name in line:
                                setattr(part, col.name, line[col.name])
                        r["error"] = 0
        return r

    @cherrypy.tools.json_out()
    def DELETE(self, part_id, **params):
        """
        Delete part with given part_id
        :param part_id: ID of part to delete.
        :return: Error code.
        """
        session = cherrypy.request.sa
        part = Part.get(session, part_id)
        session.delete(part)
        return {"error": 0}
