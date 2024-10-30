from django.contrib import admin
from .models import (
    User, Student, Service,
    Peer, Professor, PeerPosition,
    Personnel
)


class AbstractAdmin(admin.ModelAdmin):
    readonly_fields = ('public_id','created', 'updated')



# Register your models here. 
admin.site.register(User, AbstractAdmin)
admin.site.register(Student) 
admin.site.register(Peer, AbstractAdmin) 
admin.site.register(Professor) 
admin.site.register(Service) 
admin.site.register(Personnel)
admin.site.register(PeerPosition)



