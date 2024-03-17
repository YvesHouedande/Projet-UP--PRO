from django.contrib import admin
from .models import (
    PostUser, Comment, PostPeer,
    PostService, Event, GeneralPost
    )

# Register your models here.

class AbstractModelAdmin(admin.ModelAdmin):
    readonly_fields = ('public_id','created', 'updated')


admin.site.register(PostUser, AbstractModelAdmin)
admin.site.register(Comment, AbstractModelAdmin) 
admin.site.register(PostPeer, AbstractModelAdmin)
admin.site.register(PostService, AbstractModelAdmin) 
admin.site.register(Event, AbstractModelAdmin)
admin.site.register(GeneralPost, AbstractModelAdmin)
 
  