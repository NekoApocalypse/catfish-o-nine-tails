from rest_framework import viewsets, permissions
from .models import TodoList
from .serializers import TodoListSerializer


class TodoListViewSet(viewsets.ModelViewSet):
    queryset = TodoList.objects.all()
    serializer_class = TodoListSerializer
    permission_classes = [permissions.AllowAny]
