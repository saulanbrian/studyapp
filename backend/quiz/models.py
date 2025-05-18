from django.db import models
import uuid

from summary.models import Summary
import uuid

class Quiz(models.Model):

  STATUS = [
    ('processing','processing'),
    ('processed','processed'),
    ('error','error')
  ]

  id = models.UUIDField(default=uuid.uuid4,primary_key=True,unique=True)
  summary = models.OneToOneField(Summary,on_delete=models.CASCADE)
  status = models.CharField(max_length=20,choices=STATUS,default='processing')


class Question(models.Model):
  id = models.UUIDField(default=uuid.uuid4,primary_key=True,unique=True)
  quiz = models.ForeignKey(
    Quiz,
    on_delete=models.CASCADE,
    related_name='questions'
  )
  question_text = models.TextField()


class Option(models.Model):
  id = models.UUIDField(default=uuid.uuid4,primary_key=True,unique=True)
  option_text = models.TextField()
  question = models.ForeignKey(
    Question,
    on_delete=models.CASCADE,
    related_name='options'
  )
  is_correct = models.BooleanField(default=False)
