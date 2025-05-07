from rest_framework import serializers

from .models import Summary

class SummarySerializer(serializers.ModelSerializer):
  
  class Meta:
    model = Summary
    fields = (
      'id',
      'user',
      'content',
      'title',
      'status',
      'cover',
      'error_message'
    )

  def to_representation(self, obj):
    representation = super().to_representation(obj)

    if obj.status != 'error':
      representation.pop('error_message')

    return representation


