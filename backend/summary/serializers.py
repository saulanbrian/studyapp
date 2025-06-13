from rest_framework import serializers

from .models import Summary

class SummarySerializer(serializers.ModelSerializer):
  
  quiz_id = serializers.SerializerMethodField()
  id = serializers.SerializerMethodField()

  class Meta:
    model = Summary
    fields = (
      'id',
      'content',
      'title',
      'status',
      'cover',
      'error_message',
      'quiz_id',
      'favorite',
      'file'
    )


  def get_id(self,obj):
    return str(obj.id)

  def get_quiz_id(self,obj):
    return str(obj.quiz.id) if hasattr(obj,'quiz') else None


  def to_representation(self, obj):
    representation = super().to_representation(obj)

    if obj.status != 'error':
      representation.pop('error_message')

    return representation


