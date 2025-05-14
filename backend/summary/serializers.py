from rest_framework import serializers

from .models import Summary

class SummarySerializer(serializers.ModelSerializer):
  
  quiz_id = serializers.SerializerMethodField()

  class Meta:
    model = Summary
    fields = (
      'id',
      'user',
      'content',
      'title',
      'status',
      'cover',
      'error_message',
      'quiz_id'
    )


  def get_quiz_id(self,obj):
    return obj.quiz.id if hasattr(obj,'quiz') else None


  def to_representation(self, obj):
    representation = super().to_representation(obj)

    if obj.status != 'error':
      representation.pop('error_message')

    return representation


