from django.urls import path
from . import views

urlpatterns = [
    path('', views.apiOverview, name="api-overview"),
    path('play', views.play, name="play"),
    path('new-game', views.newGame, name="new-game"),
]
