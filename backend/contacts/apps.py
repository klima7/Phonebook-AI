from django.apps import AppConfig


class ContactsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'contacts'

    def ready(self):
        import contacts.signals
        from contacts.weaviate import create_contacts_collection
        create_contacts_collection()
