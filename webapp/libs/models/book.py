from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, ForeignKey
from sqlalchemy.types import String, Integer, Boolean, Text
from sqlalchemy.orm import relationship, joinedload


Base = declarative_base()


class Book(Base):

    __tablename__ = "book"
    book_id = Column(Integer, primary_key=True)
    # TODO user_id = Column(Integer, ForeignKey("user.user_id"))
    user_id = Column(Integer, nullable=False)
    title = Column(String(255), nullable=False)
    author = Column(String(255))
    description = Column(Text())
    enabled = Column(Boolean, nullable=False)
    pages = relationship("Page", order_by="Page.original", cascade="all, delete-orphan")

    def __init__(self, user_id=0, title="", author="", description="", enabled=""):
        Base.__init__(self)
        self.user_id = user_id
        self.title = title
        self.author = author
        self.description = description
        self.enabled = enabled

    def href(self):
        return "/book/%s" % self.book_id

    @staticmethod
    def list(session, user_id=None, enabled=None):
        q = session.query(Book)
        if user_id:
            q = q.filter(Book.user_id == user_id)
        if enabled:
            q = q.filter(Book.enabled == enabled)
        return q.order_by(Book.title).all()

    @staticmethod
    def get(session, book_id):
        r = None
        if book_id:
            try:
                r = session.query(Book) \
                    .filter(Book.book_id == book_id)\
                    .one()
            except:
                pass
        return r


class Page(Base):

    __tablename__ = "page"
    page_id = Column(Integer, primary_key=True)
    book_id = Column(Integer, ForeignKey('book.book_id'), nullable=False)
    title = Column(String(255), nullable=False)
    note = Column(Text())
    enabled = Column(Boolean, nullable=False)
    filename = Column(String(255))
    original = Column(String(255))  # оригинальное имя файла
    order_key = Column(Integer)
    parts = relationship("Part", order_by="Part.order_key", cascade="all, delete-orphan")

    def __init__(self, book_id=0, title="", note="", enabled="", filename="", original="", order_key=0):
        Base.__init__(self)
        self.book_id = book_id
        self.title = title
        self.note = note
        self.enabled = enabled
        self.filename = filename
        self.original = original
        self.order_key = order_key

    def href(self):
        return "/book/%s/%s" % (self.book_id, self.page_id)

    def img_href(self, mode="s"):
        r = path = None
        if mode and mode == "s":
            path = "small"
        if mode and mode == "m":
            path = "medium"
        if mode and mode == "l":
            path = "large"
        if path:
            r = "/i/pages/%06d/%s/%s" % (int(self.book_id), path, self.filename)
        return r

    def img_dir(self, mode="s"):
        r = path = None
        if mode and mode == "s":
            path = "small"
        if mode and mode == "m":
            path = "medium"
        if mode and mode == "l":
            path = "large"
        if path:
            r = "%06d/%s/%s" % (int(self.book_id), path, self.filename)
        return r

    @staticmethod
    def list(session, book_id, enabled=None):
        r = None
        if book_id:
            q = session.query(Page)\
                .filter(Page.book_id == book_id) \
                .order_by(Page.order_key)
            if enabled:
                q = q.filter(Page.enabled == enabled)
            r = q.all()
        return r

    @staticmethod
    def get(session, page_id):
        r = None
        if page_id:
            try:
                r = session.query(Page) \
                    .filter(Page.page_id == page_id)\
                    .one()
            except:
                pass
        return r


class Part(Base):

    __tablename__ = "part"
    part_id = Column(Integer, primary_key=True)
    page_id = Column(Integer, ForeignKey('page.page_id'), nullable=False)
    path = Column(String(1000))
    content = Column(Text())
    order_key = Column(Integer, nullable=False)

    def __init__(self, page_id=0, path="", content="", order_key=0):
        Base.__init__(self)
        self.page_id = page_id
        self.path = path
        self.content = content
        self.order_key = order_key

    @staticmethod
    def list(session, page_id):
        r = None
        if page_id:
            r = session.query(Part)\
                .filter(Part.page_id == page_id) \
                .order_by(Part.order_key)\
                .all()
        return r

    @staticmethod
    def get(session, part_id):
        r = None
        if part_id:
            try:
                r = session.query(Part)\
                    .filter(Part.part_id == part_id)\
                    .one()
            except:
                pass
        return r
