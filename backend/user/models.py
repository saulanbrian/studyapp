from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.
class ClerkUser(models.Model):
  clerk_id = models.CharField(max_length=1000)
  
  @property
  def is_authenticated(self):
    return True