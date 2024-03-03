from django.contrib import admin
from .models import (
    PostUser, Comment, PostPeer,
    PostService, Event
    )

# Register your models here.

admin.site.register(PostUser)
admin.site.register(Comment) 
admin.site.register(PostPeer)
admin.site.register(PostService)
admin.site.register(Event)
  