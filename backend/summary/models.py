from django.db import models
import uuid

from user.models import ClerkUser


def cover_path(instance,filename):
  return '{0}/summaries/{1}/cover/{2}'.format(
    instance.user.clerk_id,
    instance.id,
    filename
  )

def file_path(instance,filename):
  return '{0}/summaries/{1}/file/{2}'.format(
    instance.user.clerk_id,
    instance.id,
    filename
  )

class Summary(models.Model):
  
  STATUS = [
    ('processed','processed'),
    ('error','error'),
    ('processing','processing')
  ]
  
  id = models.UUIDField(default=uuid.uuid4,primary_key=True,unique=True)
  user = models.ForeignKey(ClerkUser,related_name='summaries',on_delete=models.CASCADE)
  content = models.TextField(null=True)
  title = models.CharField(max_length=200)
  status = models.CharField(choices=STATUS,max_length=20,default='processing')
  cover = models.ImageField(upload_to=cover_path,null=True)  
  error_message = models.TextField(null=True)
  created_at = models.DateTimeField(auto_now_add=True)
  favorite = models.BooleanField(default=False)
  file = models.FileField(upload_to=file_path, max_length=2000)

  class Meta:
    ordering = ['-created_at']
