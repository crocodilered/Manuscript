import json
import cherrypy
import os
from webapp.libs.models.book import Page
from webapp.libs.model_serializer import ModelSerializer


@cherrypy.expose
class PageRest(object):

    @cherrypy.tools.json_out()
    def GET(self, **params):
        """
        Предоставление данных
        :param params: - dict с переданными параметрами 
        :return: возвращается массив словарей
        """
        r = None
        if "page_id" in params:
            # инфо об одной странице
            page = Page.get(cherrypy.request.sa, params["page_id"])
            r = ModelSerializer.dict(page)
            if page.parts:
                r["parts"] = []
                for i in page.parts:
                    r["parts"].append(ModelSerializer.dict(i))
        return r

    @cherrypy.tools.json_out()
    def PUT(self, **params):
        """
        Изменение данных в БД.
        Исходим из предположения, что page_id записи всегда остается неизменным,
        соотв. если в data приезжает значение [{page_id:5, title:'TITLE'}], действуем по схеме
        UPDATE title = 'TITLE' WHERE page_id=5
        :param params: - list of page-dict
        :return: dict с кодом ошибки:
            - 0: если все хорошо
            - 1: не переданы входные данные
        """
        r = {"error": 1}
        if "data" in params:
            data = json.loads(params["data"])
            if isinstance(data, list):
                session = cherrypy.request.sa
                for line in data:
                    if "page_id" in line:
                        page = Page.get(session, line["page_id"])
                        for col in page.__table__.columns:
                            # Это вместо перечисления всех полей руками. По-моему так круче )
                            if col.name != "page_id" and col.name in line:
                                setattr(page, col.name, line[col.name])
                        r["error"] = 0
        return r

    @cherrypy.tools.json_out()
    def DELETE(self, page_id, **params):
        r = {"error_code": 1}
        session = cherrypy.request.sa
        page = Page.get(session, page_id)
        if page:
            img_file_small = page.img_dir("s")
            img_file_medium = page.img_dir("m")
            img_file_large = page.img_dir("l")

            session.delete(page)
            session.flush()
            session.commit()

            # if runtime comes here it's safe to delete image files
            root_dir = cherrypy.request.app.config["/i/pages"]["tools.staticdir.dir"]

            file = os.path.join(root_dir, img_file_small)
            if os.path.isfile(file):
                os.remove(file)

            file = os.path.join(root_dir, img_file_medium)
            if os.path.isfile(file):
                os.remove(file)

            file = os.path.join(root_dir, img_file_large)
            if os.path.isfile(file):
                os.remove(file)

            r["error_code"] = 0
        return r
