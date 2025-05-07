from django.db import models
import uuid

from user.models import ClerkUser


def generate_path(instance,filename):
    return '{0}/summaries/{1}'.format(instance.user.clerk_id,filename)


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
  cover = models.ImageField(upload_to=generate_path,null=True)  
  error_message = models.TextField(null=True)
