from scripts.page import Page
import MySQLdb as MariaDB
import os


ROTATION_S = """О цели_0005.tif	270
О цели_0014верх фрагмент.tif	270
О цели_0015.tif	270
О цели_0017.tif	90
О цели_0022.tif	90
О цели_0027расположениеСтраницы-Реконструкт.tif	270
О цели_0120.tif	270"""

ROTATION = {}
for i in ROTATION_S.split("\n"):
    i1 = i.split("\t")
    ROTATION[i1[0]] = int(i1[1])

PAGES_DIR = "D:/Dev/manuscript/public/static/pages"
TOC_ID = 6

if __name__ == "__main__":

    db = MariaDB.connect('localhost', 'root', '123qweQWE', 'manuscript', charset='utf8')

    for root, dirs, files in os.walk("E:/1_ОцелиХристианЖизни", topdown=False):
        for f in files:
            file_name, file_ext = os.path.splitext(f)
            if file_ext.lower() == '.tif':
                print(file_name, end="... ")
                page = Page(os.path.join(root, f))
                if f in ROTATION:
                    print("ROTATED FOR %s" % ROTATION[f], end="... ")
                    page.rotate(ROTATION[f])
                page.save(PAGES_DIR)
                # page.save_db(db, TOC_ID, file_name)
                print("done.")

    db.close()
