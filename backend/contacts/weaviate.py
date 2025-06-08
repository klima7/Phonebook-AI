import weaviate
from django.conf import settings
from weaviate.collections import Collection
import weaviate.classes.config as wcc
import weaviate.classes.query as wcq
from openai import OpenAI
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain.prompts import ChatPromptTemplate
from langchain.schema.output_parser import StrOutputParser

from .models import Contact


client = weaviate.connect_to_custom(
    http_host=settings.WEAVIATE_HOST,
    http_port=8080,
    http_secure=False,
    grpc_host=settings.WEAVIATE_HOST,
    grpc_port=50051,
    grpc_secure=False,
)


def create_contacts_collection():
    if _weaviate_check_collection_exists("contacts"):
        return
    
    client.collections.create(
        name="contacts",
        vectorizer_config=wcc.Configure.Vectorizer.none(),
        properties=[
            wcc.Property(
                name="model_id",
                data_type=wcc.DataType.INT
            ),
            wcc.Property(
                name="user_id",
                data_type=wcc.DataType.INT
            )
        ]
    )


def weaviate_add_contact(contact: Contact):
    contacts_collection = client.collections.get("contacts")
    contacts_collection.data.insert(
        properties={
            "model_id": contact.id,
            "user_id": contact.user.id
        },
        vector=_embed(_augment_name(contact.name))
    )
    
    
def weaviate_update_contact(contact: Contact, update_embedding: bool = True):
    contacts_collection = client.collections.get("contacts")
    
    query = contacts_collection.query.fetch_objects(
        filters=wcq.Filter.by_property("model_id").equal(contact.id)
    )
    
    for obj in query.objects:
        properties = {
            "model_id": contact.id,
            "user_id": contact.user.id
        }
        
        if update_embedding:
            contacts_collection.data.update(
                uuid=obj.uuid,
                properties=properties,
                vector=_embed(_augment_name(contact.name))
            )
        else:
            contacts_collection.data.update(
                uuid=obj.uuid,
                properties=properties
            )


def weaviate_delete_contact(contact: Contact):
    contacts_collection = client.collections.get("contacts")
    
    query = contacts_collection.query.fetch_objects(
        filters=wcq.Filter.by_property("model_id").equal(contact.id)
    )
    
    for obj in query.objects:
        contacts_collection.data.delete_by_id(obj.uuid)
        
        
def search_user_contacts(user_id: int, query: str, limit: int = 10) -> list[Contact]:
    contacts_collection = client.collections.get("contacts")
    
    results = contacts_collection.query.near_vector(
        near_vector=_embed(query),
        filters=wcq.Filter.by_property("user_id").equal(user_id),
        limit=limit
    )
    
    contact_ids = [obj.properties["model_id"] for obj in results.objects]
    return list(Contact.objects.filter(id__in=contact_ids))


def _embed(text: str) -> list[float]:
    embeddings = OpenAIEmbeddings(model="text-embedding-3-small")
    return embeddings.embed_query(text)


def _augment_name(name: str) -> str:
    llm = ChatOpenAI(model="gpt-4o-mini")
    
    prompt = ChatPromptTemplate.from_messages([
        ("system", "You are a tags extractor for phone contact names. You will be given a contact name and you have to directly output in one line, separated by commas, all tags which you can deduce. For example: female, young, family, sibling, etc. Output comma separated tags directly, without any preamble or postamble."),
        ("user", "This is the contact name: {name}. Now directly generate the comma separated tags. Go!")
    ])
    
    chain = prompt | llm | StrOutputParser()
    completion = chain.invoke({"name": name})
    return name + ", " + completion


def _weaviate_check_collection_exists(collection_name: str) -> bool:
    collections = [name.lower() for name in client.collections.list_all()]
    return collection_name.lower() in collections
