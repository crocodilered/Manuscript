import cherrypy
import os
from PIL import Image
import webapp.libs.utils as utils
from webapp.libs.models.book import Page


@cherrypy.expose
class UploadRest(object):
    @cherrypy.tools.auth()
    @cherrypy.tools.json_out()
    def POST(self, book_id, **params):
        """
        Uploads page image
        :book_id
        :params
            book_id
            qquuid
            qqfilename
            qqtotalfilesize
            qqfile
        :return:
        """
        r = {"success": False}
        if book_id and "qqfile" in params and params["qqfile"]:
            # Save temporary file
            temp_file = os.path.join(self._get_pages_dir(), "_temp", params["qquuid"])
            with open(temp_file, "wb") as fi:
                fi.write(params["qqfile"].file.read())

            # Save page image
            book_dir = self._get_book_dir(book_id)
            self._touch_dir(book_dir)

            # TODO: Maybe we should to make some optimization here: use raw data instead of temp file
            filename = "%s.jpg" % utils.build_hash(open(temp_file, "rb").read())
            img = Image.open(temp_file)
            self._safe_file(img, os.path.join(book_dir, "large",  filename), 4000)
            self._safe_file(img, os.path.join(book_dir, "medium", filename), 2000)
            self._safe_file(img, os.path.join(book_dir, "small",  filename), 150)

            # Time to write some data to database
            page = Page(book_id=book_id, filename=filename, original=params["qqfilename"], enabled=False)
            session = cherrypy.request.sa
            session.add(page)
            session.flush()
            page.order_key = page.page_id

            # Delete temporary file
            os.remove(temp_file)

            r["success"] = True
        return r

    def _get_book_dir(self, book_id):
        """
        Returns path for book's pages and creates dirs if necessary
        """
        book_dir = os.path.join(self._get_pages_dir(), "%06d" % int(book_id))

        self._touch_dir(book_dir)
        self._touch_dir(os.path.join(book_dir, "large"))
        self._touch_dir(os.path.join(book_dir, "medium"))
        self._touch_dir(os.path.join(book_dir, "small"))

        return book_dir

    @staticmethod
    def _touch_dir(dir):
        """
        Checks if dir exists and creates it if necessary
        """
        if not os.path.exists(dir):
            os.makedirs(dir)

    def _safe_file(self, img, file_name, size):
        """
        Враппер для сохранения изображения в формате JPG
        :param file_name: имя результирующего JPEG файла
        :param size: размер минимальной стороны результирующего JPEG
        :return:
        """
        img.thumbnail(self._get_new_image_size(img.size, size))
        img.save(file_name, "JPEG", quality=70, optimize=True, progressive=True)

    def _get_new_image_size(self, size, min_dimension):
        """
        Масштабирование
        :param size: Размер изображения текущий
        :param min_dimension: Требуемый мин. размер
        :return: Новые размеры
        """
        if size[0] > size[1]:
            # Portrait
            w = int(round(size[0] * min_dimension / size[1]))
            h = min_dimension
        else:
            # Landscape
            w = min_dimension
            h = int(round(size[1] * min_dimension / size[0]))
        return w, h

    def _get_pages_dir(self):
        return cherrypy.request.app.config["/i/pages"]["tools.staticdir.dir"]