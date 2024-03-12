from django.contrib import admin
from .models import (
    PostUser, Comment, PostPeer,
    PostService, Event
    )

# Register your models here.

class AbstractPostUserAdmin(admin.ModelAdmin):
    readonly_fields = ('public_id','created', 'updated')


admin.site.register(PostUser, AbstractPostUserAdmin)
admin.site.register(Comment) 
admin.site.register(PostPeer)
admin.site.register(PostService) 
admin.site.register(Event)
  