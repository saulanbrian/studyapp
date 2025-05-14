from django.db import models
import uuid

from summary.models import Summary


class Quiz(models.Model):
  id = models.UUIDField(default=uuid.uuid4,primary_key=True)
  summary = models.OneToOneField(Summary,on_delete=models.CASCADE)


class Question(models.Model):
  quiz = models.ForeignKey(
    Quiz,
    on_delete=models.CASCADE,
    related_name='questions'
  )
  question_text = models.TextField()


class Option(models.Model):
  option_text = models.TextField()
  question = models.ForeignKey(
    Question,
    on_delete=models.CASCADE,
    related_name='options'
  )
  is_correct = models.BooleanField(default=False)
