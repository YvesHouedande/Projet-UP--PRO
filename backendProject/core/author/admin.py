from django.contrib import admin
from core.abstract.models import AbstractModel
from .models import (
    User, Student, Service,
    Peer, Professor, PeerUser
)


class AbstractUserAdmin(admin.ModelAdmin):
    readonly_fields = ('public_id','created', 'updated')



# Register your models here. 
admin.site.register(User, AbstractUserAdmin)
admin.site.register(Student) 
admin.site.register(Peer) 
admin.site.register(Professor) 
admin.site.register(Service)
admin.site.register(PeerUser)



