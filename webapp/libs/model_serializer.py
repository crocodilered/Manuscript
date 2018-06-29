# TODO Implement it as a tool (maybe. think.)
class ModelSerializer:

    @staticmethod
    def dict(model):
        """
        Convert model to dict for json serialization
        """
        return {c.name: getattr(model, c.name) for c in model.__table__.columns}
