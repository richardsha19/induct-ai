from weaviate import connect_to_weaviate_cloud
from weaviate.classes.init import Auth
from dotenv import dotenv_values


class VectorDB:

    def __init__(self):

        secrets = dotenv_values("backend.env")

        try:
            WCD_URL = secrets["WCD_URL"]
            WCD_API_KEY = secrets["WCD_API_KEY"]
        except:
            raise ValueError('Environment variables set incorrectly.')

        self.client = connect_to_weaviate_cloud(
            cluster_url=WCD_URL,
            auth_credentials=Auth.api_key(WCD_API_KEY)
        )
        self.table_collection = self.client.collections.get("Data")
        assert self.client.is_ready(), "Weaviate client is not ready. Check the connection."

