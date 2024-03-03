from django.contrib import admin
from core.abstract.models import AbstractModel
from .models import (
    User, Student, Service,
    Peer, Professor,
)


class AbstractUserAdmin(admin.ModelAdmin):
    readonly_fields = ('public_id','created', 'updated')

# class PeerAdmin(admin.ModelAdmin):
#     list_display = ['__str__', 'display_students']

#     def display_students(self, obj):
#         print([str(student) for student in obj.students.all()])
#         return ", ".join([str(student) for student in obj.students.all()])
#     display_students.short_description = 'Students'

# Register your models here. 
admin.site.register(User, AbstractUserAdmin)
admin.site.register(Student) 
admin.site.register(Peer) 
admin.site.register(Professor) 
admin.site.register(Service)

