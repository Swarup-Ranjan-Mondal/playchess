from django.urls import path
from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
from apps.play_now.consumers import PlayConsumer
from apps.play_online.consumers import GameThreadConsumer

application = ProtocolTypeRouter({
    "websocket": AuthMiddlewareStack(
        URLRouter([
            path("ws/play-now/", PlayConsumer.as_asgi()),
            path("ws/play-online/", GameThreadConsumer.as_asgi()),
        ])
    ),
})
