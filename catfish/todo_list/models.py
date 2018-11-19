from django.db import models

# Create your models here.


class TodoList(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    create_time = models.DateTimeField(auto_now_add=True)
    expire_date = models.DateField(null=True, default=None)
    PRIORITY_CHOICES = (
        ('L', 'Low'),
        ('N', 'Normal'),
        ('I', 'Important'),
        ('C', 'Critical')
    )
    priority = models.CharField(
        max_length=1, choices=PRIORITY_CHOICES, default='N'
    )
    is_complete = models.BooleanField(default=False)

    def __str__(self):
        return self.title
