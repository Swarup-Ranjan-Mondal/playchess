from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('apps.play_now.urls')),

    # temporarily showing room.html
    path('play/online/', include('apps.play_online.urls')),
]
