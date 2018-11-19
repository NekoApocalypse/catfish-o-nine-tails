from django.conf.urls import include, url
from rest_framework import routers
from .views import TodoListViewSet


router = routers.DefaultRouter()
router.register('todo_list', TodoListViewSet)

urlpatterns = [
    url('^', include(router.urls))
]