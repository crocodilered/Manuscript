from PIL import Image
import webapp.libs.utils as util


class Page(object):
    """
    Библиотека для управлениея страницы, созданной на основе TIFF.
    """
    def __init__(self, tiff_file):
        self._tiff_file = tiff_file
        self._img = Image.open(self._tiff_file)
        self._jpeg_file_name = None

    def save(self, dir):
        if not self._tiff_file or not dir:
            return False

        self._jpeg_file_name = "%s.jpg" % util.build_hash(open(self._tiff_file, "rb").read())

        self._safe_jpeg_wrapper("%s/large/%s" % (dir, self._jpeg_file_name), 4000)
        self._safe_jpeg_wrapper("%s/medium/%s" % (dir, self._jpeg_file_name), 2000)
        self._safe_jpeg_wrapper("%s/small/%s" % (dir, self._jpeg_file_name), 150)

        return True

    def rotate(self, angle):
        """
        Вращение изображения
        :param angle: угол вращения (против часовой стрелки)
        :return:
        """
        self._img = self._img.rotate(angle, Image.BICUBIC, True)

    def save_db(self, conn, toc_id, title=''):
        if not toc_id or not self._jpeg_file_name:
            return False
        cursor = conn.cursor()
        sql = "INSERT INTO page (toc_id, title, filename, order_key) VALUES (%s, '%s', '%s', 0)"
        cursor.execute(sql % (toc_id, title, self._jpeg_file_name))
        cursor.execute("SELECT LAST_INSERT_ID()")
        last_insert_id = cursor.fetchone()[0]
        cursor.execute("UPDATE page SET order_key = %s WHERE page_id = %s" % (last_insert_id, last_insert_id))
        conn.commit()
        cursor.close()
        return True

    def _safe_jpeg_wrapper(self, file_name, size):
        """
        Враппер для сохранения изобрадения в формате JPG
        :param file_name: имя результирующего JPEG файла
        :param size: размер минимальной стороны результирующего JPEG
        :return:
        """
        self._img.thumbnail(self._get_new_size(self._img.size, size))
        self._img.save(file_name, "JPEG", quality=70, optimize=True, progressive=True)

    def _get_new_size(self, size, min_dimension):
        """
        Масштабирование
        :param size: Размер изображения текущий
        :param min_dimension: Требуемый мин. размер
        :return: Новые размеры
        """
        if size[0] > size[1]:
            # Портрет
            w = int(round(size[0] * min_dimension / size[1]))
            h = min_dimension
        else:
            # Пуйзаж
            w = min_dimension
            h = int(round(size[1] * min_dimension / size[0]))
        return w, h
